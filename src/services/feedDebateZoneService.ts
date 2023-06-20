import {
    DebateZone,
    OutputDebateZoneList,
    OutputFeedDebateZoneDetails,
} from '../types';
import { debateZoneDbController } from '../dbControllers/debateZoneDbController';

export const getFeedDebateZones = async (
    userId: string,
): Promise<OutputDebateZoneList> => {
    const debateZones: DebateZone[] = await debateZoneDbController.findAll(
        {
            $or: [
                {
                    $and: [
                        {
                            finishDate: {
                                $lte: new Date(),
                            },
                        },
                        {
                            isSave: true,
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
                            finishDate: {
                                $lte: new Date(),
                            },
                        },
                        {
                            isSave: true,
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
        {
            date: 'asc',
        },
    );

    return {
        debateZones: debateZones.map(debateZone => {
            const { __v, ...rest } = debateZone;
            return rest;
        }),
    };
};

export const getFeedDebateZoneDetails = async (
    id: string,
    userId: string,
): Promise<OutputFeedDebateZoneDetails> => {
    const debateZone: DebateZone | null = await debateZoneDbController.findOne({
        $and: [
            {
                _id: id,
            },
            {
                $or: [
                    {
                        $and: [
                            {
                                finishDate: {
                                    $lte: new Date(),
                                },
                            },
                            {
                                isSave: true,
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
                                finishDate: {
                                    $lte: new Date(),
                                },
                            },
                            {
                                isSave: true,
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
        ],
    });

    if (!debateZone) {
        throw new Error('Debate zone not found');
    }

    const { __v, ...rest } = debateZone;

    return rest;
};
