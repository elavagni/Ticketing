import { Subjects, Publisher, PaymentCreatedEvent } from '@eltickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject =  Subjects.PaymentCreated;
}