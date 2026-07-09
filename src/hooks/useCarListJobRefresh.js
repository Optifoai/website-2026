import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { connectSocket } from '../services/socket';
import { getRequest } from '../services';
import { APICONFIG } from '../Redux/ApiConfig';
import {
    getPendingCarJobId,
    clearPendingCarJobId
} from '../utils/carJobStorage';
import { parseCarJobStatusResponse } from '../utils/helpers';

const POLL_INTERVAL_MS = 4000;
const TERMINAL_STATUSES = new Set(['completed', 'failed', 'cancelled']);

async function fetchCarJobStatus(jobId) {
    return getRequest(`${APICONFIG.CAR_JOB_STATUS}/${encodeURIComponent(jobId)}`);
}

export function useCarListJobRefresh({ userId, onJobCompleted }) {
    const location = useLocation();
    const pollTimerRef = useRef(null);
    const handledJobIdsRef = useRef(new Set());
    const isRefreshingRef = useRef(false);
    const onJobCompletedRef = useRef(onJobCompleted);

    onJobCompletedRef.current = onJobCompleted;

    const isOnDashboard = location.pathname === '/dashboard';

    const stopPolling = useCallback(() => {
        if (pollTimerRef.current) {
            clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
        }
    }, []);

    const handleJobFinished = useCallback(async (jobId, status) => {
        if (!isOnDashboard || !jobId) {
            return;
        }

        const normalizedJobId = String(jobId);
        if (handledJobIdsRef.current.has(normalizedJobId)) {
            return;
        }

        handledJobIdsRef.current.add(normalizedJobId);
        clearPendingCarJobId();
        stopPolling();

        if (status !== 'completed' || !onJobCompletedRef.current || isRefreshingRef.current) {
            return;
        }

        isRefreshingRef.current = true;
        try {
            await onJobCompletedRef.current();
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
            return;
        }

        try {
            const res = await fetchCarJobStatus(jobId);
            const parsed = parseCarJobStatusResponse(res);

            if (!parsed?.status) {
                return;
            }

            if (TERMINAL_STATUSES.has(parsed.status)) {
                await handleJobFinished(jobId, parsed.status);
            }
        } catch {
            /* Keep polling until job is found or user leaves the page */
        }
    }, [handleJobFinished, isOnDashboard, stopPolling]);

    useEffect(() => {
        if (!isOnDashboard || !userId) {
            stopPolling();
            return undefined;
        }

        const pendingJobId = getPendingCarJobId();
        if (!pendingJobId) {
            return undefined;
        }

        pollPendingJob();
        pollTimerRef.current = setInterval(pollPendingJob, POLL_INTERVAL_MS);

        return () => {
            stopPolling();
        };
    }, [isOnDashboard, userId, pollPendingJob, stopPolling]);

    useEffect(() => {
        if (!isOnDashboard || !userId) {
            return undefined;
        }

        const socket = connectSocket(userId);

        const onCompleted = (data) => {
            const jobId = data?.jobId || getPendingCarJobId();
            if (jobId) {
                handleJobFinished(jobId, 'completed');
            }
        };

        const onFailed = (data) => {
            const jobId = data?.jobId || getPendingCarJobId();
            if (jobId) {
                handleJobFinished(jobId, 'failed');
            }
        };

        socket.on('image-job-completed', onCompleted);
        socket.on('image-job-failed', onFailed);

        return () => {
            socket.off('image-job-completed', onCompleted);
            socket.off('image-job-failed', onFailed);
        };
    }, [handleJobFinished, isOnDashboard, userId]);
}
