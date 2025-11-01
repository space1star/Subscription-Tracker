import { Router } from "express";

import authorize from "../middlewares/authorize.middleware.js";
import { getUser, getUsers } from "../controllers/user.controller.js";

const userRouter = Router();

//userRouter.get('/', (req, res) => res.send({title: 'GET all users'}));//get all users
userRouter.get('/', getUsers);

userRouter.get('/:id', authorize, getUser);//get user by id

userRouter.post('/', (req, res) => res.send({title: 'Create new user'}));

userRouter.put('/:id', (req, res) => res.send({title: 'UPDATE user'}));//put used for updates

userRouter.delete('/:id', (req, res) => res.send({title: 'DELETE user'}));

export default userRouter;