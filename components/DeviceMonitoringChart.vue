<template>
    <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <div>
                <h3 class="text-base font-medium text-gray-800">{{ title }}</h3>
                <p class="text-xs text-gray-500">{{ description }}</p>
            </div>
            <div class="flex items-center space-x-2">
                <!-- Time Range Selector -->
                <select
                      v-model="selectedPeriod"
                      @change="fetchData"
                      class="text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="1h">1 heure</option>
                    <option value="6h">6 heures</option>
                    <option value="12h">12 heures</option>
                    <option value="24h">24 heures</option>
                    <option value="7d">7 jours</option>
                    <option value="30d">30 jours</option>
                </select>

                <!-- Refresh Button -->
                <button
                      @click="fetchData"
                      class="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                      :disabled="isLoading"
                >
                    <svg :class="{'animate-spin': isLoading}" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Chart Area -->
        <div class="p-4">
            <div v-if="isLoading" class="flex justify-center items-center h-48">
                <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>

            <div v-else-if="noData" class="flex flex-col justify-center items-center h-48 text-gray-500">
                <svg class="h-12 w-12 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-sm">Aucune donnée disponible</p>
                <button @click="fetchData" class="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                    Actualiser
                </button>
            </div>

            <div v-else>
                <!-- Line Chart -->
                <div v-if="graphType === 'line'" class="h-48">
                    <LineChart
                          :chart-data="chartData"
                          :options="chartOptions"
                    />
                </div>

                <!-- Gauge Chart for current value -->
                <div v-else-if="graphType === 'gauge'" class="flex justify-center items-center h-48">
                    <div class="relative w-full max-w-xs mx-auto">
                        <canvas ref="gaugeCanvas"></canvas>
                        <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span class="text-xl font-bold text-gray-800">{{ formatValue(currentValue) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Bar Chart -->
                <div v-else-if="graphType === 'bar'" class="h-48">
                    <BarChart
                          :chart-data="chartData"
                          :options="chartOptions"
                    />
                </div>

                <!-- Last Updated Info -->
                <div class="mt-2 text-xs text-gray-500 flex justify-between items-center">
                    <span v-if="lastUpdated">Dernière actualisation: {{ formatDate(lastUpdated) }}</span>
                    <span v-else>&nbsp;</span>

                    <div class="flex items-center space-x-2">
                        <span>Valeur actuelle: <strong>{{ formatValue(currentValue) }}</strong></span>

                        <!-- Alert Indicator if configured -->
                        <span v-if="hasAlert" :class="alertClass" class="px-2 py-0.5 rounded-full text-xs">
              {{ alertStatus }}
            </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { LineChart, BarChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const props = defineProps({
    deviceId: {
        type: String,
        required: true
    },
    oid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: 'Monitoring Chart'
    },
    description: {
        type: String,
        default: ''
    },
    graphType: {
        type: String,
        default: 'line',
        validator: (value) => ['line', 'bar', 'gauge', 'none'].includes(value)
    },
    alert: {
        type: Object,
        default: () => ({ enabled: false })
    },
    autoRefresh: {
        type: Boolean,
        default: false
    },
    refreshInterval: {
        type: Number,
        default: 60000 // Default to 1 minute
    }
});

// State
const chartData = ref(null);
const isLoading = ref(false);
const noData = ref(false);
const lastUpdated = ref(null);
const selectedPeriod = ref('24h');
const currentValue = ref(null);
const refreshTimer = ref(null);
const data = ref([]);
const gaugeCanvas = ref(null);
const gaugeChart = ref(null);

// Computed properties
const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
}));

const maxValue = computed(() => {
    if (!data.value || data.value.length === 0) return 100;

    // Get the max value from the data and add 20% margin
    const max = Math.max(...data.value.map(d => d.numericValue || 0));
    return max * 1.2;
});

const hasAlert = computed(() => {
    return props.alert && props.alert.enabled &&
          props.alert.threshold !== undefined &&
          currentValue.value !== null;
});

const isAlertTriggered = computed(() => {
    if (!hasAlert.value) return false;

    const threshold = props.alert.threshold;
    const value = currentValue.value;

    switch (props.alert.condition) {
        case 'above':
            return value > threshold;
        case 'below':
            return value < threshold;
        case 'equal':
            return value === threshold;
        default:
            return false;
    }
});

const alertStatus = computed(() => {
    if (!hasAlert.value) return '';
    return isAlertTriggered.value ? 'Alerte' : 'Normal';
});

const alertClass = computed(() => {
    return isAlertTriggered.value ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
});

