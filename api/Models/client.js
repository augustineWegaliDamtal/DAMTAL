import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: String,
  balance: Number,
  totalWithdrawals: Number,
 email: String,
  phone: String,
  // Other client-specific fields…
},{timestamps:true}); 

const Client = mongoose.model('Client',clientSchema);

export default  Client