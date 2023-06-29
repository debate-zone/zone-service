import {
    DebateZone,
    NewDebateZone,
    NewParticipant,
    OutputDebateZone,
    OutputDebateZoneDetail,
    OutputDebateZoneList,
    Participant,
    Round,
    RoundStatus,
    UpdateDebateZone,
} from '../types';
import { debateZoneDbController } from '../dbControllers/debateZoneDbController';
import { createHttpError } from 'express-zod-api';
import { Role } from '../enums/role';
import { produceNotificationForInvitedUser } from '../kafka/producer/notification';
import axios from 'axios';
import 'dotenv/config';
import { isAlreadyJoined, isTimeExpiredToJoin } from './joinDebateZoneService';
import { InvitedUserToDebate } from '../../../debate-zone-micro-service-common-library/src/kafka/types';
import { ParticipantStatus } from '../../../../common-library/src/debateZone/types';

async function notifyUserAboutInvite(
    options: {
        userId: string;
        fullName: string;
    },
    debateZoneId: string,
    debateZoneTitle: string,
    debateZoneShortDescription: string,
    newParticipant: Participant,
) {
    const dataNotification: InvitedUserToDebate = {
        debateZoneShortDescription: debateZoneShortDescription,
        debateZoneId: debateZoneId,
        debateZoneTitle: debateZoneTitle,
        producerUserId: options.userId,
        producerFullName: options.fullName,
        consumerUserId: newParticipant.userId,
        consumerEmail: newParticipant.email,
        consumerRole: newParticipant.role,
    };
    await produceNotificationForInvitedUser(dataNotification);
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

        const participantToSave: Participant = {
            userId: user._id,
            role: Role.DEBATER,
            status: ParticipantStatus.PENDING,
            email: participant.email,
        };
        participantsToSave.push(participantToSave);
    }
    return participantsToSave;
}

export const newDebateZone = async (
    saveDebateZoneInput: NewDebateZone,
    options: {
        userId: string;
        fullName: string;
    },
): Promise<DebateZone> => {
    const participants = await handleParticipants(saveDebateZoneInput);
    const rounds: Round[] = [];

    participants.forEach(participant => {
        if (participant.role === Role.DEBATER) {
            const round: Round = {
                activeUserId: participant.userId,
                time: saveDebateZoneInput.roundTime,
                status: RoundStatus.PENDING,
            };
            rounds.push(round);
        }
    });

    const debateZoneToSave: DebateZone | null = {
        ...saveDebateZoneInput,
        userId: options.userId,
        date: new Date(saveDebateZoneInput.date),
        finishDate: new Date(
            new Date(saveDebateZoneInput.date).getTime() +
                saveDebateZoneInput.roundTime * rounds.length * 60000,
        ),
        rounds: rounds,
        participants: participants,
    };

    const debateZone: DebateZone | null = await debateZoneDbController.create(
        debateZoneToSave,
    );

    if (!debateZone) {
        throw createHttpError(500, 'Could not save debate zone.');
    } else {
        participants.forEach(participant => {
            notifyUserAboutInvite(
                options,
                debateZone._id,
                debateZone.title,
                debateZone.shortDescription,
                participant,
            );
        });

        const { __v, ...rest } = debateZone;
        return rest as OutputDebateZone;
    }
};

export const getListDebateZone = async (
    userId: string,
): Promise<OutputDebateZoneList> => {
    const time = new Date();

    const debateZones: DebateZone[] = await debateZoneDbController.findAll(
        {
            $or: [
                {
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
                },
                {
                    $and: [
                        {
                            date: {
                                $gt: time,
                            },
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
                        {
                            isPrivate: true,
                        },
                    ],
                },
            ],
        },
        { date: 'asc' },
    );

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

const isLive = (debateZone: DebateZone): boolean => {
    return debateZone.date < new Date() && debateZone.finishDate > new Date();
};

export const getDebateZoneById = async (
    id: string,
    userId: string,
): Promise<OutputDebateZoneDetail> => {
    const debateZone: DebateZone | null = await debateZoneDbController.findOne({
        _id: id,
    });

    if (!debateZone) {
        throw createHttpError(404, 'Could not find debate zone.');
    } else {
        const { __v, ...rest } = debateZone;

        const outputDebateZoneDetails = rest as OutputDebateZoneDetail;

        outputDebateZoneDetails.isTimeExpiredToJoin =
            isTimeExpiredToJoin(debateZone);
        outputDebateZoneDetails.isAlreadyJoined = isAlreadyJoined(
            debateZone,
            userId,
        );
        outputDebateZoneDetails.isAlreadyFinished =
            debateZone.date < new Date();

        return outputDebateZoneDetails;
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
