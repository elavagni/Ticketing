
import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@eltickets/common';
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { Order } from '../../../models/order';

const setup  = async() => {
    const listener = new OrderCancelledListener(natsWrapper.client);

   const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,       
        price:10,
        userId: 'sdf',
        version:0        
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1, 
        ticket: {
            id: 'sdfds'
        }
    };

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return { listener, data, message, order };
}

it('updates the status of the order1', async() => {
    const { listener, data, message, order } = await setup();
    
    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);    

});


it('acks the message', async() => {
    const { listener, data, message } = await setup();
    
    await listener.onMessage(data, message);
    
    expect(message.ack).toHaveBeenCalled();

});