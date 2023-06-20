import { DebateZone, OutputDebateZone, OutputDebateZoneDetail } from '../types';
import { Role } from '../enums/role';
import { debateZoneDbController } from '../dbControllers/debateZoneDbController';
import { createHttpError } from 'express-zod-api';
import { getDebateZoneById } from './baseDebateZoneService';
import { produceNotificationForHostUser } from '../kafka/producer/notification';

function validateJoin(outputDebateZoneDetail: OutputDebateZoneDetail) {
    if (outputDebateZoneDetail.isTimeExpiredToJoin) {
        throw createHttpError(400, 'Time is expired to join.');
    }
    if (outputDebateZoneDetail.isAlreadyJoined) {
        throw createHttpError(400, 'You are already joined.');
    }
    if (outputDebateZoneDetail.isAlreadyFinished) {
        throw createHttpError(400, 'Debate zone is already finished.');
    }
}

export const joinDebateZone = async (
    id: string,
    user: {
        userId: string;
        fullName: string;
    },
): Promise<OutputDebateZoneDetail> => {
    const outputDebateZoneDetail: OutputDebateZoneDetail =
        await getDebateZoneById(id, user.userId);

    validateJoin(outputDebateZoneDetail);

    if (outputDebateZoneDetail.participants) {
        outputDebateZoneDetail.participants.push({
            userId: user.userId,
            role: Role.DEBATER,
        });
    } else {
        outputDebateZoneDetail.participants = [
            {
                userId: user.userId,
                role: Role.DEBATER,
            },
        ];
    }
    const savedDebateZone: DebateZone | null =
        await debateZoneDbController.save(
            {
                _id: id,
            },
            outputDebateZoneDetail as DebateZone,
        );

    if (!savedDebateZone) {
        throw createHttpError(500, 'Could not save debate zone.');
    } else {
        await produceNotificationForHostUser({
            producerUserId: user.userId,
            producerFullName: user.fullName,
            debateZoneId: id,
            debateZoneTitle: savedDebateZone.title,
            debateZoneShortDescription: savedDebateZone.shortDescription,
            consumerUserId: savedDebateZone.userId,
        });
        return await getDebateZoneById(id, user.userId);
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
