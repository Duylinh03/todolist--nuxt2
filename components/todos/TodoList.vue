<template>
  <a-list bordered>
    <a-list-item v-for="(item, index) in todos" :key="index">
      <div style="display: flex; justify-content: space-between; width: 100%;">
        <div>
          <template v-if="editingIndex === index">
            <a-input
              v-model="editingText"
              @pressEnter="confirmEdit(index)"
              style="width: 70%; margin-right: 10px;"
            />
            <a-button type="primary" @click="confirmEdit(index)">Lưu</a-button>
          </template>
          <template v-else>
            {{ item }}
          </template>
        </div>
        <div>
          <a-button type="link" @click="startEdit(index, item)">Sửa</a-button>
          <a-button type="link" danger @click="$emit('remove', index)">Xóa</a-button>
        </div>
      </div>
    </a-list-item>
  </a-list>
</template>

<script>
export default {
  props: ['todos'],
  data() {
    return {
      editingIndex: null,
      editingText: ''
    }
  },
  methods: {
    startEdit(index, text) {
      this.editingIndex = index
      this.editingText = text
    },
    confirmEdit(index) {
      if (this.editingText.trim()) {
        this.$emit('update', { index, newText: this.editingText.trim() })
        this.editingIndex = null
        this.editingText = ''
      }
    }
  }
}
</script>
