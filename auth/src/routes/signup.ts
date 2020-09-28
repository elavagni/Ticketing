import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from '@eltickets/common';

import { User } from '../models/user';


const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
    ],
    validateRequest, 
    async (req: Request, res: Response) => {
                
        const { email, password} = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {         
            throw new BadRequestError('Email in use');
        }

        //Create user
        const user = User.build({email, password});

        //Save user to DB
        await user.save();

        //Generate JWT
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
            },
            //Use ! to tell typescript that we know as a 
            //fact that the environment variable is defined  
            process.env.JWT_KEY!
        );
        
        //Store jwt on session object
        req.session = { 
            jwt: userJwt 
        };

        res.status(201).send(user);
});

export { router as signupRouter };