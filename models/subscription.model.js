import mongoose from 'mongoose';

//define the schema
const subscriptionSchema = new mongoose.Schema(
    {
        name:{//obj
            type: String,
            required: [true, 'Subscription name is req.'],
            trim: true,//remove empty spaces
            minLength: 2,
            maxLength: 100,
        },
        price:{
            type: Number,
            required: [true, 'Subscription price is req.'],
            min: [0, 'Price must be greater than 0'],
        },
        //optional
        currency:{
            type: String,
            enum: ['INR', 'USD', 'EUR', 'GBP'],
            default: 'INR',
        },
        //how often getting charged for subscription
        frequency:{
            type: String,
            enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        },
        category:{
            type: String,
            enum: ['Sports', 'News', 'Entertainment', 'Lifestyle', 'Technology', 'Finance', 'Politics', 'Other'],
            required: true,
        },
        paymentMethod:{
            type: String,
            required: true,
            trim: true,
        },
        Status:{
            type: String,
            enum: ['Active', 'Cancelled', 'Expired'],
            default: 'Active',
        },
        //start date of subscription
        startDate:{
            type: Date,
            required: true,
            //validate those properties,before they r used
            validate:{
                //pass an obj
                //where I define validator fun.
                validator: (value) => value <= new Date(),
                message: 'Start date must be in the past',
            }
        },
        renewalDate:{
            type: Date,
            //required: true, ---> auto calculated
            validate:{
                validator: function(value) {
                    return value > this.startDate;
                },
                message: 'Renewal date must be after the start date',
            }
        },

        //user that is subscribed to the subs.,
        user:{//accepting the ID
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,//Optimize the query by indexing user field
        }
    },{timestamps: true}
);


//Auto-calculate renewal date(if missing)
subscriptionSchema.pre('save', function(next){
    if(!this.renewalDate){

        //define more periods
        const renewalPeriods = {
            //obj
            Daily: 1,
            Weekly: 7,
            Monthly: 30,
            Yearly: 365,
        };
        //set up renewal date
        this.renewalDate = new Date(this.startDate);
        //adding no. of dated based on freq. we pass in
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
        //e.g
        //startDate = jan 1st
        //monthly ---> frey
        //30
        //end on jan 31st (30+1)
    }
    if(this.renewalDate < new Date()){
        this.status = 'Expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);//finally creating model out of above schema

export default Subscription;