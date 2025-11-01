import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
    try{                                       //1 token deducted,take away 1 token from the bucket
        const decision = await aj.protect(req, { requested: 1} );

        if(decision.isDenied()){
            //figure out reason for denied
            if(decision.reason.isRateLimit()) return res.status(429).json({error: 'Rate Limit Exceeded'});
            
            if(decision.reason.isBot()) return res.status(403).json({error: 'Bot detection'});

            //neither one of these & it is just denied then
            return res.status(403).json({error: 'Access denied'});
        }

        //req. is not denied
        next();//go to the next step
    }catch(error){
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
};

export default arcjetMiddleware;