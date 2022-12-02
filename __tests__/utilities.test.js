import { mount } from '@vue/test-utils'
import getInitials from './../src/js/utilities.js'
import VueRouter from 'vue-router'

describe('getInitials', () => {
    console.log('running getInitials test')
    test('Johnathan should result in J', () => {
        expect(getInitials('Johnathan')).toBe('J')
    })
})