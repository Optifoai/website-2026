import { getRequest, postRequest } from './index';
import { APICONFIG } from '../Redux/ApiConfig';

/**
 * Fetch logged-in vendor car template profile.
 */
export const getTemplate = () => {
    return getRequest(APICONFIG.VENDOR_CAR_TEMPLATE);
};

/**
 * Create or update vendor car template (one profile per vendor).
 */
export const saveTemplate = (payload) => {
    return postRequest(APICONFIG.VENDOR_CAR_TEMPLATE, payload);
};

/**
 * Fetch active feature categories grouped with active features.
 */
export const getGroupedFeatures = () => {
    return getRequest(APICONFIG.VENDOR_CAR_TEMPLATE_FEATURES);
};
