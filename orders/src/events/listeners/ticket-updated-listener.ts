import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent, NotFoundError } from '@eltickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from  './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject =  Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: TicketUpdatedEvent['data'], message: Message) {
        //Make sure events are being processed in order, look for the previous version of the ticket
        const ticket = await Ticket.findByEvent(data);

        if(!ticket) {
            throw Error('Ticket not found');
        }

        const {title, price} = data;
        ticket.set({ title, price });
        await ticket.save();

        message.ack();
    }
}
