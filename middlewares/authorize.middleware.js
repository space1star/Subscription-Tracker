import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import {JWT_SECRET} from '../config/env.js';

const authorize = async(req, res, next) => {
    try{
        //access the user token
        let token;
        
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return res.status(401).json({message: 'Unauthorized'});
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        //check user still exist or not
        const user = await User.findById(decoded.userId);

        if(!user){
            return res.status(401).json({message: 'Unauthorized'});
        }

        req.user = user;

        next();//forward over to 2nd part of the req

    }catch(error){
        //401 ---> means unauthorized
        res.status(401).json({message: 'Unauthorized', error: error.message});
    }
}

export default authorize;