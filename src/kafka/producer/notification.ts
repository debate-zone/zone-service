import { kafka } from '../config';
import { TopicEnum } from '../../../../debate-zone-micro-service-common-library/src/kafka/topicsEnum';
import { RecordMetadata } from 'kafkajs';
import {
    InvitedUserToDebate,
    JoinedToDebate,
} from '../../../../debate-zone-micro-service-common-library/src/kafka/types';

export const produceNotification = async (
    topic: TopicEnum,
    value: any,
): Promise<RecordMetadata[] | void> => {
    const producer = kafka.producer({ allowAutoTopicCreation: true });
    await producer.connect();
    try {
        const recordMetadata: RecordMetadata[] = await producer.send({
            topic: topic,
            messages: [
                {
                    value: JSON.stringify(value),
                },
            ],
        });
        console.info(
            `${topic} produced successfully, recordMetadata: ${JSON.stringify(
                recordMetadata,
            )}`,
        );
        return recordMetadata;
    } catch (e) {
        console.error(e);
        throw e;
    } finally {
        await producer.disconnect();
    }
};

export const produceNotificationForInvitedUser = async (
    inviteUserToDebate: InvitedUserToDebate,
): Promise<RecordMetadata[] | void> => {
    return await produceNotification(
        TopicEnum.INVITE_TO_DEBATE_ZONE_NOTIFICATION,
        inviteUserToDebate,
    );
};

export const produceNotificationForHostUser = async (
    joinedToDebate: JoinedToDebate,
): Promise<RecordMetadata[] | void> => {
    return await produceNotification(
        TopicEnum.JOINED_TO_DEBATE_ZONE_NOTIFICATION,
        joinedToDebate,
    );
};
