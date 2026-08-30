import { Request, Response } from 'express';
import Category from '../models/Category';


export const createCategory = async (req: Request, res: Response): Promise<void> => {

    try{

        const {name,dynamicAttributes}= req.body;

        const categoryExists = await Category.findOne({name});


        if(categoryExists){
            res.
            status(400).
            json({ 
                message: 'Category already exists'
             });
        
            
        }

        const image = req.file ? (req.file as any).location : '';

        if(!image){
            res.
            status(400).
            json({ 
                message: 'Image is required'
             });
        }

         let parsedAttributes = [];
    if (dynamicAttributes) {
      parsedAttributes = JSON.parse(dynamicAttributes);
    }

    const category = await Category.create({
        name,
        image,
        dynamicAttributes: parsedAttributes
    })


        res.
        status(201).
        json(
        
            category
         );


    }catch(error){
        console.log(error);
        res.
        status(500).
        json({ 
            message: 'Error creating category'
         });
    }

}

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({});

    res.
    status(200).
    json(
        categories
    );
  } catch (error) {
    res.
    status(500).
    json({ 
        message: 'Internal server error' 
    });
  }
};

