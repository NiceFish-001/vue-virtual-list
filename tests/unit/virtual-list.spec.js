import { shallowMount } from '@vue/test-utils'
import VirtualList from '@/components/VirtualList'

describe('VirtualList.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(VirtualList, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
