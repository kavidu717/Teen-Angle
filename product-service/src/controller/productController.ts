import { Response, Request } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';
import Category from '../models/Category';

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

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 12,
      keyword,
      category,
      priceRange,
      ...filters
    } = req.query;

    const query: any = {};

    // Keyword search
    if (keyword && typeof keyword === "string") {
      query.$or = [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    // Category filter
    if (category && typeof category === "string") {
      query.category = category;
    }

    // Price filter
    if (priceRange && typeof priceRange === "string") {
      const [min, max] = priceRange.split("-");

      query.basePrice = {};

      if (min && !isNaN(Number(min))) {
        query.basePrice.$gte = Number(min);
      }

      if (max && !isNaN(Number(max))) {
        query.basePrice.$lte = Number(max);
      }
    }

    // Get dynamic attributes from category
    let dynamicAttributes: string[] = [];

    if (category && typeof category === "string") {
      const selectedCategory = await Category.findById(category).select(
        "dynamicAttributes"
      );

      console.log("CATEGORY:", category);
      console.log(
        "DYNAMIC ATTRIBUTES:",
        selectedCategory?.dynamicAttributes
      );

      if (selectedCategory) {
        dynamicAttributes = selectedCategory.dynamicAttributes.map(
          (attribute) => attribute.name
        );
      }
    }

    console.log("DYNAMIC ATTRIBUTE NAMES:", dynamicAttributes);
    console.log("FILTERS:", filters);

    // Variant conditions
    const variantConditions: any = {
      stock: {
        $gt: 0,
      },
    };

    let hasVariantFilter = false;

    // Dynamic filters
    Object.entries(filters).forEach(([key, value]) => {
      console.log("FILTER KEY:", key);
      console.log("FILTER VALUE:", value);

      if (typeof value !== "string") {
        return;
      }

      // Dynamic category attribute
      if (dynamicAttributes.includes(key)) {
        console.log("VARIANT FILTER:", key, value);

        variantConditions[`attributes.${key}`] = value;

        hasVariantFilter = true;

        return;
      }

      // General product attribute
      console.log("GENERAL FILTER:", key, value);

      query[`generalAttributes.${key}`] = value;
    });

    // Apply variant filters
    if (hasVariantFilter) {
      query.variants = {
        $elemMatch: variantConditions,
      };
    }

    console.log(
      "FINAL QUERY:",
      JSON.stringify(query, null, 2)
    );

    // Pagination
    const currentPage = Math.max(Number(page), 1);
    const currentLimit = Math.max(Number(limit), 1);

    const skip = (currentPage - 1) * currentLimit;

    // Count
    const total = await Product.countDocuments(query);

    // Get products
    const products = await Product.find(query)
      .populate(
        "category",
        "name image dynamicAttributes"
      )
      .skip(skip)
      .limit(currentLimit)
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      products,
      page: currentPage,
      pages: Math.ceil(total / currentLimit),
      total,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {

    const id = req.params.id;

    if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {

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



