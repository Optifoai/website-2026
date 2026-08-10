import { useEffect, useRef, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connectSocket } from '../services/socket';
import { getRequest } from '../services';
import { APICONFIG } from '../Redux/ApiConfig';
import {
    getPendingCarJobId,
    clearPendingCarCreation
} from '../utils/carJobStorage';
import { getLoggedInUserId, notify, parseCarJobStatusResponse, isCarProcessing } from '../utils/helpers';

const POLL_INTERVAL_MS = 4000;
const CAR_LIST_POLL_MS = 5000;
const TERMINAL_STATUSES = new Set(['completed', 'failed', 'cancelled']);

async function fetchCarJobStatus(jobId) {
    return getRequest(`${APICONFIG.CAR_JOB_STATUS}/${encodeURIComponent(jobId)}`);
}

function resolveUserId(user) {
    return user?._id || user?.id || user?.userProfile?._id || getLoggedInUserId();
}

export function useCarListJobRefresh({ user, onJobCompleted, carsList = [] }) {
    const location = useLocation();
    const pollTimerRef = useRef(null);
    const handledJobIdsRef = useRef(new Set());
    const isRefreshingRef = useRef(false);
    const onJobCompletedRef = useRef(onJobCompleted);
    const [isProcessingCar, setIsProcessingCar] = useState(Boolean(getPendingCarJobId()));

    onJobCompletedRef.current = onJobCompleted;

    const isOnDashboard = location.pathname === '/dashboard';
    const userId = resolveUserId(user);

    const stopPolling = useCallback(() => {
        if (pollTimerRef.current) {
            clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
        }
    }, []);

    const handleJobFinished = useCallback(async (jobId, status, errorMessage, jobResult) => {
        if (!isOnDashboard || !jobId) {
            return;
        }

        const normalizedJobId = String(jobId);
        if (handledJobIdsRef.current.has(normalizedJobId)) {
            return;
        }

        handledJobIdsRef.current.add(normalizedJobId);
        clearPendingCarCreation();
        setIsProcessingCar(false);
        stopPolling();

        if (status === 'failed') {
            notify(
                'error',
                errorMessage || 'Car creation failed in the background. Please try again.'
            );
            return;
        }

        if (status !== 'completed' || !onJobCompletedRef.current || isRefreshingRef.current) {
            return;
        }

        isRefreshingRef.current = true;
        try {
            await onJobCompletedRef.current(jobResult);
            notify('success', 'Your car is ready and has been added to the list.');
        } finally {
            isRefreshingRef.current = false;
        }
    }, [isOnDashboard, stopPolling]);

    const pollPendingJob = useCallback(async () => {
        if (!isOnDashboard) {
            return;
        }

        const jobId = getPendingCarJobId();
        if (!jobId || handledJobIdsRef.current.has(String(jobId))) {
            stopPolling();
            setIsProcessingCar(false);
            return;
        }

        setIsProcessingCar(true);

        try {
            const res = await fetchCarJobStatus(jobId);
            const parsed = parseCarJobStatusResponse(res);

            if (!parsed?.status) {
                return;
            }

            if (TERMINAL_STATUSES.has(parsed.status)) {
                await handleJobFinished(jobId, parsed.status, parsed.errorMessage, parsed.result);
            }
        } catch (error) {
            const message = error?.message || error?.error?.responseMessage;
            if (message && /not found/i.test(message)) {
                clearPendingCarCreation();
                setIsProcessingCar(false);
                stopPolling();
            }
        }
    }, [handleJobFinished, isOnDashboard, stopPolling]);

    useEffect(() => {
        if (!isOnDashboard) {
            stopPolling();
            return undefined;
        }

        const pendingJobId = getPendingCarJobId();
        if (!pendingJobId) {
            setIsProcessingCar(false);
            return undefined;
        }

        setIsProcessingCar(true);
        if (onJobCompletedRef.current) {
            onJobCompletedRef.current();
        }
        pollPendingJob();
        pollTimerRef.current = setInterval(pollPendingJob, POLL_INTERVAL_MS);

        return () => {
            stopPolling();
        };
    }, [isOnDashboard, pollPendingJob, stopPolling]);

    useEffect(() => {
        if (!isOnDashboard || !userId) {
            return undefined;
        }

        const socket = connectSocket(String(userId));

        const onCompleted = (data) => {
            const jobId = data?.jobId || getPendingCarJobId();
            if (jobId) {
                handleJobFinished(jobId, 'completed');
            }
        };

        const onFailed = (data) => {
            const jobId = data?.jobId || getPendingCarJobId();
            if (jobId) {
                handleJobFinished(jobId, 'failed', data?.errorMessage);
            }
        };

        socket.on('image-job-completed', onCompleted);
        socket.on('image-job-failed', onFailed);

        return () => {
            socket.off('image-job-completed', onCompleted);
            socket.off('image-job-failed', onFailed);
        };
    }, [handleJobFinished, isOnDashboard, userId]);

    const carListPollRef = useRef(null);

    const hasProcessingCars = carsList.some(isCarProcessing);

    useEffect(() => {
        if (!isOnDashboard || !hasProcessingCars || !onJobCompletedRef.current) {
            if (carListPollRef.current) {
                clearInterval(carListPollRef.current);
                carListPollRef.current = null;
            }
            return undefined;
        }

        carListPollRef.current = setInterval(() => {
            if (!isRefreshingRef.current) {
                onJobCompletedRef.current();
            }
        }, CAR_LIST_POLL_MS);

        return () => {
            if (carListPollRef.current) {
                clearInterval(carListPollRef.current);
                carListPollRef.current = null;
            }
        };
    }, [hasProcessingCars, isOnDashboard]);

    return { isProcessingCar: isProcessingCar || hasProcessingCars };
}
