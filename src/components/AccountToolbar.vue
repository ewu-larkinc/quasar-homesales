<template>
    <div class="q-pa-none">
      <q-header elevated>
        <q-toolbar class="fixed-top bg-primary">
            <q-btn flat round dense icon="assignment_ind" @click="drawer = !drawer" />
            <q-toolbar-title>{{ title }}</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-drawer v-model="drawer" :width="300" :breakpoint="500" bordered class="bg-grey-3" style="">
          <q-img class="absolute" src="~assets/menu-bg-1.jpg" style="height: 120px; top: 50px;">
              <div class="absolute-bottom bg-transparent">
                  <q-avatar size="56px" class="q-mb-sm">
                  <img :src="userAvatar">
                  </q-avatar>
                  <div class="text-weight-bold">{{ user.name }}</div>
              </div>
          </q-img>
              <q-list bordered separator style="margin-top:170px">
                  <q-item clickable v-ripple @click="gotoAccount()" class="theme-color-text-primary">
                      <q-item-section avatar>
                          <q-icon name="badge" />
                      </q-item-section>
                      <q-item-section>
                          Account Info
                      </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple @click="goTo('/lookup')" class="theme-color-text-primary">
                      <q-item-section avatar>
                          <q-icon name="contacts" />
                      </q-item-section>
                      <q-item-section>
                          Contacts
                      </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple @click="goTo('/groups')" class="theme-color-text-primary">
                      <q-item-section avatar>
                          <q-icon name="groups" />
                      </q-item-section>
                      <q-item-section>
                          Contact Groups
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
    import { useAuthStore } from "stores/auth"

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
                drawer: true,
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
                const store = useAuthStore()
                store.logout()
            },
            gotoAccount() {

            },
            goTo(path) {
                this.$router.push(path)
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