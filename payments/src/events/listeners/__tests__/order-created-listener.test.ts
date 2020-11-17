import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@eltickets/common';
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import { Order } from '../../../models/order';

const setup  = async() => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version:0,
        expiresAt: 'sdfsdf',
        userId: 'sfrr',
        status: OrderStatus.Created,
        ticket: {
            id: 'sdfsf',
            price: 10
        }
    };

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return { listener, data, message };
}

it('replicates the order info', async() => {
    const { listener, data, message } = await setup();
    
    await listener.onMessage(data, message);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);    

});


it('acks the message', async() => {
    const { listener, data, message } = await setup();
    
    await listener.onMessage(data, message);
    
    expect(message.ack).toHaveBeenCalled();

});