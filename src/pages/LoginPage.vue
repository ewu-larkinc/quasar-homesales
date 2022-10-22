<template>
  <q-page class="flex flex-center">
    <q-card class="login-card" bordered>
      <q-card-section horizontal class="row items-start">
        <q-card-section class="col-6 text-center q-pa-xl main-panel">
          <q-card flat class="text-center">
            <q-img
              src="~assets/generic-company-logo.png"
              class="logo-small self-center q-mb-md"
            ></q-img>
          </q-card>
          <!--<q-form >-->
            <q-input
              v-model="username"
              ref="usernameEntry"
              id="usernameEntry"
              name="username"
              autocomplete="off"
              outlined
              label="Username"
              stack-label
              hide-bottom-space
              class="q-mb-sm"
              :rules="[(val) => !!val || 'Username is required']"
              lazy-rules="ondemand"
            >
              <template v-slot:append v-if="usernameEntered">
                <q-icon name="done" color="positive" />
              </template>
            </q-input>
            <q-input
              v-model="password"
              ref="passwordEntry"
              name="password"
              outlined
              label="Password"
              stack-label
              hide-bottom-space
              type="password"
              class="q-mb-sm"
              :rules="[(val) => !!val || 'Password is required']"
              lazy-rules="ondemand"
            >
              <template v-slot:append v-if="passwordEntered">
                <q-icon name="done" color="positive" />
              </template>
            </q-input>
          <!--</q-form>-->
          <q-card-section horizontal class="justify-between items-center">
            <q-checkbox v-model="rememberMe" label="Remember me" />
            <a href="" class="theme-color-text-primary">Forgot password?</a>
          </q-card-section>
          <q-card-section class="q-px-none">
            <q-btn
              text-color="white"
              label="Login"
              @click="loginClicked()"
              class="theme-color-bg-primary full-width"
            />
          </q-card-section>
          <q-card-section>
            <span
              >Need an account?
              <a
                class="cursor-pointer theme-color-text-primary"
                @click="toggleRegistration()"
                >Register here</a
              ></span
            >
          </q-card-section>
          <q-card-section class="q-py-none">
            <a @click="previewSite()" class="linkify cursor-pointer"
              >or preview site without an account</a
            >
          </q-card-section>
        </q-card-section>
        <q-card-section class="q-pa-none col-6 overflow-hidden">
          <q-img src="~assets/abstract-1-large.jpg" class="login-img main-panel" />
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { dom } from 'quasar'
import { defineComponent } from "vue";
import RegistrationDialog from "components/RegistrationDialog.vue";
import { useMyStore } from "stores/main"

export const detectAutofill = (element) => {
  const { style } = dom

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(window.getComputedStyle(element, null).getPropertyValue('appearance') === 'menulist-button')
      //resolve(style(element))
    }, 600)
  })
}

export default defineComponent({
  name: "LoginPage",
  setup() {
    
  },
  data() {
    return {
      username: "",
      usernameEntered: false,
      password: "",
      passwordEntered: false,
      rememberMe: false,
      contactRecords: [], //will be moving to lookup page file
      previewModeUser: {
        id: 0,
        name: 'Guest User'
      }
    };
  },
  mounted() {
    //trying to detect autofill on inputs, in order to ensure the rememberMe function works correctly.
    //nothing will work though
    /*this.$nextTick(() => {
      this.testAutoFill()
    })*/
  },
  watch: {
    username(oldValue, newValue) {
      console.log('username change detected!')
    },
    password(oldValue, newValue) {

    }
  },
  methods: {
    async testAutoFill () {
      this.autofilled = await detectAutofill(this.$el.querySelector('#usernameEntry'))
      console.log("autofill detection: " + this.autofilled)
    },

    async loginClicked() {
      /*console.log("fetching contact records...")
      fetch("http://localhost:1337/api/contacts?populate=%2A")
        .then((response) => response.json())
        .then((data) => {
          this.contactRecords = data
        })*/
      //if form fields are validated, submit request
      if (this.validateLoginForm()) {
        const store = useMyStore()

        const payload = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: this.username,
            password: this.password,
          }),
        }
        await fetch("http://localhost:1337/api/auth/local", payload)
          .then((response) => response.json())
          .then((data) => {
            //read jwt from successful response, store appropriately, and redirect to the home page
            const { jwt, user } = data
            window.localStorage.setItem("hs-jwt", jwt)
            window.localStorage.setItem("hs-user", JSON.stringify(user))
            console.log('response contains: ' + JSON.stringify(data))
            console.log('jwt contains: ' + jwt)
            if (jwt) {
              //update state with user info
              store.$patch({
                isAuthenticated: true,
                name: user.name,
                id: user.id,
                jwt: jwt
              })
              this.$router.push({ path: "/lookup" })
            }
          })
      }
    },
    previewSite() {
      window.localStorage.setItem("hs-user", JSON.stringify(this.previewModeUser))
      this.$router.push({ path: "/lookup" })
    },
    toggleRegistration() {
      this.$q
        .dialog({
          component: RegistrationDialog,
        })
        .onOk((retVal) => {
          console.log(
            "Ok event firing in parent. retVal: " + JSON.stringify(retVal)
          )
          this.$refs.registerDialog.hide()
          this.confirmRegistration()
        })
        .onCancel(() => {
          console.log("cancel event firing in parent")
        })
    },
    confirmRegistration() {
      this.$q.dialog({
        title: "Thanks for registering",
        message: "You may now proceed to login",
      })
    },
    validateLoginForm() {
      this.usernameEntered = this.$refs.usernameEntry.validate()
      this.passwordEntered = this.$refs.passwordEntry.validate()
      return this.usernameEntered && this.passwordEntered
    },
    resetValidation() {
      this.$refs.usernameEntry.resetValidation()
      this.$refs.passwordEntry.resetValidation()
    },
  },
})
</script>
<style lang="scss" scoped></style>
