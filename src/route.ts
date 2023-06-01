import {Routing} from "express-zod-api"
import {
    getDebateZoneByIdEndpoint,
    getListOfDebateZoneEndpoint,
    joinDebateZoneEndpoint,
    saveDebateZoneEndpoint
} from "./endpoint"

export const routing: Routing = {
    v1: {
        'debate-zone': {
            'save': saveDebateZoneEndpoint,
            'list': getListOfDebateZoneEndpoint,
            'details': getDebateZoneByIdEndpoint,
            'join': joinDebateZoneEndpoint
        }
    }
}
