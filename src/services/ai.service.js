import { postRequest } from './index';
import { APICONFIG } from '../Redux/ApiConfig';

/**
 * Generate a car description using the backend OpenAI integration.
 */
export function generateCarDescription(payload, config = {}) {
    return postRequest(APICONFIG.AI_GENERATE_CAR_DESCRIPTION, payload, config);
}
