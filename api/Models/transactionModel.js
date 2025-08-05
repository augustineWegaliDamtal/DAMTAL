import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
   clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["deposit", "withdrawal"],
    required: true
  },
day: {
  type: Number
},
month: {
  type: Number
},
year: {
  type: Number
},

  amount: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  messageSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
