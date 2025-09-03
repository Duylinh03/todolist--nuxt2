<template>
  <div class="page">
    <!-- Header -->
    <section class="page__header">
      <h1 class="page__title">Todo</h1>
      <a-button type="primary" @click="openAdd">+ Add</a-button>
    </section>

    <!-- Filters + Stats -->
    <div class="filters">
      <a-button :type="filter === 'all' ? 'primary' : 'default'" @click="setFilter('all')">
        Tất cả
      </a-button>
      <a-button :type="filter === 'completed' ? 'primary' : 'default'" @click="setFilter('completed')">
        Đã hoàn thành
      </a-button>
      <span class="filters__stats">
        {{ stats.active }} active • {{ stats.completed }} completed / {{ stats.total }} total
      </span>
    </div>

    <!-- List -->
    <TodoList
      :items="list"
      @toggle="onToggle"
      @edit="openEdit"
      @remove="askRemove"
    />

    <!-- Add/Edit Modal -->
    <a-modal
      :title="editingId ? 'Edit Todo' : 'Add Todo'"
      :visible="modalOpen"
      :footer="null"
      @cancel="close"
      destroyOnClose
    >
      <TodoInput
        ref="todoField"
        v-model="input"
        :isEditing="!!editingId"
        :placeholder="editingId ? 'Sửa đi chứ...' : 'Nhập vào ô này'"
        :externalError="uiErrorVisible"
        :hardBlock="true"
        @input="markTouched"
        @submit="save"
        @valid-change="onValidChange"
      />

      <div class="modal__footer">
        <a-button @click="close">Cancel</a-button>
        <a-button
          type="primary"
          :loading="saving"
          :disabled="saveDisabled"
          @click="save"
        >
          {{ primaryLabel }}
        </a-button>
      </div>
    </a-modal>

    <!-- Confirm Delete -->
    <a-modal
      title="Delete this todo?"
      :visible="confirmOpen"
      ok-text="Delete"
      ok-type="danger"
      cancel-text="Cancel"
      @ok="remove"
      @cancel="confirmOpen = false"
    >
      <p class="confirm__text">“{{ confirmTitle }}”</p>
    </a-modal>
  </div>
</template>

<script>
import TodoInput from '@/features/todo/components/TodoInput.vue'
import TodoList  from '@/features/todo/components/TodoList.vue'

export default {
  components: { TodoInput, TodoList },

  data() {
    return {
      // modal/form
      modalOpen: false,
      saving: false,
      editingId: null,
      input: '',
      fieldValid: true,
      touched: false,
      submitTried: false,

      // confirm
      confirmOpen: false,
      confirmId: null,
      confirmTitle: ''
    }
  },

  computed: {
    // Vuex
    list()   { return this.$store.getters['todo/filtered'] },
    filter() { return this.$store.state.todo.filter },
    stats()  { return this.$store.getters['todo/stats'] },

    // UI
    primaryLabel() { return this.editingId ? 'Save changes' : 'Add task' },
    textTrimmed()  { return (this.input || '').trim() },
    isDuplicate() {
      return this.$store.state.todo.items
        .some(t => t.text === this.textTrimmed && t.id !== this.editingId)
    },
    uiError() {
      if (!this.textTrimmed) return 'nhập từ khóa rồi submit'
      if (this.isDuplicate)  return 'đã tồn tại'
      return ''
    },
    uiErrorVisible() {
      return (this.touched || this.submitTried) ? this.uiError : ''
    },
    saveDisabled() {
      // disable nếu: có từ cấm HOẶC rỗng/trùng
      return !this.fieldValid || !!this.uiError
    }
  },

  methods: {
    // Filters & Toggle
    setFilter(f) { this.$store.dispatch('todo/setFilter', f) },
    onToggle(id) { this.$store.dispatch('todo/toggle', id) },

    // Openers
    openAdd() {
      this.editingId   = null
      this.input       = ''
      this.fieldValid  = true
      this.touched     = false
      this.submitTried = false
      this.modalOpen   = true
      this.$nextTick(() => this.$refs.todoField && this.$refs.todoField.focus())
    },
    openEdit(id) {
      const item = this.$store.state.todo.items.find(t => t.id === id)
      if (!item) return
      this.editingId   = id
      this.input       = item.text
      this.fieldValid  = true
      this.touched     = false
      this.submitTried = false
      this.modalOpen   = true
      this.$nextTick(() => this.$refs.todoField && this.$refs.todoField.focus())
    },
    close() {
      this.modalOpen   = false
      this.saving      = false
      this.input       = ''
      this.editingId   = null
      this.fieldValid  = true
      this.touched     = false
      this.submitTried = false
    },

    // Validation hooks
    onValidChange({ valid }) { this.fieldValid = valid },
    markTouched() { if (!this.touched) this.touched = true },

    // Save (Add/Edit)
    async save() {
      if (this.saveDisabled) { this.submitTried = true; return }
      this.saving = true
      setTimeout(async () => {
        if (!this.editingId) {
          await this.$store.dispatch('todo/add', this.textTrimmed)
          this.$message.success('đã thêm thành công nè ')
        } else {
          await this.$store.dispatch('todo/updateText', { id: this.editingId, text: this.textTrimmed })
          this.$message.success('đã lưu thành công nè ')
        }
        this.saving = false
        this.close()
      }, 80)
    },

    // Delete
    askRemove(id) {
      const item = this.$store.state.todo.items.find(t => t.id === id)
      if (!item) return
      this.confirmId    = id
      this.confirmTitle = item.text
      this.confirmOpen  = true
    },
    async remove() {
      if (!this.confirmId) return
      await this.$store.dispatch('todo/remove', this.confirmId)
      this.$message.success('đã xóa thành công nè ')
      this.confirmOpen  = false
      this.confirmId    = null
      this.confirmTitle = ''
    }
  }
}
</script>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
}

.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.page__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.filters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}
.filters__stats {
  margin-left: 12px;
  color: #666;
  font-size: 13px;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.confirm__text {
  color: #666;
}
</style>
