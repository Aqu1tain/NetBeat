// server/models/DeviceHistory.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the DeviceHistory document interface
interface IDeviceHistory extends Document {
    deviceId: Types.ObjectId;
    timestamp: Date;
    oid: string;
    value: string;
    numericValue?: number; // For storing values that can be graphed
}

// Define the schema
const DeviceHistorySchema: Schema<IDeviceHistory> = new Schema({
    deviceId: { type: Schema.Types.ObjectId, ref: 'Device', required: true, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    oid: { type: String, required: true, index: true },
    value: { type: String, required: true },
    numericValue: { type: Number } // Optional numeric value for graphing
});

// Create a compound index for faster queries
DeviceHistorySchema.index({ deviceId: 1, oid: 1, timestamp: -1 });

// Export the model
const DeviceHistoryModel = (mongoose.models.DeviceHistory as mongoose.Model<IDeviceHistory>) ||
    mongoose.model<IDeviceHistory>('DeviceHistory', DeviceHistorySchema);

export default DeviceHistoryModel;