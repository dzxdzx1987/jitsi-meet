/* @flow */

import type { Dispatch } from 'redux';

import {
    CONFIG_WILL_LOAD,
    LOAD_CONFIG_ERROR,
    SET_CONFIG
} from './actionTypes';
import { setConfigFromURLParams } from './index';

/**
 * Signals that the configuration for a specific locationURL will be loaded now.
 *
 * @param {string|URL} locationURL - The URL of the location which necessitated
 * the loading of a configuration.
 * @returns {{
 *     type: CONFIG_WILL_LOAD,
 *     locationURL
 * }}
 */
export function configWillLoad(locationURL: string | URL) {
    return {
        type: CONFIG_WILL_LOAD,
        locationURL
    };
}

/**
 * Signals that a configuration could not be loaded due to a specific error.
 *
 * @param {Error} error - The {@code Error} which prevented the successful
 * loading of a configuration.
 * @param {string|URL} locationURL - The URL of the location which necessitated
 * the loading of a configuration.
 * @returns {{
 *     type: LOAD_CONFIG_ERROR,
 *     error: Error,
 *     locationURL
 * }}
 */
export function loadConfigError(error: Error, locationURL: string | URL) {
    return {
        type: LOAD_CONFIG_ERROR,
        error,
        locationURL
    };
}

/**
 * Sets the configuration represented by the feature base/config. The
 * configuration is defined and consumed by the library lib-jitsi-meet but some
 * of its properties are consumed by the application jitsi-meet as well.
 *
 * @param {Object} config - The configuration to be represented by the feature
 * base/config.
 * @returns {{
 *     type: SET_CONFIG,
 *     config: Object
 * }}
 */
export function setConfig(config: Object = {}) {

    return (dispatch: Dispatch<*>, getState: Function) => {
        const { locationURL } = getState()['features/base/connection'];

        // Now that the loading of the config was successful override the values
        // with the parameters passed in the hash part of the location URI.
        // TODO We're still in the middle ground between old Web with config,
        // interfaceConfig, and loggingConfig used via global variables and new
        // Web and mobile reading the respective values from the redux store.
        // On React Native there's no interfaceConfig at all yet and
        // loggingConfig is not loaded but there's a default value in the redux
        // store.
        // Only the config will be overridden on React Native, as the other
        // globals will be undefined here. It's intentional - we do not care
        // to override those configs yet.
        locationURL && setConfigFromURLParams(

            // On Web the config also comes from the window.config global,
            // but it is resolved in the load config procedure.
            config,
            window && window.interfaceConfig,
            window && window.loggingConfig,
            locationURL);

        dispatch({
            type: SET_CONFIG,
            config
        });
    };
}
