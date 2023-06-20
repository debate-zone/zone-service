import { z } from 'zod';
import {
    baseZodSchema,
    emailSchema,
    idObjectIdsSchema,
    phoneNumberSchema,
} from '../../debate-zone-micro-service-common-library/src/zod/baseZodSchema';
import { Type } from './enums/type';
import * as moment from 'moment';

export const debateZoneDateSchema = z.string().refine(
    // todo fix timezone
    dateString => {
        return true;
    },
    {
        message: 'Date must be in the future',
    },
);

export const participantSchema = z.object({
    userId: idObjectIdsSchema,
    role: z.string(),
    email: emailSchema.optional(),
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
    finishDate: z.date(),
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
        finishDate: true,
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
    });

export const outputNewDebateZoneSchema = outputDebateZoneSchema.extend({});

export const outputDebateZoneListSchema = z.object({
    debateZones: z.array(outputDebateZoneSchema),
});

export const inputDebateZoneIdSchema = z.object({
    id: idObjectIdsSchema,
});

export const inputActiveDebateZoneIdSchema = z.object({
    id: idObjectIdsSchema,
});

export const outputDebateZoneDetailsSchema = debateZoneSchema.extend({
    isTimeExpiredToJoin: z.boolean(),
    isAlreadyJoined: z.boolean(),
    isAlreadyFinished: z.boolean(),
});

export const outputActiveDebateZoneSchema = outputDebateZoneSchema.extend({});

export const outputActiveDebateZoneListSchema = z.object({
    debateZones: z.array(outputActiveDebateZoneSchema),
});

export const outputActiveDebateZoneDetailsSchema =
    outputDebateZoneSchema.extend({});

export const outputProfileDebateZoneSchema = outputDebateZoneSchema.extend({});
export const outputProfileDebateZoneListSchema = z.object({
    debateZones: z.array(outputProfileDebateZoneSchema),
});

export const outputFeedDebateZoneDetailsSchema = outputDebateZoneSchema.extend(
    {},
);
