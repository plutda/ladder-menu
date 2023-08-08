<script>
import Vue from 'vue';
import { menuData } from '../src/lib-components/data'
import ladderMenu from '@/entry.esm'

Vue.use(ladderMenu)

export default Vue.extend({
  name: 'ServeDev',
  data() {
    return {
      menuData,
      select: []
    }
  }
});
</script>

<template>
  <div id="app">
    <ladder-menu
      :data="menuData"
      :select.sync="select"
      children="children"
      selectField="selected"
    />
  </div>
</template>
