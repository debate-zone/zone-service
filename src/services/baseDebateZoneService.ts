import {DebateZone, NewDebateZone, OutputDebateZone, OutputDebateZoneList, UpdateDebateZone} from "../types";
import {debateZoneDbController} from "../dbControllers/debateZoneDbController";
import {createHttpError} from "express-zod-api";
import {Role} from "../enums/role";

export const saveDebateZone = async (
    saveDebateZoneInput: NewDebateZone | UpdateDebateZone
): Promise<OutputDebateZone> => {
    const debateZone: DebateZone | null = await debateZoneDbController.save({}, saveDebateZoneInput);

    if (!debateZone) {
        throw createHttpError(500, "Could not save debate zone.");
    } else {
        return debateZone;
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
        debateZones: debateZones
    }
}

export const getDebateZoneById = async (id: string): Promise<OutputDebateZone> => {
    const debateZone: DebateZone | null = await debateZoneDbController.findOne({
        _id: id
    });

    if (!debateZone) {
        throw createHttpError(404, "Could not find debate zone.");
    } else {
        return debateZone;
    }
}

export const joinDebateZone = async (id: string): Promise<DebateZone> => {
    const outputDebateZone: OutputDebateZone = await getDebateZoneById(id);
    if (outputDebateZone.participants) {
        outputDebateZone.participants.push({
            userId: "123",
            role: Role.PARTICIPANT
        })
    } else {
        outputDebateZone.participants = [{
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
        return savedDebateZone;
    }
}
