import { debateZoneDbController } from '../dbControllers/debateZoneDbController';
import { OutputProfileDebateZone, OutputProfileDebateZoneList } from '../types';

export const getProfileDebateZoneList =
    async (): Promise<OutputProfileDebateZoneList> => {
        const profileDebateZones = await debateZoneDbController.findAll(
            {
                // todo auth user id
                userId: '60b8f8bdf8e5a20fec8b8a54',
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
