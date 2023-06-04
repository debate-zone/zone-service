import {
    debateZoneSchema,
    newDebateZoneSchema, newParticipantSchema, outputDebateZoneListSchema,
    outputDebateZoneSchema, participantSchema,
    updateDebateZoneSchema
} from "./zodSchema"
import {z} from "zod"

export type DebateZone = z.infer<typeof debateZoneSchema>

export type Participant = z.infer<typeof participantSchema>

export type UpdateDebateZone = z.infer<typeof updateDebateZoneSchema>

export type NewDebateZone = z.infer<typeof newDebateZoneSchema>

export type NewParticipant = z.infer<typeof newParticipantSchema>

export type OutputDebateZone = z.infer<typeof outputDebateZoneSchema>

export type OutputDebateZoneList = z.infer<typeof outputDebateZoneListSchema>
