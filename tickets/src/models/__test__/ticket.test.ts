import { Ticket } from '../ticket';

it('implement optimistic concurrency control', async (done) => {
    //Create an instnce of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    })

    //Save the ticket to the database
    await ticket.save();

    //fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    //make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    //save the first fetched ticket
    await firstInstance!.save();   

    //save the second fetched ticket and expect an error
    //TODO:  This line of code should work, however it is not currently supported by jest.  Check if this work in the future
    // expect(async () => {
    //     await secondInstance!.save();    
    // }).toThrow();

    //save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();    
    } catch (error) {
        return done();
    }

    throw new Error('Should not reach this point');   

});

it('increment the version number on multiple saves', async() => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20,
        userId: '123'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);

});