import {
    DebateZone,
    NewDebateZone,
    NewParticipant,
    OutputDebateZone,
    OutputDebateZoneList,
    Participant,
    Round,
    UpdateDebateZone,
} from '../types';
import { debateZoneDbController } from '../dbControllers/debateZoneDbController';
import { createHttpError } from 'express-zod-api';
import { Role } from '../enums/role';
import { produceNotification } from '../kafka/producer/notification';
import axios from 'axios';
import 'dotenv/config';

async function notifyUserAboutInvite(
    userId: string,
    newParticipant: NewParticipant,
) {
    const dataNotification = {
        userId,
        ...newParticipant,
    };
    await produceNotification(dataNotification);
}

async function createNewUser(newParticipant: NewParticipant) {
    let user:
        | {
              _id: string;
          }
        | undefined = undefined;
    try {
        const response = await axios.post(
            `${process.env.USER_MICRO_SERVICE_URL}/users/new`,
            {
                email:
                    newParticipant.email != null
                        ? newParticipant.email
                        : undefined,
                phoneNumber:
                    newParticipant.phoneNumber != null
                        ? newParticipant.phoneNumber
                        : undefined,
            },
        );
        user = response.data.data;
    } catch (e: any) {
        throw createHttpError(500, `Cannot create user: ${e.message}`);
    }

    if (user === undefined) {
        throw createHttpError(500, 'User not created');
    } else {
        return user;
    }
}

async function handleParticipants(
    saveDebateZoneInput: NewDebateZone,
): Promise<Participant[]> {
    const participants = saveDebateZoneInput.participants;
    const participantsToSave: Participant[] = [];

    for (const participant of participants) {
        const user = await createNewUser(participant);

        await notifyUserAboutInvite(user._id, participant);

        const participantToSave: Participant = {
            userId: user._id,
            role: Role.DEBATER,
        };
        participantsToSave.push(participantToSave);
    }
    return participantsToSave;
}

export const newDebateZone = async (
    saveDebateZoneInput: NewDebateZone,
): Promise<OutputDebateZone> => {
    const participants = await handleParticipants(saveDebateZoneInput);
    // todo in dependence on type or add selector in new debate zone component
    const rounds: Round[] = [];

    participants.forEach(participant => {
        if (participant.role === Role.DEBATER) {
            const round: Round = {
                activeUserId: participant.userId,
                time: saveDebateZoneInput.roundTime,
            };
            rounds.push(round);
        }
    });

    const debateZoneToSave: DebateZone | null = {
        ...saveDebateZoneInput,
        userId: '60b8f8bdf8e5a20fec8b8a54',
        date: new Date(saveDebateZoneInput.date),
        rounds: rounds,
        participants: participants,
    };

    const debateZone: DebateZone | null = await debateZoneDbController.create(
        debateZoneToSave,
    );

    if (!debateZone) {
        throw createHttpError(500, 'Could not save debate zone.');
    } else {
        const { __v, ...rest } = debateZone;
        return rest as OutputDebateZone;
    }
};

export const getListDebateZone = async (): Promise<OutputDebateZoneList> => {
    const time = new Date();

    const debateZones: DebateZone[] = await debateZoneDbController.findAll({
        $and: [
            {
                date: {
                    $gt: time,
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
    });

    const outputDebateZones: OutputDebateZone[] = debateZones.map(
        debateZone => {
            const { __v, ...rest } = debateZone;
            return rest as OutputDebateZone;
        },
    );

    return {
        debateZones: outputDebateZones,
    };
};

export const getDebateZoneById = async (
    id: string,
): Promise<OutputDebateZone> => {
    const debateZone: DebateZone | null = await debateZoneDbController.findOne({
        _id: id,
    });

    if (!debateZone) {
        throw createHttpError(404, 'Could not find debate zone.');
    } else {
        const { __v, ...rest } = debateZone;
        return rest as OutputDebateZone;
    }
};

export const updateDebateZone = async (
    updateDebateZone: UpdateDebateZone,
): Promise<OutputDebateZone> => {
    const { date, ...rest } = updateDebateZone;

    const debateZone: DebateZone | null = await debateZoneDbController.save(
        {
            _id: updateDebateZone._id,
        },
        {
            ...rest,
            date: date ? new Date(date) : undefined,
        },
    );

    if (!debateZone) {
        throw createHttpError(500, 'Could not save debate zone.');
    } else {
        const { __v, ...rest } = debateZone;
        return rest as OutputDebateZone;
    }
};

export const joinDebateZone = async (id: string): Promise<OutputDebateZone> => {
    const outputDebateZone: OutputDebateZone = await getDebateZoneById(id);
    if (outputDebateZone.participants) {
        outputDebateZone.participants.push({
            // todo get user id from auth
            userId: '123',
            role: Role.DEBATER,
        });
    } else {
        outputDebateZone.participants = [
            {
                // todo get user id from auth
                userId: '123',
                role: Role.DEBATER,
            },
        ];
    }
    const savedDebateZone: DebateZone | null =
        await debateZoneDbController.save(
            {
                _id: id,
            },
            outputDebateZone,
        );

    if (!savedDebateZone) {
        throw createHttpError(500, 'Could not save debate zone.');
    } else {
        return savedDebateZone as OutputDebateZone;
    }
};
