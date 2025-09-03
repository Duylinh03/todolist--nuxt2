export default ({ store }) => {

  if (!store || !store.state || !store.state.todo) {
    if (process.client) console.warn('[persist] Vuex module "todo" chưa sẵn sàng.')
    return
  }

  const KEY = 'todos_v1'
  const FALLBACK_OLD = 'todos'
  try {
    const raw = localStorage.getItem(KEY) || localStorage.getItem(FALLBACK_OLD)
    const data = raw ? JSON.parse(raw) : null
    if (Array.isArray(data)) store.commit('todo/SET_ITEMS', data)
  } catch (_) {}
  store.commit('todo/SET_READY', true)

  const touch = new Set([
    'todo/ADD',
    'todo/UPDATE_TEXT',
    'todo/TOGGLE',
    'todo/REMOVE',
    'todo/SET_ITEMS',
    'todo/CLEAR_COMPLETED'
  ])

  store.subscribe((mutation, state) => {
    if (!touch.has(mutation.type)) return
    try {
      localStorage.setItem(KEY, JSON.stringify(state.todo.items))
    } catch (_) {}
  })
}
