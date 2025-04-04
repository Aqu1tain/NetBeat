// utils/snmp.ts
// Common SNMP OIDs for network device monitoring

export const commonOids = {
    // System information
    system: [
        {
            oid: '1.3.6.1.2.1.1.1.0',
            name: 'sysDescr',
            description: 'Description du système'
        },
        {
            oid: '1.3.6.1.2.1.1.3.0',
            name: 'sysUpTime',
            description: 'Temps écoulé depuis le dernier démarrage'
        },
        {
            oid: '1.3.6.1.2.1.1.4.0',
            name: 'sysContact',
            description: 'Contact administratif'
        },
        {
            oid: '1.3.6.1.2.1.1.5.0',
            name: 'sysName',
            description: 'Nom du système'
        },
        {
            oid: '1.3.6.1.2.1.1.6.0',
            name: 'sysLocation',
            description: 'Emplacement physique'
        }
    ],

    // Interface information
    interfaces: [
        {
            oid: '1.3.6.1.2.1.2.1.0',
            name: 'ifNumber',
            description: 'Nombre d\'interfaces'
        },
        {
            oid: '1.3.6.1.2.1.2.2.1.2',
            name: 'ifDescr',
            description: 'Description des interfaces',
            isTable: true
        },
        {
            oid: '1.3.6.1.2.1.2.2.1.8',
            name: 'ifOperStatus',
            description: 'État opérationnel des interfaces',
            isTable: true,
            values: {
                '1': 'up',
                '2': 'down',
                '3': 'testing',
                '4': 'unknown',
                '5': 'dormant',
                '6': 'notPresent',
                '7': 'lowerLayerDown'
            }
        },
        {
            oid: '1.3.6.1.2.1.2.2.1.10',
            name: 'ifInOctets',
            description: 'Octets reçus',
            isTable: true
        },
        {
            oid: '1.3.6.1.2.1.2.2.1.16',
            name: 'ifOutOctets',
            description: 'Octets envoyés',
            isTable: true
        }
    ],

    // IP information
    ip: [
        {
            oid: '1.3.6.1.2.1.4.20.1.1',
            name: 'ipAdEntAddr',
            description: 'Adresses IP du dispositif',
            isTable: true
        },
        {
            oid: '1.3.6.1.2.1.4.20.1.3',
            name: 'ipAdEntNetMask',
            description: 'Masques de sous-réseau',
            isTable: true
        }
    ],

    // CPU and Memory (Cisco specific)
    cisco: [
        {
            oid: '1.3.6.1.4.1.9.9.109.1.1.1.1.3.1',
            name: 'cpmCPUTotal5sec',
            description: 'Utilisation CPU sur 5 secondes (%)'
        },
        {
            oid: '1.3.6.1.4.1.9.9.109.1.1.1.1.4.1',
            name: 'cpmCPUTotal1min',
            description: 'Utilisation CPU sur 1 minute (%)'
        },
        {
            oid: '1.3.6.1.4.1.9.9.109.1.1.1.1.5.1',
            name: 'cpmCPUTotal5min',
            description: 'Utilisation CPU sur 5 minutes (%)'
        },
        {
            oid: '1.3.6.1.4.1.9.9.48.1.1.1.5.1',
            name: 'ciscoMemoryPoolUsed',
            description: 'Mémoire utilisée (octets)'
        },
        {
            oid: '1.3.6.1.4.1.9.9.48.1.1.1.6.1',
            name: 'ciscoMemoryPoolFree',
            description: 'Mémoire libre (octets)'
        }
    ]
};

// Helper function to format SNMP values
export const formatSnmpValue = (oid, value) => {
    // Format uptime from timeticks to human-readable format
    if (oid === '1.3.6.1.2.1.1.3.0') {
        // Convert timeticks (1/100th of a second) to more readable format
        const timeticks = parseInt(value);
        const seconds = Math.floor(timeticks / 100);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    }

    // Format interface operational status
    if (oid.startsWith('1.3.6.1.2.1.2.2.1.8.')) {
        const statusMap = {
            '1': 'up',
            '2': 'down',
            '3': 'testing',
            '4': 'unknown',
            '5': 'dormant',
            '6': 'notPresent',
            '7': 'lowerLayerDown'
        };
        return statusMap[value] || value;
    }

    // Format octets to more readable sizes
    if (oid.startsWith('1.3.6.1.2.1.2.2.1.10.') || oid.startsWith('1.3.6.1.2.1.2.2.1.16.') ||
        oid === '1.3.6.1.4.1.9.9.48.1.1.1.5.1' || oid === '1.3.6.1.4.1.9.9.48.1.1.1.6.1') {
        const bytes = parseInt(value);
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 B';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
        if (i === 0) return `${bytes} ${sizes[i]}`;
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]} (${bytes} octets)`;
    }

    // CPU percentages
    if (oid.startsWith('1.3.6.1.4.1.9.9.109.1.1.1.1.')) {
        return `${value}%`;
    }

    return value;
};

// Function to get a template of OIDs for a specific device type
export const getOidTemplateByType = (type) => {
    switch(type) {
        case 'router':
            return [
                ...commonOids.system,
                ...commonOids.interfaces.filter(oid => !oid.isTable || oid.name === 'ifNumber'),
                ...commonOids.ip.filter(oid => !oid.isTable),
                ...commonOids.cisco
            ];
        case 'switch':
            return [
                ...commonOids.system,
                ...commonOids.interfaces.filter(oid => !oid.isTable || oid.name === 'ifNumber'),
                ...commonOids.cisco
            ];
        case 'host':
            return [
                ...commonOids.system,
                commonOids.interfaces[0], // Just the number of interfaces
                commonOids.ip[0] // Just the IP addresses
            ];
        default:
            return commonOids.system; // Default to just system information
    }
};