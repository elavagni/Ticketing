import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from '@eltickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject =  Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'] , message: Message) {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            version: data.version,
            userId: data.userId,
            status: data.status          
        })
        
        await order.save();

        message.ack();
        
    }

}