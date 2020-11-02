import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order for the given Id', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save(); 

    const user = global.getAuthCookie();
    // make a request to build an order with the ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    //make request to fetch the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error is one user tries to fetch another users order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save(); 

    const user = global.getAuthCookie();
    // make a request to build an order with the ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    //make request to fetch the order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.getAuthCookie())
        .send()
        .expect(401);  
});
