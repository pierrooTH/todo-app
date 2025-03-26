<template>
    <div
      class="group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:shadow-lg"
      :class="statusColorClass"
    >
      <div class="flex items-center space-x-4">
        <div
          class="w-3 h-3 rounded-full"
          :class="dotColorClass"
        ></div>
        <div class="flex flex-col">
          <h3
            class="text-lg font-semibold transition-all"
            :class="{'line-through text-gray-500': todo.status === TodoStatus.DONE}"
          >
            {{ todo.title }}
          </h3>
          <p v-if="todo.description" class="text-gray-500 text-sm">{{ todo.description }}</p>
        </div>
      </div>
      <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
        <button
          @click="$emit('view', todo._id)"
          class="p-2 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <button
          @click="$emit('edit', todo._id)"
          class="p-2 rounded-full hover:bg-gray-100 text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          @click="$emit('delete', todo._id)"
          class="p-2 rounded-full hover:bg-gray-100 text-red-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { TodoStatus } from '../models/todo-status.enum';
  
  const props = defineProps({
    todo: {
      type: Object,
      required: true
    }
  });
  
  defineEmits(['view', 'edit', 'delete', 'update-status']);
  
  const statusColorClass = computed(() => {
    switch (props.todo.status) {
      case TodoStatus.TODO: return 'bg-blue-50';
      case TodoStatus.IN_PROGRESS: return 'bg-amber-50';
      case TodoStatus.DONE: return 'bg-green-50';
      default: return '';
    }
  });
  
  const dotColorClass = computed(() => {
    switch (props.todo.status) {
      case TodoStatus.TODO: return 'bg-blue-500';
      case TodoStatus.IN_PROGRESS: return 'bg-amber-500';
      case TodoStatus.DONE: return 'bg-green-500';
      default: return '';
    }
  });
  </script>