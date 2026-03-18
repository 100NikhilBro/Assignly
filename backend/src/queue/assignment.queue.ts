import {Queue} from 'bullmq';
import {env} from '../config/env'

export const assignmentQueue = new Queue("assignmentQueue",{
    connection:{
        url:env.REDIS_URL // We have to add the url of redis here - Remember it 
    }
})


