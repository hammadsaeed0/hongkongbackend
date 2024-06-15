import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    // required: true,
  },
  image:{
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  city: {
    type: String,
    // required: true,
  },
  about: {
    type: String,
    // required: true,
  },
  gender: {
    type: String,
    // required: true,
  },
  country: {
    type: String,
    // required: true,
  },

  ethnicity: {
    type: String,
    // required: true,
  },
  look: {
    type: String,
    // required: true,
  },
  age: {
    type: String,
    // required: true,
  },
  hairLength: {
    type: String,
    // required: true,
  },
  bustSize: {
    type: String,
    // required: true,
  },
  availability: {
    type: String,
    // required: true,
  },
  currency: {
    type: String,
    // required: true,
  },
  services: {
    type: Object,
    // required: true,
  },
  extraServices: {
    type: String,
    // required: true,
  },
});

// Create models based on the schemas
const User = mongoose.model('User', userSchema)
export { User };
