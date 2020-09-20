import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
    const response = await request(app)
        .post('/api/users/signout')
        .send({
            email: 'pad@test.com',
            password: 'password'
        })   
    expect(response.get('Set-Cookie')).toBeDefined();
});