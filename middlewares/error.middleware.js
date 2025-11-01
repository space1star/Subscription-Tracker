const errorMiddleware = (err, req, res, next) => {
//Create a subscription -> middleware(checks for renewal date) -> middleware(check for errors) -> next() -> controller
//controller handles the actual logic of creating a subscription
    try{
        let error = {...err};//obj
        error.message = err.message;

        console.error(err);

        //types of errors -:

        //MONGOOSE BAD ObjectID error
        if(err.name === 'Cast Error'){
            const message = 'Resource not found';

            error = new Error(message);
            error.statusCode = 404;
        }

        //MONGOOSE DUPLICATE KEY
        if(err.code === 11000){
            //form a message
            const message = 'Duplicate field value entered';

            error = new Error(message);
            error.statusCode = 400;
        }

        //MONGOOSE VALIDATION ERROR
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(val => val.message);

            error = new Error(message.join(', '));//join it based on comma and spaces
            error.statusCode = 400;
        }
        //return the respond from this middleware
        //500 -> general server error 
        res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'});
    } catch( error ){
        next(error);
    }
};

export default errorMiddleware;