import { Kafka, KafkaConfig } from 'kafkajs';
import 'dotenv/config'

const kafkaConfig: KafkaConfig = { brokers: [process.env.BROKER_PORT!] }
export const kafka = new Kafka(kafkaConfig)
