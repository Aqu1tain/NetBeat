// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

// Définition de l'interface pour le document User
export interface IUser extends Document {
    username: string;
    password: string;
    role: 'user' | 'admin'; // Deux rôles possibles
    _id: mongoose.Types.ObjectId;
}

// Définition du schéma en incluant le rôle
const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Mot de passe haché
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

// Export du modèle, typé en tant que mongoose.Model<IUser>
const UserModel = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export default UserModel;
