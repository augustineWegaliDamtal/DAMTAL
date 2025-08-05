import mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema(
    {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  type: String, // e.g. 'deposit'
  isRead: { type: Boolean, default: false },
},
{timestamps:true}

)
const Notification = mongoose.model('Notification',notificationsSchema)
export default Notification