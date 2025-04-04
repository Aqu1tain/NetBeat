// server/api/devices/history.get.ts
import { defineEventHandler, getQuery, createError } from 'h3';
import connectToDatabase from '../../utils/db';
import DeviceHistory from '../../models/DeviceHistory';
import Device from '../../models/Device';
import { verifyToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    verifyToken(event); // Verify authentication

    const query = getQuery(event);
    const deviceId = query.deviceId as string;
    const oid = query.oid as string;
    const limit = parseInt(query.limit as string) || 100;
    const period = query.period as string || '24h'; // Default to last 24 hours

    if (!deviceId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Device ID is required'
        });
    }

    if (!oid) {
        throw createError({
            statusCode: 400,
            statusMessage: 'OID is required'
        });
    }

    await connectToDatabase();

    // Check if device exists
    const device = await Device.findById(deviceId);
    if (!device) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Device not found'
        });
    }

    // Calculate start time based on period
    const now = new Date();
    let startTime = new Date();

    switch (period) {
        case '1h':
            startTime.setHours(now.getHours() - 1);
            break;
        case '6h':
            startTime.setHours(now.getHours() - 6);
            break;
        case '12h':
            startTime.setHours(now.getHours() - 12);
            break;
        case '24h':
            startTime.setHours(now.getHours() - 24);
            break;
        case '7d':
            startTime.setDate(now.getDate() - 7);
            break;
        case '30d':
            startTime.setDate(now.getDate() - 30);
            break;
        default:
            startTime.setHours(now.getHours() - 24); // Default to 24h
    }

    // Query history data
    const history = await DeviceHistory.find({
        deviceId,
        oid,
        timestamp: { $gte: startTime }
    })
        .sort({ timestamp: -1 })
        .limit(limit);

    // Get OID metadata for display purposes
    const oidInfo = device.oids.find(o => o.oid === oid) || {
        name: 'Unknown OID',
        description: ''
    };

    return {
        success: true,
        deviceName: device.name,
        oidInfo,
        data: history.map(h => ({
            timestamp: h.timestamp,
            value: h.value,
            numericValue: h.numericValue
        })).reverse() // Reverse to get chronological order for graphs
    };
});