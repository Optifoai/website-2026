const PENDING_CAR_JOB_ID_KEY = 'pendingCarJobId';

const PENDING_VEHICLE_ID_KEY = 'pendingVehicleId';



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



export function setPendingVehicleId(vehicleId) {

    if (vehicleId) {

        sessionStorage.setItem(PENDING_VEHICLE_ID_KEY, String(vehicleId));

    }

}



export function getPendingVehicleId() {

    return sessionStorage.getItem(PENDING_VEHICLE_ID_KEY);

}



export function clearPendingVehicleId() {

    sessionStorage.removeItem(PENDING_VEHICLE_ID_KEY);

}



export function clearPendingCarCreation() {

    clearPendingCarJobId();

    clearPendingVehicleId();

}

