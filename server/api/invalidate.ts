export default defineEventHandler(async () => {
  const storage = await useStorage('db')
  storage.clear()
  const keys = storage.keys()
  return {
    date: new Date(),
    keys
  }
});