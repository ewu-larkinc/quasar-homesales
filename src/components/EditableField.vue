<template>
    <q-input v-if="isDateField" v-model="fieldValue" :rules="['fieldValue']" readonly outlined :label="label" stack-label class="dateWidth">
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="fieldValue" :readonly="editMode" mask="YYYY-MM-DD" :title="label" color="secondary" @change="updateValue">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="close" color="primary" flat />
                        </div>
                    </q-date>
                </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
    <q-input 
        v-else-if="editMode && !isDateField" 
        v-model="fieldValue" 
        :label="label" 
        stack-label 
        outlined 
        :class="['controlHeight', { controlWidth: !reduceWidth, reducedWidth: reduceWidth }] " 
        @change="updateValue"
    />
    <template v-else>
        <q-item-section :class="['q-pa-sm', 'controlHeight', { controlWidth: !reduceWidth, reducedWidth: reduceWidth }]" top style="border-bottom: 1px solid rgba(0,0,0,0.15); border-radius: 2px;">
            <q-item-label caption>{{ label }}</q-item-label>
            <q-item-label>{{ fieldValue }}</q-item-label>
        </q-item-section>
    </template>
</template>
<script>
    import { defineComponent } from 'vue'

    export default defineComponent({
        title: 'EditableField',
        data() {
            return {
                fieldValue: ''
            }
        },
        props: {
            label: {
                type: String,
                required: true
            },
            originalValue: {
                type: String,
                required: true
            },
            editMode: {
                type: Boolean,
                default: false
            },
            noTopPadding: {
                type: Boolean,
                default: false
            },
            reduceWidth: {
                type: Boolean,
                default: false
            },
            isDateField: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            //emit new value whenever this changes, so that the parent can update accordingly
            updateValue() {
                console.log('emitting value change now to ' + this.fieldValue)
                this.$emit('valueUpdated', { newValue: this.fieldValue, type: this.label })
            }
        },
        computed: {

        },
        mounted() {
            this.fieldValue = this.originalValue
            console.log('label: ' + this.label)
            console.log('curVal: ' + this.fieldValue)
        },
        watch: {
            originalValue(newValue, oldValue) {
                console.log('originalValue updating to: ' + newValue)
                console.log('oldValue: ' + oldValue)
                this.fieldValue = newValue
            }
        },
        setup() {

        }
    })
</script>
<style lang="scss" scoped>
.control {
    &Height {
        min-height: 53px;
    }
    &Width {
        min-width: 130px;
    }
}
.reduced {
    &Width {
        max-width: 100px;
    }
}
.date {
    &Width {
        max-width: 150px;
    }
}
</style>