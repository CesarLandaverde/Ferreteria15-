import providersModel from '../models/providers.js';
import {v2 as cloudinary} from 'cloudinary';

import {config} from '../config.js';

cloudinary.config({
    cloud_name:config.cloudinary.cloud_name,
    api_key:config.cloudinary.cloudinary_api_key,
    api_secret:config.cloudinary.cloudinary_api_secret
});

const providersControllers = {};
providersControllers.getAllProviders = async (req, res) => {
    try {
        const providers = await providersModel.find();
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Insert

providersControllers.insertProvider = async (req, res) => {

    try {
        const{name,telephone}=req.body;
        let imageUrl = "";
        //sUBIR IMAGEN A CLO
       if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path
                ,{
                    folder:"public",
                    allowed_formats:["jpg","png","jpeg"],
                }
            );//Se subo la imagen
         
            imageUrl = result.secure_url;
        }
        const newProvider = new providersModel({
            name,
            telephone,
            image:imageUrl,
        });
         await newProvider.save();
        res.status(200).json({message:"Provider created successfully"});
        
       



        
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
}


export default providersControllers;