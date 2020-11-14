import mongoose from 'mongoose';
import { OrderCancelledEvent } from '@eltickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledLister } from '../order-cancelled-listener'


const setup  = async() => {
    const listener = new OrderCancelledLister(natsWrapper.client);

    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'concert',
        price: 34,
        userId: 'sfrgtvrkl'        
    });

    ticket.set({ orderId });
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return { message, data, ticket,  orderId, listener };
}

it("updates the ticket, publishes an event, and acks the message", async () => {
    const { listener, ticket, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);
    
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(message.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();

});
