<template>
    <q-page class="flex flex-center">
        <Account-Toolbar title="Contact Groups" selected-tab="groups" />
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
                                v-model="searchText"
                                filled
                                label="Search"
                                stack-label
                                class="full-width"
                                v-on:keyup="searchForContactGroup()"
                            >
                            <template v-slot:append>
                                <q-icon name="search" color="secondary" />
                            </template>
                            </q-input>
                        </q-item>
                        <q-item
                            v-for="group in searchContactGroups"
                            :key="group.id"
                            :class="[
                                'q-py-sm',
                                'items-center',
                                { selected: selectedContactGroup && selectedContactGroup.value.id == group.id },
                            ]"
                            active-class="theme-color-bg-secondary"
                            :active="selectedContactGroup && selectedContactGroup.value.id == group.id"
                            clickable
                            v-ripple
                            @click="selectContactGroup(group)"
                        >
                            <q-item-section>
                                <q-item-label overline>
                                    {{ group.attributes.name }}
                                </q-item-label>
                                <q-item-label caption lines="1" class="theme-font-secondary">
                                    {{ group.attributes.contacts.data.length }} members
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
                <q-card-section class="info-panel q-pt-none">
                    <q-card v-if="selectedContactGroup.value.id > 0">
                        <q-card-section horizontal>
                            <q-card-section>
                                <q-card-section class="q-px-none q-pt-none">
                                    <Editable-Field label="Group Name" :original-value="selectedContactGroup.value.attributes.name" :edit-mode="editMode" @value-updated="fieldUpdated" />
                                </q-card-section>
                                <q-card-section class="q-px-none q-pt-none">
                                    <q-input label="Description" v-model="selectedContactGroup.value.attributes.description" :readonly="!editMode" outlined type="textarea" />
                                </q-card-section>
                            </q-card-section>
                            <q-separator vertical />
                            <q-card-section>
                                <q-card-section>
                                    <q-item-label header>Current Members</q-item-label>
                                    <q-list>
                                        <q-item v-for="contact in selectedContactGroup.value.attributes.contacts.data" :key="contact.id">
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
                                                <q-btn size="10px" icon="delete" flat color="negative" @click="removeContactFromGroup(contact)" style="width: 35px;" class="q-pr-none" />
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-card-section>
                                <q-card-section>
                                    
                                </q-card-section>
                            </q-card-section>
                        </q-card-section>
                    </q-card>
                    <q-card v-else>

                    </q-card>
                </q-card-section>
            </q-card-section>
        </q-card>-->
    </q-page>
</template>
<script setup>
    //import { defineComponent } from 'vue'
    import AccountToolbar from 'components/AccountToolbar.vue'
    import EditableField from 'components/EditableField.vue'
    import  { computed, ref, reactive, onMounted } from 'vue'
    import { useQuasar } from 'quasar'
    import axios from 'axios'

    const apiBaseUrl = process.env.VITE_SERVER_URL
    const $q = useQuasar()
    const removalDialog = ref(null)

    const editMode = ref(false)
    const contactGroups = ref([])
    const searchText = ref('')
    let selectedContactGroup = reactive({
        value: {
            id: 0,
            attributes: {
                name: '',
                description: '',
                contacts: {
                    data: []
                }
            }
        }
    })

    async function fetchContactGroups() {
        let user = JSON.parse(window.localStorage.getItem('hs-user'))
        let jwt = window.localStorage.getItem('hs-jwt')

        try {
            const { data } = await axios.get(`http://localhost:1337/api/contact-groups?populate[0]=contacts&populate[1]=contacts.photo&filters[userId][$eq]=${user.id}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            contactGroups.value = data.data
            //console.log('contact groups: ' + JSON.stringify(contactGroups.value))
        } catch (error) {
            console.log('error occurred while retrieving contacts: ' + error.message)
        }
    }

    function fieldUpdated(val) {
        console.log('newValue: ' + val.newValue)
        console.log('for type: ' + val.type)
    }

    function resetSelectedContactGroup() {
        selectedContactGroup = {
            value: {
            id: 0,
            attributes: {
                name: '',
                description: '',
                contacts: {
                    data: []
                }
            }
        }
        }
    }

    function selectContactGroup(group) {
        console.log("group selected! " + JSON.stringify(group))
        if (selectedContactGroup.id == group.id) {
            resetSelectedContactGroup()
        } else {
            selectedContactGroup.value = group
            console.log('selectedContactGroup: ' + JSON.stringify(selectedContactGroup))
        }
    }

    function getContactInitial(name) {
        return name ? name.charAt(0) : ""
    }

    function removeContactFromGroup(contact) {
        //first prompt them to make sure they want to proceed
        $q.dialog({
            title: 'Confirm Removal',
            message: "Are you sure you'd like to remove this contact from the group?",
            ok: {
                title: 'Confirm'
            },
            cancel: {
                title: 'Cancel'
            }
        })
        .onOk(() => {
            console.log("confirm deletion!!: ")
        })
        .onCancel(() => {
            console.log("cancel event firing")
        })
    }

    const searchContactGroups = computed(() => {
        if (!searchText.value.length) {
            return contactGroups.value
        }

        let results = contactGroups.value.filter((contactGroup) => {
            return contactGroup.attributes.name.toLowerCase().includes(searchText.value.toLowerCase())
        })

        return results
    })

    onMounted(() => {
        fetchContactGroups()
    })

</script>