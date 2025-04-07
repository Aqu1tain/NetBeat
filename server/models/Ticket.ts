// server/models/Ticket.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the Ticket document interface
interface ITicket extends Document {
    title: string;
    description: string;
    status: 'new' | 'in_progress' | 'waiting_user' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    createdBy: Types.ObjectId; // Type for ObjectId reference to User
    assignedTo?: Types.ObjectId; // Optional assignment to admin/support
    updatedAt: Date;
    lastActivityAt: Date; // Track when the last activity happened
    category?: string; // Optional category for organization
}

// Define the schema with the interface
const TicketSchema: Schema<ITicket> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'waiting_user', 'closed'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
    lastActivityAt: { type: Date, default: Date.now },
    category: { type: String }
});

// Update the lastActivityAt field before saving
TicketSchema.pre('save', function(next) {
    this.lastActivityAt = new Date();
    next();
});

// Export the model, typed as mongoose.Model<ITicket>
const TicketModel = (mongoose.models.Ticket as mongoose.Model<ITicket>) ||
    mongoose.model<ITicket>('Ticket', TicketSchema);

export default TicketModel;