<template>
  <div>
    <a-input-search v-model="text" enter-button="Thêm" @search="handleAdd" placeholder="Nhập việc cần làm"
      class="todo-input" />
  </div>
</template>

<script>
import { message } from 'ant-design-vue'

export default {
  data() {
    return {
      text: ''
    }
  },
  methods: {
    handleAdd() {
      const newText = (this.text || '').trim()
      const bannedWords = ['fuck']

      if (!newText) {
        message.warning('Nhập nội dung trước khi thêm!')
        return
      }

      const containsBannedWord = bannedWords.some(word =>
        newText.toLowerCase().includes(word)
      )

      if (containsBannedWord) {
        message.error('Nội dung chứa từ không phù hợp!')
        return
      }

      const isDuplicate = this.$store.state.todos.list.some(
        item => item.text === newText && item.id !== this.editId
      )
      if (isDuplicate) {
        message.error('Công việc đã tồn tại!')
        return
      }
      this.$emit('add', newText)
      this.text = ''
      message.success('Đã thêm')
    }

  }
}
</script>
