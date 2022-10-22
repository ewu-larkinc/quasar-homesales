<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="isAuthenticated" class="">
        <q-toolbar class="text-primary fixed-top">
            <q-btn flat round dense icon="assignment_ind" @click="drawer = !drawer" />
            <q-toolbar-title>{{ title }}</q-toolbar-title>
        </q-toolbar>
        <q-drawer v-model="drawer" :width="300" bordered class="bg-grey-3">
            <q-img class="absolute-top" src="~assets/menu-bg-1.jpg" style="height: 120px;">
                <div class="absolute-bottom bg-transparent">
                    <q-avatar size="56px" class="q-mb-sm">
                    <img :src="userAvatar">
                    </q-avatar>
                    <div class="text-weight-bold">{{ user.name }}</div>
                </div>
            </q-img>
            <!--<q-scroll-area class="fit" style="height: calc(100% - 120px); margin-top: 120px; border-right: 1px solid #ddd">-->
                <q-list bordered separator style="margin-top:120px">
                    <!-- avatar and name at top, followed by list items for Account Info, Logout, etc.-->
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
            <!--</q-scroll-area>-->
        </q-drawer>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue"
import { useMyStore } from "stores/main"

export default defineComponent({
  name: "MainLayout",
  data() {
    return {
      drawer: false,
      isAuthenticated: false,
      user: {
        name: '',
        username: '',
        avatar: ''
      },
      defaultAvatar: 'src/assets/default-avatar.png'
    }
  },

  components: {},

  methods: {
    stateChangeCallback(state) {
      console.log('state change detected!')
    }
  },

  computed: {
    userAvatar() {
        if (this.user.avatar && this.user.avatar.length) {
            return this.user.avatar
        }
        return this.defaultAvatar
    }
  },

  mounted() {
    console.log('mainLayout mounted!!!')
    this.store.$subscribe((mutation, state) => {
      console.log('state change detected in mainLayout! State: ' + JSON.stringify(state))
      console.log('mutation: ' + JSON.stringify(mutation))
      this.isAuthenticated = state.isAuthenticated
      this.user.name = state.name
      if (state.avatar) {
        this.user.avatar = state.avatar
      }
    })
  },

  watch: {
    user(newValue, oldValue) {
        console.log("user record change detected!")
    },
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const store = useMyStore()

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      store
    };
  },
});
</script>
