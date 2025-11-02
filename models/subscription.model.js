import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, 'Subscription name is req.'],
            trim: true,
            minLength: 2,
            maxLength: 100,
        },
        price:{
            type: Number,
            required: [true, 'Subscription price is req.'],
            min: [0, 'Price must be greater than 0'],
        },
        currency:{
            type: String,
            enum: ['INR', 'USD', 'EUR', 'GBP'],
            default: 'INR',
        },
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
        startDate:{
            type: Date,
            required: true,
            validate:{
                validator: (value) => value <= new Date(),
                message: 'Start date must be in the past',
            }
        },
        renewalDate:{
            type: Date,
            validate:{
                validator: function(value) {
                    return value > this.startDate;
                },
                message: 'Renewal date must be after the start date',
            }
        },


        user:{//accepting the ID
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        }
    },{timestamps: true}
);


//Auto-calculate renewal date(if missing)
subscriptionSchema.pre('save', function(next){
    if(!this.renewalDate){

        const renewalPeriods = {
            Daily: 1,
            Weekly: 7,
            Monthly: 30,
            Yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    if(this.renewalDate < new Date()){
        this.status = 'Expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
