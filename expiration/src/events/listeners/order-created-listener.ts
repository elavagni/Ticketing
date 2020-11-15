import { Listener, OrderCreatedEvent, Subjects } from '@eltickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject =  Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], message: Message) {
        await expirationQueue.add({ 
            orderId: data.id 
        }, {
            delay: 10000
        });

        message.ack();
    }
}