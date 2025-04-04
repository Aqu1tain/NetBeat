// server/models/Device.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the Device document interface
interface IDevice extends Document {
    name: string;
    ipAddress: string;
    snmpCommunity: string; // SNMP community string (usually "public" or "private")
    snmpVersion: string; // SNMP version (e.g., "1", "2c", "3")
    description: string;
    oids: {
        oid: string;
        name: string;
        description: string;
        graphType?: string; // Type of graph to use for this OID
        alert?: {
            enabled: boolean;
            threshold: number;
            condition: 'above' | 'below' | 'equal';
        };
    }[];
    status: 'active' | 'inactive';
    createdAt: Date;
    createdBy: Types.ObjectId; // Reference to the user who created this device
    updatedAt: Date;
    lastMonitored?: Date; // When the device was last monitored
    monitoringInterval?: number; // How often to monitor in minutes
    lastPingStatus?: {
        timestamp: Date;
        success: boolean;
        responseTime?: number;
        packetLoss?: number;
    };
}

// Define the schema
const DeviceSchema: Schema<IDevice> = new Schema({
    name: { type: String, required: true },
    ipAddress: { type: String, required: true },
    snmpCommunity: { type: String, default: 'public' },
    snmpVersion: { type: String, enum: ['1', '2c', '3'], default: '2c' },
    description: { type: String },
    oids: [{
        oid: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String },
        graphType: { type: String, enum: ['line', 'bar', 'gauge', 'none'], default: 'line' },
        alert: {
            enabled: { type: Boolean, default: false },
            threshold: { type: Number },
            condition: { type: String, enum: ['above', 'below', 'equal'], default: 'above' }
        }
    }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt: { type: Date, default: Date.now },
    lastMonitored: { type: Date },
    monitoringInterval: { type: Number, default: 5 }, // Default to 5 minutes
    lastPingStatus: {
        timestamp: { type: Date },
        success: { type: Boolean },
        responseTime: { type: Number },
        packetLoss: { type: Number }
    }
});

// Export the model
const DeviceModel = (mongoose.models.Device as mongoose.Model<IDevice>) ||
    mongoose.model<IDevice>('Device', DeviceSchema);

export default DeviceModel;