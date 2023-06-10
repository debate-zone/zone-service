import { z } from 'zod';
import {
    baseZodSchema,
    emailSchema,
    idObjectIdsSchema,
    phoneNumberSchema,
} from '../../debate-zone-micro-service-common-library/src/zod/baseZodSchema';
import { Type } from './enums/type';

export const debateZoneDateSchema = z.string().refine(
    dateString => {
        let date = new Date(dateString);
        return !isNaN(date.getTime()) && date > new Date();
    },
    {
        message: 'Date must be in the future',
    },
);

export const participantSchema = z.object({
    userId: idObjectIdsSchema,
    role: z.string(),
});

export const roundSchema = z.object({
    time: z.number(),
    activeUserId: idObjectIdsSchema,
    isFinished: z.boolean().optional(),
});

export const debateZoneSchema = baseZodSchema.extend({
    userId: idObjectIdsSchema,
    title: z.string(),
    shortDescription: z.string(),
    type: z.nativeEnum(Type),
    date: z.date(),
    rounds: z.array(roundSchema).optional(),
    isPrivate: z.boolean().optional(),
    isAIReferee: z.boolean().optional(),
    isPublicChoice: z.boolean().optional(),
    participants: z.array(participantSchema),
    isSave: z.boolean().optional(),
});

export const updateDebateZoneSchema = debateZoneSchema
    .omit({
        __v: true,
        createdAt: true,
        updatedAt: true,
        date: true,
    })
    .extend({
        date: debateZoneDateSchema,
    })
    .partial();

export const newParticipantSchema = participantSchema
    .omit({
        userId: true,
    })
    .extend({
        email: emailSchema.optional(),
        phoneNumber: phoneNumberSchema.optional(),
    });

export const newDebateZoneSchema = debateZoneSchema
    .omit({
        _id: true,
        __v: true,
        participants: true,
        createdAt: true,
        rounds: true,
    })
    .extend({
        date: debateZoneDateSchema,
        roundTime: z.number(),
        participants: z
            .array(newParticipantSchema)
            .min(2, { message: 'Must have at least 2 participants' })
            .max(3, { message: 'Must have at most 2 participants' }),
    });

export const outputDebateZoneSchema = debateZoneSchema
    .omit({
        __v: true,
    })
    .extend({
        date: z.date(),
    })
    .partial();

export const outputDebateZoneListSchema = z.object({
    debateZones: z.array(outputDebateZoneSchema),
});

export const inputDebateZoneIdSchema = z.object({
    id: idObjectIdsSchema,
});
