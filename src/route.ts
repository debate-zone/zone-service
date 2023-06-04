import { Routing } from 'express-zod-api';
import {
    getDebateZoneByIdEndpoint,
    getListOfDebateZoneEndpoint,
    joinDebateZoneEndpoint,
    saveDebateZoneEndpoint,
    updateDebateZoneEndpoint,
} from './endpoint';

export const routing: Routing = {
    v1: {
        save: saveDebateZoneEndpoint,
        update: updateDebateZoneEndpoint,
        list: getListOfDebateZoneEndpoint,
        details: getDebateZoneByIdEndpoint,
        join: joinDebateZoneEndpoint,
    },
};
