import {z} from "zod"
import { baseZodSchema } from '../../../debate-zone-micro-service-common-library/src/zod/baseZodSchema';

export const debateZoneSchema = baseZodSchema.extend({
    userId: z.string(),
    shortDescription: z.string(),
    type: z.string(),
    date: z.date().min(new Date(), {message: "Date must be in the future"}),
    isPrivate: z.boolean().optional(),
    isAIReferee: z.boolean().optional(),
    isPublicChoice: z.boolean().optional(),
    participants: z.array(z.object({
        userId: z.string(),
        role: z.string()
    })).optional(),
    isSave: z.boolean().optional(),
})

export const updateDebateZoneSchema = debateZoneSchema.omit({
    __v: true,
})

export const newDebateZoneSchema = debateZoneSchema.omit({
    _id: true,
    __v: true,
})

export const outputDebateZoneSchema = debateZoneSchema.omit({
    __v: true,
})

export const outputDebateZoneListSchema = z.object({
    debateZones: z.array(outputDebateZoneSchema),
})

export const inputDebateZoneIdSchema = z.object({
    id: z.string(),
})