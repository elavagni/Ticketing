import { Subjects, Publisher, ExpirationCompleteEvent } from '@eltickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject =  Subjects.ExpirationComplete;
}