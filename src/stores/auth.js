import { defineStore } from 'pinia'
import { router } from '@/router'
import LoginPageVue from 'src/pages/LoginPage.vue'

const baseUrl = import.meta.env.CLIENT_URL

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: JSON.parse(localStorage.getItem('hs-user')),
    jwt: JSON.parse(localStorage.getItem('hs-jwt')),
    returnUrl: null
  }),

  actions: {
    async login(username, password) {
      try {
        const payload = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: username,
            password: password
          }),
        }

        const user = await fetch("http://localhost:1337/api/auth/local", payload)
        .then((response) => response.json())
          .then((data) => {
            //read jwt from successful response, store appropriately, and redirect to the home page
            const { jwt, user } = data

            //update pinia state
            this.user = user
            this.jwt = jwt

            console.log('response contains: ' + JSON.stringify(data))
            console.log('jwt contains: ' + jwt)
            
        })
      } catch (error) {

      }
    },
    logout() {
      this.user = null
      this.jwt = null
      localStorage.removeItem('hs-user')
      localStorage.remvoeItem('hs-jwt')
      router.push('/')
    }
  }
})
