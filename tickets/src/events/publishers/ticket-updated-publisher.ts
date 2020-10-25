import { Publisher, Subjects, TicketUpdatedEvent } from '@eltickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject =  Subjects.TicketUpdated;
}