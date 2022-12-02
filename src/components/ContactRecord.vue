<template>
    <q-card>
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
        </q-card-section>
        <q-card-section v-if="selectedContact.groups" class="q-pt-none">
            <div class="text-overline">
                Group Memberships
            </div>
            <div>
                <q-chip v-for="group in selectedContact.groups" :key="group.id" :ref="`chip-${group.id}`" removable icon="groups" color="secondary" square class="" @remove="removeFromGroup(group.id)" >
                    {{ group.attributes.name }}
                </q-chip>
            </div>
        </q-card-section>
        <q-card-section>
            <q-btn label="Save" flat @click="saveContactRecord()" />
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
    contactInfo: {
        type: Object,
        required: false
    },
    editMode: {
        type: Boolean,
        default: false
    }
})

let emit = defineEmits(['contactSelected'])
let selectedContact = ref(props.contactInfo)

function selectContact(contact) {
    console.log("contact selected! " + JSON.stringify(contact))
    emit('contactSelected', contact)
}
//const emit = defineEmits([''])

</script>