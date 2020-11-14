import { Mongoose } from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { response } from 'express';
import { Ticket } from '../../models/ticket';

it('return 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.getAuthCookie())
        .send({
            title: 'Title 1',
            price: 20
        })
        .expect(404);
});

it('return 401 if user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)        
        .send({
            title: 'Title 1',
            price: 20
        })
        .expect(401);
});

it('return 401 if the user does not own the ticket', async () => {
    const response =  await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getAuthCookie())
        .send({
            title: 'Title',
            price: 20
        });

    await request(app)
            .put(`/api/Tickets/${response.body.id}`)
            .set('Cookie', global.getAuthCookie())
            .send({
                title: 'Updated title',
                price: 23
            })
            .expect(401);
});

it('return 400 if the user provides an invalid title or price', async () => {
    const cookie =  global.getAuthCookie();
    
    const response =  await request(app)    
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 20
        });

    await request(app)    
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);

    await request(app)    
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Ttitle',
            price: -10
        })
        .expect(400);

});

it('updates the ticket when valid inputs are provided', async () => {
    const cookie =  global.getAuthCookie();
    
    const response =  await request(app)    
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 20
        });
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 10
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual(10);
        
});

it('rejects updates if the ticket is reserved', async () => {
    const cookie =  global.getAuthCookie();
    
    const response =  await request(app)    
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 20
        });

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 10
        })
        .expect(400);    
});