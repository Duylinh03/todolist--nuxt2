<template>
  <div class="todo-app">
    <div class="todo-container">
      <todos-input @add="addTodo" />
      <todos-list :todos="todoList" @remove="removeTodo" @update="updateTodo" />
    </div>
  </div>
</template>

<script>
import TodosInput from '../components/todos/TodoInput.vue'
import TodosList from '../components/todos/TodoList.vue'

export default {
  components: {
    TodosInput,
    TodosList
  },
  computed: {
    todoList() {
      return this.$store.state.todos.list
    }
  },
  methods: {
    addTodo(text) {
      this.$store.commit('todos/add', text)
    },
    removeTodo(index) {
      this.$store.commit('todos/remove', index)
    },
    updateTodo(payload) {
      this.$store.commit('todos/update', payload)
    }
  }
}
</script>

<style scoped>
.todo-app {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.todo-container {
  width: 100%;
  max-width: 600px;
  padding: 20px;
  background-color: #eff7f3;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #ffffff;
}
</style>
