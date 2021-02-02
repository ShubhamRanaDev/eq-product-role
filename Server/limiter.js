const jwt = require("jsonwebtoken");
module.exports = function(req,res,next){
    const tokenc = req.header('token')
    if(tokenc !== ''){
        jwt.verify(tokenc, process.env.SECRET_KEY, (err, verifiedJwt) => {
            if(err){
                res.send(err.message)
            }else{
                let limiterArray = verifiedJwt.limiterArray

                if(limiterArray.length >= 11)
                {
                    limiterArray.pop()
                    limiterArray=[Date.now(),...limiterArray]

                    const payload = {
                        limiterArray: [limiterArray],
                    };
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 56780,
                    });

                    if((limiterArray[0]-limiterArray[9])<20000){

                        res.status(429).send({msg:"Request limit reached",token: token})
                    }
                    else
                    {
                        res.status(200).send({ token: token })

                    }


                    next()

                }
                else
                {

                    const payload = {
                        limiterArray: [Date.now(),...limiterArray],
                    };
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 56780,
                    });
                    res.send({ token: token });
                    next()
                }
            }
        })

    }
    else
    {
        const payload = {
            limiterArray: [Date.now()],
        };
        let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 56780,
        });

        setTimeout(()=> {
            res.send({ token: token });
            next()
        },4000)
    }

}