// server/api/devices/[id].put.ts
import { defineEventHandler, readBody, createError } from 'h3';
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

    const body = await readBody(event);
    const { name, ipAddress, snmpCommunity, snmpVersion, description, oids, status } = body;

    await connectToDatabase();

    // Check if the device exists and if the user has permission to modify it
    const device = await Device.findById(deviceId);
    if (!device) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Device not found'
        });
    }

    // Only the owner or an admin can update the device
    const isOwner = device.createdBy.toString() === decoded.id;
    const isAdmin = decoded.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw createError({
            statusCode: 403,
            statusMessage: 'You are not authorized to update this device'
        });
    }

    // Update the device
    const updates: Record<string, any> = {};

    if (name !== undefined) updates.name = name;
    if (ipAddress !== undefined) updates.ipAddress = ipAddress;
    if (snmpCommunity !== undefined) updates.snmpCommunity = snmpCommunity;
    if (snmpVersion !== undefined) updates.snmpVersion = snmpVersion;
    if (description !== undefined) updates.description = description;
    if (oids !== undefined) updates.oids = oids;
    if (status !== undefined) updates.status = status;

    updates.updatedAt = new Date();

    const updatedDevice = await Device.findByIdAndUpdate(
        deviceId,
        { $set: updates },
        { new: true, runValidators: true }
    );

    return { success: true, device: updatedDevice };
});