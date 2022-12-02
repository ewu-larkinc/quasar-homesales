<template>
    <q-page class="flex flex-center">
      <!--<q-toolbar class="text-primary fixed-top">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>Contact Lookup Page</q-toolbar-title>
      </q-toolbar>-->
      <Account-Toolbar title="Contact Lookup" selected-tab="lookup" :contacts="contacts" @contact-selected="selectContact" />
      <div class="row justify-center q-gutter-md" style="margin-top: 50px;">
          <contact-record v-for="(contact, index) in searchContacts" :key="index" :contact-info="contact" :edit-mode="editMode" />
      </div>
      <!--<q-card flat>
        <q-card-section horizontal>
          <q-card-section class="search-panel q-pa-none">
            <q-list bordered separator>
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
                        {{ getContactInitial(contact.attributes.name) }}
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
          </q-card-section>
          <q-card-section class="info-panel q-pa-none q-ml-md">
            <q-card v-if="editMode" bordered flat class="">
              <q-card-section class="q-pa-none">
                <q-card-section horizontal class="items-center bottom-border">
                  <q-card-section class="items-center text-center">
                    <q-avatar rounded size="50px">
                      <q-img v-if="(!selectedContact || selectedContact && !selectedContact.attributes.photo.data) && !avatarForUpload" :src="defaultAvatar" @click="updateAvatar()" class="test1" />
                      <q-img v-else-if="selectedContact.attributes.photo.data && selectedContact.attributes.photo.data.attributes" :src="`${apiBaseUrl}${selectedContact.attributes.photo.data.attributes.url}`" @click="updateAvatar()" class="test2" />
                      <q-img v-else :src="avatarUrl" @click="updateAvatar()" class="test3" />
                      <q-file v-model="avatarForUpload" ref="avatarPicker" class="hidden" @update:model-value="loadSelectedAvatar()" />
                    </q-avatar>
                  </q-card-section>
                  <q-card-section class="q-pl-none">
                    <Editable-Field label="Name" :original-value="selectedContact.attributes.name" :edit-mode="editMode" @value-updated="fieldUpdated" />
                  </q-card-section>
                  <q-card-section v-if="editMode" class="q-pa-none">
                    <q-icon name="edit" @click="toggleEditMode()" size="sm"/>
                  </q-card-section>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <Editable-Field label="Street Address" :original-value="selectedContact.attributes.streetAddress" :edit-mode="editMode" @value-updated="fieldUpdated" />
                </q-card-section>
                <q-card-section horizontal class="q-pa-sm">
                  <Editable-Field label="City" :original-value="selectedContact.attributes.city" :edit-mode="editMode" @value-updated="fieldUpdated" />
                  <q-select :options="states" v-model="selectedContact.attributes.state" outlined label="State" stack-label class="q-mx-xs" style="min-width: 100px;"></q-select>
                  <Editable-Field label="Zipcode" :original-value="selectedContact.attributes.zipcode" reduce-width :edit-mode="editMode" @value-updated="fieldUpdated" />
                </q-card-section>
                <q-card-section horizontal class="q-pa-sm justify-between">
                  <Editable-Field label="Birthday" :original-value="selectedContact.attributes.birthDate" :edit-mode="editMode" @value-updated="fieldUpdated" is-date-field />
                  <Editable-Field label="Housiversary" :original-value="selectedContact.attributes.housiversary" :edit-mode="editMode" @value-updated="fieldUpdated" is-date-field class="q-mx-xs" />
                  <Editable-Field label="Anniversary" :original-value="selectedContact.attributes.anniversary" :edit-mode="editMode" @value-updated="fieldUpdated" is-date-field />
                </q-card-section>
                <q-card-section>
                    <q-btn label="Save" flat @click="saveContactRecord()" />
                </q-card-section>
              </q-card-section>
            </q-card>
            <q-card bordered flat class="">
                <q-card-section class="">
                    <div>
                        <q-chip v-for="group in selectedContact.groups" :key="group.id" :ref="`chip-${group.id}`" removable icon="groups" color="secondary" square class="" @remove="removeFromGroup(group.id)" >
                            {{ group.attributes.name }}
                        </q-chip>
                    </div>
                </q-card-section>
            </q-card>
          </q-card-section>
        </q-card-section>
      </q-card>-->
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from "vue"
  import { useAuthStore } from "stores/auth"
  import AccountToolbar from "components/AccountToolbar.vue"
  import ContactRecord from "components/ContactRecord.vue"
  import EditableField from "components/EditableField.vue"
  import utilities from "src/js/utilities"
  
  export default defineComponent({
    name: "ContactLookupPage",
    components: {
      AccountToolbar,
      ContactRecord
      //EditableField
    },
    setup() {
      const store = useAuthStore()
      return {
        store
      }
    },
    data() {
      return {
        apiBaseUrl: process.env.VITE_SERVER_URL,
        contacts: [],
        contactSearchText: "",
        selectedContact: {
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
        },
        editMode: false,
        avatarForUpload: null,
        avatarUrl: null,
        defaultAvatar: 'src/assets/default-avatar.png',
        states: ["Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Minor Outlying Islands", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Northern Mariana Islands", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "U.S. Virgin Islands", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
      }
    },
    computed: {
      searchContacts() {
        if (!this.contactSearchText.length) {
          return this.contacts
        }
        //return filtered version of contacts, filtering for whatever the search text is
        let results = this.contacts.filter((contact) => {
          return contact.attributes.name.toLowerCase().includes(
            this.contactSearchText.toLowerCase()
          )
        })
        return results
      },
    },
    methods: {
      toggleAddNewContact() {
        this.resetSelectedContact()
        this.editMode = true
      },
      removeFromGroup(groupId) {
        console.log('removing ' + groupId + ' membership for contact')
        this.$refs[`chip-${groupId}`].value = false
      },
      resetSelectedContact() {
        this.selectedContact = {
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
      },
      toggleEditMode() {
        this.editMode = !this.editMode
      },
      fieldUpdated(val) {
        console.log('newValue: ' + val.newValue)
        console.log('for type: ' + val.type)
        //now update type with new value (within selectedContact)
        //e.g. this.selectedContact.attributes[val.type] = val.newValue 
      },
      async fetchContacts() {
        let user = JSON.parse(window.localStorage.getItem('hs-user'))
        let jwt = window.localStorage.getItem('hs-jwt')
        console.log('fetching contacts for userId: ' + user.id)
        /*await fetch(`http://localhost:1337/api/contacts?populate=%2A&filters[UserId][$eq]=${user.id}`)
          .then((response) => response.json())
          .then((data) => {
            this.contacts = data.data
          })*/
        try {
            const { data } = await this.$axios.get(`http://localhost:1337/api/contacts?populate=%2A&filters[userId][$eq]=${user.id}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            this.contacts = data.data
            //console.log('contacts: ' + JSON.stringify(this.contacts))
        } catch (error) {
            console.log('error occurred while retrieving contacts: ' + error.message)
        }
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
        console.log("contact selected! " + JSON.stringify(contact))
        if (this.selectedContact.id == contact.id) {
            this.resetSelectedContact()
        } else {
            this.selectedContact = contact
            this.fetchContactGroupsForSelectedContact()
            console.log('selectedContact: ' + JSON.stringify(this.selectedContact))
        }
      },
      async fetchContactGroupsForSelectedContact() { 
        let jwt = window.localStorage.getItem('hs-jwt')

        const {data} = await this.$axios(`http://localhost:1337/api/contact-groups?populate=%2A&filters[contacts][id][$contains]=${this.selectedContact.id}`, {
            method: 'GET',
            headers: {
                    Authorization: `Bearer ${jwt}`
                }
        })
        this.selectedContact.groups = data.data
        console.log('groups contains: ' + JSON.stringify(data.data))
      },
      updateAvatar() {
        //launch file upload utility to allow user to select image, that is loaded into control and prepped for api request
        this.$refs.avatarPicker.pickFiles()
      },
      loadSelectedAvatar() {
        console.log('loading selected avatar photo!!')
        this.avatarUrl = URL.createObjectURL(this.avatarForUpload)
      },
      async saveContactPhoto() {
        //for existing contacts
        //if avatar has been added or updated, we need to post the new image to the backend, and then update the contact record to point to the new photo
        if (this.avatarForUpload) {
            let user = JSON.parse(window.localStorage.getItem('hs-user'))
            let jwt = window.localStorage.getItem('hs-jwt')

            const headers = {
                Authorization: `Bearer ${jwt}`
            }

            const formData = new FormData()
            formData.append('files', this.avatarForUpload)

            let response = await this.$axios({
                method: 'POST',
                url: 'http://localhost:1337/api/upload',
                headers: headers,
                data: formData
            })

            if (response.data[0]) {
                return response.data[0].id
            } else {
                return null
            }
            /*.then((response) => {
                const imageId = response.data[0].id
                const contactFormData = new FormData()
                const photo = {
                    'photo': { 'data': imageId }
                }
                contactFormData.append('photo', imageId)
                console.log('image uploaded with id: ' + imageId)

                this.$axios({
                    method: 'PUT',
                    url: `http://localhost:1337/api/contacts/${user.id}`,
                    headers: headers,
                    data: contactFormData
                })
                
            })
            .catch((error) => {
                console.log('error occurred while uploading new avatar image! ' + error.message)
            })*/
        }
      },
      async saveContactRecord() {
        let user = JSON.parse(window.localStorage.getItem('hs-user'))
        let jwt = window.localStorage.getItem('hs-jwt')
        //setting up saving changes to an existing contact record first, will add new contact creation next
        //will also want to update this so that the contact update request isn't dependent on having an avatarForUpload
        if (this.selectedContact && this.avatarForUpload) {
            
            let imageId = await this.saveContactPhoto()
            if (imageId) {
                console.log('new imageId is: ' + imageId)
            }
            /*const formData = new FormData()
            formData.append('files', this.avatarForUpload)
            const headers = {
                Authorization: `Bearer ${jwt}`
            }
            
            this.$axios({
                method: 'POST',
                url: 'http://localhost:1337/api/upload',
                headers: headers,
                data: formData
            })
            .then((response) => {
                const imageId = response.data[0].id
                const contactFormData = new FormData()
                const photo = {
                    'photo': { 'data': imageId }
                }
                contactFormData.append('photo', imageId)
                console.log('image uploaded with id: ' + imageId)

                this.$axios({
                    method: 'PUT',
                    url: `http://localhost:1337/api/contacts/${user.id}`,
                    headers: headers,
                    data: contactFormData
                })
                
            })
            .catch((error) => {
                console.log('error occurred while uploading new avatar image! ' + error.message)
            })*/
        } else {
            console.log('sending basic update request')
            const data = { "data": { "city": "Ritzville" }}
            console.log('data: ' + JSON.stringify(data))

            fetch(`http://localhost:1337/api/contacts/${this.selectedContact.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
                body: JSON.stringify(data)
            })
            .then((response) => {

            })
        }
      }
    },
    mounted() {
      console.log("contactlookuppage mounted!!")
      this.store.$subscribe((mutation, state) => {
        console.log('store change detected in lookup page!! ' + JSON.stringify(state))
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
  .info-panel {
    .q-card {
        min-width: 350px;
    }
  }
  </style>
  