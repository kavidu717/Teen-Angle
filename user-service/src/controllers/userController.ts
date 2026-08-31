import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User'; 



export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
    
        if (req.user) {
      res.status(200).json({
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified
      });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }

    }catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
}

export const toggleWishlist= async (req: AuthRequest, res: Response): Promise<void> => {
    try{

        const {productId} = req.body;

        const user = await User.findById(req.user?._id);

        if (!user) {
      res.
      status(404).
      json({ 
        message: 'User not found.' 
    });
      return;
    }

      const isWishlisted = user.wishlist.includes(productId);

      if (isWishlisted) {

      user.wishlist = user.wishlist.filter(id => id !== productId);

    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    res.
    status(200).
    json({
         wishlist: user.wishlist 
        });
    
    }catch (error) {
        res.
        status(500).
        json({ 
            message: 'Internal server error.' 
        
        });
    }
}

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.
      
      status(404).
      json({ 
        message: 'User not found.'
     });
      return;
    }

    res.status(200).json({
         wishlist: user.wishlist 
        });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try{

        const users = await User.find().select('-password');

        res.status(200).json
   ({ 
        success: true,
        count: users.length,
        data: users,
    });

    }catch (error) {
        res.
        status(500).
        json({

           message: 'Internal server error.' 

          });
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
     try{

      const {id}  = req.params
       
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        res.
        status(404).
        json({
            message: 'User not found.'
        });
        return;
      }

      res.
      status(200).
      json({
          success: true,
          message: 'User deleted successfully.'
      });

     }catch (error) {
        res.
        status(500).
        json({
            message: 'Internal server error.'
        
        });
    }
}