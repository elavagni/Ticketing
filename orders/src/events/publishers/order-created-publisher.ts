import { Publisher, OrderCreatedEvent, Subjects } from '@eltickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject =  Subjects.OrderCreated;
}
