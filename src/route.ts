import { Routing } from 'express-zod-api';
import {
    getDebateZoneByIdEndpoint,
    getListOfDebateZoneEndpoint,
    joinDebateZoneEndpoint,
    createDebateZoneEndpoint,
    updateDebateZoneEndpoint,
    getActiveDebateZoneListEndpoint,
    getActiveDebateZoneDetailsEndpoint,
    getProfileDebateZoneListEndpoint, getProfileCreatedDebateZoneListEndpoint,
} from './endpoint';

export const routing: Routing = {
    v1: {
        'debate-zones': {
            create: createDebateZoneEndpoint,
            update: updateDebateZoneEndpoint,
            list: getListOfDebateZoneEndpoint,
            details: getDebateZoneByIdEndpoint,
            join: joinDebateZoneEndpoint,
            active: {
                list: getActiveDebateZoneListEndpoint,
                details: getActiveDebateZoneDetailsEndpoint,
            },
            profile: {
                list: getProfileDebateZoneListEndpoint,
                "my-list": getProfileCreatedDebateZoneListEndpoint,
            },
        },
    },
};
