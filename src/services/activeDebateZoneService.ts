import {
    DebateZone,
    OutputActiveDebateZone,
    OutputActiveDebateZoneDetails,
    OutputActiveDebateZoneList,
} from '../types';
import { debateZoneDbController } from '../dbControllers/debateZoneDbController';
import { createHttpError } from 'express-zod-api';

export const getActiveDebateZones =
    async (): Promise<OutputActiveDebateZoneList> => {
        const now = new Date();

        console.log('now', now);
        const debateZones: DebateZone[] = await debateZoneDbController.findAll(
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
                ],
            },
            { date: 'asc' },
        );

        const outputActiveDebateZones: OutputActiveDebateZone[] =
            debateZones.map(debateZone => {
                const { __v, ...rest } = debateZone;
                return rest as OutputActiveDebateZone;
            });

        return {
            debateZones: outputActiveDebateZones,
        };
    };

export const getActiveDebateZoneDetails = async (
    id: string,
): Promise<OutputActiveDebateZoneDetails> => {
    const debateZone: DebateZone | null = await debateZoneDbController.findOne({
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
    });

    if (!debateZone) {
        throw createHttpError(404, 'Debate zone not found.');
    }

    const { __v, ...rest } = debateZone;
    return rest as OutputActiveDebateZoneDetails;
};
