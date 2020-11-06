import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@eltickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from  './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject =  Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    //The property data, inside the TicketCreatedEvent interface, indicates the type for the data parameter in this method
    async onMessage(data: TicketCreatedEvent['data'], message: Message) {
        const {id, title, price} = data;

        const ticket = Ticket.build({            
            id,
            title, 
            price
        });
        await ticket.save();

        message.ack();
    }
}