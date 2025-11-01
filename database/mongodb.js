import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

if(!DB_URI){
    throw new Error('Please define the MONGODB_URI environment variable inside .env<development/production>.local');
}

//Connect to mongodb
const connectToDB = async () => {
    try{
      await mongoose.connect(DB_URI);

      console.log(`Connected to database in ${NODE_ENV} mode`)
    } catch(error){
        console.error('Error connecting to database: ', error);

        // eslint-disable-next-line no-undef
        process.exit(1);//Exit code 1 means "there was an error".
    }
//This prevents the server from running if the DB connection failed (which makes sense—most apps can’t function without their database).
}

export default connectToDB;