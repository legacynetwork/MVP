import { shallowMount } from '@vue/test-utils'
import CreateLegacy from '../../../src/components/CreateLegacy.vue'


// using asser
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});


// using expect
const wrapper = shallowMount(CreateLegacy);
describe('tPoL test', () => {
  it('should check tPoL default value', () => {

    expect(wrapper.vm.$data.tPol).toBe(90);

  })
});
