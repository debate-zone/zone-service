import { debateZoneDbController } from '../dbControllers/debateZoneDbController';
import { OutputProfileDebateZone, OutputProfileDebateZoneList } from '../types';

export const getProfileDebateZoneList = async (
    userId: string,
): Promise<OutputProfileDebateZoneList> => {
    const profileDebateZones = await debateZoneDbController.findAll(
        {
            $and: [
                {
                    date: {
                        $gt: new Date(),
                    },
                },
                {
                    'participants.userId': userId,
                },
            ],
        },
        { date: 'asc' },
    );

    const outputProfileDebateZone: OutputProfileDebateZone[] =
        profileDebateZones.map(debateZone => {
            const { __v, ...rest } = debateZone;
            return rest as OutputProfileDebateZone;
        });

    return {
        debateZones: outputProfileDebateZone,
    };
};

export const getProfileMyDebateZoneList = async (
    userId: string,
): Promise<OutputProfileDebateZoneList> => {
    const profileDebateZones = await debateZoneDbController.findAll(
        {
            $and: [
                {
                    date: {
                        $gt: new Date(),
                    },
                },
                {
                    userId: userId,
                },
            ],
        },
        { date: 'asc' },
    );

    const outputProfileDebateZone: OutputProfileDebateZone[] =
        profileDebateZones.map(debateZone => {
            const { __v, ...rest } = debateZone;
            return rest as OutputProfileDebateZone;
        });

    return {
        debateZones: outputProfileDebateZone,
    };
}

