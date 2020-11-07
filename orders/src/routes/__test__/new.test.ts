import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async() => {
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.getAuthCookie())
        .send({ ticketId })
        .expect(404);
});

it('returns an error if the ticket is already reserved', async() => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        id: id,
        title: 'concert',
        price: 20
    });
   
    await ticket.save();

    const order = Order.build({
        ticket, 
        userId: id,
        status: OrderStatus.Created,
        expiresAt: new Date()
    })

    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.getAuthCookie())
        .send({ticketId: ticket.id})
        .expect(400);

});

it('reserves a ticket', async() => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id: id,
        title: 'concert',
        price: 20
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.getAuthCookie())
        .send({ ticketId: ticket.id })
        .expect(201);
});

it('emits an order created', async() => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id: id,
        title: 'concert',
        price: 20
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.getAuthCookie())
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});