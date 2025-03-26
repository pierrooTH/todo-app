<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="space-y-1">
      <label for="title" class="text-sm font-medium text-gray-700">Titre</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        placeholder="Titre de la tâche"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        :class="{ 'border-red-300': errors.title }"
      />
      <p v-if="errors.title" class="text-sm text-red-600">{{ errors.title }}</p>
    </div>

    <div class="space-y-1">
      <label for="description" class="text-sm font-medium text-gray-700">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        placeholder="Description de la tâche (optionnel)"
        rows="3"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      ></textarea>
    </div>

    <div class="space-y-1">
      <label for="status" class="text-sm font-medium text-gray-700">Statut</label>
      <select
        id="status"
        v-model="form.status"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option :value="TodoStatus.TODO">À faire</option>
        <option :value="TodoStatus.IN_PROGRESS">En cours</option>
        <option :value="TodoStatus.DONE">Terminée</option>
      </select>
    </div>

    <div class="flex space-x-3">
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 px-4 py-2 text-white font-medium bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Traitement...
        </span>
        <span v-else>{{ todoId ? 'Mettre à jour' : 'Créer' }}</span>
      </button>
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Annuler
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue';
import { TodoStatus } from '../models/todo-status.enum';

const props = defineProps({
  todo: Object,
  loading: Boolean
});

const emit = defineEmits(['submit', 'cancel']);

const todoId = ref(props.todo?._id);

const form = reactive({
  title: props.todo?.title || '',
  description: props.todo?.description || '',
  status: props.todo?.status || TodoStatus.TODO
});

const errors = reactive({
  title: ''
});

watch(() => props.todo, (newTodo) => {
  if (newTodo) {
    todoId.value = newTodo._id;
    form.title = newTodo.title;
    form.description = newTodo.description || '';
    form.status = newTodo.status;
  }
});

function validateForm() {
  errors.title = '';
  
  if (!form.title.trim()) {
    errors.title = 'Le titre est requis';
    return false;
  }
  
  return true;
}

function handleSubmit() {
  if (!validateForm()) return;

  emit('submit', {
    _id: todoId.value,
    title: form.title,
    description: form.description,
    status: form.status
  });
}
</script>