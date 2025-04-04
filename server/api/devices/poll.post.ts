// server/api/devices/poll.post.ts
import { defineEventHandler, readBody, createError } from 'h3';
import { verifyToken } from '../../utils/auth';
import snmp from 'net-snmp';

export default defineEventHandler(async (event) => {
    const decoded: any = verifyToken(event);
    const body = await readBody(event);
    const { ipAddress, community = 'public', version = '2c', oids = [] } = body;

    if (!ipAddress) {
        throw createError({
            statusCode: 400,
            statusMessage: 'IP address is required'
        });
    }

    if (oids.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'At least one OID is required'
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
            version: version === '3' ? snmp.Version3 : version === '1' ? snmp.Version1 : snmp.Version2c
        };

        // Create the SNMP session
        const session = snmp.createSession(ipAddress, community, options);

        return new Promise((resolve, reject) => {
            // Perform get request for the OIDs
            session.get(oids, (error, varbinds) => {
                session.close();

                if (error) {
                    reject(createError({
                        statusCode: 500,
                        statusMessage: `SNMP Error: ${error.message}`
                    }));
                } else {
                    // Process the results
                    const results = varbinds.map(varbind => {
                        if (snmp.isVarbindError(varbind)) {
                            return {
                                oid: varbind.oid,
                                error: snmp.varbindError(varbind)
                            };
                        } else {
                            return {
                                oid: varbind.oid,
                                type: varbind.type,
                                value: varbind.value.toString()
                            };
                        }
                    });

                    resolve({ success: true, results });
                }
            });
        });

    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error polling device: ${error.message}`
        });
    }
});