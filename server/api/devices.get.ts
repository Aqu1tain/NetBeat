// server/api/devices.get.ts
import { defineEventHandler, createError } from 'h3';
import connectToDatabase from '../utils/db';
import Device from '../models/Device';
import { verifyToken } from '../utils/auth';

export default defineEventHandler(async (event) => {
    const decoded: any = verifyToken(event);
    await connectToDatabase();

    // Admin can see all devices, regular users only see their devices
    const filter = decoded.role === 'admin' ? {} : { createdBy: decoded.id };

    const devices = await Device.find(filter).sort({ createdAt: -1 });
    return { success: true, devices };
});