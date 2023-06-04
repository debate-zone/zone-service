import {kafka} from "../config";
import {TopicEnum} from "../../../../../debate-zone-micro-service-common-library/src/kafka/topicsEnum";
import {RecordMetadata} from "kafkajs";

export const produceNotification = async (data: any): Promise<RecordMetadata[] | void> => {
    const producer = kafka.producer({allowAutoTopicCreation: true})
    await producer.connect()
    try {
        const recordMetadata: RecordMetadata[] = await producer.send({
            topic: TopicEnum.INVITE_TO_DEBATE_ZONE_NOTIFICATION,
            messages: [
                {
                    value: JSON.stringify(data),
                }
            ],
        })
        console.info(`Notification produced successfully, recordMetadata: ${JSON.stringify(recordMetadata)}`)
        return recordMetadata
    } catch (e) {
        console.error(e)
        throw e
    } finally {
        await producer.disconnect()
    }
}
