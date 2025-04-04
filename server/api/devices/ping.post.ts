// server/api/devices/ping.post.ts
import { defineEventHandler, readBody, createError } from 'h3';
import { verifyToken } from '../../utils/auth';
import { ping } from 'net-ping';

// Node.js net-ping requires raw socket access which might not be available
// in all environments. This is a simplified version using child_process.

export default defineEventHandler(async (event) => {
    verifyToken(event); // Verify authentication

    const body = await readBody(event);
    const { ipAddress } = body;

    if (!ipAddress) {
        throw createError({
            statusCode: 400,
            statusMessage: 'IP address is required'
        });
    }

    // Use child_process to execute ping command
    const { exec } = await import('child_process');

    return new Promise((resolve, reject) => {
        // Different command options based on platform
        const pingCount = process.platform === 'win32' ? '-n 4' : '-c 4';
        const command = `ping ${pingCount} ${ipAddress}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                // Ping failed, but we want to return the results anyway
                return resolve({
                    success: false,
                    message: stderr || 'Device unreachable',
                    details: stdout
                });
            }

            // Parse ping statistics
            let avgTime = 0;
            let packetLoss = 0;

            try {
                // Extract average time - this depends on OS locale and format
                // Sample pattern for English: "Average = 10ms" or "avg = 10.2 ms"
                const avgMatch = stdout.match(/[aA]v(era)?g(e)?[\s=]+([0-9.]+)/);
                if (avgMatch && avgMatch[3]) {
                    avgTime = parseFloat(avgMatch[3]);
                }

                // Extract packet loss - this also depends on OS locale and format
                // Sample pattern: "0% packet loss" or "(0% loss)"
                const lossMatch = stdout.match(/([0-9.]+)%[\s]+(packet loss|loss)/);
                if (lossMatch && lossMatch[1]) {
                    packetLoss = parseFloat(lossMatch[1]);
                }
            } catch (parseError) {
                console.error('Error parsing ping output:', parseError);
            }

            return resolve({
                success: true,
                message: 'Ping successful',
                details: stdout,
                stats: {
                    avgTime,
                    packetLoss
                }
            });
        });
    });
});