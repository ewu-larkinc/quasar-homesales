<template>
    <div class="q-pa-none">
      <q-header elevated v-if="isAuthenticated">
        <q-toolbar class="fixed-top bg-primary">
            <q-btn flat round dense icon="assignment_ind" @click="drawer = !drawer" />
            <q-toolbar-title>{{ title }}</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-drawer v-model="drawer" :width="300" :breakpoint="500" bordered class="bg-grey-3">
          <q-img class="absolute-top" src="~assets/menu-bg-1.jpg" style="height: 120px;">
              <div class="absolute-bottom bg-transparent">
                  <q-avatar size="56px" class="q-mb-sm">
                  <img :src="userAvatar">
                  </q-avatar>
                  <div class="text-weight-bold">{{ user.name }}</div>
              </div>
          </q-img>
              <q-list bordered separator style="margin-top:120px">
                  <q-item clickable v-ripple @click="gotoAccount()" class="theme-color-text-primary">
                      <q-item-section avatar>
                          <q-icon name="badge" />
                      </q-item-section>
                      <q-item-section>
                          Account Info
                      </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple @click="logout()" class="theme-color-text-primary">
                      <q-item-section avatar>
                          <q-icon name="logout" />
                      </q-item-section>
                      <q-item-section>
                          Logout
                      </q-item-section>
                  </q-item>
              </q-list>
      </q-drawer>
    </div>
</template>
<script>
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: "AccountToolbar",
        props: {
            title: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                drawer: false,
                isAuthenticated: false,
                user: {
                    name: '',
                    avatar: ''
                },
                defaultAvatar: 'src/assets/default-avatar.png'
            }
        },
        mounted() {
            this.user = JSON.parse(window.localStorage.getItem('hs-user'))
            console.log('user name: ' + this.user.name)
        },
        watch: {
            user(newValue, oldValue) {
                console.log("user record change detected!")
            },
        },
        methods: {
            logout() {
                //clear local storage of jwt, and redirect to login
            },
            gotoAccount() {

            }
        },
        computed: {
            userAvatar() {
                if (this.user.avatar && this.user.avatar.length) {
                    return this.user.avatar
                }
                return this.defaultAvatar
            }
        }
    })
</script>
<style lang="scss" scoped>

</style>