import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: function () {
      return this.role === 'admin' || this.role === 'agent';
    }
  },

  accountNumber: {
    type: String,
    required: function () {
      return this.role === 'client' || this.role === 'agent' || this.role === 'admin';
    },
    unique: true
  },

  clientId: {
    type: String,
    unique: true,
    sparse: true // only for clients, allows null for others
  },

  name: {
    type: String,
    required: function () {
      return this.role === 'client';
    }
  },
  agentUsername: {
  type: String,
  required: false // or just delete this field entirely
},
  email: {
    type: String,
    unique: true,
    sparse: true
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
    required: true
  },

  password: {
    type: String,
    required: function () {
      return this.role === 'admin' || this.role === 'agent';
    }
  },

  pin: {
    type: String,
    required: false // for clients only
  },

  avatar: {
    type: String,
    default: "https://www.flaticon.com/free-icon/user_3177440"
  },

  avatarUrl: {
    type: String,
    default: function () {
      return this.avatar || "https://www.flaticon.com/free-icon/user_3177440";
    }
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
  },

  lastDepositDate: {
    type: Date
  },

  balance: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
