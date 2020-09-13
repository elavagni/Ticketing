import { Request, Response, NextFunction } from "express";
import { CustomError } from '../errors/custom-error'

export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {    
    
    //All expected errors should extend the CustomError abstract class
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors()});        
    }   

    //If the type of error was not defined by us, return a generic message
    return res.status(400).send({ 
        errors: [{ message: 'Something went wrong' }]
    });
};
