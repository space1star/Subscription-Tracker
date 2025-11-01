import { Router } from "express";
import authorize from "../middlewares/authorize.middleware.js";
import { createSubscription,  getUserSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

//dealing with CRUD functionalities(below)

subscriptionRouter.get('/', (req, res) => res.send({title: 'GET all subscriptions'}));

subscriptionRouter.get('/:id', (req, res) => res.send({title: 'GET subscription deatails'}));//subs. by id

//subscriptionRouter.post('/', authorize, (req, res) => res.send({title: 'CREATE subscription'}));
subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send({title: 'UPDATE subscription'}));//update subs. based on id

subscriptionRouter.delete('/:id', (req, res) => res.send({title: 'DELETE subscription'}));

//get all subscription belonging to a specific user
//subscriptionRouter.get('/user/:id', (req, res) => res.send({title: 'GET all user subscriptions'}));
subscriptionRouter.get('/user/:id', authorize, getUserSubscription);

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({title: 'CANCEL subscription'}));

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({title: 'GET upcoming renewals'}));

export default subscriptionRouter;