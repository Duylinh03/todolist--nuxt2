export const state = () => ({
  list: []
})

export const mutations = {
  add(state, text) {
    state.list.push(text)
  },
  remove(state, index) {
    state.list.splice(index, 1)
  },
  update(state, { index, newText }) {
    state.list[index] = newText
  }
}
