// server/api/devices.post.ts
import { defineEventHandler, readBody, createError } from 'h3';
import connectToDatabase from '../utils/db';
import Device from '../models/Device';
import { verifyToken } from '../utils/auth';

export default defineEventHandler(async (event) => {
    const decoded: any = verifyToken(event);
    const body = await readBody(event);
    const { name, ipAddress, snmpCommunity, snmpVersion, description, oids } = body;

    if (!name || !ipAddress) {
        throw createError({ statusCode: 400, statusMessage: 'Name and IP address are required' });
    }

    await connectToDatabase();
    const newDevice = new Device({
        name,
        ipAddress,
        snmpCommunity: snmpCommunity || 'public',
        snmpVersion: snmpVersion || '2c',
        description,
        oids: oids || [],
        createdBy: decoded.id,
    });

    await newDevice.save();
    return { success: true, device: newDevice };
});