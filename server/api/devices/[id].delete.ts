// server/api/devices/[id].delete.ts
import { defineEventHandler, createError } from 'h3';
import connectToDatabase from '../../utils/db';
import Device from '../../models/Device';
import { verifyToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    const decoded: any = verifyToken(event);

    const deviceId = event.context.params?.id;
    if (!deviceId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Device ID is required'
        });
    }

    await connectToDatabase();

    // Check if the device exists and if the user has permission to delete it
    const device = await Device.findById(deviceId);
    if (!device) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Device not found'
        });
    }

    // Only the owner or an admin can delete the device
    const isOwner = device.createdBy.toString() === decoded.id;
    const isAdmin = decoded.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw createError({
            statusCode: 403,
            statusMessage: 'You are not authorized to delete this device'
        });
    }

    await Device.findByIdAndDelete(deviceId);

    return { success: true, message: 'Device deleted successfully' };
});