<template>
  <div id="app">
    <editors :sourceObj="obj" :highlightFileds="['isNew']"></editors>
  </div>
</template>

<script>
import editors from './components/index.vue'
export default {
  name: 'App',
  components: {
    editors
  },
  data () {
    return {
      obj: {
        num: 1,
        str: 'str',
        arr: [
          'apple', 'banana', 'orange'
        ],
        obj: {
          a: 1,
          b: 'hello'
        }
      }
    }
  }
}
</script>

<style lang="scss">
#app {
}
</style>
