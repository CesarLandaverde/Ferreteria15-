import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config.js';

export const validateAuthToken = (allowUserTypes=[])=>{
return (req,res,next)=>{
    try {
        const {authToken}= req.cookies;

        if (!authToken) {
            return res.json({message:"No auth token , you have to login"})
            
        }

        const decoded =jsonwebtoken.verify(authToken,config.JWT.secret)

if (!allowUserTypes.includes(decoded.userType)) {
    return res.json({message:"Acces denied"})
}

        next();
    } catch (error) {
        console.log("error"+error);
        
    }
}
}