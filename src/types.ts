import {
    debateZoneSchema,
    newDebateZoneSchema, outputDebateZoneListSchema,
    outputDebateZoneSchema,
    updateDebateZoneSchema
} from "./zodSchema"
import {z} from "zod"

export type DebateZone = z.infer<typeof debateZoneSchema>

export type UpdateDebateZone = z.infer<typeof updateDebateZoneSchema>

export type NewDebateZone = z.infer<typeof newDebateZoneSchema>

export type OutputDebateZone = z.infer<typeof outputDebateZoneSchema>

export type OutputDebateZoneList = z.infer<typeof outputDebateZoneListSchema>