<template>
    <main class="container mx-auto p-4 max-w-lg">
      <button @click="$router.back()" class="flex items-center text-gray-600 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour
      </button>
  
      <div class="bg-white rounded-lg shadow p-4">
        <h1 class="text-xl font-bold mb-4">
          {{ isEditing ? 'Modifier la tâche' : 'Créer une nouvelle tâche' }}
        </h1>
        
        <div v-if="loading" class="flex justify-center py-6">
          <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <div v-else-if="error" class="bg-red-50 p-4 rounded-lg mb-4">
          <p class="text-red-600">{{ error }}</p>
          <button v-if="isEditing" @click="fetchTodo" class="mt-2 px-3 py-1 bg-red-600 text-white rounded">
            Réessayer
          </button>
        </div>
        
        <TodoForm 
          v-else
          :todo="todo" 
          :loading="saving"
          @submit="saveTodo"
          @cancel="$router.push('/')"
        />
      </div>
    </main>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import TodoForm from '../components/TodoForm.vue';
  import { TodoService } from '../services/todo.service';
  
  const route = useRoute();
  const router = useRouter();
  const todo = ref(null);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);
  
  const isEditing = computed(() => !!route.params.id);
  
  const fetchTodo = async () => {
    if (!isEditing.value) return;
    
    const id = route.params.id;
    loading.value = true;
    error.value = null;
    
    try {
      todo.value = await TodoService.getTodoById(id);
    } catch (err) {
      error.value = "Impossible de charger cette tâche. Elle n'existe peut-être plus.";
      console.error('Erreur:', err);
    } finally {
      loading.value = false;
    }
  };
  
  const saveTodo = async (formData) => {
    saving.value = true;
    error.value = null;
    
    try {
      if (isEditing.value && formData._id) {
        const { _id, ...updateData } = formData;
        await TodoService.updateTodo(_id, updateData);
      } else {
        await TodoService.createTodo(formData);
      }
      router.push('/');
    } catch (err) {
      error.value = "Une erreur est survenue lors de l'enregistrement.";
      console.error('Erreur:', err);
    } finally {
      saving.value = false;
    }
  };
  
  onMounted(() => {
    if (isEditing.value) {
      fetchTodo();
    }
  });
  </script>