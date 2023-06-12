import {
    debateZoneSchema,
    newDebateZoneSchema,
    newParticipantSchema,
    outputActiveDebateZoneDetailsSchema,
    outputActiveDebateZoneListSchema,
    outputActiveDebateZoneSchema,
    outputDebateZoneDetailsSchema,
    outputDebateZoneListSchema,
    outputDebateZoneSchema,
    outputProfileDebateZoneListSchema,
    outputProfileDebateZoneSchema,
    participantSchema,
    roundSchema,
    updateDebateZoneSchema,
} from './zodSchema';
import { z } from 'zod';

export type DebateZone = z.infer<typeof debateZoneSchema>;

export type Participant = z.infer<typeof participantSchema>;

export type UpdateDebateZone = z.infer<typeof updateDebateZoneSchema>;

export type NewDebateZone = z.infer<typeof newDebateZoneSchema>;

export type NewParticipant = z.infer<typeof newParticipantSchema>;

export type OutputDebateZone = z.infer<typeof outputDebateZoneSchema>;

export type OutputDebateZoneList = z.infer<typeof outputDebateZoneListSchema>;

export type Round = z.infer<typeof roundSchema>;

export type OutputDebateZoneDetail = z.infer<
    typeof outputDebateZoneDetailsSchema
>;

export type OutputActiveDebateZone = z.infer<
    typeof outputActiveDebateZoneSchema
>;

export type OutputActiveDebateZoneList = z.infer<
    typeof outputActiveDebateZoneListSchema
>;

export type OutputActiveDebateZoneDetails = z.infer<
    typeof outputActiveDebateZoneDetailsSchema
>;

export type OutputProfileDebateZone = z.infer<
    typeof outputProfileDebateZoneSchema
>;

export type OutputProfileDebateZoneList = z.infer<
    typeof outputProfileDebateZoneListSchema
>;
