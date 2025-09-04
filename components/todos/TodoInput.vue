<template>
  <a-input-search
    v-model="text"
    enter-button="Thêm"
    @search="handleAdd"
    placeholder="Nhập việc cần làm"
    class="todo-input"
  />
</template>

<script>
export default {
  data() {
    return {
      text: ''
    }
  },
  methods: {
    handleAdd() {
      if (this.text.trim()) {
        this.$emit('add', this.text.trim())
        this.text = ''
      }
    }
  }
}
</script>


