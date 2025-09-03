<template>
  <ul class="todo-list">
    <li v-for="todo in items" :key="todo.id" class="todo-item">
      <a-checkbox :checked="todo.done" @change="$emit('toggle', todo.id)" />
      <span :class="['todo-text', { 'todo-text--done': todo.done }]">
        {{ todo.text }}
      </span>
      <div class="todo-actions">
        <a-button size="small" @click="$emit('edit', todo.id)">Edit</a-button>
        <a-button size="small" type="danger" ghost @click="$emit('remove', todo.id)">Delete</a-button>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TodoList',
  props: {
    items: { type: Array, default: () => [] }
  }
}
</script>

<style scoped>
.todo-list {
  list-style: none;
  padding: 0;
  margin-top: 16px;
}
.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 10px 0;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 10px;
}
.todo-text { flex: 1; }
.todo-text--done { text-decoration: line-through; color: #999; }
.todo-actions { display: flex; gap: 8px; margin-left: auto; }
</style>
