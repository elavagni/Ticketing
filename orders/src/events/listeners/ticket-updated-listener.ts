import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent, NotFoundError } from '@eltickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from  './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject =  Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: TicketUpdatedEvent['data'], message: Message) {
        const ticket = await Ticket.findById(data.id);

        if(!ticket) {
            throw Error('Ticket not found');
        }

        const {title, price} = data;
        ticket.set({ title, price });
        await ticket.save();

        message.ack();
    }
}
