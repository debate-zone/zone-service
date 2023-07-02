import { createMiddleware, defaultEndpointsFactory } from 'express-zod-api';
import {
    inputActiveDebateZoneIdSchema,
    inputDebateZoneIdSchema,
    inputJoinDebateZoneSchema,
    newDebateZoneSchema,
    outputActiveDebateZoneDetailsSchema,
    outputActiveDebateZoneListSchema,
    outputDebateZoneDetailsSchema,
    outputDebateZoneListSchema,
    outputDebateZoneSchema,
    outputFeedDebateZoneDetailsSchema,
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
import {
    getProfileDebateZoneList,
    getProfileMyDebateZoneList,
} from './services/profileDebateZoneService';
import {
    getFeedDebateZoneDetails,
    getFeedDebateZones,
} from './services/feedDebateZoneService';
import { AuthOptions } from '../../debate-zone-micro-service-common-library/src/types/auth';

export const authMiddleware = createMiddleware({
    input: z.object({}),
    middleware: async ({ input: {}, request, logger }) => {
        const userId = request.headers['x-user-id'] as string;
        const userRole = request.headers['x-user-role'] as string;
        const userFullName = request.headers['x-user-full-name'] as string;
        const userEmail = request.headers['x-user-email'] as string;

        return {
            userId,
            userRole,
            userFullName,
            userEmail,
        } as AuthOptions;
    },
});

export const endpointsFactory =
    defaultEndpointsFactory.addMiddleware(authMiddleware);

export const createDebateZoneEndpoint = endpointsFactory.build({
    method: 'post',
    input: newDebateZoneSchema,
    output: outputNewDebateZoneSchema,
    handler: async ({ input, options, logger }) => {
        logger.debug('Options:', options);
        return newDebateZone(input, options);
    },
});

export const getListOfDebateZoneEndpoint = endpointsFactory.build({
    method: 'get',
    shortDescription: 'Get list debate zone',
    input: z.object({}),
    output: outputDebateZoneListSchema,
    handler: async ({ options, logger }) => {
        logger.debug('Options:', options);
        return await getListDebateZone(options.userId);
    },
});

export const getDebateZoneByIdEndpoint = endpointsFactory.build({
    method: 'get',
    shortDescription: 'Get debate zone by id',
    input: inputDebateZoneIdSchema,
    output: outputDebateZoneDetailsSchema,
    handler: async ({ input, options, logger }) => {
        logger.debug('Options:', options);
        return await getDebateZoneById(input.id, options.userId);
    },
});

export const updateDebateZoneEndpoint = endpointsFactory.build({
    method: 'put',
    input: updateDebateZoneSchema,
    output: outputDebateZoneSchema,
    handler: async ({ input, options, logger }) => {
        logger.debug('Options:', options);
        return await updateDebateZone(input);
    },
});

export const joinDebateZoneEndpoint = endpointsFactory.build({
    method: 'post',
    shortDescription: 'Join debate zone',
    input: inputJoinDebateZoneSchema,
    output: outputDebateZoneDetailsSchema,
    handler: async ({
        input,
        options,
        logger,
    }): Promise<OutputDebateZoneDetail> => {
        logger.debug('Options:', options);
        return await joinDebateZone(input, options);
    },
});

export const getActiveDebateZoneListEndpoint = endpointsFactory.build({
    method: 'get',
    shortDescription: 'Get active debate zone list',
    input: z.object({}),
    output: outputActiveDebateZoneListSchema,
    handler: async ({ options, logger }) => {
        logger.debug('Options:', options);
        return await getActiveDebateZones(options.userId);
    },
});

export const getActiveDebateZoneDetailsEndpoint = endpointsFactory.build({
    method: 'get',
    shortDescription: 'Get active debate zone details',
    input: inputActiveDebateZoneIdSchema,
    output: outputActiveDebateZoneDetailsSchema,
    handler: async ({ input, options, logger }) => {
        logger.debug('Options:', options);
        return await getActiveDebateZoneDetails(input.id, options.userId);
    },
});

export const getProfileDebateZoneListEndpoint = endpointsFactory.build({
    method: 'get',
    shortDescription: 'Get profile debate zone list',
    input: z.object({}),
    output: outputProfileDebateZoneListSchema,
    handler: async ({ options, logger }) => {
        logger.debug('Options:', options);
        return await getProfileDebateZoneList(options.userId);
    },
});

export const getProfileCreatedDebateZoneListEndpoint = endpointsFactory.build({
    method: 'get',
    shortDescription: 'Get profile created debate zone list',
    input: z.object({}),
    output: outputProfileDebateZoneListSchema,
    handler: async ({ options, logger }) => {
        logger.debug('Options:', options);
        return await getProfileMyDebateZoneList(options.userId);
    },
});

export const getFeedDebateZonesEndpoint = endpointsFactory.build({
    method: 'get',
    shortDescription: 'Get feed debate zone list',
    input: z.object({}),
    output: outputDebateZoneListSchema,
    handler: async ({ options, logger }) => {
        logger.debug('Options:', options);
        return await getFeedDebateZones(options.userId);
    },
});

export const getFeedDebateZoneDetailsByIdEndpoint = endpointsFactory.build({
    method: 'get',
    shortDescription: 'Get feed debate zone details by id',
    input: inputDebateZoneIdSchema,
    output: outputFeedDebateZoneDetailsSchema,
    handler: async ({ input, options, logger }) => {
        logger.debug('Options:', options);
        return await getFeedDebateZoneDetails(input.id, options.userId);
    },
});
