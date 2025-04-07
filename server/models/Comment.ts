// server/models/Comment.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the Comment document interface
interface IComment extends Document {
    ticketId: Types.ObjectId; // Reference to the Ticket
    content: string;
    createdBy: Types.ObjectId; // Reference to User
    createdAt: Date;
    isInternal: boolean; // Flag for admin-only notes
    attachmentUrl?: string; // Optional attachment
}

// Define the schema with the interface
const CommentSchema: Schema<IComment> = new Schema({
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false }, // Default to public comments
    attachmentUrl: { type: String } // Optional attachment URL
});

// Create indexes for faster queries
CommentSchema.index({ ticketId: 1, createdAt: 1 });

// Export the model, typed as mongoose.Model<IComment>
const CommentModel = (mongoose.models.Comment as mongoose.Model<IComment>) ||
    mongoose.model<IComment>('Comment', CommentSchema);

export default CommentModel;