// Methods
const fetchData = async () => {
    if (isLoading.value) return;

    isLoading.value = true;

    try {
        const response = await $fetch(`/api/devices/history?deviceId=${props.deviceId}&oid=${props.oid}&period=${selectedPeriod.value}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.success && response.data.length > 0) {
            data.value = response.data;
            lastUpdated.value = new Date();

            // Update current value
            currentValue.value = response.data[response.data.length - 1].numericValue;

            // Format chart data
            const labels = response.data.map(d => formatTime(d.timestamp));
            const values = response.data.map(d => d.numericValue);

            chartData.value = {
                labels,
                datasets: [{
                    label: response.oidInfo.name,
                    data: values,
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    tension: 0.3
                }]
            };

            // Update gauge chart if using gauge type
            if (props.graphType === 'gauge' && gaugeChart.value) {
                updateGaugeChart();
            }

            noData.value = false;
        } else {
            noData.value = true;
            chartData.value = null;
        }
    } catch (error) {
        console.error('Error fetching monitoring data:', error);
        noData.value = true;
        chartData.value = null;
    } finally {
        isLoading.value = false;
    }
};

const formatDate = (date) => {
    if (!date) return '';

    return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);

    // For short periods (hours), show only time
    if (selectedPeriod.value.includes('h')) {
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // For longer periods (days), show date and time
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
    }) + ' ' + date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';

    // Detect common types and format appropriately
    const oidLower = props.oid.toLowerCase();

    // CPU usage
    if (oidLower.includes('cpu') || props.title.toLowerCase().includes('cpu')) {
        return `${value.toFixed(1)}%`;
    }

    // Memory
    if (oidLower.includes('mem') || props.title.toLowerCase().includes('memoire') || props.title.toLowerCase().includes('memory')) {
        // Format as bytes (KB, MB, GB, etc.)
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (value === 0) return '0 B';
        const i = Math.floor(Math.log(value) / Math.log(1024));
        if (i === 0) return `${value} ${sizes[i]}`;
        return `${(value / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    }

    // Uptime (assuming in seconds)
    if (oidLower.includes('uptime') || props.title.toLowerCase().includes('uptime')) {
        const days = Math.floor(value / 86400);
        const hours = Math.floor((value % 86400) / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        const seconds = Math.floor(value % 60);

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else {
            return `${minutes}m ${seconds}s`;
        }
    }

    // Network traffic
    if (oidLower.includes('octets') || oidLower.includes('bytes') || props.title.toLowerCase().includes('traffic')) {
        // Format as bytes/s
        const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
        if (value === 0) return '0 B/s';
        const i = Math.floor(Math.log(value) / Math.log(1024));
        if (i === 0) return `${value} ${sizes[i]}`;
        return `${(value / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    }

    // Default: just show the number with 2 decimal places if needed
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
};

// Initialize gauge chart
const initGaugeChart = () => {
    if (!gaugeCanvas.value || props.graphType !== 'gauge') return;

    const ctx = gaugeCanvas.value.getContext('2d');

    gaugeChart.value = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [currentValue.value || 0, maxValue.value - (currentValue.value || 0)],
                backgroundColor: [
                    getColorForValue(currentValue.value || 0),
                    '#e5e7eb' // Gray background
                ],
                borderWidth: 0,
                circumference: 180,
                rotation: 270
            }]
        },
        options: {
            cutout: '70%',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
};

// Update gauge chart
const updateGaugeChart = () => {
    if (!gaugeChart.value) {
        initGaugeChart();
        return;
    }

    gaugeChart.value.data.datasets[0].data = [
        currentValue.value || 0,
        maxValue.value - (currentValue.value || 0)
    ];
    gaugeChart.value.data.datasets[0].backgroundColor[0] = getColorForValue(currentValue.value || 0);
    gaugeChart.value.update();
};

// Get color for gauge value
const getColorForValue = (value) => {
    // Calculate percentage of max
    const percentage = (value / maxValue.value) * 100;

    // Return color based on percentage
    if (percentage < 60) {
        return '#10B981'; // Green
    } else if (percentage < 80) {
        return '#F59E0B'; // Yellow
    } else {
        return '#EF4444'; // Red
    }
};

// Auto-refresh functionality
const startAutoRefresh = () => {
    if (props.autoRefresh && props.refreshInterval > 0) {
        stopAutoRefresh(); // Clear any existing timer
        refreshTimer.value = setInterval(fetchData, props.refreshInterval);
    }
};

const stopAutoRefresh = () => {
    if (refreshTimer.value) {
        clearInterval(refreshTimer.value);
        refreshTimer.value = null;
    }
};

// Component lifecycle
onMounted(() => {
    fetchData();
    startAutoRefresh();

    // Initialize gauge chart if needed
    if (props.graphType === 'gauge') {
        nextTick(() => {
            initGaugeChart();
        });
    }
});

watch(() => props.deviceId, fetchData);
watch(() => props.oid, fetchData);
watch(() => props.graphType, () => {
    // If switching to gauge, initialize it
    if (props.graphType === 'gauge') {
        nextTick(() => {
            initGaugeChart();
        });
    }
});
watch(() => props.autoRefresh, (newVal) => {
    if (newVal) {
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
});

// Clean up on component unmount
onUnmounted(() => {
    stopAutoRefresh();

    // Clean up chart instances
    if (gaugeChart.value) {
        gaugeChart.value.destroy();
        gaugeChart.value = null;
    }
});
</script>