<!-- pages/dashboard.vue -->
<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Navbar -->
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-3">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <h1 class="text-xl font-bold text-gray-800">Packet Tracer Monitorer</h1>

                        <!-- Admin Badge -->
                        <span v-if="isAdmin" class="ml-3 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
              Admin
            </span>
                    </div>

                    <div class="flex items-center space-x-4">
                        <!-- Session Info -->
                        <div class="hidden md:flex items-center text-sm">
              <span v-if="sessionTime" class="text-gray-600">
                Session: {{ sessionTime }} min
              </span>
                        </div>

                        <!-- User Info & Logout -->
                        <div class="relative" ref="userMenuRef">
                            <button
                                  @click="toggleUserMenu"
                                  class="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                            >
                                <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                    {{ user?.username?.charAt(0).toUpperCase() }}
                                </div>
                                <span class="hidden md:inline">{{ user?.username }}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <!-- Dropdown Menu -->
                            <div
                                  v-if="isUserMenuOpen"
                                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                            >
                                <div class="px-4 py-2 text-sm text-gray-500 border-b">
                                    Connecté en tant que <span class="font-semibold">{{ user?.username }}</span>
                                    <p class="text-xs text-gray-500">Rôle: {{ user?.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}</p>
                                </div>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mon profil</a>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paramètres</a>
                                <button
                                      @click="logout"
                                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content with Sidebar -->
        <div class="container mx-auto px-4 py-6">
            <div class="flex flex-col md:flex-row">
                <!-- Sidebar Navigation -->
                <div class="w-full md:w-64 mb-6 md:mb-0">
                    <div class="bg-white rounded-lg shadow p-4">
                        <div class="font-medium text-gray-500 uppercase tracking-wider text-xs mb-2">Menu principal</div>

                        <nav class="space-y-1">
                            <!-- Common Menu Items -->
                            <a
                                  href="#dashboard"
                                  @click.prevent="activeTab = 'dashboard'"
                                  class="flex items-center px-3 py-2 rounded-md transition-colors"
                                  :class="activeTab === 'dashboard' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                            >
                <span class="mr-3">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </span>
                                Tableau de bord
                            </a>

                            <a
                                  href="#tickets"
                                  @click.prevent="activeTab = 'tickets'"
                                  class="flex items-center px-3 py-2 rounded-md transition-colors"
                                  :class="activeTab === 'tickets' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                            >
                <span class="mr-3">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                                Tickets
                            </a>

                            <!-- Admin-only Menu Items -->
                            <template v-if="isAdmin">
                                <div class="pt-2 mt-2 border-t border-gray-200">
                                    <div class="font-medium text-gray-500 uppercase tracking-wider text-xs mt-2 mb-2">Administration</div>

                                    <a
                                          href="#devices"
                                          @click.prevent="activeTab = 'devices'"
                                          class="flex items-center px-3 py-2 rounded-md transition-colors"
                                          :class="activeTab === 'devices' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                                    >
                    <span class="mr-3">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </span>
                                        Gestion des appareils
                                    </a>

                                    <a
                                          href="#users"
                                          @click.prevent="activeTab = 'users'"
                                          class="flex items-center px-3 py-2 rounded-md transition-colors"
                                          :class="activeTab === 'users' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                                    >
                    <span class="mr-3">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                                        Gestion des utilisateurs
                                    </a>

                                    <a
                                          href="#logs"
                                          @click.prevent="activeTab = 'logs'"
                                          class="flex items-center px-3 py-2 rounded-md transition-colors"
                                          :class="activeTab === 'logs' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                                    >
                    <span class="mr-3">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                                        Journaux système
                                    </a>
                                </div>
                            </template>
                        </nav>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="flex-1 md:ml-6">
                    <!-- Dashboard Tab -->
                    <div v-if="activeTab === 'dashboard'" class="space-y-6">
                        <!-- Welcome Card -->
                        <div class="bg-white rounded-lg shadow p-6">
                            <h2 class="text-xl font-semibold mb-4">
                                {{ isAdmin ? 'Bienvenue sur le panneau d\'administration' : 'Bienvenue sur votre tableau de bord' }}
                            </h2>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <!-- Card 1 -->
                                <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                    <div class="flex items-center">
                                        <div class="p-3 rounded-full bg-blue-200 text-blue-800">
                                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div class="ml-4">
                                            <h3 class="text-lg font-medium text-gray-800">Tickets</h3>
                                            <p class="text-2xl font-bold text-gray-900">{{ tickets.length }}</p>
                                            <p class="text-sm text-gray-600">{{ openTicketsCount }} ouvert(s)</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Card 2 (Admin only sees all data, users see personal data) -->
                                <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                    <div class="flex items-center">
                                        <div class="p-3 rounded-full bg-green-200 text-green-800">
                                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div class="ml-4">
                                            <h3 class="text-lg font-medium text-gray-800">{{ isAdmin ? 'Tickets résolus' : 'Vos tickets résolus' }}</h3>
                                            <p class="text-2xl font-bold text-gray-900">{{ closedTicketsCount }}</p>
                                            <p class="text-sm text-gray-600">{{ Math.round((closedTicketsCount / (tickets.length || 1)) * 100) }}% de résolution</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Card 3 (Admin Only) -->
                                <div v-if="isAdmin" class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                                    <div class="flex items-center">
                                        <div class="p-3 rounded-full bg-purple-200 text-purple-800">
                                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <div class="ml-4">
                                            <h3 class="text-lg font-medium text-gray-800">Utilisateurs</h3>
                                            <p class="text-2xl font-bold text-gray-900">{{ usersCount }}</p>
                                            <p class="text-sm text-gray-600">{{ adminCount }} admin(s)</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Card 3 (Regular User) -->
                                <div v-else class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                                    <div class="flex items-center">
                                        <div class="p-3 rounded-full bg-yellow-200 text-yellow-800">
                                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div class="ml-4">
                                            <h3 class="text-lg font-medium text-gray-800">En attente</h3>
                                            <p class="text-2xl font-bold text-gray-900">{{ pendingTicketsCount }}</p>
                                            <p class="text-sm text-gray-600">Tickets nécessitant attention</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Activity -->
                        <div class="bg-white rounded-lg shadow">
                            <div class="border-b border-gray-200 px-6 py-4">
                                <h3 class="text-lg font-medium">Activité récente</h3>
                            </div>
                            <div class="p-6">
                                <div v-if="recentActivity.length === 0" class="text-center py-4 text-gray-500">
                                    Aucune activité récente à afficher
                                </div>
                                <ul v-else class="divide-y divide-gray-200">
                                    <li v-for="(activity, index) in recentActivity" :key="index" class="py-3">
                                        <div class="flex items-start">
                                            <div class="flex-shrink-0">
                                                <div :class="`h-8 w-8 rounded-full ${activityTypeColor(activity.type)} flex items-center justify-center text-white`">
                                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div class="ml-3 flex-1">
                                                <p class="text-sm text-gray-900">
                                                    {{ activity.message }}
                                                </p>
                                                <p class="mt-1 text-xs text-gray-500">
                                                    {{ formatDate(activity.timestamp) }}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Tickets Tab -->
                    <div v-if="activeTab === 'tickets'" class="bg-white rounded-lg shadow">
                        <div class="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h3 class="text-lg font-medium">{{ isAdmin ? 'Gestion des tickets' : 'Vos tickets' }}</h3>

                            <!-- New Ticket button (only for regular users) -->
                            <button
                                  v-if="!isAdmin"
                                  @click="showNewTicketForm = !showNewTicketForm"
                                  class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <span v-if="!showNewTicketForm">Nouveau ticket</span>
                                <span v-else>Annuler</span>
                            </button>
                        </div>

                        <!-- New Ticket Form (for regular users) -->
                        <div v-if="!isAdmin && showNewTicketForm" class="border-b border-gray-200 p-6 bg-gray-50">
                            <form @submit.prevent="createTicket" class="space-y-4">
                                <div>
                                    <label for="ticket-title" class="block text-sm font-medium text-gray-700">Titre</label>
                                    <input
                                          id="ticket-title"
                                          v-model="ticketTitle"
                                          type="text"
                                          placeholder="Titre du ticket"
                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label for="ticket-description" class="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                          id="ticket-description"
                                          v-model="ticketDescription"
                                          placeholder="Décrivez votre problème en détail"
                                          rows="4"
                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    ></textarea>
                                </div>
                                <div class="flex justify-end space-x-3">
                                    <button
                                          type="button"
                                          @click="showNewTicketForm = false"
                                          class="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                          type="submit"
                                          class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                          :disabled="isSubmittingTicket"
                                    >
                                        <span v-if="isSubmittingTicket">Création...</span>
                                        <span v-else>Créer le ticket</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Ticket Filters -->
                        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div class="flex flex-wrap items-center justify-between gap-3">
                                <!-- Status Filter -->
                                <div class="flex space-x-2">
                                    <button
                                          @click="ticketFilter = 'all'"
                                          class="px-3 py-1 text-sm rounded-md"
                                          :class="ticketFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                                    >
                                        Tous
                                    </button>
                                    <button
                                          @click="ticketFilter = 'open'"
                                          class="px-3 py-1 text-sm rounded-md"
                                          :class="ticketFilter === 'open' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                                    >
                                        Ouverts
                                    </button>
                                    <button
                                          @click="ticketFilter = 'closed'"
                                          class="px-3 py-1 text-sm rounded-md"
                                          :class="ticketFilter === 'closed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                                    >
                                        Résolus
                                    </button>
                                </div>

                                <!-- Search (Admin only) -->
                                <div v-if="isAdmin" class="relative">
                                    <input
                                          v-model="ticketSearch"
                                          type="text"
                                          placeholder="Rechercher..."
                                          class="pl-8 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                        <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tickets List -->
                        <div class="p-6">
                            <div v-if="filteredTickets.length === 0" class="text-center py-8 text-gray-500">
                                Aucun ticket à afficher
                            </div>
                            <ul v-else class="divide-y divide-gray-200">
                                <li
                                      v-for="ticket in filteredTickets"
                                      :key="ticket._id"
                                      class="py-4"
                                >
                                    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <!-- Ticket Info -->
                                        <div class="flex-1">
                                            <div class="flex items-start">
                                                <!-- Status Indicator -->
                                                <span
                                                      class="h-2 w-2 mt-2 mr-2 rounded-full"
                                                      :class="ticket.status === 'open' ? 'bg-red-500' : 'bg-green-500'"
                                                ></span>

                                                <!-- Ticket Content -->
                                                <div>
                                                    <h4 class="text-lg font-medium text-gray-900">{{ ticket.title }}</h4>
                                                    <p class="mt-1 text-gray-600">{{ ticket.description }}</p>

                                                    <!-- Admin-visible metadata -->
                                                    <div v-if="isAdmin" class="mt-2 flex flex-wrap text-xs text-gray-500 space-x-4">
                                                        <span>ID: {{ ticket._id }}</span>
                                                        <span>Créé par: {{ getUsername(ticket.createdBy) }}</span>
                                                    </div>

                                                    <!-- Common metadata -->
                                                    <div class="mt-2 flex flex-wrap text-xs text-gray-500 space-x-4">
                                                        <span>Créé le: {{ formatDate(ticket.createdAt) }}</span>
                                                        <span>
                              Statut:
                              <span
                                    :class="ticket.status === 'open' ? 'text-red-600' : 'text-green-600'"
                                    class="font-medium"
                              >
                                {{ ticket.status === 'open' ? 'Ouvert' : 'Résolu' }}
                              </span>
                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Action Buttons -->
                                        <div class="mt-4 md:mt-0 flex justify-end">
                                            <!-- Admin Actions -->
                                            <div v-if="isAdmin" class="flex space-x-2">
                                                <button
                                                      v-if="ticket.status === 'open'"
                                                      @click="updateTicketStatus(ticket._id, 'closed')"
                                                      class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                                >
                                                    Marquer comme résolu
                                                </button>
                                                <button
                                                      v-else
                                                      @click="updateTicketStatus(ticket._id, 'open')"
                                                      class="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                                                >
                                                    Réouvrir
                                                </button>
                                            </div>

                                            <!-- User Actions -->
                                            <div v-else class="flex space-x-2">
                                                <button
                                                      v-if="ticket.status === 'open'"
                                                      @click="confirmCloseTicket(ticket._id)"
                                                      class="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                                                >
                                                    Marquer comme résolu
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Admin-Only Devices Tab -->
                    <div v-if="isAdmin && activeTab === 'devices'" class="bg-white rounded-lg shadow">
                        <div class="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h3 class="text-lg font-medium">Gestion des appareils</h3>

                            <!-- New Device button -->
                            <button
                                  @click="showNewDeviceForm = !showNewDeviceForm"
                                  class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <span v-if="!showNewDeviceForm">Nouvel appareil</span>
                                <span v-else>Annuler</span>
                            </button>
                        </div>

                        <!-- New Device Form -->
                        <div v-if="showNewDeviceForm" class="border-b border-gray-200 p-6 bg-gray-50">
                            <form @submit.prevent="createDevice" class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="device-name" class="block text-sm font-medium text-gray-700">Nom</label>
                                        <input
                                              id="device-name"
                                              v-model="deviceForm.name"
                                              type="text"
                                              placeholder="Nom de l'appareil"
                                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                              required
                                        />
                                    </div>
                                    <div>
                                        <label for="device-ip" class="block text-sm font-medium text-gray-700">Adresse IP</label>
                                        <input
                                              id="device-ip"
                                              v-model="deviceForm.ipAddress"
                                              type="text"
                                              placeholder="192.168.1.1"
                                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                              required
                                        />
                                    </div>
                                    <div>
                                        <label for="device-community" class="block text-sm font-medium text-gray-700">Communauté SNMP</label>
                                        <input
                                              id="device-community"
                                              v-model="deviceForm.snmpCommunity"
                                              type="text"
                                              placeholder="public"
                                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label for="device-version" class="block text-sm font-medium text-gray-700">Version SNMP</label>
                                        <select
                                              id="device-version"
                                              v-model="deviceForm.snmpVersion"
                                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="1">1</option>
                                            <option value="2c">2c</option>
                                            <option value="3">3</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label for="device-description" class="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                          id="device-description"
                                          v-model="deviceForm.description"
                                          placeholder="Description de l'appareil"
                                          rows="2"
                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    ></textarea>
                                </div>

                                <!-- OIDs Section -->
                                <div>
                                    <div class="flex justify-between items-center mb-2">
                                        <label class="block text-sm font-medium text-gray-700">OIDs à surveiller</label>
                                        <button
                                              type="button"
                                              @click="addOid"
                                              class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Ajouter un OID
                                        </button>
                                    </div>

                                    <!-- OID Template Picker -->
                                    <div class="mt-2 mb-4">
                                        <label class="block text-xs font-medium text-gray-700 mb-1">Templates d'OIDs</label>
                                        <div class="flex flex-wrap gap-2">
                                            <button
                                                  type="button"
                                                  @click="applyDeviceTemplate('system')"
                                                  class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                            >
                                                Système
                                            </button>
                                            <button
                                                  type="button"
                                                  @click="applyDeviceTemplate('router')"
                                                  class="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
                                            >
                                                Router
                                            </button>
                                            <button
                                                  type="button"
                                                  @click="applyDeviceTemplate('switch')"
                                                  class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                                            >
                                                Switch
                                            </button>
                                            <button
                                                  type="button"
                                                  @click="applyDeviceTemplate('host')"
                                                  class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                                            >
                                                Host
                                            </button>
                                        </div>
                                    </div>

                                    <div v-for="(oid, index) in deviceForm.oids" :key="index" class="border p-3 rounded mb-2">
                                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                                            <div>
                                                <label :for="`oid-value-${index}`" class="block text-xs font-medium text-gray-700">OID</label>
                                                <input
                                                      :id="`oid-value-${index}`"
                                                      v-model="oid.oid"
                                                      type="text"
                                                      placeholder="1.3.6.1.2.1.1.1.0"
                                                      class="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                      required
                                                />
                                            </div>
                                            <div>
                                                <label :for="`oid-name-${index}`" class="block text-xs font-medium text-gray-700">Nom</label>
                                                <input
                                                      :id="`oid-name-${index}`"
                                                      v-model="oid.name"
                                                      type="text"
                                                      placeholder="sysDescr"
                                                      class="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                      required
                                                />
                                            </div>
                                            <div>
                                                <label :for="`oid-desc-${index}`" class="block text-xs font-medium text-gray-700">Description</label>
                                                <input
                                                      :id="`oid-desc-${index}`"
                                                      v-model="oid.description"
                                                      type="text"
                                                      placeholder="Description du système"
                                                      class="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div class="flex justify-between">
                                            <button
                                                  type="button"
                                                  @click="testOid(index)"
                                                  class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Tester
                                            </button>
                                            <button
                                                  type="button"
                                                  @click="removeOid(index)"
                                                  class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                        <div v-if="oid.testResult" class="mt-2 p-2 bg-gray-100 rounded text-xs">
                                            <p v-if="oid.testResult.error" class="text-red-600">
                                                Erreur: {{ oid.testResult.error }}
                                            </p>
                                            <p v-else class="text-green-600">
                                                Valeur: {{ oid.testResult.value }}
                                            </p>
                                        </div>
                                    </div>

                                    <p v-if="deviceForm.oids.length === 0" class="text-sm text-gray-500 italic">
                                        Aucun OID ajouté. Cliquez sur "Ajouter un OID" pour commencer.
                                    </p>
                                </div>

                                <div class="flex justify-end space-x-3">
                                    <button
                                          type="button"
                                          @click="showNewDeviceForm = false"
                                          class="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                          type="submit"
                                          class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                          :disabled="isSubmittingDevice"
                                    >
                                        <span v-if="isSubmittingDevice">Création...</span>
                                        <span v-else>Créer l'appareil</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Device Filters -->
                        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div class="flex flex-wrap items-center justify-between gap-3">
                                <!-- Status Filter -->
                                <div class="flex space-x-2">
                                    <button
                                          @click="deviceFilter = 'all'"
                                          class="px-3 py-1 text-sm rounded-md"
                                          :class="deviceFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                                    >
                                        Tous
                                    </button>
                                    <button
                                          @click="deviceFilter = 'active'"
                                          class="px-3 py-1 text-sm rounded-md"
                                          :class="deviceFilter === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                                    >
                                        Actifs
                                    </button>
                                    <button
                                          @click="deviceFilter = 'inactive'"
                                          class="px-3 py-1 text-sm rounded-md"
                                          :class="deviceFilter === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                                    >
                                        Inactifs
                                    </button>
                                </div>

                                <!-- Search -->
                                <div class="relative">
                                    <input
                                          v-model="deviceSearch"
                                          type="text"
                                          placeholder="Rechercher..."
                                          class="pl-8 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                        <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Devices List -->
                        <div class="p-6">
                            <div v-if="filteredDevices.length === 0" class="text-center py-8 text-gray-500">
                                Aucun appareil à afficher
                            </div>
                            <ul v-else class="divide-y divide-gray-200">
                                <li
                                      v-for="device in filteredDevices"
                                      :key="device._id"
                                      class="py-4"
                                >
                                    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <!-- Device Info -->
                                        <div class="flex-1">
                                            <div class="flex items-start">
                                                <!-- Status Indicator -->
                                                <span
                                                      class="h-2 w-2 mt-2 mr-2 rounded-full"
                                                      :class="device.status === 'active' ? 'bg-green-500' : 'bg-red-500'"
                                                ></span>

                                                <!-- Device Content -->
                                                <div>
                                                    <h4 class="text-lg font-medium text-gray-900">{{ device.name }}</h4>
                                                    <p class="mt-1 text-gray-600">{{ device.description }}</p>

                                                    <!-- Device metadata -->
                                                    <div class="mt-2 flex flex-wrap text-xs text-gray-500 space-x-4">
                                                        <span>IP: {{ device.ipAddress }}</span>
                                                        <span>SNMP: v{{ device.snmpVersion }}</span>
                                                        <span>OIDs: {{ device.oids.length }}</span>
                                                        <span>Créé le: {{ formatDate(device.createdAt) }}</span>
                                                        <span>
                                                            Statut:
                                                            <span
                                                                  :class="device.status === 'active' ? 'text-green-600' : 'text-red-600'"
                                                                  class="font-medium"
                                                            >
                                                                {{ device.status === 'active' ? 'Actif' : 'Inactif' }}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Action Buttons -->
                                        <div class="mt-4 md:mt-0 flex justify-end space-x-2">
                                            <button
                                                  @click="viewDeviceDetails(device._id)"
                                                  class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                            >
                                                Détails
                                            </button>
                                            <button
                                                  @click="pollDevice(device._id)"
                                                  class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                            >
                                                Interroger
                                            </button>
                                            <button
                                                  @click="editDevice(device._id)"
                                                  class="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                  @click="confirmDeleteDevice(device._id)"
                                                  class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Device Details Panel (hidden by default) -->
                                    <div v-if="device._id === selectedDeviceId" class="mt-4 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                                        <div class="flex border-b border-gray-200">
                                            <button
                                                  @click="activeDeviceTab = 'details'"
                                                  class="px-4 py-2 text-sm font-medium transition-colors"
                                                  :class="activeDeviceTab === 'details' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'"
                                            >
                                                Détails
                                            </button>
                                            <button
                                                  @click="activeDeviceTab = 'monitor'"
                                                  class="px-4 py-2 text-sm font-medium transition-colors"
                                                  :class="activeDeviceTab === 'monitor' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'"
                                            >
                                                Monitoring
                                            </button>
                                        </div>

                                        <!-- Details Tab -->
                                        <div v-if="activeDeviceTab === 'details'" class="p-4">
                                            <h5 class="font-medium mb-2">Détails de l'appareil</h5>

                                            <!-- OIDs Table -->
                                            <div class="overflow-x-auto mt-2">
                                                <table class="min-w-full divide-y divide-gray-200">
                                                    <thead class="bg-gray-100">
                                                    <tr>
                                                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">OID</th>
                                                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Graphique</th>
                                                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dernière valeur</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody class="bg-white divide-y divide-gray-200">
                                                    <tr v-for="(oid, index) in device.oids" :key="index">
                                                        <td class="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{{ oid.oid }}</td>
                                                        <td class="px-4 py-2 whitespace-nowrap text-xs">{{ oid.name }}</td>
                                                        <td class="px-4 py-2 text-xs">{{ oid.description }}</td>
                                                        <td class="px-4 py-2 whitespace-nowrap text-xs">
                            <span
                                  :class="{
                                    'bg-blue-100 text-blue-800': oid.graphType === 'line',
                                    'bg-green-100 text-green-800': oid.graphType === 'bar',
                                    'bg-yellow-100 text-yellow-800': oid.graphType === 'gauge',
                                    'bg-gray-100 text-gray-800': oid.graphType === 'none' || !oid.graphType
                                }"
                                  class="px-2 py-0.5 rounded-full text-xs"
                            >
                                {{ oid.graphType === 'line' ? 'Ligne' :
                                  oid.graphType === 'bar' ? 'Histogramme' :
                                        oid.graphType === 'gauge' ? 'Jauge' : 'Aucun' }}
                            </span>
                                                            <span v-if="oid.alert?.enabled" class="ml-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                                Alerte
                            </span>
                                                        </td>
                                                        <td class="px-4 py-2 whitespace-nowrap text-xs">
                            <span v-if="devicePollingResults[device._id] && devicePollingResults[device._id][oid.oid]">
                                {{ devicePollingResults[device._id][oid.oid].value }}
                            </span>
                                                            <span v-else class="text-gray-400">Non disponible</span>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <!-- Device Info -->
                                            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div class="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                                                    <h6 class="text-xs font-medium text-gray-500 uppercase mb-2">Informations</h6>
                                                    <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                        <dt class="text-gray-500">IP</dt>
                                                        <dd class="text-gray-900">{{ device.ipAddress }}</dd>

                                                        <dt class="text-gray-500">Communauté SNMP</dt>
                                                        <dd class="text-gray-900">{{ device.snmpCommunity }}</dd>

                                                        <dt class="text-gray-500">Version SNMP</dt>
                                                        <dd class="text-gray-900">{{ device.snmpVersion }}</dd>

                                                        <dt class="text-gray-500">Statut</dt>
                                                        <dd>
                        <span
                              :class="device.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                              class="px-2 py-0.5 rounded-full text-xs"
                        >
                            {{ device.status === 'active' ? 'Actif' : 'Inactif' }}
                        </span>
                                                        </dd>
                                                    </dl>
                                                </div>

                                                <div class="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                                                    <h6 class="text-xs font-medium text-gray-500 uppercase mb-2">Monitoring</h6>
                                                    <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                        <dt class="text-gray-500">Intervalle</dt>
                                                        <dd class="text-gray-900">{{ device.monitoringInterval || 5 }} minutes</dd>

                                                        <dt class="text-gray-500">Dernière vérification</dt>
                                                        <dd class="text-gray-900">{{ device.lastMonitored ? formatDate(device.lastMonitored) : 'Jamais' }}</dd>

                                                        <dt class="text-gray-500">Dernier ping</dt>
                                                        <dd>
                        <span v-if="device.lastPingStatus">
                            <span
                                  :class="device.lastPingStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                                  class="px-2 py-0.5 rounded-full text-xs"
                            >
                                {{ device.lastPingStatus.success ? 'OK' : 'Échec' }}
                            </span>
                            <span v-if="device.lastPingStatus.responseTime" class="ml-1 text-gray-900">
                                {{ device.lastPingStatus.responseTime.toFixed(1) }} ms
                            </span>
                        </span>
                                                            <span v-else class="text-gray-500">Non testé</span>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>

                                            <!-- Buttons -->
                                            <div class="flex justify-end space-x-3 mt-4">
                                                <button
                                                      @click="pingDeviceFromDetails(device._id)"
                                                      class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    Ping
                                                </button>
                                                <button
                                                      @click="monitorDeviceFromDetails(device._id)"
                                                      class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    Actualiser
                                                </button>
                                                <button
                                                      @click="selectedDeviceId = null"
                                                      class="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                                                >
                                                    Fermer
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Monitor Tab -->
                                        <div v-if="activeDeviceTab === 'monitor'" class="bg-white">
                                            <DeviceMonitor
                                                  :device="device"
                                                  @update:device="updateDeviceFromMonitor"
                                                  @edit-device="editDevice(device._id)"
                                            />
                                        </div>
                                    </div>

                                    <!-- Device Edit Form (hidden by default) -->
                                    <div v-if="device._id === editingDeviceId" class="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                        <h5 class="font-medium mb-4">Modifier l'appareil</h5>

                                        <form @submit.prevent="updateDevice(device._id)" class="space-y-4">
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700">Nom</label>
                                                    <input
                                                          v-model="editDeviceForm.name"
                                                          type="text"
                                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                          required
                                                    />
                                                </div>
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700">Adresse IP</label>
                                                    <input
                                                          v-model="editDeviceForm.ipAddress"
                                                          type="text"
                                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                          required
                                                    />
                                                </div>
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700">Communauté SNMP</label>
                                                    <input
                                                          v-model="editDeviceForm.snmpCommunity"
                                                          type="text"
                                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700">Version SNMP</label>
                                                    <select
                                                          v-model="editDeviceForm.snmpVersion"
                                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    >
                                                        <option value="1">1</option>
                                                        <option value="2c">2c</option>
                                                        <option value="3">3</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700">Status</label>
                                                    <select
                                                          v-model="editDeviceForm.status"
                                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    >
                                                        <option value="active">Actif</option>
                                                        <option value="inactive">Inactif</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700">Intervalle de monitoring (minutes)</label>
                                                    <input
                                                          v-model.number="editDeviceForm.monitoringInterval"
                                                          type="number"
                                                          min="1"
                                                          max="1440"
                                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Description</label>
                                                <textarea
                                                      v-model="editDeviceForm.description"
                                                      rows="2"
                                                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                ></textarea>
                                            </div>

                                            <!-- Edit OIDs Section -->
                                            <div>
                                                <div class="flex justify-between items-center mb-2">
                                                    <label class="block text-sm font-medium text-gray-700">OIDs à surveiller</label>
                                                    <button
                                                          type="button"
                                                          @click="addEditOid"
                                                          class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                                    >
                                                        Ajouter un OID
                                                    </button>
                                                </div>

                                                <!-- OID Template Picker for Edit Form -->
                                                <div class="mt-2 mb-3">
                                                    <div class="flex flex-wrap gap-2">
                                                        <button
                                                              type="button"
                                                              @click="applyEditDeviceTemplate('system')"
                                                              class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                                        >
                                                            Système
                                                        </button>
                                                        <button
                                                              type="button"
                                                              @click="applyEditDeviceTemplate('router')"
                                                              class="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
                                                        >
                                                            Router
                                                        </button>
                                                        <button
                                                              type="button"
                                                              @click="applyEditDeviceTemplate('switch')"
                                                              class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                                                        >
                                                            Switch
                                                        </button>
                                                        <button
                                                              type="button"
                                                              @click="applyEditDeviceTemplate('host')"
                                                              class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                                                        >
                                                            Host
                                                        </button>
                                                    </div>
                                                </div>

                                                <!-- OID Form Components -->
                                                <OidConfigForm
                                                      v-for="(oid, index) in editDeviceForm.oids"
                                                      :key="index"
                                                      :value="oid"
                                                      :device-ip="editDeviceForm.ipAddress"
                                                      :device-community="editDeviceForm.snmpCommunity"
                                                      :device-version="editDeviceForm.snmpVersion"
                                                      @update:value="updateEditOid(index, $event)"
                                                      @remove="removeEditOid(index)"
                                                />

                                                <div v-if="editDeviceForm.oids.length === 0" class="text-center py-4 text-gray-500 bg-white rounded-md border border-gray-200">
                                                    <p class="text-sm">Aucun OID configuré. Utilisez un template ou ajoutez manuellement des OIDs.</p>
                                                </div>
                                            </div>

                                            <div class="flex justify-end space-x-3">
                                                <button
                                                      type="button"
                                                      @click="editingDeviceId = null"
                                                      class="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                      type="submit"
                                                      class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                                      :disabled="isSubmittingEdit"
                                                >
                                                    <span v-if="isSubmittingEdit">Mise à jour...</span>
                                                    <span v-else>Mettre à jour</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div v-if="isAdmin && activeTab === 'users'" class="bg-white rounded-lg shadow p-6">
                        <h2 class="text-xl font-semibold mb-4">Gestion des utilisateurs</h2>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Utilisateur
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rôle
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="user in usersList" :key="user._id">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ user._id }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                            :class="user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
                        {{ user.role }}
                      </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                              class="text-indigo-600 hover:text-indigo-900 mr-2"
                                              @click="toggleUserRole(user._id, user.role === 'admin' ? 'user' : 'admin')"
                                        >
                                            {{ user.role === 'admin' ? 'Rétrograder' : 'Promouvoir admin' }}
                                        </button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div v-if="isAdmin && activeTab === 'logs'" class="bg-white rounded-lg shadow p-6">
                        <h2 class="text-xl font-semibold mb-4">Journaux système</h2>
                        <p class="text-gray-600">Accès aux journaux système pour le débogage.</p>
                        <!-- Placeholder for logs UI -->
                        <div class="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded mt-4">
                            Cette fonctionnalité est en cours de développement.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SNMP Query Modal -->
        <SNMPQueryViewer
              :show="showSnmpQueryModal"
              :device="selectedQueryDevice"
              @close="showSnmpQueryModal = false"
              @update-device="handleDeviceUpdate"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/utils/auth';
