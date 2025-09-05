export const state = () => ({
  list: []
})

export const mutations = {
  add(state, text) {
    const id = Date.now()
    state.list.push({ id, text })
  },
  remove(state, id) {
    state.list = state.list.filter(item => item.id !== id)
  },
  update(state, { id, newText }) {
    const item = state.list.find(item => item.id === id)
    if (item) {
      item.text = newText
    }
  }
}
