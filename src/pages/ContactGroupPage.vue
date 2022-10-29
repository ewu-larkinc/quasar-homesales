<template>
    <q-page class="flex flex-center">
        <Account-Toolbar title="Contact Groups" />
        <q-card flat>
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
                                { selected: selectedContactGroup && selectedContactGroup.id == group.id },
                            ]"
                            active-class="theme-color-bg-secondary"
                            :active="selectedContactGroup && selectedContactGroup.id == group.id"
                            clickable
                            v-ripple
                            @click="selectContactGroup(group)"
                        >
                        <!--<q-item-section avatar class="">
                            <q-avatar size="48px" color="primary" text-color="white">
                                <template v-if="group.attributes.photo.data && group.attributes.photo.data.attributes">
                                    <q-img :src="`${apiBaseUrl}${group.attributes.photo.data.attributes.url}`" />
                                </template>
                                <template v-else>
                                    {{ getContactInitial(contact.attributes.name) }}
                                </template>
                            </q-avatar>
                        </q-item-section>-->
                            <q-item-section>
                                <q-item-label overline>
                                    {{ group.attributes.name }}
                                </q-item-label>
                                <q-item-label caption lines="1">
                                    {{ group.attributes.contacts.data.length }} members
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
                <q-card-section class="info-panel">
                    
                </q-card-section>
            </q-card-section>
        </q-card>
    </q-page>
</template>
<script>
    import { defineComponent } from 'vue'
    import AccountToolbar from 'components/AccountToolbar.vue'

    export default defineComponent({
        title: 'ContactGroupPage',
        components: {
            AccountToolbar
        },
        data() {
            return {
                apiBaseUrl: process.env.VITE_SERVER_URL,
                contactGroups: [],
                searchText: '',
                selectedContactGroup: {
                    attributes: {
                        name: '',
                        id: '',
                        contacts: {
                            data: []
                        }
                    }
                }
            }
        },
        methods: {
            async fetchContactGroups() {
                let user = JSON.parse(window.localStorage.getItem('hs-user'))
                let jwt = window.localStorage.getItem('hs-jwt')

                try {
                    const { data } = await this.$axios.get(`http://localhost:1337/api/contact-groups?populate=%2A&filters[userId][$eq]=${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${jwt}`
                        }
                    })
                    this.contactGroups = data.data
                    //console.log('contact groups: ' + JSON.stringify(this.contactGroups))
                } catch (error) {
                    console.log('error occurred while retrieving contacts: ' + error.message)
                }
            },
            resetSelectedContactGroup() {
                this.selectedContactGroup = {
                    attributes: {
                        name: '',
                        contacts: []
                    }
                }
            }
        },
        computed: {
            searchContactGroups() {
                if (!this.searchText.length) {
                    return this.contactGroups
                }

                let results = this.contactGroups.filter((contactGroup) => {
                    return contactGroup.attributes.name.toLowerCase().includes(this.searchText.toLowerCase())
                })

                return results
            },
        },
        watch: {
            contactGroups(newValue, oldValue) {
                console.log("contact groups record change detected!")
            },
        },
        mounted() {
            this.fetchContactGroups()
        }
    })
</script>