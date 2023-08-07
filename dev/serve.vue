<script>
import Vue from 'vue';
import { menuData } from '../src/lib-components/data'
// Uncomment import and local "components" registration if library is not registered globally.
// import { LadderMenuSample } from '@/entry.esm';

export default Vue.extend({
  name: 'ServeDev',
  data() {
    return {
      menuData,
      select: []
    }
  }
  // components: {
  //  LadderMenuSample,
  // }
});
</script>

<template>
  <div id="app">
    <ladder-menu-sample
      :data="menuData"
      :select.sync="select"
      children="children"
      selectField="selected"
    />
  </div>
</template>
