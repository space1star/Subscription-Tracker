//Every routes files has to have its own contoller file

//create a fun. -> responsible for sending reminders

import dayjs from 'dayjs';//tells the current time and date
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7, 5, 2, 1];//list of diff. days

export const sendReminders = serve(async (context) => {
    //extract subscription ID from a specific workflow
    const { subscriptionId } = context.requestPayload;
    //fetch deatails about the subscription
    const subscription = await fetchSubscription(context, subscriptionId);


if(!subscription || subscription.status !== "active"){
    return; //exit from this fun -> don't send reminders
}

const renewalDate = dayjs(subscription.renewalDate);

if(renewalDate.isBefore(dayjs())){
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping Workflow`);
    return;//exit out of this workflow
}

for(const daysBefore of REMINDERS)
{
    const reminderDate = renewalDate.subtract(daysBefore, 'day');
    //renewal date = 22 feb, then reminder date = 15 feb, 17, 20, 21 feb

    if(reminderDate.isAfter(dayjs())){  
        //put it to sleep untill it's ready to be find
        await sleepUntilReminder(context, `Remainder ${daysBefore} days before`, reminderDate);
    }

    if (dayjs().isSame(reminderDate, 'day')) {
     await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
                                     //2 days before reminder
    // await triggerReminder(context, `${daysBefore} days before reminder`, subscription)
}
});

//new fun.
const fetchSubscription = async(context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        //open up new fun block
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);

    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        //send emails or SMS or push notifications...
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,//5 days untill whether 7 days untill
            subscription,
        })
    })
}
