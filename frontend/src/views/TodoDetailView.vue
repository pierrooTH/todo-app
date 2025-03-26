<template>
    <main class="flex-1 p-6 max-w-4xl mx-auto w-full">
      <div class="mb-6">
        <button @click="$router.back()" class="inline-flex items-center text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>
      </div>
  
      <div v-if="loading" class="flex justify-center p-10">
        <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
  
      <div v-else-if="error" class="bg-red-50 p-6 rounded-xl">
        <h2 class="text-xl font-semibold text-red-700 mb-2">Erreur</h2>
        <p class="text-red-600">{{ error }}</p>
        <button @click="fetchTodo" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Réessayer
        </button>
      </div>
  
      <div v-else-if="todo" class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b" :class="statusClasses">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">{{ todo.title }}</h1>
            <div class="px-3 py-1 rounded-full text-sm font-medium" :class="statusBadgeClasses">
              {{ todo.status }}
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div v-if="todo.description" class="mb-8">
            <h2 class="text-lg font-medium text-gray-900 mb-2">Description</h2>
            <p class="text-gray-600 whitespace-pre-line">{{ todo.description }}</p>
          </div>
          <div v-else class="mb-8 text-gray-500 italic">
            Aucune description
          </div>
          
          <div class="flex space-x-3">
            <router-link :to="`/edit/${todo._id}`" class="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700">
              Modifier
            </router-link>
            
            <button @click="updateStatus" class="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50" :disabled="updateLoading">
              {{ updateLoading ? 'Mise à jour...' : nextStatusText }}
            </button>
            
            <button @click="showDeleteModal = true" class="flex-1 sm:flex-none px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50">
              Supprimer
            </button>
          </div>
        </div>
      </div>
  
      <Teleport to="body">
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 class="text-lg font-bold text-gray-900 mb-3">Confirmer la suppression</h3>
            <p class="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.</p>
            <div class="flex space-x-3">
              <button @click="deleteTodo" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" :disabled="deleteLoading">
                {{ deleteLoading ? 'Suppression...' : 'Supprimer' }}
              </button>
              <button @click="showDeleteModal = false" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </main>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { TodoService } from '../services/todo.service';
  import { TodoStatus } from '../models/todo-status.enum';
  import type { Todo } from '../models/todo.model';
  
  const route = useRoute();
  const router = useRouter();
  const todo = ref<Todo | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const updateLoading = ref(false);
  const showDeleteModal = ref(false);
  const deleteLoading = ref(false);
  
  // Classes CSS calculées pour le statut
  const statusClasses = computed(() => {
    if (!todo.value) return '';
    return {
      'border-blue-200 bg-blue-50': todo.value.status === TodoStatus.TODO,
      'border-amber-200 bg-amber-50': todo.value.status === TodoStatus.IN_PROGRESS,
      'border-green-200 bg-green-50': todo.value.status === TodoStatus.DONE
    };
  });
  
  const statusBadgeClasses = computed(() => {
    if (!todo.value) return '';
    return {
      'bg-blue-100 text-blue-800': todo.value.status === TodoStatus.TODO,
      'bg-amber-100 text-amber-800': todo.value.status === TodoStatus.IN_PROGRESS,
      'bg-green-100 text-green-800': todo.value.status === TodoStatus.DONE
    };
  });
  
  // Texte du bouton selon le statut actuel
  const nextStatusText = computed(() => {
    if (!todo.value) return 'Changer le statut';
    switch (todo.value.status) {
      case TodoStatus.TODO: return 'Marquer en cours';
      case TodoStatus.IN_PROGRESS: return 'Marquer terminée';
      case TodoStatus.DONE: return 'Marquer à faire';
      default: return 'Changer le statut';
    }
  });
  
  // Obtenir le prochain statut dans le cycle
  const getNextStatus = (): TodoStatus => {
    if (!todo.value) return TodoStatus.TODO;
    switch (todo.value.status) {
      case TodoStatus.TODO: return TodoStatus.IN_PROGRESS;
      case TodoStatus.IN_PROGRESS: return TodoStatus.DONE;
      case TodoStatus.DONE: return TodoStatus.TODO;
      default: return TodoStatus.TODO;
    }
  };
  
  const fetchTodo = async () => {
    const id = route.params.id as string;
    loading.value = true;
    error.value = null;
    
    try {
      todo.value = await TodoService.getTodoById(id);
    } catch (err) {
      error.value = "Impossible de charger cette tâche. Elle n'existe peut-être plus.";
      console.error('Erreur lors du chargement de la tâche:', err);
    } finally {
      loading.value = false;
    }
  };
  
  const updateStatus = async () => {
    if (!todo.value || !todo.value._id) return;
    
    updateLoading.value = true;
    try {
      todo.value = await TodoService.updateTodo(todo.value._id, {
        status: getNextStatus()
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
    } finally {
      updateLoading.value = false;
    }
  };
  
  const deleteTodo = async () => {
    if (!todo.value || !todo.value._id) return;
    
    deleteLoading.value = true;
    try {
      await TodoService.deleteTodo(todo.value._id);
      router.push('/');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    } finally {
      deleteLoading.value = false;
      showDeleteModal.value = false;
    }
  };
  
  onMounted(fetchTodo);
  </script>