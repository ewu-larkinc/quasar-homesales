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
          <q-input
            v-model="username"
            outlined
            label="Username"
            stack-label
            class="q-mb-sm"
          />
          <q-input
            v-model="password"
            outlined
            label="Password"
            stack-label
            type="password"
            class="q-mb-sm"
          />
          <q-card-section horizontal class="justify-between items-center">
            <q-checkbox v-model="rememberMe" label="Remember me" />
            <a href="" class="theme-color">Forgot password?</a>
          </q-card-section>
          <q-card-section class="q-px-none">
            <q-btn
              text-color="white"
              label="Login"
              @click="loginClicked()"
              class="theme-color-bg full-width"
            />
          </q-card-section>
          <q-card-section>
            <span
              >Need an account?
              <a
                class="cursor-pointer theme-color"
                @click="toggleRegistration()"
                >Register here</a
              ></span
            >
          </q-card-section>
          <q-card-section>
            <p>Or</p>
            <a @click="previewSite()" class="linkify cursor-pointer"
              >Preview site without an account</a
            >
          </q-card-section>
        </q-card-section>
        <q-card-section class="q-pa-none col-6 overflow-hidden">
          <q-img src="~assets/stock-photo-3.jpg" class="login-img main-panel" />
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";

import RegistrationDialog from "components/RegistrationDialog.vue";

export default defineComponent({
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false,
      contactRecords: [],
      newUserInfo: {
        username: "",
        password: "",
        email: "",
        name: "",
      },
    };
  },
  methods: {
    loginClicked() {
      console.log("fetching contact records...")
      fetch("http://localhost:1337/api/contacts?populate=%2A")
        .then((response) => response.json())
        .then((data) => {
          this.contactRecords = data
        })
    },
    previewSite() {
      console.log("pushing /contact lookup page")
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
  },
})
</script>
<style lang="scss" scoped></style>
