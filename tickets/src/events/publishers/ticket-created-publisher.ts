import { Publisher, Subjects, TicketCreatedEvent } from '@eltickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject =  Subjects.TicketCreated;
}