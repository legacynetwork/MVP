import { shallowMount } from '@vue/test-utils'
import CreateLegacy from '../../../src/components/CreateLegacy.vue'
import flushPromises from 'flush-promises'
import 'babel-polyfill';


// an example using assert
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

const wrapper = shallowMount(CreateLegacy);

describe('Testing CreateLegacy component', () => {
  // Inspect the raw component options
  it('has a created hook', () => {
    expect(typeof CreateLegacy.created).toBe('function')
  });

  it('should read a null string from tPol input text field', () => {
    // expect(wrapper.find('.tPolTxtField').exists()).toBe(true)
    expect(wrapper.find('.tPolTxtField').text()).toBe('')
    // console.log(wrapper.find('.tPolTxtField').html());
  });

  // it('asynch test', async () => {
  //   const wrapper = shallowMount(CreateLegacy)
  //   await wrapper.vm.getOwnerAddress()
  //   // await console.log(wrapper.vm.$data.ownerAddress)
  //   // expect(wrapper.vm.$data.ownerAddress).toBe(42)
  // });

});

describe('asynch test', () => {
  it('fetches async', async () => {
    await wrapper.vm.created
    await wrapper.vm.getOwnerAddress
    await flushPromises()
    console.log(wrapper.vm.$data.ownerAddress) // TODO: shouldn't return null
    // expect(wrapper.vm.value).toBe('value')
  })
})

// using expect
describe('tPoL test', () => {
  it('should check tPoL default value', () => {
    expect(wrapper.vm.$data.tPol).toBe(90)
  })
});
