import React from 'react';
import store from '../store'

import { Config } from '../../../services/Config';

// Helper functions for redux/auth related tasks
class LocalStorageAccessor {
    constructor(key) {
        this.key = key;

        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            this.storageSupported = true;
        } catch (e) {
            // Fallbacks here and in the methods below are to support browsers that don't have local storage, e.g.
            // Safari in private mode
            this.storageSupported = false;
            window.iconStorage = {};
        }
    }

    get() {
        if (this.storageSupported) return localStorage.getItem(this.key);

        return window.iconStorage[this.key];
    }

    set(value) {
        if (this.storageSupported) return localStorage.setItem(this.key, value);

        return window.iconStorage[this.key] = value;
    }

    remove() {
        if (this.storageSupported) return localStorage.removeItem(this.key);

        return delete window.iconStorage[this.key];
    }
}

const accessToken = new LocalStorageAccessor('access_token');
const refreshToken = new LocalStorageAccessor('refresh_token');
const rememberMeFlag = new LocalStorageAccessor('remember_me');
const baseUrl = Config.serverUrl;

export { accessToken, refreshToken,  rememberMeFlag };

export const clearAllLoginLocalStorage = () => {
    masqueradeToken.remove();
    masqueradeRefreshToken.remove();
    rememberMeFlag.remove();
    localStorage.removeItem('user_type')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('local_refresh_token')
    localStorage.removeItem('local_access_token')
    localStorage.removeItem('masquradingFrom')
    localStorage.removeItem('access_token')
    localStorage.removeItem('masquradingUser')
    localStorage.removeItem('brandColorName')
    localStorage.removeItem('local_user_type')
    localStorage.removeItem('partnerData')
    localStorage.removeItem('partners')
    localStorage.removeItem('ticket')
    localStorage.removeItem('masqurade-parent-id')
}

// config level User Match functions start
// e.g., in a new src/config/envConfig.js or directly in helpers.js if preferred for now
let ENV = 'development';
ENV = import.meta.env.MODE;

// Check if baseUrl contains 'preprod-api' and override ENV to 'production'
if (typeof baseUrl === 'string' && baseUrl.includes('preprod-api')) {
    ENV = 'production';
}



const commonConfig = {
    // Values that are the same across environments
};

const devConfig = {
    ...commonConfig,
    menloUserEmail: 'menlocollege@yopmail.com',
    demoUserEmail: 'demoparkengage@yopmail.com',
    // ... other dev-specific values
    menloUserId: '371710',
    demoUserId: '356560',
};

const prodConfig = {
    ...commonConfig,
    menloUserEmail: 'menlocollege@yopmail.com',
    demoUserEmail: 'pedemos@yopmail.com',
    // ... other prod-specific values
    menloUserId: '169163',
    demoUserId: '54682',
};

const envConfigs = {
    development: devConfig,
    production: prodConfig,

    // Add other environments like 'staging', 'test' if needed
};

export const getConfig = (key) => {
    const currentConfig = envConfigs[ENV] || envConfigs.development; // Fallback to development
    if (key in currentConfig) {
        return currentConfig[key];
    }
    // Optional: warn if a key is not found, or return a default
    console.warn(`Configuration key "${key}" not found for environment "${ENV}".`);
    return undefined;
};
