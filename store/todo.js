export const namespaced = true

export const state = () => ({
  items: [],    
  filter: 'all',
  ready: false
})

export const getters = {
  filtered(s) {
    return s.filter === 'completed' ? s.items.filter(t => t.done) : s.items
  },
  stats(s) {
    const total = s.items.length
    const completed = s.items.filter(t => t.done).length
    return { total, completed, active: total - completed }
  }
}

export const mutations = {
  SET_ITEMS(s, arr){ s.items = arr || [] },
  SET_FILTER(s, f){ s.filter = f },
  SET_READY(s, v){ s.ready = !!v },

  ADD(s, t){ s.items.unshift(t) },
  UPDATE_TEXT(s, { id, text }) {
    const i = s.items.findIndex(x => x.id === id)
    if (i >= 0) s.items[i].text = text
  },
  TOGGLE(s, id) {
    const i = s.items.findIndex(x => x.id === id)
    if (i >= 0) s.items[i].done = !s.items[i].done
  },
  REMOVE(s, id){ s.items = s.items.filter(x => x.id !== id) },
  CLEAR_COMPLETED(s){ s.items = s.items.filter(x => !x.done) }
}

export const actions = {
  setFilter({ commit }, f){ commit('SET_FILTER', f) },
  add({ commit }, text){
    commit('ADD', { id: Date.now(), text, done:false, createdAt: Date.now() })
  },
  updateText({ commit }, payload){ commit('UPDATE_TEXT', payload) },
  toggle({ commit }, id){ commit('TOGGLE', id) },
  remove({ commit }, id){ commit('REMOVE', id) },
  clearCompleted({ commit }){ commit('CLEAR_COMPLETED') }
}
