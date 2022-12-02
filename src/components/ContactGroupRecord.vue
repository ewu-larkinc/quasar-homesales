<template>
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
</template>
<script setup>
import { computed, defineEmits, defineProps, onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from "stores/auth"
import EditableField from 'components/EditableField.vue'

const apiBaseUrl = process.env.VITE_SERVER_URL
const props = defineProps({
    contactGroupInfo: {
        type: Object,
        required: false
    },
    editMode: {
        type: Boolean,
        default: false
    }
})

let selectedContactGroup = ref(props.contactGroupInfo)
let emit = defineEmits(['removeContactFromGroup', 'selectContactGroup'])

function removeContactFromGroup(contact) {
    emit('removeContactFromGroup', contact)
}

function getContactInitial(name) {
    return name ? name.charAt(0) : ""
}

function selectContactGroup(group) {
    console.log("group selected! " + JSON.stringify(group))
    emit('selectContactGroup', group)
}

</script>