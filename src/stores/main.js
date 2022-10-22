import { defineStore } from 'pinia'

export const useMyStore = defineStore('myStore', {
  state: () => ({
    isAuthenticated: false,
    name: 'Guest User',
    username: '',
    id: 0,
    jwt: null
  }),

  getters: {

  },

  actions: {

  }
})
