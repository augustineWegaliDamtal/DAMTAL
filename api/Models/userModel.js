import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
 email: {
  type: String,
  // no longer `required`, since some clients may not have it
  unique: true,
  sparse: true // allows multiple nulls in unique fields
},
gender: {
  type: String,
  enum: ["male", "female", "other"],
  required: true
},
address: {
  type: String,
  required: true
},
  phone: {
    type: String,
    required: true,

  },
  password: {
  type: String,
  required: function () {
    return this.role === 'admin' || this.role === 'agent';
  }
},
  avatar: {
    type: String,
    default: ""
  },
  role: {
  type: String,
  enum: ["admin", "agent", "client"],
  default: "client"
},

  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
