import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async (title: string) => {
    const ticket = Ticket.build({
        title: title,
        price: 20
    });

    await ticket.save();

    return ticket;
}

it('fetches orders for a particular user' , async() => {
    // Create three tickets
    const ticket1 = await buildTicket('Concert1');
    const ticket2 = await buildTicket('Concert2');
    const ticket3 = await buildTicket('Concert3');
    
    const user1 = global.getAuthCookie();
    const user2 = global.getAuthCookie();

    // Create one order as User #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket1.id })
        .expect(201);

    // Create two orders as User #2
    const { body: order1 } =  await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket2.id })
        .expect(201);

    const { body: order2 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket3.id })
        .expect(201);

    // Make request to get orders for User #2
    const response = await request(app)
                        .get('/api/orders')
                        .set('Cookie', user2)
                        .expect(200);

    // Make sure we only got the orders for User #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order1.id);
    expect(response.body[1].id).toEqual(order2.id);
    expect(response.body[0].ticket.id).toEqual(ticket2.id);
    expect(response.body[1].ticket.id).toEqual(ticket3.id);
});