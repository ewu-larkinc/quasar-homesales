<template>
    <div class="q-pa-none">
      <q-header elevated>
        <q-toolbar class="fixed-top bg-primary">
            <!--<q-btn flat round dense icon="menu" @click="drawerLeft = !drawerLeft" />-->
            <q-separator dark vertical inset class="q-ml-sm" />
            <!--<q-toolbar-title>{{ title }}</q-toolbar-title>-->
            <!--<q-space />-->
            <!--<q-btn-toggle model-value="selectedTab" flat stretch toggle-color="white" color="secondary" :options="options" @click="navigateToPage(selectedTab)" />-->
            <q-btn flat label="Contacts" :class="[{ active : currentRoute == '/lookup'}]" :text-color="currentRoute != 'lookup' ? 'secondary' : ''" @click="navigateToPage('/lookup')" />
            <q-btn flat label="Contact Groups" :class="[{ active : currentRoute == '/groups'}]" :text-color="currentRoute != 'groups' ? 'secondary' : ''" @click="navigateToPage('/groups')" />
            <q-space />
            <q-btn flat round dense icon="menu" @click="drawerRight = !drawerRight" />
        </q-toolbar>
      </q-header>
      <q-drawer v-model="drawerLeft" :width="400" :breakpoint="500" bordered class="bg-grey-3" style="margin-top: 50px;">
        <q-list v-if="props.contacts" bordered separator>
              <q-item class="q-pa-none">
                <q-input
                  v-model="searchText"
                  filled
                  label="Search"
                  stack-label
                  class="full-width"
                  v-on:keyup="searchForContact()"
                >
                  <template v-slot:append>
                    <q-icon name="search" color="secondary" />
                  </template>
                </q-input>
              </q-item>
              <q-item class="" clickable @click="toggleAddNewContact()">
                <q-item-section avatar text-color="white" class="">
                  <q-avatar size="48px" color="secondary">
                    <q-icon name="person_add" color="white" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                    <q-item-label overline>
                        Add New Contact
                    </q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-btn size="10px" icon="chevron_right" flat color="primary" style="width: 35px;"  />
                </q-item-section>
              </q-item>
              <q-item
                v-for="contact in searchContacts"
                :key="contact.id"
                :class="[
                  'q-py-sm',
                  'items-center',
                  { selected: selectedContact && selectedContact.id == contact.id },
                ]"
                active-class="theme-color-bg-secondary"
                :active="selectedContact && selectedContact.id == contact.id"
                clickable
                v-ripple
                @click="selectContact(contact)"
              >
                <q-item-section avatar class="">
                  <q-avatar size="48px" color="primary" text-color="white">
                    <template v-if="contact.attributes.photo.data && contact.attributes.photo.data.attributes">
                        <q-img :src="`${apiBaseUrl}${contact.attributes.photo.data.attributes.url}`" class="full-height" />
                    </template>
                    <template v-else>
                        {{ getInitials(contact.attributes.name) }}
                    </template>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label overline>
                    {{ contact.attributes.name }}
                  </q-item-label>
                  <q-item-label caption lines="1">
                    {{ contact.attributes.email }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-btn size="10px" icon="email" flat color="primary" @click="emailContact()" style="width: 35px;" class="q-pr-none" />
                </q-item-section>
                <q-item-section side>
                    <q-btn size="10px" icon="details" flat color="primary" @click="callContact()" style="width: 35px;"  />
                </q-item-section>
              </q-item>
        </q-list>
      </q-drawer>
      <q-drawer v-model="drawerRight" side="right" :width="300" :breakpoint="500" bordered class="bg-grey-3" style="">
          <q-img class="absolute" src="~assets/abstract-1-large.jpg" style="height: 120px; top: 50px;">
              <div class="absolute-bottom bg-transparent">
                  <q-avatar size="56px" class="q-mb-sm">
                  <img :src="userAvatar">
                  </q-avatar>
                  <div v-if="user.value" class="text-weight-bold">{{ user.value.name }}</div>
              </div>
          </q-img>
              <q-list bordered separator style="margin-top:170px">
                  <q-expansion-item expand-separator icon="badge" label="Account Info" class="theme-color-text-primary">
                    <q-card v-if="user.value">
                        <q-card-section class="q-pb-none q-pt-xs q-px-none">
                            <editable-field label="Name" :original-value="user.value.name" @value-updated="fieldUpdated" :edit-mode="editMode" />
                        </q-card-section>
                        <q-card-section class="q-py-xs">
                            <editable-field label="Username" :original-value="user.value.username" @value-updated="fieldUpdated" :edit-mode="editMode" />
                        </q-card-section>
                        <q-card-section class="q-pt-none q-pb-xs">
                            <editable-field label="Email" :original-value="user.value.email" @value-updated="fieldUpdated" :edit-mode="editMode" />
                        </q-card-section>
                        <q-card-section></q-card-section>
                    </q-card>
                  </q-expansion-item>
                  <!--<q-item clickable v-ripple @click="goTo('/lookup')" class="theme-color-text-primary">
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
                  </q-item>-->
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
<script setup>
    import { computed, defineEmits, defineProps, onMounted, ref, reactive } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useAuthStore } from "stores/auth"
    import getInitials from 'src/js/utilities'
    import EditableField from 'components/EditableField.vue'

    const store = useAuthStore()
    const route = useRoute()
    const router = useRouter()
    const defaultAvatar = 'src/assets/default-avatar.png'
    const apiBaseUrl = process.env.VITE_SERVER_URL
    const props = defineProps({
        contacts: {
            type: Array,
            required: false
        },
        contactGroups: {
            type: Array,
            required: false
        }
    })

    let searchText = ref('');
    let editMode = ref(false)
    let drawerLeft = ref(true);
    let drawerRight = ref(false);
    let currentRoute = ref('')
    let user = reactive({
            name: '',
            avatar: ''
    })
    let selectedContact = reactive({
        attributes: {
            name: '',
            streetAddress: '',
            city: '',
            state: '',
            zipcode: '',
            email: '',
            phone: '',
            photo: {
                data: null
            },
            housiversary: '',
            anniversary: '',
            birthDate: ''
        },
        groups: []
    })

    let emit = defineEmits(['contact-selected'])

    onMounted(async() => {
        console.log('testing')
        await router.isReady()
        currentRoute.value = route.path
        user.value = store.user
        console.log('user contains: ' + JSON.stringify(user.value))
        console.log('jwt contains: ' + store.jwt)
    })

    function resetSelectedContact() {
        selectedContact = {
            attributes: {
                name: '',
                streetAddress: '',
                city: '',
                state: '',
                zipcode: '',
                email: '',
                phone: '',
                photo: {
                    data: null
                },
                housiversary: '',
                anniversary: '',
                birthDate: ''
            },
            groups: []
        }
    }

    function navigateToPage(selected) {
        router.push(selected)
    }

    function logout() {
        store.logout()
    }

    function fieldUpdated(val) {
        console.log('newValue: ' + val.newValue)
        console.log('for type: ' + val.type)
        //now update type with new value (within selectedContact)
        //e.g. this.selectedContact.attributes[val.type] = val.newValue 
    }

    function searchForContact() {
        console.log("search text entered: " + searchText.value)
        if (searchText.value.length) {
        }
    }

    function selectContact(contact) {
        console.log("contact selected in account toolbar! ")
        if (selectedContact.id == contact.id) {
            resetSelectedContact()
        } else {
            selectedContact = contact
        }
        emit('contact-selected', contact)
    }

    const userAvatar = computed(() => {
        if (user.value.avatar && user.value.avatar.formats && user.value.avatar.formats.thumbnail) {
            return `${apiBaseUrl}${user.value.avatar.formats.thumbnail.url}`
        }
        return defaultAvatar
    })

    const searchContacts = computed(() => {
        if (!searchText.value.length) {
            if (props.contacts) {
                return props.contacts
            }
            if (props.contactGroups) {
                return props.contactGroups
            }
        }
        //return filtered version of contacts, filtering for whatever the search text is
        let results = props.contacts.filter((contact) => {
          return contact.attributes.name.toLowerCase().includes(
            searchText.value.toLowerCase()
          )
        })
        return results
    })
</script>
<style lang="scss" scoped>
.active {
    color: #fff !important;
}

</style>
<style lang="scss">
.q-drawer--right {
    transform: translateX(300px) !important;
    height: 100%;
}
</style>