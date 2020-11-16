import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from '@eltickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationCompletedListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;
    
    async onMessage(data: ExpirationCompleteEvent['data'], message: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.status === OrderStatus.Complete) {
            return message.ack();
        }

        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,            
            version: order.version,
            ticket: {
                id: order.ticket.id
            } 
        });

        message.ack();
    }

}