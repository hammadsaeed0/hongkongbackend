import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../model/User.js";
import cloudinary from "cloudinary";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

cloudinary.v2.config({
  cloud_name: "dirfoibin",
  api_key: "315619779683284",
  api_secret: "_N7-dED0mIjUUa3y5d5vv2qJ3Ww",
});

// Register Buyer
export const Register = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password, phone } = req.body;

    const requiredFields = ['email', 'password', 'phone'];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(200).json({ success: false, error: `The following fields are required: ${missingFields.join(', ')}` });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ success: false, error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      phone
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


// Login Buyer
export const Login = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: false, error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ success: false, error: 'Invalid email or password' });
    }

    // Return success message
    res.json({ success: true, message: 'Login successful', data: user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Login Buyer
export const MyProfile = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID format' });
    }

    // Fetch user profile from database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Return user profile
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Utility function to filter out empty strings from an object
const filterUpdateFields = (existingData, newFields) => {
  const filteredFields = { ...existingData };
  for (const key in newFields) {
    if (newFields[key] !== '') {
      filteredFields[key] = newFields[key];
    }
  }
  return filteredFields;
};

// Update profile API
export const UpdateProfile = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const updateFields = req.body;

    // Fetch the existing user data
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Filter out empty strings and merge with existing data
    const filteredFields = filterUpdateFields(existingUser.toObject(), updateFields);

    // Update user profile in the database
    const updatedUser = await User.findByIdAndUpdate(userId, filteredFields, { new: true });

    // Return updated user profile
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);

    // Custom error handling based on the type of error
    if (error.name === 'ValidationError') {
      // Handle validation errors
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      // Handle invalid ObjectId errors
      return res.status(400).json({ success: false, error: 'Invalid User ID format' });
    }

    if (error.name === 'MongoError' && error.code === 11000) {
      // Handle duplicate key errors
      return res.status(409).json({ success: false, error: 'Duplicate key error', details: error.keyValue });
    }

    // Generic error response for other types of errors
    res.status(500).json({ success: false, error: 'An unexpected error occurred', details: error.message });
  }
});



// Update profile API
export const GetAllProfile = catchAsyncError(async (req, res, next) => {
  try {
      // Extract city query parameter from request
      const { city } = req.query;
      
      // Define filter object based on city query parameter
      const filter = city ? { city } : {};

      // Fetch user profiles from database based on the filter
      const users = await User.find(filter);

      // Return user profiles
      res.json({ success: true, users });
  } catch (error) {
      console.error('Error fetching user profiles:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
