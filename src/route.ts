import { Routing } from 'express-zod-api';
import {
    getDebateZoneByIdEndpoint,
    getListOfDebateZoneEndpoint,
    joinDebateZoneEndpoint,
    createDebateZoneEndpoint,
    updateDebateZoneEndpoint,
} from './endpoint';

export const routing: Routing = {
    v1: {
        'debate-zones': {
            create: createDebateZoneEndpoint,
            update: updateDebateZoneEndpoint,
            list: getListOfDebateZoneEndpoint,
            details: getDebateZoneByIdEndpoint,
            join: joinDebateZoneEndpoint,
        },
    },
};
