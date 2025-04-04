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

                    <!-- Admin-Only Tabs -->
                    <div v-if="isAdmin && activeTab === 'devices'" class="bg-white rounded-lg shadow p-6">
                        <h2 class="text-xl font-semibold mb-4">Gestion des appareils</h2>
                        <p class="text-gray-600">Interface de gestion des périphériques réseau.</p>
                        <!-- Placeholder for devices management UI -->
                        <div class="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded mt-4">
                            Cette fonctionnalité est en cours de développement.
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
    </div>
</template>

<!-- The following snippet should replace the script section in dashboard.vue -->
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/utils/auth';
import { onClickOutside } from '@vueuse/core'

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

// Computed properties
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
});

// Define page metadata
definePageMeta({
    middleware: ['auth']
});
</script>