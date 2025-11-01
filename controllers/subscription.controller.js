import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
    try{
        //create new subscription                                   
        const subscription = await Subscription.create({
            ...req.body, 
            user: req.user._id, //user is set to
        });

        const { workflowRunId } = await workflowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,

        body: {
            subscriptionId: subscription.id,
        },
        headers: {
            'content-type': 'application/json',
        },
        retries: 0,
        });

        res.status(201).json({success: true, data: {subscription, workflowRunId} });
    }catch(e){
        next(e);
    }
}

//give us all subs. created by the user
export const getUserSubscription = async(req, res, next) => {
    try{
        if(req.user.id !== req.params.id){//check if user is same as the one in the token
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        //rightful Owner
        const subscriptions = await Subscription.find({user: req.params.id});

        //finally return
        res.status(200).json({success: true, data: subscriptions});
    }catch(e){
        next(e);//forwarded over to error handling middleware
    }
}

//export default createSubscription;