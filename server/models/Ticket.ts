// server/models/Ticket.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the Ticket document interface
interface ITicket extends Document {
    title: string;
    description: string;
    status: 'open' | 'closed';
    createdAt: Date;
    createdBy: Types.ObjectId; // Type for ObjectId reference to User
    updatedAt: Date;
}

// Define the schema with the interface
const TicketSchema: Schema<ITicket> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt: { type: Date, default: Date.now },
});

// Export the model, typed as mongoose.Model<ITicket>
const TicketModel = (mongoose.models.Ticket as mongoose.Model<ITicket>) ||
    mongoose.model<ITicket>('Ticket', TicketSchema);

export default TicketModel;