import { OrderStatus } from '@eltickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';

it('returns a 404 when paying an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.getAuthCookie())
        .send({
            token: 'sdfsdsfs',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);

});

it('returns a 401 when paying for an order that does not belong to the user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.getAuthCookie())
        .send({
            token: 'sdfsdsfs',
            orderId: order.id
        })
        .expect(401);
});

it('returns a 400 when paying for a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.getAuthCookie(userId))
        .send({
            token: 'sdfsdsfs',
            orderId: order.id
        })
        .expect(400);
    });


