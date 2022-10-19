<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section horizontal>
        <q-avatar rounded size="100px">
          <q-btn v-if="!contact.avatar" icon="add" class="add-avatar" />
        </q-avatar>
        <q-input filled v-model="contact.name" v-if="editMode" />
        <h3>{{ contactName }}</h3>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContactPage",
  data() {
    return {
      editMode: true,
      contact: {
        name: null,
        streetAddress: null,
        city: null,
        state: null,
        zipcode: null,
        birthdate: null,
        anniversary: null,
        home_anniversary: null,
        children: [],
        avatar: null,
        homePhoto: null,
        email: null,
        phone: null,
      },
    };
  },
  methods: {},
  mounted() {
    console.log("contactpage mounted!!");
  },
});
</script>
<style lang="scss" scoped></style>
