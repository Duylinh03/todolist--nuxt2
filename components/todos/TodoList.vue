<template>
  <a-list bordered>
    <template v-if="todos && todos.length">
      <a-list-item v-for="(item, index) in todos" :key="item.id">
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <div>{{ item.text }}</div>

          <div>
            <a-button type="link" @click="openEdit(item)">Sửa</a-button>

            <a-popconfirm title="Bạn có chắc muốn xóa mục này?" ok-text="Xóa" cancel-text="Hủy" okType="danger"
              @confirm="doDelete(item.id)">
              <a-button type="link" danger>Xóa</a-button>
            </a-popconfirm>
          </div>
        </div>
      </a-list-item>
    </template>
    <template v-else>
      <a-empty description="đã thêm đâu mà có dữ liệu" style="margin: 10px 0" />
    </template>


    <a-modal :visible="editVisible" title="Chỉnh sửa công việc" ok-text="Lưu" cancel-text="Hủy" @ok="handleEditOk"
      @cancel="handleEditCancel" :confirm-loading="saving" destroyOnClose>
      <a-input v-model="editText" ref="editInput" placeholder="Nhập nội dung mới" @pressEnter="handleEditOk" />
      <p v-if="editError" style="color:#ff4d4f; margin-top:8px">{{ editError }}</p>
    </a-modal>
  </a-list>
</template>

<script>
import { message } from 'ant-design-vue'

export default {
  props: {

    todos: { type: Array, required: true }
  },
  data() {
    return {
      editVisible: false,
      editIndex: null,
      editText: '',
      editOldText: '',
      editError: '',
      saving: false
    }
  },
  methods: {
    openEdit(item) {
      this.editIndex = item.id
      this.editText = item.text
      this.editOldText = item.text
      this.editError = ''
      this.editVisible = true

      this.$nextTick(() => {
        if (this.$refs.editInput && this.$refs.editInput.focus) {
          this.$refs.editInput.focus()
        }
      })
    },

    async handleEditOk() {
      const newText = (this.editText || '').trim()

      if (!newText) {
        this.editError = 'không được để trống.'
        return
      }
      const isDuplicate = this.$store.state.todos.list.some(
        item => item.text === newText && item.id !== this.editIndex
      )
      if (isDuplicate) {
        this.editError = 'Công việc đã tồn tại!'
        return
      }
      if (newText === this.editOldText) {
        this.handleEditCancel()
        return
      }

      this.saving = true
      try {
        this.$emit('update', { id: this.editIndex, newText })
        this.editVisible = false
        message.success('Đã cập nhật')
      } finally {
        this.saving = false
        this.resetEditState()
      }
    },

    handleEditCancel() {
      this.editVisible = false
      this.resetEditState()
    },

    doDelete(index) {
      this.$emit('remove', index)
      message.success('Đã xóa')
    },

    resetEditState() {
      this.editIndex = null
      this.editText = ''
      this.editOldText = ''
      this.editError = ''
    }
  }
}
</script>
