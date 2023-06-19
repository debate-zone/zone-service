import {
    DebateZone,
    OutputActiveDebateZone,
    OutputActiveDebateZoneDetails,
    OutputActiveDebateZoneList,
} from '../types';
import { debateZoneDbController } from '../dbControllers/debateZoneDbController';
import { createHttpError } from 'express-zod-api';

export const getActiveDebateZones = async (
    userId: string,
): Promise<OutputActiveDebateZoneList> => {
    const debateZones: DebateZone[] = await debateZoneDbController.findAll(
        {
            $or: [
                {
                    $and: [
                        {
                            date: {
                                $lte: new Date(),
                            },
                        },
                        {
                            finishDate: {
                                $gte: new Date(),
                            },
                        },
                        {
                            $or: [
                                {
                                    isPrivate: false,
                                },
                                {
                                    isPrivate: {
                                        $exists: false,
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    $and: [
                        {
                            date: {
                                $lte: new Date(),
                            },
                        },
                        {
                            finishDate: {
                                $gte: new Date(),
                            },
                        },
                        {
                            isPrivate: true,
                        },
                        {
                            $or: [
                                {
                                    'participants.userId': userId,
                                },
                                {
                                    userId: userId,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        { date: 'asc' },
    );

    const outputActiveDebateZones: OutputActiveDebateZone[] = debateZones.map(
        debateZone => {
            const { __v, ...rest } = debateZone;
            return rest as OutputActiveDebateZone;
        },
    );

    return {
        debateZones: outputActiveDebateZones,
    };
};

export const getActiveDebateZoneDetails = async (
    id: string,
    userId: string,
): Promise<OutputActiveDebateZoneDetails> => {
    const debateZone: DebateZone | null = await debateZoneDbController.findOne({
        $or: [
            {
                $and: [
                    {
                        date: {
                            $lte: new Date(),
                        },
                    },
                    {
                        finishDate: {
                            $gte: new Date(),
                        },
                    },
                    {
                        $or: [
                            {
                                isPrivate: false,
                            },
                            {
                                isPrivate: {
                                    $exists: false,
                                },
                            },
                        ],
                    },
                    {
                        _id: id,
                    },
                ],
            },
            {
                $and: [
                    {
                        date: {
                            $lte: new Date(),
                        },
                    },
                    {
                        finishDate: {
                            $gte: new Date(),
                        },
                    },
                    {
                        isPrivate: true,
                    },
                    {
                        $or: [
                            {
                                'participants.userId': userId,
                            },
                            {
                                userId: userId,
                            },
                        ],
                    },
                ],
            },
        ],
    });

    if (!debateZone) {
        throw createHttpError(404, 'Debate zone not found.');
    }

    const { __v, ...rest } = debateZone;
    return rest as OutputActiveDebateZoneDetails;
};
