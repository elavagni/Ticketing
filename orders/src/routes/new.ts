import  mongoose  from 'mongoose';
import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from '@eltickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

//Set the expiration time to 15 minutes in seconds
const EXPIRATION_WINDOW_SECONDS = 15 * 60;;

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        //This validation could be removed to avoid expecting the ticket id as a mongodb id (in case the ticket service changes its store in the future)
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided') 
    ], 
    validateRequest, 
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        //Find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);        

        if (!ticket) {
            throw new NotFoundError();
        }

        // Make sure this ticket is not already reserved
        const isReserved = await ticket.isReserved();        

        if (isReserved) {
            throw new BadRequestError('Ticket is already reserved');
        }

        // Calculate expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

        // Build the order and save it to the database
        const order = Order.build( {
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket: ticket
        })

        await order.save();

        // Publish an event indicating that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,  
            version: order.version,          
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
            id: ticket.id,
            price: ticket.price,
            },
        });

        res.status(201).send(order);
    }
); 

export { router as newOrderRouter };