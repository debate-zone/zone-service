import {
    DebateZone,
    InputJoinDebateZone,
    OutputDebateZoneDetail,
} from '../types';
import { Role } from '../enums/role';
import { debateZoneDbController } from '../dbControllers/debateZoneDbController';
import { createHttpError } from 'express-zod-api';
import { getDebateZoneById } from './baseDebateZoneService';
import { produceNotificationForHostUser } from '../kafka/producer/notification';

function validateJoin(outputDebateZoneDetail: OutputDebateZoneDetail) {
    if (outputDebateZoneDetail.isTimeExpiredToJoin) {
        throw createHttpError(400, 'Time is expired to join.');
    }
    if (outputDebateZoneDetail.isAlreadyFinished) {
        throw createHttpError(400, 'Debate zone is already finished.');
    }
}

export const joinDebateZone = async (
    inputJoinDebateZone: InputJoinDebateZone,
    user: {
        userId: string;
        fullName: string;
    },
): Promise<OutputDebateZoneDetail> => {
    const outputDebateZoneDetail: OutputDebateZoneDetail =
        await getDebateZoneById(inputJoinDebateZone.id, user.userId);

    validateJoin(outputDebateZoneDetail);

    if (
        outputDebateZoneDetail.participants &&
        !isAlreadyJoined(outputDebateZoneDetail, user.userId)
    ) {
        outputDebateZoneDetail.participants.push({
            userId: user.userId,
            role: Role.DEBATER,
            status: inputJoinDebateZone.participantStatus,
        });
    }

    if (
        outputDebateZoneDetail.participants &&
        isAlreadyJoined(outputDebateZoneDetail, user.userId)
    ) {
        outputDebateZoneDetail.participants =
            outputDebateZoneDetail.participants.map(participant => {
                if (participant.userId.toString() === user.userId) {
                    participant.status = inputJoinDebateZone.participantStatus;
                }
                return participant;
            });
    }

    if (
        !outputDebateZoneDetail.participants ||
        outputDebateZoneDetail.participants.length === 0
    ) {
        outputDebateZoneDetail.participants = [
            {
                userId: user.userId,
                role: Role.DEBATER,
                status: inputJoinDebateZone.participantStatus,
            },
        ];
    }
    const savedDebateZone: DebateZone | null =
        await debateZoneDbController.save(
            {
                _id: inputJoinDebateZone.id,
            },
            outputDebateZoneDetail as DebateZone,
        );

    if (!savedDebateZone) {
        throw createHttpError(500, 'Could not save debate zone.');
    } else {
        await produceNotificationForHostUser({
            producerUserId: user.userId,
            producerFullName: user.fullName,
            debateZoneId: inputJoinDebateZone.id,
            debateZoneTitle: savedDebateZone.title,
            debateZoneShortDescription: savedDebateZone.shortDescription,
            debateZoneParticipantStatus: savedDebateZone.participants?.find(
                participant => participant.userId.toString() === user.userId,
            )?.status,
            consumerUserId: savedDebateZone.userId,
        });
        return await getDebateZoneById(inputJoinDebateZone.id, user.userId);
    }
};

export const isTimeExpiredToJoin = (debateZone: DebateZone): boolean => {
    const now = new Date();
    const debateZoneDate = new Date(debateZone.date);
    return now > debateZoneDate;
};

export const isAlreadyJoined = (
    debateZone: DebateZone,
    userId: string,
): boolean => {
    if (debateZone.participants) {
        return debateZone.participants.some(
            // todo mongoose return string not ObjectId
            participant => participant.userId.toString() === userId,
        );
    } else {
        return false;
    }
};
