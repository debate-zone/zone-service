import {
    DebateZone,
    NewDebateZone,
    NewParticipant,
    OutputDebateZone,
    OutputDebateZoneList, Participant
} from "../types";
import {debateZoneDbController} from "../dbControllers/debateZoneDbController";
import {createHttpError} from "express-zod-api";
import {Role} from "../enums/role";
import {produceNotification} from "../kafka/producer/notification";
import axios from "axios";
import 'dotenv/config'

async function notifyUserAboutInvite(userId: string, newParticipant: NewParticipant) {
    const dataNotification = {
        userId,
        ...newParticipant,
    }
    await produceNotification(dataNotification)
}

async function createNewUser(newParticipant: NewParticipant) {
    let user: {
        _id: string;
    } | undefined = undefined;
    try {
        const response = await axios
            .post(`${process.env.USER_MICRO_SERVICE_URL}/users/newUser`, {
                email: newParticipant.email != null ? newParticipant.email : undefined,
                phoneNumber: newParticipant.phoneNumber != null ? newParticipant.phoneNumber : undefined,
            })
        user = response.data.data;
    } catch (e) {
        throw createHttpError(500, "Smth went wrong with user creation")
    }
    if (user === undefined) {
        throw createHttpError(500, "User not created")
    } else {
        return user;
    }
}

async function handleParticipants(saveDebateZoneInput: NewDebateZone): Promise<Participant[]> {
    const participants = saveDebateZoneInput.participants
    const participantsToSave: Participant[] = [];

    for (const participant of participants) {
        const user = await createNewUser(participant);

        await notifyUserAboutInvite(user._id, participant);

        const participantToSave: Participant = {
            userId: user._id,
            role: Role.PARTICIPANT,
        }
        participantsToSave.push(participantToSave);
    }
    return participantsToSave;
}

export const newDebateZone = async (
    saveDebateZoneInput: NewDebateZone
): Promise<OutputDebateZone> => {
    const participants = await handleParticipants(saveDebateZoneInput);

    const debateZoneToSave: DebateZone | null = {
        ...saveDebateZoneInput,
        date: new Date(saveDebateZoneInput.date),
        participants: participants,
    }

    const debateZone: DebateZone | null = await debateZoneDbController.create(debateZoneToSave);

    if (!debateZone) {
        throw createHttpError(500, "Could not save debate zone.");
    } else {
        return {
            _id: debateZone._id,
            shortDescription: debateZone.shortDescription,
            participants: debateZone.participants.map(participant => ({
                userId: participant.userId.toString(),
                role: participant.role,
            })),
            type: debateZone.type,
            userId: debateZone.userId.toString(),
            date: debateZone.date,
        } as OutputDebateZone
    }
}

export const getListDebateZone = async (): Promise<OutputDebateZoneList> => {
    const time = new Date();

    const debateZones: DebateZone[] =  await debateZoneDbController.findAll({
        date: {
            $gt: time
        },
        isPrivate: {
            $in: [false, undefined]
        }
    });

    return {
        debateZones: debateZones as OutputDebateZone[]
    }
}

export const getDebateZoneById = async (id: string): Promise<OutputDebateZone> => {
    const debateZone: DebateZone | null = await debateZoneDbController.findOne({
        _id: id
    });

    if (!debateZone) {
        throw createHttpError(404, "Could not find debate zone.");
    } else {
        return debateZone as OutputDebateZone;
    }
}

export const joinDebateZone = async (id: string): Promise<OutputDebateZone> => {
    const outputDebateZone: OutputDebateZone = await getDebateZoneById(id);
    if (outputDebateZone.participants) {
        outputDebateZone.participants.push({
            // todo get user id from auth
            userId: "123",
            role: Role.PARTICIPANT
        })
    } else {
        outputDebateZone.participants = [{
            // todo get user id from auth
            userId: "123",
            role: Role.PARTICIPANT
        }]
    }
    const savedDebateZone: DebateZone | null = await debateZoneDbController.save({
        _id: id
    }, outputDebateZone);

    if (!savedDebateZone) {
        throw createHttpError(500, "Could not save debate zone.");
    } else {
        return savedDebateZone as OutputDebateZone;
    }
}