import { onClickOutside } from '@vueuse/core';
import SNMPQueryViewer from '~/components/SNMPQueryViewer.vue';
import DeviceMonitor from '~/components/DeviceMonitor.vue';
import OidConfigForm from '~/components/OidConfigForm.vue';
import { getOidTemplateByType } from '~/utils/snmp';

const activeDeviceTab = ref('details');
const showPingResults = ref(false);
const pingResults = ref(null);

// Auth & routing
const router = useRouter();
const { user, isAdmin, logout, initAuth, setupTokenRefresh, getSessionTimeRemaining } = useAuth();

// UI State
const activeTab = ref('dashboard');
const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);
const sessionTime = ref(null);
const sessionRefreshInterval = ref(null);

// Tickets
const tickets = ref([]);
const ticketTitle = ref('');
const ticketDescription = ref('');
const showNewTicketForm = ref(false);
const isSubmittingTicket = ref(false);
const ticketFilter = ref('all');
const ticketSearch = ref('');

// Users (admin only)
const usersList = ref([]);
const usersCount = ref(0);
const adminCount = ref(0);

// Activity data
const recentActivity = ref([]);

// Device management state
const devicesList = ref([]);
const deviceFilter = ref('all');
const deviceSearch = ref('');
const showNewDeviceForm = ref(false);
const isSubmittingDevice = ref(false);
const selectedDeviceId = ref(null);
const editingDeviceId = ref(null);
const devicePollingResults = ref({});
const isSubmittingEdit = ref(false);
const showSnmpQueryModal = ref(false);
const selectedQueryDevice = ref(null);

