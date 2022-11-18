import { defineStore } from 'pinia'

const baseUrl = import.meta.env.CLIENT_URL

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: localStorage.getItem('hs-user') ? JSON.parse(localStorage.getItem('hs-user')) : null,
    jwt: localStorage.getItem('hs-jwt'),
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
          .then(async (data) => {
            //read user/jwt from successful response, store appropriately, and redirect to the home page
            const { jwt, user } = data

            //update pinia state
            this.user = user
            this.jwt = jwt

            console.log('response contains: ' + JSON.stringify(data))
            console.log('jwt contains: ' + jwt)

            //need to pull additional user info - avatar
            await fetch("http://localhost:1337/api/users/me?populate=%2A", {
              method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                }
            })
            .then((resp) => resp.json())
            .then((data) => {
              console.log('/users/me data: ' + JSON.stringify(data))
              user.avatar = data.avatar

              localStorage.setItem('hs-user', JSON.stringify(user))
              localStorage.setItem('hs-jwt', jwt)
            })

            // store user details and jwt in local storage to keep user logged in between page refreshes
            
            
            this.router.push('/lookup')
        })
      } catch (error) {
        console.log('error occurred during login process: ' + error.message)
      }
    },
    logout() {
      try {
        this.user = null
        this.jwt = null
        localStorage.removeItem('hs-user')
        localStorage.removeItem('hs-jwt')
        this.router.push('/')
      } catch (error) {
        console.log('An error occurred during logout')
      }
    }
  }
})
