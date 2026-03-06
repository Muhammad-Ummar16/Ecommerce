import mongoose, { mongo } from "mongoose"
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true // Allows multiple null/missing emails
    },

    password: {
      type: String
    },

    phone: {
      type: String,
      unique: true,
      sparse: true
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true
    },

    avatar: {
      public_id: String,
      url: String
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    otp: {
      type: String
    },

    otpExpire: {
      type: Date
    },

    addresses: [
      {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        postalCode: String,
        country: String
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
