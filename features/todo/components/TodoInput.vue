<template>
  <div class="todo-input">
    <a-input
      :value="value"
      :placeholder="placeholder"
      :class="{ 'input--error': combinedError }"
      @input="onInput"
      @pressEnter="onEnter"
      ref="field"
      autocomplete="off"
      aria-describedby="todo-input-error"
    />
    <p
      v-if="combinedError"
      id="todo-input-error"
      class="todo-input__error"
      aria-live="polite"
    >
      {{ combinedError }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'TodoInput',
  props: {
    value: String,
    placeholder: String,
    isEditing: Boolean,
    externalError: { type: String, default: '' }, // lỗi rỗng/trùng từ parent (chỉ show khi parent cho phép)
    hardBlock: { type: Boolean, default: true }   // chặn cứng ký tự cấm
  },
  data() {
    return {
      internalError: '',
      forbiddenWords: ['fuck', 'shit', 'dirty'],
      lastGood: ''
    }
  },
  computed: {
    combinedError() {
      // Ưu tiên lỗi cấm từ; nếu không có thì dùng lỗi rỗng/trùng từ parent
      return this.internalError || this.externalError
    }
  },
  mounted() {
    this.lastGood = this.value || ''
    this.validate(this.value)
  },
  watch: {
    value(v) { this.validate(v) }
  },
  methods: {
    normalize(payload) { return payload && payload.target ? payload.target.value : payload },
    onInput(payload) {
      const next = this.normalize(payload)
      const lower = (next || '').toLowerCase()
      const banned = this.forbiddenWords.some(w => lower.includes(w))

      if (banned) {
        this.internalError = 'từ này bị cấm'
        this.$emit('valid-change', { valid: false, message: this.internalError })
        if (this.hardBlock) this.$emit('input', this.lastGood)
        else this.$emit('input', next)
        return
      }

      this.internalError = ''
      this.lastGood = next
      this.$emit('input', next)
      this.$emit('valid-change', { valid: true, message: '' })
    },
    onEnter() {
      if (!this.combinedError && (this.value || '').trim()) this.$emit('submit')
    },
    validate(v) {
      const s = (v || '').toLowerCase()
      this.internalError = this.forbiddenWords.some(w => s.includes(w)) ? 'từ này bị cấm' : ''
      this.$emit('valid-change', { valid: !this.internalError, message: this.internalError })
    },
    focus() { this.$refs.field && this.$refs.field.focus() }
  }
}
</script>

<style scoped>
.todo-input { display: block; }
.todo-input__error {
  color: #f5222d;
  font-weight: 600;
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
}
.input--error {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.15);
}
</style>
