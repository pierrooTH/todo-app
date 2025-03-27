<template>
  <main class="flex-1 p-6 max-w-4xl mx-auto w-full">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Mes tâches</h1>
      <router-link 
        to="/create" 
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouvelle tâche
      </router-link>
    </div>

    <div class="mb-6">
      <TodoFilter v-model="statusFilter" />
    </div>

    <TodoList 
      :todos="reversedTodos" 
      :loading="loading"
      :filter="statusFilter"
      @view="id => router.push(`/todos/${id}`)"
      @edit="id => router.push(`/edit/${id}`)"
      @delete="openDeleteModal"
    />

    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
          <h3 class="text-lg font-bold text-gray-900 mb-3">Confirmer la suppression</h3>
          <p class="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.</p>
          <div class="flex space-x-3">
            <button 
              @click="deleteTodo" 
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              :disabled="deleteLoading"
            >
              {{ deleteLoading ? 'Suppression...' : 'Supprimer' }}
            </button>
            <button 
              @click="showDeleteModal = false" 
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import TodoList from '../components/TodoList.vue';
import TodoFilter from '../components/TodoFilter.vue';
import { TodoService } from '../services/todo.service';
import type { Todo } from '../models/todo.model';

const router = useRouter();
const todos = ref<Todo[]>([]);
const loading = ref(true);
const statusFilter = ref('all');
const showDeleteModal = ref(false);
const todoToDelete = ref<string | null>(null);
const deleteLoading = ref(false);

const reversedTodos = computed(() => [...todos.value].reverse());

const fetchTodos = async () => {
  loading.value = true;
  try {
    todos.value = await TodoService.getAllTodos();
  } catch (error) {
    console.error('Erreur lors du chargement des tâches:', error);
  } finally {
    loading.value = false;
  }
};

const openDeleteModal = (id: string) => {
  todoToDelete.value = id;
  showDeleteModal.value = true;
};

const deleteTodo = async () => {
  if (!todoToDelete.value) return;
  
  deleteLoading.value = true;
  try {
    await TodoService.deleteTodo(todoToDelete.value);
    todos.value = todos.value.filter(todo => todo._id !== todoToDelete.value);
    showDeleteModal.value = false;
    todoToDelete.value = null;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
  } finally {
    deleteLoading.value = false;
  }
};

// Les tâches sont chargées au montage du composant
onMounted(fetchTodos);
</script>