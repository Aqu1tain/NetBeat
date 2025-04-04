// server/api/devices/monitor.post.ts
import { defineEventHandler, readBody, createError } from 'h3';
import connectToDatabase from '../../utils/db';
import Device from '../../models/Device';
import DeviceHistory from '../../models/DeviceHistory';
import { verifyToken } from '../../utils/auth';
import snmp from 'net-snmp';

export default defineEventHandler(async (event) => {
    verifyToken(event); // Verify authentication

    const body = await readBody(event);
    const { deviceId, oids } = body;

    if (!deviceId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Device ID is required'
        });
    }

    await connectToDatabase();

    // Find the device
    const device = await Device.findById(deviceId);
    if (!device) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Device not found'
        });
    }

    // Determine which OIDs to fetch
    let oidsToFetch = [];
    if (oids && Array.isArray(oids) && oids.length > 0) {
        // Use the provided OIDs
        oidsToFetch = oids;
    } else if (device.oids && device.oids.length > 0) {
        // Use all OIDs defined for the device
        oidsToFetch = device.oids.map(oid => oid.oid);
    } else {
        throw createError({
            statusCode: 400,
            statusMessage: 'No OIDs specified for monitoring'
        });
    }

    try {
        // Create SNMP session options
        const options = {
            port: 161,
            retries: 1,
            timeout: 5000,
            transport: "udp4",
            trapPort: 162,
            version: device.snmpVersion === '3' ? snmp.Version3 :
                device.snmpVersion === '1' ? snmp.Version1 : snmp.Version2c
        };

        // Create the SNMP session
        const session = snmp.createSession(device.ipAddress, device.snmpCommunity, options);

        // Perform SNMP requests
        return new Promise((resolve, reject) => {
            // Perform get request for the OIDs
            session.get(oidsToFetch, async (error, varbinds) => {
                session.close();

                if (error) {
                    reject(createError({
                        statusCode: 500,
                        statusMessage: `SNMP Error: ${error.message}`
                    }));
                    return;
                }

                // Process the results
                const results = [];
                const timestamp = new Date();
                const historyRecords = [];

                for (const varbind of varbinds) {
                    let result;

                    if (snmp.isVarbindError(varbind)) {
                        result = {
                            oid: varbind.oid,
                            error: snmp.varbindError(varbind)
                        };
                    } else {
                        const value = varbind.value.toString();
                        result = {
                            oid: varbind.oid,
                            type: varbind.type,
                            value: value
                        };

                        // Create history record
                        let numericValue = null;

                        // Try to extract numeric values for graphing
                        if (varbind.type === 2 || varbind.type === 65) { // Integer or Counter
                            numericValue = parseInt(value);
                        } else if (varbind.type === 70 || varbind.type === 66) { // Counter64 or Gauge
                            numericValue = parseInt(value);
                        } else if (varbind.type === 67) { // TimeTicks
                            numericValue = parseInt(value) / 100; // Convert to seconds
                        } else {
                            // Try to parse as number if it looks numeric
                            const parsed = parseFloat(value);
                            if (!isNaN(parsed)) {
                                numericValue = parsed;
                            }
                        }

                        // Store in history
                        historyRecords.push({
                            deviceId: device._id,
                            timestamp,
                            oid: varbind.oid,
                            value,
                            numericValue
                        });
                    }

                    results.push(result);
                }

                // Save history records in bulk
                if (historyRecords.length > 0) {
                    await DeviceHistory.insertMany(historyRecords);

                    // Update device with last monitored timestamp
                    await Device.findByIdAndUpdate(deviceId, {
                        lastMonitored: timestamp
                    });
                }

                resolve({
                    success: true,
                    results,
                    timestamp
                });
            });
        });
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error monitoring device: ${error.message}`
        });
    }
});