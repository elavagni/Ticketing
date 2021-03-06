import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('It marks an order as cancelled', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    // create a ticket with Ticket Model
    const ticket = Ticket.build({
        id: id,
        title: 'futbol game',
        price:80
    });

    await ticket.save();

    const user = global.getAuthCookie();

    // make a request to create an order
    const { body: order } = await request(app)
            .post('/api/orders')
            .set('Cookie', user)
            .send({ ticketId: ticket.id })
            .expect(201);

    // make a request tp cancel the order
    await request(app)         
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)   
        .expect(204)

    //expectation to make sure the order is cancelled
    const updatedOrder =  await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('It fails to cancel  an order created by a different user', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    // create a ticket with Ticket Model
    const ticket = Ticket.build({
        id: id,
        title: 'futbol game',
        price:80
    });

    await ticket.save();

    // make a request to create an order
    const { body: order } = await request(app)
            .post('/api/orders')
            .set('Cookie', global.getAuthCookie())
            .send({ ticketId: ticket.id })
            .expect(201);

    // make a request to cancel the order, expect the request to fail
    await request(app)         
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', global.getAuthCookie())   
        .expect(401)
});

it('emits a order cancelled event', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    // create a ticket with Ticket Model
    const ticket = Ticket.build({
        id: id,
        title: 'futbol game',
        price:80
    });

    await ticket.save();

    const user = global.getAuthCookie();

    // make a request to create an order
    const { body: order } = await request(app)
            .post('/api/orders')
            .set('Cookie', user)
            .send({ ticketId: ticket.id })
            .expect(201);

    // make a request tp cancel the order
    await request(app)         
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)   
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});