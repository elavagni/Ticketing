import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@eltickets/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake data event
    const data : TicketCreatedEvent['data'] = { 
        version:0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price:10, 
        userId: new mongoose.Types.ObjectId().toHexString()
    };
    
    // create a fake message object
    // @ts-ignore - there is only one function we need from Message
    const message: Message = {
        //make this function a jest mock function
        ack: jest.fn()
    };

    return { listener, data, message };
}

it('creates and saves a ticket', async() => {    
    const {listener, data, message } = await setup();
    
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, message);

    const ticket = await Ticket.findById(data.id);
    
    // write assertions to make sure a ticket was created!
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async() => {
   
    const {listener, data, message } = await setup();

     // call the onMessage function with the data object + message object
    await listener.onMessage(data, message);
        
    // write assertions to make ack funtion is called
    expect(message.ack).toHaveBeenCalled();
});
