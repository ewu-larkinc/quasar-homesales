<template>
  <q-dialog ref="registerDialog">
    <q-card style="min-width: 350px">
      <q-card-section class="theme-color-bg-primary">
        <div class="text-h6 text-white">User Registration</div>
      </q-card-section>
      <q-card-section>
        <q-input
          class="q-mb-xs-xs q-mb-sm-sm"
          ref="name"
          filled
          label="Name"
          stack-label
          v-model="newUserInfo.name"
          :rules="[(val) => !!val || 'Name is required']"
        >
          <template v-slot:append v-if="inputValidationStates.name">
            <q-icon name="done" />
          </template>
        </q-input>
        <q-input
          filled
          class="q-mb-xs-xs q-mb-sm-sm"
          ref="username"
          label="Username"
          stack-label
          v-model="newUserInfo.username"
          :rules="[(val) => !!val || 'Username is required']"
        >
          <template v-slot:append v-if="inputValidationStates.username">
            <q-icon name="done" />
          </template>
        </q-input>
        <q-input
          filled
          class="q-mb-xs-xs q-mb-sm-sm"
          ref="email"
          label="Email Address"
          stack-label
          v-model="newUserInfo.email"
          :rules="[(val) => !!val || 'Email is required']"
        >
          <template v-slot:append v-if="inputValidationStates.email">
            <q-icon name="done" />
          </template>
        </q-input>
        <q-input
          filled
          class="q-mb-xs-xs q-mb-sm-sm"
          ref="password"
          label="Password"
          type="password"
          stack-label
          v-model="newUserInfo.password"
          :rules="[(val) => !!val || 'Password is required']"
        >
          <template v-slot:append v-if="inputValidationStates.password">
            <q-icon name="done" />
          </template>
        </q-input>
        <q-input
          filled
          class="q-mb-xs-xs q-mb-sm-sm"
          ref="confirmPassword"
          label="Confirm Password"
          type="password"
          stack-label
          v-model="confirmPassword"
          :rules="[
            (val) => !!val || 'Confirm Password is required',
            (val) => val === newUserInfo.password || 'Passwords must match',
          ]"
        >
          <template v-slot:append v-if="inputValidationStates.confirmPassword">
            <q-icon name="done" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Register"
          class="no-caps"
          color="primary"
          text-color="white"
          @click="processRegistration()"
        />
        <q-btn
          flat
          label="Cancel"
          class="no-caps"
          text-color="red-3"
          @click="cancelRegistration()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "RegistrationDialog",
  data() {
    return {
      newUserInfo: {
        username: "",
        password: "",
        email: "",
        name: "",
      },
      confirmPassword: "",
      inputRefs: ["name", "username", "password", "email", "confirmPassword"],
      inputValidationStates: {
        name: false,
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
      },
    };
  },
  methods: {
    validate(type) {
      //remember to do the actual validation first!!!
      console.log("type is: " + type);
      this.inputValidationStates[type] = this.$refs[type].validate();
    },
    async processRegistration() {
      let continueProcess = true;
      //this.$emit("update:modelValue", this.newUserInfo);
      //this.$emit("ok", this.newUserInfo);

      this.inputRefs.every((key) => {
        console.log("inputRefs key: " + key);

        //cycle through all inputs and ensure validation before proceeding with form submission to register endpoint
        let valid = this.$refs[key].validate();
        console.log("validation for : " + key + ": " + valid);
        if (!valid) {
          console.log("exiting validation loop");
          continueProcess = false;
          //return false;
        } else {
          this.inputValidationStates[key] = true;
        }
        return true;
      });

      if (continueProcess) {
        console.log("submitting form");
        const payload = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.newUserInfo),
        };
        await fetch("http://localhost:1337/api/auth/local/register", payload)
          .then((response) => response.json())
          .then((data) => {
            console.log("registration response contains: " + data);
            this.resetValidation();
            this.clearForm();
            this.$emit("ok", this.newUserInfo);
          });
      }
    },
    cancelRegistration() {
      console.log("name: " + this.newUserInfo.name);
      console.log("username: " + this.newUserInfo.username);
      console.log("email: " + this.newUserInfo.email);
      console.log("password: " + this.newUserInfo.password);
      this.$refs.registerDialog.hide();
    },
    resetValidation() {
      this.inputRefs.every((key) => {
        this.$refs[key].resetValidation();
      });
    },
    clearForm() {
      this.newUserInfo = {
        username: "",
        password: "",
        email: "",
        name: "",
      };
    },
  },
});
</script>
