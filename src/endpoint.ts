import {defaultEndpointsFactory} from "express-zod-api"
import {
    inputDebateZoneIdSchema,
    newDebateZoneSchema,
    outputDebateZoneListSchema,
    outputDebateZoneSchema,
    updateDebateZoneSchema
} from "./zodSchema";
import {getDebateZoneById, getListDebateZone, joinDebateZone, saveDebateZone} from "./services/baseDebateZoneService";
import {z} from "zod";

export const saveDebateZoneEndpoint = defaultEndpointsFactory.build({
    method: "post",
    input: updateDebateZoneSchema || newDebateZoneSchema,
    output: outputDebateZoneSchema,
    handler: async ({input, options, logger }) => {
        logger.debug("Options:", options)
        return saveDebateZone(input)
    },
})

export const getListOfDebateZoneEndpoint = defaultEndpointsFactory.build({
    method: "get",
    shortDescription: "Get list debate zone",
    input: z.object({}),
    output: outputDebateZoneListSchema,
    handler: async ({input, options, logger }) => {
        logger.debug("Options:", options)
        return await getListDebateZone()
    }
})

export const getDebateZoneByIdEndpoint = defaultEndpointsFactory.build({
    method: "get",
    shortDescription: "Get debate zone by id",
    input: inputDebateZoneIdSchema,
    output: outputDebateZoneSchema,
    handler: async ({input, options, logger }) => {
        logger.debug("Options:", options)
        return await getDebateZoneById(input.id)
    }
})

export const joinDebateZoneEndpoint = defaultEndpointsFactory.build({
    method: "post",
    shortDescription: "Join debate zone",
    input: z.object({
        id: z.string(),
    }),
    output: outputDebateZoneSchema,
    handler: async ({input, options, logger }) => {
        logger.debug("Options:", options)
        return await joinDebateZone(input.id)
    }
})