import { Routing } from 'express-zod-api';
import {
    getDebateZoneByIdEndpoint,
    getListOfDebateZoneEndpoint,
    joinDebateZoneEndpoint,
    createDebateZoneEndpoint,
    updateDebateZoneEndpoint,
    getActiveDebateZoneListEndpoint,
    getActiveDebateZoneDetailsEndpoint,
    getProfileDebateZoneListEndpoint,
    getProfileCreatedDebateZoneListEndpoint,
    getFeedDebateZonesEndpoint,
    getFeedDebateZoneDetailsByIdEndpoint,
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
            feed: {
                list: getFeedDebateZonesEndpoint,
                details: getFeedDebateZoneDetailsByIdEndpoint,
            },
            profile: {
                list: getProfileDebateZoneListEndpoint,
                'my-list': getProfileCreatedDebateZoneListEndpoint,
            },
        },
    },
};
