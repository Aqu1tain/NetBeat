// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the User document interface
interface IUser extends Document {
    username: string;
    password: string;
    _id: mongoose.Types.ObjectId; // Optional: explicitly include _id if used later
}

// Define the schema with the interface
const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
});

// Export the model, typed as mongoose.Model<IUser>
const UserModel = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export default UserModel;