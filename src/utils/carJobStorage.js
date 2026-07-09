const PENDING_CAR_JOB_ID_KEY = 'pendingCarJobId';

export function setPendingCarJobId(jobId) {
    if (jobId) {
        sessionStorage.setItem(PENDING_CAR_JOB_ID_KEY, String(jobId));
    }
}

export function getPendingCarJobId() {
    return sessionStorage.getItem(PENDING_CAR_JOB_ID_KEY);
}

export function clearPendingCarJobId() {
    sessionStorage.removeItem(PENDING_CAR_JOB_ID_KEY);
}