// Device form for creating a new device
const deviceForm = ref({
    name: '',
    ipAddress: '',
    snmpCommunity: 'public',
    snmpVersion: '2c',
    description: '',
    oids: []
});

// Device form for editing an existing device
const editDeviceForm = ref({
    name: '',
    ipAddress: '',
    snmpCommunity: 'public',
    snmpVersion: '2c',
    status: 'active',
    description: '',
    monitoringInterval: 5, // Default to 5 minutes
    oids: []
});

// Detect clicks outside user menu to close it (client-side only)
if (process.client) {
    onClickOutside(userMenuRef, () => {
        isUserMenuOpen.value = false;
    });
}

// Toggle user menu
const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};

// Format date for display
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Get color for activity type
const activityTypeColor = (type) => {
    const colors = {
        'ticket_created': 'bg-blue-500',
        'ticket_closed': 'bg-green-500',
        'ticket_reopened': 'bg-yellow-500',
        'user_login': 'bg-purple-500',
        'device_created': 'bg-indigo-500',
        'device_updated': 'bg-cyan-500',
        'device_deleted': 'bg-red-500',
        'device_polled': 'bg-teal-500',
        'default': 'bg-gray-500'
    };
    return colors[type] || colors.default;
};

// Fetch tickets based on user role (SSR compatible)
const fetchTickets = async () => {
    if (process.server) return;

    try {
        // Skip if not authenticated yet
        if (!user.value) return;

        // Endpoint depends on user role
        const endpoint = isAdmin.value ? '/api/tickets/all' : '/api/tickets';

        const response = await $fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        tickets.value = response.tickets || [];
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
};

// Fetch users (admin only)
const fetchUsers = async () => {
    if (process.server) return;
    if (!isAdmin.value) return;

    try {
        const response = await $fetch('/api/users', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        usersList.value = response.users || [];
        usersCount.value = usersList.value.length;
        adminCount.value = usersList.value.filter(u => u.role === 'admin').length;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

// Fetch devices from API
const fetchDevices = async () => {
    if (process.server) return;
    try {
        const response = await $fetch('/api/devices', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        devicesList.value = response.devices || [];
    } catch (error) {
        console.error('Error fetching devices:', error);
    }
};

// Get username from ID (for admin view)
const getUsername = (userId) => {
    if (!userId) return 'Inconnu';

    if (typeof userId === 'object' && userId.username) {
        return userId.username;
    }

    const foundUser = usersList.value.find(u => u._id === userId);
    return foundUser ? foundUser.username : 'Utilisateur #' + userId;
};

// Create a new ticket
const createTicket = async () => {
    if (!ticketTitle.value || !ticketDescription.value) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    try {
        isSubmittingTicket.value = true;

        await $fetch('/api/tickets', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: {
                title: ticketTitle.value,
                description: ticketDescription.value
            }
        });

        // Reset form and refresh tickets
        ticketTitle.value = '';
        ticketDescription.value = '';
        showNewTicketForm.value = false;
        await fetchTickets();

        // Add to recent activity
        recentActivity.value.unshift({
            type: 'ticket_created',
            message: `Nouveau ticket créé: "${ticketTitle.value}"`,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error creating ticket:', error);
        alert('Erreur lors de la création du ticket');
    } finally {
        isSubmittingTicket.value = false;
    }
};

// Update ticket status
const updateTicketStatus = async (ticketId, newStatus) => {
    try {
        await $fetch(`/api/tickets/${ticketId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: {
                status: newStatus
            }
        });

        // Refresh tickets
        await fetchTickets();

        // Add to recent activity
        const actionType = newStatus === 'closed' ? 'ticket_closed' : 'ticket_reopened';
        const actionMessage = newStatus === 'closed'
              ? `Ticket #${ticketId.substring(0, 6)} marqué comme résolu`
              : `Ticket #${ticketId.substring(0, 6)} réouvert`;

        recentActivity.value.unshift({
            type: actionType,
            message: actionMessage,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error updating ticket:', error);
        alert('Erreur lors de la mise à jour du ticket');
    }
};

// Toggle user role (admin only)
const toggleUserRole = async (userId, newRole) => {
    if (!isAdmin.value) return;

    try {
        await $fetch(`/api/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: {
                role: newRole
            }
        });

        // Refresh users
        await fetchUsers();

        // Add to recent activity
        recentActivity.value.unshift({
            type: 'user_role_changed',
            message: `Utilisateur #${userId.substring(0, 6)} ${newRole === 'admin' ? 'promu administrateur' : 'rétrogradé utilisateur'}`,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error updating user role:', error);
        alert('Erreur lors de la mise à jour du rôle utilisateur');
    }
};

// Confirm before closing ticket (for regular users)
const confirmCloseTicket = (ticketId) => {
    if (confirm('Êtes-vous sûr de vouloir marquer ce ticket comme résolu ?')) {
        updateTicketStatus(ticketId, 'closed');
    }
};

// Device management functions

// Add a new OID to the form
const addOid = () => {
    deviceForm.value.oids.push({
        oid: '',
        name: '',
        description: '',
        testResult: null
    });
};

// Remove an OID from the form
const removeOid = (index) => {
    deviceForm.value.oids.splice(index, 1);
};

// Test an OID against the specified device
const testOid = async (index) => {
    const oid = deviceForm.value.oids[index];
    if (!oid.oid || !deviceForm.value.ipAddress) {
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
                ipAddress: deviceForm.value.ipAddress,
                community: deviceForm.value.snmpCommunity,
                version: deviceForm.value.snmpVersion,
                oids: [oid.oid]
            }
        });

        if (response.success && response.results && response.results.length > 0) {
            const result = response.results[0];
            if (result.error) {
                deviceForm.value.oids[index].testResult = { error: result.error };
            } else {
                deviceForm.value.oids[index].testResult = { value: result.value };
            }
        }
    } catch (error) {
        console.error('Error testing OID:', error);
        deviceForm.value.oids[index].testResult = { error: error.message || 'Failed to test OID' };
    }
};

// Create a new device
// Updated createDevice function with enhanced fields
const createDevice = async () => {
    if (!deviceForm.value.name || !deviceForm.value.ipAddress) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    try {
        isSubmittingDevice.value = true;

        // Clean up testResult from oids and prepare OIDs with alerts
        const oids = deviceForm.value.oids.map(({ oid, name, description, graphType, alert }) => ({
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
                name: deviceForm.value.name,
                ipAddress: deviceForm.value.ipAddress,
                snmpCommunity: deviceForm.value.snmpCommunity,
                snmpVersion: deviceForm.value.snmpVersion,
                description: deviceForm.value.description,
                monitoringInterval: deviceForm.value.monitoringInterval || 5,
                oids
            }
        });

        // Reset form and refresh devices
        deviceForm.value = {
            name: '',
            ipAddress: '',
            snmpCommunity: 'public',
            snmpVersion: '2c',
            description: '',
            monitoringInterval: 5,
            oids: []
        };
        showNewDeviceForm.value = false;
        await fetchDevices();

        // Add to recent activity
        recentActivity.value.unshift({
            type: 'device_created',
            message: `Nouvel appareil créé: "${deviceForm.value.name}"`,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error creating device:', error);
        alert('Erreur lors de la création de l\'appareil');
    } finally {
        isSubmittingDevice.value = false;
    }
};

const pingDeviceFromDetails = async (deviceId) => {
    const device = devicesList.value.find(d => d._id === deviceId);
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
        pingResults.value = response;
        showPingResults.value = true;

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
        const index = devicesList.value.findIndex(d => d._id === deviceId);
        if (index !== -1) {
            devicesList.value[index] = updatedDevice;
        }

        // Update device in API
        await $fetch(`/api/devices/${deviceId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: {
                lastPingStatus: updatedDevice.lastPingStatus,
                status: updatedDevice.status
            }
        });

    } catch (error) {
        console.error('Error pinging device:', error);
        alert('Erreur lors du ping de l\'appareil');
    }
};

const monitorDeviceFromDetails = async (deviceId) => {
    const device = devicesList.value.find(d => d._id === deviceId);
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

            devicePollingResults.value = {
                ...devicePollingResults.value,
                [deviceId]: results
            };

            // Update device with last monitored timestamp
            const updatedDevice = {
                ...device,
                lastMonitored: response.timestamp,
                status: 'active' // Set status to active if monitoring succeeds
            };

            // Update device in the list
            const index = devicesList.value.findIndex(d => d._id === deviceId);
            if (index !== -1) {
                devicesList.value[index] = updatedDevice;
            }

            // Update device in API
            await $fetch(`/api/devices/${deviceId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: {
                    lastMonitored: response.timestamp,
                    status: 'active'
                }
            });

            // Show success message
            alert('Données actualisées avec succès');
        }
    } catch (error) {
        console.error('Error monitoring device:', error);
        alert('Erreur lors de l\'actualisation des données');
    }
};

const updateDeviceFromMonitor = (updatedDevice) => {
    // Find and update the device in the list
    const index = devicesList.value.findIndex(d => d._id === updatedDevice._id);
    if (index !== -1) {
        devicesList.value[index] = updatedDevice;
    }
};

// View device details
const viewDeviceDetails = (deviceId) => {
    if (selectedDeviceId.value === deviceId) {
        selectedDeviceId.value = null; // Toggle off if already selected
    } else {
        selectedDeviceId.value = deviceId;
        editingDeviceId.value = null; // Close edit form if open
    }
};

// Open the SNMP query modal for a device
const openSnmpQueryModal = (deviceId) => {
    const device = devicesList.value.find(d => d._id === deviceId);
    if (!device) return;

    selectedQueryDevice.value = device;
    showSnmpQueryModal.value = true;
};

// Handle device update from SNMP query modal
const handleDeviceUpdate = async (updatedDevice) => {
    try {
        await $fetch(`/api/devices/${updatedDevice._id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: {
                oids: updatedDevice.oids
            }
        });

        // Refresh devices
        await fetchDevices();

        // Add to recent activity
        recentActivity.value.unshift({
            type: 'device_updated',
            message: `OIDs de l'appareil "${updatedDevice.name}" mis à jour`,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error updating device:', error);
        alert('Erreur lors de la mise à jour des OIDs');
    }
};

// Edit a device
const editDevice = (deviceId) => {
    const device = devicesList.value.find(d => d._id === deviceId);
    if (!device) return;

    // Initialize edit form with enhanced device data
    editDeviceForm.value = {
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

    editingDeviceId.value = deviceId;
    selectedDeviceId.value = null; // Close details if open
    activeDeviceTab.value = 'details'; // Reset tab for next view
};

const updateEditOid = (index, updatedOid) => {
    editDeviceForm.value.oids[index] = updatedOid;
};

const pollDevice = (deviceId) => {
    selectedDeviceId.value = deviceId;
    activeDeviceTab.value = 'monitor';
};
// Add a new OID to the edit form
const addEditOid = () => {
    editDeviceForm.value.oids.push({
        oid: '',
        name: '',
        description: ''
    });
};

// Remove an OID from the edit form
const removeEditOid = (index) => {
    editDeviceForm.value.oids.splice(index, 1);
};

// Update a device
const updateDevice = async (deviceId) => {
    try {
        isSubmittingEdit.value = true;

        await $fetch(`/api/devices/${deviceId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: editDeviceForm.value
        });

        // Reset and refresh
        editingDeviceId.value = null;
        await fetchDevices();

        // Add to recent activity
        recentActivity.value.unshift({
            type: 'device_updated',
            message: `Appareil "${editDeviceForm.value.name}" mis à jour`,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error updating device:', error);
        alert('Erreur lors de la mise à jour de l\'appareil');
    } finally {
        isSubmittingEdit.value = false;
    }
};

// Confirm and delete a device
const confirmDeleteDevice = async (deviceId) => {
    const device = devicesList.value.find(d => d._id === deviceId);
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
        if (selectedDeviceId.value === deviceId) selectedDeviceId.value = null;
        if (editingDeviceId.value === deviceId) editingDeviceId.value = null;

        // Refresh devices
        await fetchDevices();

        // Add to recent activity
        recentActivity.value.unshift({
            type: 'device_deleted',
            message: `Appareil "${device.name}" supprimé`,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error deleting device:', error);
        alert('Erreur lors de la suppression de l\'appareil');
    }
};

// Apply OID templates
const applyDeviceTemplate = (templateType) => {
    // Get the appropriate template
    const templateOids = getOidTemplateByType(templateType);

    // If already have some OIDs, confirm before replacing
    if (deviceForm.value.oids.length > 0) {
        if (!confirm('Cela remplacera les OIDs existants. Continuer?')) {
            return;
        }
    }

    // Apply the template
    deviceForm.value.oids = JSON.parse(JSON.stringify(templateOids));
};

// Add a similar function for the edit form
const applyEditDeviceTemplate = (templateType) => {
    // Get the appropriate template
    const templateOids = getOidTemplateByType(templateType);

    // If already have some OIDs, confirm before replacing
    if (editDeviceForm.value.oids.length > 0) {
        if (!confirm('Cela remplacera les OIDs existants. Continuer?')) {
            return;
        }
    }

    // Apply the template
    editDeviceForm.value.oids = JSON.parse(JSON.stringify(templateOids));
};

// Computed properties

// Tickets
const openTicketsCount = computed(() =>
      tickets.value.filter(t => t.status === 'open').length
);

const closedTicketsCount = computed(() =>
      tickets.value.filter(t => t.status === 'closed').length
);

const pendingTicketsCount = computed(() =>
      tickets.value.filter(t => t.status === 'open' && t.createdBy === user.value?.id).length
);

const filteredTickets = computed(() => {
    let result = [...tickets.value];

    // Filter by status
    if (ticketFilter.value !== 'all') {
        result = result.filter(ticket => ticket.status === ticketFilter.value);
    }

    // Filter by search (admin only)
    if (isAdmin.value && ticketSearch.value) {
        const searchLower = ticketSearch.value.toLowerCase();
        result = result.filter(ticket =>
              ticket.title.toLowerCase().includes(searchLower) ||
              ticket.description.toLowerCase().includes(searchLower)
        );
    }

    // Sort by created date, newest first
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

// Devices
const filteredDevices = computed(() => {
    let result = [...devicesList.value];

    // Filter by status
    if (deviceFilter.value !== 'all') {
        result = result.filter(device => device.status === deviceFilter.value);
    }

    // Filter by search
    if (deviceSearch.value) {
        const searchLower = deviceSearch.value.toLowerCase();
        result = result.filter(device =>
              device.name.toLowerCase().includes(searchLower) ||
              device.description?.toLowerCase().includes(searchLower) ||
              device.ipAddress.includes(searchLower)
        );
    }

    // Sort by created date, newest first
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

// Update session time display
const updateSessionTime = () => {
    if (process.server) return;
    sessionTime.value = getSessionTimeRemaining();
};

// Lifecycle hooks
onMounted(async () => {
    if (process.server) return;

    const isAuthed = await initAuth();
    if (!isAuthed) {
        router.push('/login');
        return;
    }

    // Set up token refresh
    setupTokenRefresh();

    // Load data
    await fetchTickets();

    if (isAdmin.value) {
        await fetchUsers();
        if (activeTab.value === 'devices') {
            await fetchDevices();
        }
    }

    // Update session time every minute
    updateSessionTime();
    sessionRefreshInterval.value = setInterval(updateSessionTime, 60000);

    // Setup demo activity data
    recentActivity.value = [
        {
            type: 'ticket_created',
            message: 'Nouveau ticket créé: "Problème de connexion réseau"',
            timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
        },
        {
            type: 'ticket_closed',
            message: 'Ticket #a12b3c marqué comme résolu',
            timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
        },
        {
            type: 'user_login',
            message: 'Connexion à l\'application',
            timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
        }
    ];
});

onUnmounted(() => {
    // Clear interval when component is destroyed
    if (process.client && sessionRefreshInterval.value) {
        clearInterval(sessionRefreshInterval.value);
    }
});

// Watch for tab changes to load data
watch(activeTab, async (newTab) => {
    if (process.server) return;
    if (newTab === 'users' && isAdmin.value) {
        await fetchUsers();
    }
    if (newTab === 'devices' && isAdmin.value) {
        await fetchDevices();
    }
});

// Define page metadata
definePageMeta({
    middleware: ['auth']
});
</script>