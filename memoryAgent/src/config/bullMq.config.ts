import { Queue, Worker} from "bullmq";
import type { Processor } from "bullmq";

export const connection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
};

export const createQueue = (name: string) => {
    return new Queue(name, {connection});
};

export const createWorker = (name : string, processor : Processor) =>{
    return new Worker(name, processor, {connection})
}

