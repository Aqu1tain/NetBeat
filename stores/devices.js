// stores/devices.js
import { defineStore } from 'pinia';
import { useActivityStore } from './activity';

export const useDevicesStore = defineStore('devices', {
    state: () => ({
        devicesList: [],
        deviceFilter: 'all',
        deviceSearch: '',
        showNewDeviceForm: false,
        isSubmittingDevice: false,
        selectedDeviceId: null,
        editingDeviceId: null,
        devicePollingResults: {},
        isSubmittingEdit: false,
        showSnmpQueryModal: false,
        selectedQueryDevice: null,
        activeDeviceTab: 'details',
        showPingResults: false,
        pingResults: null,

        // Device form for creating a new device
        deviceForm: {
            name: '',
            ipAddress: '',
            snmpCommunity: 'public',
            snmpVersion: '2c',
            description: '',
            oids: []
        },

        // Device form for editing an existing device
        editDeviceForm: {
            name: '',
            ipAddress: '',
            snmpCommunity: 'public',
            snmpVersion: '2c',
            status: 'active',
            description: '',
            monitoringInterval: 5, // Default to 5 minutes
            oids: []
        }
    }),

    getters: {
        filteredDevices: (state) => {
            let result = [...state.devicesList];

            // Filter by status
            if (state.deviceFilter !== 'all') {
                result = result.filter(device => device.status === state.deviceFilter);
            }

            // Filter by search
            if (state.deviceSearch) {
                const searchLower = state.deviceSearch.toLowerCase();
                result = result.filter(device =>
                    device.name.toLowerCase().includes(searchLower) ||
                    device.description?.toLowerCase().includes(searchLower) ||
                    device.ipAddress.includes(searchLower)
                );
            }

            // Sort by created date, newest first
            return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    },

    actions: {
        async fetchDevices() {
            if (process.server) return;
            try {
                const response = await $fetch('/api/devices', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.devicesList = response.devices || [];
            } catch (error) {
                console.error('Error fetching devices:', error);
            }
        },

        // Add a new OID to the form
        addOid() {
            this.deviceForm.oids.push({
                oid: '',
                name: '',
                description: '',
                testResult: null
            });
        },

        // Remove an OID from the form
        removeOid(index) {
            this.deviceForm.oids.splice(index, 1);
        },

        // Test an OID against the specified device
        async testOid(index) {
            const oid = this.deviceForm.oids[index];
            if (!oid.oid || !this.deviceForm.ipAddress) {
                alert('Veuillez spécifier un OID et une adresse IP valides');
                return;
            }

            try {
                const response = await $fetch('/api/devices/poll', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: {
                        ipAddress: this.deviceForm.ipAddress,
                        community: this.deviceForm.snmpCommunity,
                        version: this.deviceForm.snmpVersion,
                        oids: [oid.oid]
                    }
                });

                if (response.success && response.results && response.results.length > 0) {
                    const result = response.results[0];
                    if (result.error) {
                        this.deviceForm.oids[index].testResult = { error: result.error };
                    } else {
                        this.deviceForm.oids[index].testResult = { value: result.value };
                    }
                }
            } catch (error) {
                console.error('Error testing OID:', error);
                this.deviceForm.oids[index].testResult = { error: error.message || 'Failed to test OID' };
            }
        },

        // Create a new device
        async createDevice() {
            if (!this.deviceForm.name || !this.deviceForm.ipAddress) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }

            try {
                this.isSubmittingDevice = true;

                // Clean up testResult from oids and prepare OIDs with alerts
                const oids = this.deviceForm.oids.map(({ oid, name, description, graphType, alert }) => ({
                    oid,
                    name,
                    description,
                    graphType: graphType || 'line',
                    alert: {
                        enabled: alert?.enabled || false,
                        threshold: alert?.threshold || 0,
                        condition: alert?.condition || 'above'
                    }
                }));

                await $fetch('/api/devices', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: {
                        name: this.deviceForm.name,
                        ipAddress: this.deviceForm.ipAddress,
                        snmpCommunity: this.deviceForm.snmpCommunity,
                        snmpVersion: this.deviceForm.snmpVersion,
                        description: this.deviceForm.description,
                        monitoringInterval: this.deviceForm.monitoringInterval || 5,
                        oids
                    }
                });

                // Add to recent activity
                const activityStore = useActivityStore();
                activityStore.addActivity({
                    type: 'device_created',
                    message: `Nouvel appareil créé: "${this.deviceForm.name}"`,
                    timestamp: new Date()
                });

                // Reset form and refresh devices
                this.resetDeviceForm();
                this.showNewDeviceForm = false;
                await this.fetchDevices();

            } catch (error) {
                console.error('Error creating device:', error);
                alert('Erreur lors de la création de l\'appareil');
            } finally {
                this.isSubmittingDevice = false;
            }
        },

        resetDeviceForm() {
            this.deviceForm = {
                name: '',
                ipAddress: '',
                snmpCommunity: 'public',
                snmpVersion: '2c',
                description: '',
                monitoringInterval: 5,
                oids: []
            };
        },

        async pingDevice(deviceId) {
            const device = this.devicesList.find(d => d._id === deviceId);
            if (!device) return;

            try {
                const response = await $fetch('/api/devices/ping', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: {
                        ipAddress: device.ipAddress
                    }
                });

                // Store ping results
                this.pingResults = response;
                this.showPingResults = true;

                // Update device with ping status
                const updatedDevice = {
                    ...device,
                    lastPingStatus: {
                        timestamp: new Date(),
                        success: response.success,
                        responseTime: response.stats?.avgTime,
                        packetLoss: response.stats?.packetLoss
                    }
                };

                // Update device status based on ping result
                if (!response.success && device.status === 'active') {
                    updatedDevice.status = 'inactive';
                }

                // Update device in the list
                const index = this.devicesList.findIndex(d => d._id === deviceId);
                if (index !== -1) {
                    this.devicesList[index] = updatedDevice;
                }

                // Update device in API
                await this.updateDevice(deviceId, {
                    lastPingStatus: updatedDevice.lastPingStatus,
                    status: updatedDevice.status
                });

            } catch (error) {
                console.error('Error pinging device:', error);
                alert('Erreur lors du ping de l\'appareil');
            }
        },

        async monitorDevice(deviceId) {
            const device = this.devicesList.find(d => d._id === deviceId);
            if (!device) return;

            try {
                // Call monitor API with all OIDs for this device
                const oidsToMonitor = device.oids.map(oid => oid.oid);

                if (oidsToMonitor.length === 0) {
                    alert('Aucun OID configuré pour cet appareil');
                    return;
                }

                const response = await $fetch('/api/devices/monitor', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: {
                        deviceId,
                        oids: oidsToMonitor
                    }
                });

                if (response.success) {
                    // Store polling results
                    const results = {};
                    response.results.forEach(result => {
                        results[result.oid] = {
                            value: result.value,
                            error: !!result.error
                        };
                    });

                    this.devicePollingResults = {
                        ...this.devicePollingResults,
                        [deviceId]: results
                    };

                    // Update device with last monitored timestamp
                    const updatedDevice = {
                        ...device,
                        lastMonitored: response.timestamp,
                        status: 'active' // Set status to active if monitoring succeeds
                    };

                    // Update device in the list
                    const index = this.devicesList.findIndex(d => d._id === deviceId);
                    if (index !== -1) {
                        this.devicesList[index] = updatedDevice;
                    }

                    // Update device in API
                    await this.updateDevice(deviceId, {
                        lastMonitored: response.timestamp,
                        status: 'active'
                    });

                    // Show success message
                    alert('Données actualisées avec succès');
                }
            } catch (error) {
                console.error('Error monitoring device:', error);
                alert('Erreur lors de l\'actualisation des données');
            }
        },

        // View device details
        viewDeviceDetails(deviceId) {
            if (this.selectedDeviceId === deviceId) {
                this.selectedDeviceId = null; // Toggle off if already selected
            } else {
                this.selectedDeviceId = deviceId;
                this.editingDeviceId = null; // Close edit form if open
            }
        },

        // Edit a device
        editDevice(deviceId) {
            const device = this.devicesList.find(d => d._id === deviceId);
            if (!device) return;

            // Initialize edit form with enhanced device data
            this.editDeviceForm = {
                name: device.name,
                ipAddress: device.ipAddress,
                snmpCommunity: device.snmpCommunity,
                snmpVersion: device.snmpVersion,
                status: device.status,
                description: device.description,
                monitoringInterval: device.monitoringInterval || 5,
                oids: device.oids.map(oid => ({
                    ...oid,
                    // Ensure alert object exists with defaults if not present
                    alert: {
                        enabled: oid.alert?.enabled || false,
                        threshold: oid.alert?.threshold || 0,
                        condition: oid.alert?.condition || 'above'
                    }
                }))
            };

            this.editingDeviceId = deviceId;
            this.selectedDeviceId = null; // Close details if open
            this.activeDeviceTab = 'details'; // Reset tab for next view
        },

        // Add a new OID to the edit form
        addEditOid() {
            this.editDeviceForm.oids.push({
                oid: '',
                name: '',
                description: ''
            });
        },

        // Remove an OID from the edit form
        removeEditOid(index) {
            this.editDeviceForm.oids.splice(index, 1);
        },

        // Update a device
        async updateDevice(deviceId, partialData = null) {
            try {
                this.isSubmittingEdit = true;

                const dataToSend = partialData || this.editDeviceForm;

                await $fetch(`/api/devices/${deviceId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: dataToSend
                });

                // Reset and refresh
                if (!partialData) {
                    // Add to recent activity
                    const activityStore = useActivityStore();
                    activityStore.addActivity({
                        type: 'device_updated',
                        message: `Appareil "${this.editDeviceForm.name}" mis à jour`,
                        timestamp: new Date()
                    });

                    this.editingDeviceId = null;
                }

                await this.fetchDevices();

            } catch (error) {
                console.error('Error updating device:', error);
                alert('Erreur lors de la mise à jour de l\'appareil');
            } finally {
                this.isSubmittingEdit = false;
            }
        },

        // Confirm and delete a device
        async deleteDevice(deviceId) {
            const device = this.devicesList.find(d => d._id === deviceId);
            if (!device) return;

            if (!confirm(`Êtes-vous sûr de vouloir supprimer l'appareil "${device.name}" ?`)) {
                return;
            }

            try {
                await $fetch(`/api/devices/${deviceId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Close panels if open for this device
                if (this.selectedDeviceId === deviceId) this.selectedDeviceId = null;
                if (this.editingDeviceId === deviceId) this.editingDeviceId = null;

                // Add to recent activity
                const activityStore = useActivityStore();
                activityStore.addActivity({
                    type: 'device_deleted',
                    message: `Appareil "${device.name}" supprimé`,
                    timestamp: new Date()
                });

                // Refresh devices
                await this.fetchDevices();

            } catch (error) {
                console.error('Error deleting device:', error);
                alert('Erreur lors de la suppression de l\'appareil');
            }
        },

        // Apply OID templates for new device
        applyDeviceTemplate(templateType) {
            // Get the appropriate template
            const templateOids = this.getOidTemplateByType(templateType);

            // If already have some OIDs, confirm before replacing
            if (this.deviceForm.oids.length > 0) {
                if (!confirm('Cela remplacera les OIDs existants. Continuer?')) {
                    return;
                }
            }

            // Apply the template
            this.deviceForm.oids = JSON.parse(JSON.stringify(templateOids));
        },

        // Apply OID templates for edit form
        applyEditDeviceTemplate(templateType) {
            // Get the appropriate template
            const templateOids = this.getOidTemplateByType(templateType);

            // If already have some OIDs, confirm before replacing
            if (this.editDeviceForm.oids.length > 0) {
                if (!confirm('Cela remplacera les OIDs existants. Continuer?')) {
                    return;
                }
            }

            // Apply the template
            this.editDeviceForm.oids = JSON.parse(JSON.stringify(templateOids));
        },

        // Helper function to get OID templates
        getOidTemplateByType(type) {
            // This would normally be imported from utils/snmp
            // But for simplicity, implementing here directly
            const templates = {
                system: [
                    { oid: '1.3.6.1.2.1.1.1.0', name: 'sysDescr', description: 'Description du système' },
                    { oid: '1.3.6.1.2.1.1.3.0', name: 'sysUpTime', description: 'Temps depuis le dernier redémarrage' },
                    { oid: '1.3.6.1.2.1.1.5.0', name: 'sysName', description: 'Nom du système' }
                ],
                router: [
                    { oid: '1.3.6.1.2.1.2.2.1.10.1', name: 'ifInOctets', description: 'Octets entrants' },
                    { oid: '1.3.6.1.2.1.2.2.1.16.1', name: 'ifOutOctets', description: 'Octets sortants' },
                    { oid: '1.3.6.1.2.1.4.3.0', name: 'ipInReceives', description: 'Paquets IP reçus' }
                ],
                switch: [
                    { oid: '1.3.6.1.2.1.17.1.4.1.2', name: 'dot1dBasePortIfIndex', description: 'Index des ports' },
                    { oid: '1.3.6.1.2.1.2.2.1.8', name: 'ifOperStatus', description: 'Statut opérationnel des interfaces' }
                ],
                host: [
                    { oid: '1.3.6.1.2.1.25.3.3.1.2.1', name: 'hrProcessorLoad', description: 'Charge CPU' },
                    { oid: '1.3.6.1.2.1.25.2.3.1.6.1', name: 'hrStorageUsed', description: 'Utilisation mémoire' }
                ]
            };

            return templates[type] || [];
        }
    }
});