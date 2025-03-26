<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center p-10">
      <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div 
      v-else-if="filteredTodos.length === 0" 
      class="flex flex-col items-center justify-center p-8 space-y-3 bg-gray-50 rounded-xl text-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="text-lg font-medium text-gray-600">Aucune tâche trouvée</h3>
      <p class="text-sm text-gray-500">Créez votre première tâche en cliquant sur le bouton "Nouvelle tâche"</p>
    </div>
    
    <TransitionGroup v-else name="todo-list" tag="div" class="space-y-3">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo._id"
        :todo="todo"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import TodoItem from './TodoItem.vue';

const props = defineProps({
  todos: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  filter: {
    type: String,
    default: 'all'
  }
});

defineEmits(['view', 'edit', 'delete']);

const filteredTodos = computed(() => {
  if (props.filter === 'all') {
    return props.todos;
  }
  return props.todos.filter(todo => todo.status === props.filter);
});
</script>

<style scoped>
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from,
.todo-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
