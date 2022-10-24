<template>
  <q-page class="flex flex-center">
    <!--<q-toolbar class="text-primary fixed-top">
      <q-btn flat round dense icon="assignment_ind" />
      <q-toolbar-title>Contact Lookup Page</q-toolbar-title>
    </q-toolbar>-->
    <!--<Account-Toolbar title="Contact Lookup" />-->
    <q-card flat>
      <q-card-section horizontal>
        <q-card-section class="search-panel q-pa-none">
          <q-list bordered separator>
            <!--<q-toolbar class="bg-primary text-white">
              <q-toolbar-title>Contacts</q-toolbar-title>
            </q-toolbar>-->
            <q-item class="q-pa-none">
              <q-input
                v-model="contactSearchText"
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
            <q-item
              v-for="contact in searchContacts"
              :key="contact.id"
              :class="[
                'q-py-sm',
                'items-center',
                { selected: selectedContact && selectedContact.id == contact.id },
              ]"
              clickable
              v-ripple
              @click="selectContact(contact)"
            >
              <q-item-section avatar class="">
                <q-avatar size="48px" color="primary" text-color="white">
                  {{ getContactInitial(contact.attributes.Name) }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label overline>
                  {{ contact.attributes.Name }}
                </q-item-label>
                <q-item-label caption lines="1">
                  {{ contact.attributes.Email }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section class="info-panel q-pa-none">
          <q-card bordered class="q-ml-lg">
            <q-card-section class="q-pa-none">
              <q-card-section horizontal class="items-center bottom-border">
                <q-card-section class="items-center text-center">
                  <q-avatar rounded size="50px" color="primary">
                    <q-btn
                      v-if="!selectedContact || !selectedContact.attributes.avatar"
                      flat
                      icon="add"
                      text-color="white"
                      class="add-avatar"
                    />
                    <q-img v-else src="selectedContact.attributes.avatar" />
                  </q-avatar>
                  <q-item-label v-if="selectedContact && selectedContact.attributes && !selectedContact.attributes.avatar"
                    >Photo</q-item-label
                  >
                </q-card-section>
                <q-card-section class="q-pl-none">
                  <q-input
                    filled
                    v-model="selectedContact.attributes.Name"
                    v-if="editMode"
                  />
                  <p v-else style="font-size: 18px">
                    {{ selectedContact && selectedContact.attributes.Name }}
                  </p>
                </q-card-section>
              </q-card-section>
              <q-card-section>
                <q-input label="Street Address" stack-label outlined />
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue"
import { useAuthStore } from "stores/auth"

export default defineComponent({
  name: "ContactLookupPage",
  components: {
    //AccountToolbar
  },
  setup() {
    const store = useAuthStore()
    return {
      store
    }
  },
  data() {
    return {
      contacts: [],
      contactSearchText: "",
      selectedContact: null,
      editMode: false
    }
  },
  computed: {
    searchContacts() {
      if (!this.contactSearchText.length) {
        return this.contacts
      }
      //return filtered version of contacts, filtering for whatever the search text is
      let results = this.contacts.filter((contact) => {
        return contact.attributes.Name.toLowerCase().includes(
          this.contactSearchText.toLowerCase()
        )
      })
      return results
    },
  },
  methods: {
    async fetchContacts() {
      let user = JSON.parse(window.localStorage.getItem('hs-user'))
      console.log('fetching contacts for userId: ' + user.id)
      await fetch(`http://localhost:1337/api/contacts?populate=%2A&filters[UserId][$eq]=${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          this.contacts = data.data
        })
    },
    getContactInitial(name) {
      return name ? name.charAt(0) : ""
    },
    searchForContact() {
      console.log("search text entered: " + this.contactSearchText)
      if (this.contactSearchText.length) {
      }
    },
    selectContact(contact) {
      console.log("contact selected!")
      this.selectedContact = contact
    },
  },
  mounted() {
    console.log("contactlookuppage mounted!!")
    this.store.$subscribe((mutation, state) => {
      console.log('store change detected in lookup page!!')
    })

    this.fetchContacts()
  },
  watch: {
    contacts(newValue, oldValue) {
      console.log("contacts record change detected!")
    },
  },
});
</script>
<style lang="scss" scoped>
.bottom-border {
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}
</style>
