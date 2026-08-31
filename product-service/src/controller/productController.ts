import { Response, Request } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, basePrice, category, generalAttributes, variants } = req.body;

    const files = req.files as any[];
    if (!files || files.length === 0) {
      res.
      status(400).
      json({
         message: 'At least one image is required' 
        });
      return;
    }

    const imageUrls = files.map(file => file.location);

    let parsedGeneralAttributes = {};
    if (generalAttributes) {
      parsedGeneralAttributes = JSON.parse(generalAttributes);
    }

    let parsedVariants = [];
    if (variants) {
      parsedVariants = JSON.parse(variants);
    }

    if (parsedVariants.length === 0) {
      res.
      status(400).
      json({ 
        message: 'At least one product variant is required' 
    });
      return;
    }

    const product = await Product.create({
      name,
      description,
      basePrice: Number(basePrice),
      images: imageUrls,
      category,
      generalAttributes: parsedGeneralAttributes,
      variants: parsedVariants,
      adminId: req.user?._id
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.
    status(500).
    json({ 
        message: 'Internal server error' 
    });
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      keyword, 
      category, 
      priceRange, 
      brand, 
      sex, 
      ...dynamicFilters 
    } = req.query;

    const query: any = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword as string, $options: 'i' } },
        { description: { $regex: keyword as string, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (priceRange) {
      const [min, max] = (priceRange as string).split('-');
      query.basePrice = {};
      
      if (min && !isNaN(Number(min))) {
        query.basePrice.$gte = Number(min);
      }
      if (max && !isNaN(Number(max))) {
        query.basePrice.$lte = Number(max);
      }
    }

    if (brand) query['generalAttributes.Brand'] = brand;
    if (sex) query['generalAttributes.Sex'] = sex;

    const variantConditions: any = { stock: { $gt: 0 } };
    let hasVariantFilter = false;

    Object.keys(dynamicFilters).forEach((key) => {
      if (typeof dynamicFilters[key] === 'string') {
        variantConditions[`attributes.${key}`] = dynamicFilters[key];
        hasVariantFilter = true;
      }
    });

    if (hasVariantFilter) {
      query.variants = { $elemMatch: variantConditions };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Product.countDocuments(query);
    
    const products = await Product.find(query)
      .populate('category', 'name image')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {

     const id=req.params.id;

    if (!id || typeof id !== 'string' ||!mongoose.Types.ObjectId.isValid(id)) {

      res.
      status(400).
      json(
        {
           message: 'Invalid Product ID' 
          }
        );
      return;
    }

    const product = await Product.findById(req.params.id).populate('category', 'name image dynamicAttributes');

    if (!product) {
      res.
      status(404).
      json(
        {
           message: 'Product not found'
           }
          );
      return; 
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    })
    .populate('category', 'name')
    .limit(8);

    res.
    status(200).
    json(
      {
      product,
      relatedProducts
    }
  );

  } catch (error) {
    res
    .status(500).
    json(
      {
         message: 'Internal server error' 
        }
      );
  }
};



