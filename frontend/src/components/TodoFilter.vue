<template>
    <div class="filter-container">
      <button 
        v-for="option in options" 
        :key="option.value"
        :class="{ active: selected === option.value }"
        @click="updateFilter(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
    import { computed } from 'vue';
    import { TodoStatus } from '../models/todo-status.enum';
  
    const props = defineProps({
      modelValue: {
        type: String,
        required: true
      }
    });
    
    const emit = defineEmits(['update:modelValue']);
    
    const options = [
      { label: 'Toutes', value: 'all' },
      { label: 'À faire', value: TodoStatus.TODO },
      { label: 'En cours', value: TodoStatus.IN_PROGRESS },
      { label: 'Terminées', value: TodoStatus.DONE }
    ];
    
    const selected = computed(() => props.modelValue);
    
    function  updateFilter(value: string) {
      emit('update:modelValue', value);
    }

  </script>
  
  <style scoped>
    .filter-container {
      display: flex;
      background-color: white;
      border-radius: 0.75rem;
      padding: 0.25rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    button {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #4b5563;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    button:hover {
      background-color: #f3f4f6;
    }
    
    button.active {
      background-color: #4f46e5;
      color: white;
    }
  </style>