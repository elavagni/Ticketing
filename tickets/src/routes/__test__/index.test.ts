import request from 'supertest';
import { app } from '../../app';

const createTicket = (title: string, price: number ) =>  {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.getAuthCookie())
        .send({
            title: title,
            price: price
        });
}

it('can fetch a list of tickets', async() => {
    await createTicket('title 1', 20);    
    await createTicket('title 2', 30);
    await createTicket('title 3', 40);

    const response =  await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);
        
    expect(response.body.length).toEqual(3);

})



