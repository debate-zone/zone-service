import { defaultEndpointsFactory } from 'express-zod-api';
import {
    inputActiveDebateZoneIdSchema,
    inputDebateZoneIdSchema,
    newDebateZoneSchema,
    outputActiveDebateZoneDetailsSchema,
    outputActiveDebateZoneListSchema,
    outputDebateZoneDetailsSchema,
    outputDebateZoneListSchema,
    outputDebateZoneSchema,
    outputNewDebateZoneSchema,
    outputProfileDebateZoneListSchema,
    updateDebateZoneSchema,
} from './zodSchema';
import {
    getDebateZoneById,
    getListDebateZone,
    newDebateZone,
    updateDebateZone,
} from './services/baseDebateZoneService';
import { z } from 'zod';
import { OutputDebateZoneDetail } from './types';
import { joinDebateZone } from './services/joinDebateZoneService';
import {
    getActiveDebateZoneDetails,
    getActiveDebateZones,
} from './services/activeDebateZoneService';
import { getProfileDebateZoneList } from './services/profileDebateZoneService';

export const createDebateZoneEndpoint = defaultEndpointsFactory.build({
    method: 'post',
    input: newDebateZoneSchema,
    output: outputNewDebateZoneSchema,
    handler: async ({ input, options, logger }) => {
        logger.debug('Options:', options);
        return newDebateZone(input);
    },
});

export const getListOfDebateZoneEndpoint = defaultEndpointsFactory.build({
    method: 'get',
    shortDescription: 'Get list debate zone',
    input: z.object({}),
    output: outputDebateZoneListSchema,
    handler: async ({ input, options, logger }) => {
        logger.debug('Options:', options);
        return await getListDebateZone();
    },
});

export const getDebateZoneByIdEndpoint = defaultEndpointsFactory.build({
    method: 'get',
    shortDescription: 'Get debate zone by id',
    input: inputDebateZoneIdSchema,
    output: outputDebateZoneDetailsSchema,
    handler: async ({ input, options, logger }) => {
        logger.debug('Options:', options);
        return await getDebateZoneById(input.id);
    },
});

export const updateDebateZoneEndpoint = defaultEndpointsFactory.build({
    method: 'put',
    input: updateDebateZoneSchema,
    output: outputDebateZoneSchema,
    handler: async ({ input, options, logger }) => {
        logger.debug('Options:', options);
        return await updateDebateZone(input);
    },
});

export const joinDebateZoneEndpoint = defaultEndpointsFactory.build({
    method: 'post',
    shortDescription: 'Join debate zone',
    input: z.object({
        id: z.string(),
    }),
    output: outputDebateZoneDetailsSchema,
    handler: async ({
        input,
        options,
        logger,
    }): Promise<OutputDebateZoneDetail> => {
        logger.debug('Options:', options);
        return await joinDebateZone(input.id);
    },
});

export const getActiveDebateZoneListEndpoint = defaultEndpointsFactory.build({
    method: 'get',
    shortDescription: 'Get active debate zone list',
    input: z.object({}),
    output: outputActiveDebateZoneListSchema,
    handler: async ({ input, options, logger }) => {
        logger.debug('Options:', options);
        return await getActiveDebateZones();
    },
});

export const getActiveDebateZoneDetailsEndpoint = defaultEndpointsFactory.build(
    {
        method: 'get',
        shortDescription: 'Get active debate zone details',
        input: inputActiveDebateZoneIdSchema,
        output: outputActiveDebateZoneDetailsSchema,
        handler: async ({ input, options, logger }) => {
            logger.debug('Options:', options);
            return await getActiveDebateZoneDetails(input.id);
        },
    },
);

export const getProfileDebateZoneListEndpoint = defaultEndpointsFactory.build({
    method: 'get',
    shortDescription: 'Get profile debate zone list',
    input: z.object({}),
    output: outputProfileDebateZoneListSchema,
    handler: async ({ input, options, logger }) => {
        logger.debug('Options:', options);
        return await getProfileDebateZoneList();
    },
});
