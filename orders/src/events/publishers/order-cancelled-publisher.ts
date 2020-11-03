import { Publisher, OrderCancelledEvent, Subjects } from '@eltickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject =  Subjects.OrderCancelled;
}
