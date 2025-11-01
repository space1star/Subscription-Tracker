import { Router } from 'express';
import { sendReminders } from '../controllers/workflow.contoller.js';

//initialize new workflow router
const workflowRouter = Router();

//define a route
workflowRouter.post('/subscription/reminder', sendReminders);

export default workflowRouter;