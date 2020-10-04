import { response } from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns 404 if the ticket is not found,', async () => {
    //TODO: move this to helper class
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
})

it('returns the ticket if the ticket is found,', async () => {
    const title = 'concert'
    const price = 20;

    //TODO: remove this code as we should not test ticket cretion here,
    //we are doing it like this for simplicity to get the test started.
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getAuthCookie())
        .send({
            title,
            price
        })
        .expect(201);
        
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
})