import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { DebateZone } from '../types';
import { baseSchema } from '../../../debate-zone-micro-service-common-library/src/mongoose/baseSchema';
import { Type } from '../enums/type';
import { Role } from '../enums/role';
import { CollectionsEnum } from '../../../debate-zone-micro-service-common-library/src/enums/collectionsEnum';

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
        },
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
