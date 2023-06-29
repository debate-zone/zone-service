import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { DebateZone, RoundStatus } from '../types';
import { baseSchema } from '../../../debate-zone-micro-service-common-library/src/mongoose/baseSchema';
import { Type } from '../enums/type';
import { Role } from '../enums/role';
import { CollectionsEnum } from '../../../debate-zone-micro-service-common-library/src/enums/collectionsEnum';
import {
    ParticipantStatus,
    DebateZoneStatus,
} from '../../../../common-library/src/debateZone/types';

export type DebateZoneDocument = Document & DebateZone;

const debateZoneMongooseSchema: mongoose.Schema = baseSchema.add({
    userId: {
        type: Types.ObjectId,
        ref: CollectionsEnum.USER,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    rounds: {
        type: Array,
        of: {
            time: {
                type: Number,
                required: true,
            },
            activeUserId: {
                type: Types.ObjectId,
                ref: CollectionsEnum.USER,
                required: true,
            },
            isFinished: {
                type: Boolean,
            },
            status: {
                type: String,
                enum: Object.values(RoundStatus),
                required: true,
            },
        },
    },
    status: {
        type: String,
        enum: Object.values(DebateZoneStatus),
        required: true,
        default: DebateZoneStatus.PENDING,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(Type),
        required: true,
    },
    date: {
        type: Date,
        required: true,
        min: new Date(),
    },
    finishDate: {
        type: Date,
        required: true,
        min: new Date(),
    },
    isPrivate: {
        type: Boolean,
    },
    isAIReferee: {
        type: Boolean,
    },
    isPublicChoice: {
        type: Boolean,
    },
    participants: {
        type: Array,
        of: {
            userId: {
                type: Types.ObjectId,
                ref: CollectionsEnum.USER,
                required: true,
            },
            role: {
                type: String,
                enum: Object.values(Role),
                required: true,
            },
            status: {
                type: String,
                enum: Object.values(ParticipantStatus),
                required: true,
                default: ParticipantStatus.PENDING,
            },
        },
    },
    winnerUserId: {
        type: Types.ObjectId,
        ref: CollectionsEnum.USER,
    },
    isSave: {
        type: Boolean,
    },
});

export const debateZoneMongooseModel = mongoose.model<DebateZoneDocument>(
    CollectionsEnum.DEBATE_ZONE,
    debateZoneMongooseSchema,
);
