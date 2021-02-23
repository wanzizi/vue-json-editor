<!--
 * @Author: ganlan
 * @Date: 2020-11-30 16:02:50
 * @Description:
-->

<template>
  <div class="json-editor">
    <i class="el-icon-plus" @click="add" v-if="canEdit"></i>
    <json-node
      v-for="(item,index) in innerObj.children"
      :key="index"
      :node="item"
      :type="innerObj.type"
      :first="true"
      @on-key-change="(val)=>handleKeyChange(index,val)"
      @on-value-change="(val)=>handleValueChange(index,val)"
      @on-delete="handleDelete(index)"
      @on-copy="handleCopy(index)"
    ></json-node>
  </div>
</template>

<script>
import jsonNode from './jsonNode.vue'
import _ from 'lodash'
import 'element-ui/lib/theme-chalk/index.css'
export default {
  name: 'vueJsonEditor',
  provide () {
    return {
      watchObjChange: this.watchObjChange,
      highlightFileds: this.highlightFileds,
      canEdit: this.canEdit,
      isNewEditableOnly: this.isNewEditableOnly,
      canToggle: this.canToggle
    }
  },
  props: {
    // 是否可编辑
    canEdit: {
      type: Boolean,
      default: true
    },
    // 是否需要转换
    needTransfer: {
      type: Boolean,
      default: true
    },
    // 源对象
    sourceObj: {
      type: Object,
      default () {
        return {}
      }
    },
    // 作为高亮依据的字段
    highlightFileds: {
      type: Array,
      default () {
        return []
      }
    },
    // 已有数据不可编辑，新增数据才可编辑
    isNewEditableOnly: {
      type: Boolean,
      default: false
    },
    // 是否需要展开收起
    canToggle: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      innerObj: {},
      timer: null
    }
  },
  components: { jsonNode },
  watch: {
    sourceObj: {
      immediate: true,
      handler: function (val, oldVal) {
        if (val && typeof val === 'object') {
          this.innerObj = this.needTransfer ? this.renderObj(val) : val
          console.log(this.innerObj)
        } else {
          throw new TypeError('expected array or object!')
        }
      }
    }
  },
  methods: {
    add () {
      this.innerObj.children.push({
        index: this.innerObj.children[this.innerObj.children.length - 1].index + 1,
        key: ' ',
        type: 'string',
        value: ' ',
        isNew: true,
        children: []
      })
    },
    handleDelete (index) {
      // 接收到子节点的删除操作
      this.innerObj.children.splice(index, 1)
      this.watchObjChange()
    },
    // TODO:复制的key没法编辑
    handleCopy (index) {
      const children = this.innerObj.children
      const { length } = children
      const item = _.cloneDeep(children[index])
      if (this.innerObj.type === 'array') {
        item.key = length
      } else {
        item.key = ' '
      }
      item.isNew = true
      // item.index = length
      this.innerObj.children.splice((index + 1), 0, item)
      this.$set(this.innerObj.children, index + 1, item)
      this.watchObjChange()
    },
    renderObj (data) {
      const type = this.getType(data)
      return {
        type: type,
        children: type === 'array'
          ? data.map((value, key) => this.getItem(key, value, key))
          : Object.entries(data).map(([key, value], index) => this.getItem(key, value, index))
      }
    },
    getItem (key, value, index) {
      const type = this.getType(value)
      const { children } = (type === 'array' || type === 'object') ? this.renderObj(value) : {}
      return {
        key,
        value,
        // index,
        type: type,
        children: children || []
      }
    },
    getType (value) {
      if (value) {
        if (Array.isArray(value)) {
          return 'array'
        } else {
          return typeof value
        }
      } else {
        return value === null ? 'null' : typeof value
      }
    },
    handleKeyChange (index, val) {
      if (this.innerObj.children[index].key !== val) {
        this.$set(this.innerObj.children[index], 'key', val)
        this.watchObjChange()
      }
    },
    handleValueChange (index, val) {
      if (this.innerObj.children[index].value !== val) {
        this.$set(this.innerObj.children[index], 'value', val)
        this.watchObjChange()
      }
    },
    watchObjChange () {
      if (!this.needTransfer) {
        return
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.emitData(this.needTransfer ? this.restoreSource(this.innerObj) : this.innerObj)
        this.timer = null
      }, 500)
    },
    restoreSource (data) {
      return data.children.reduce((acc, item, index) => {
        if (item.type === 'array' || item.type === 'object') {
          acc[item.key] = this.restoreSource(item)
        } else {
          acc[item.key] = this.restoreValue(item.value, item.type)
        }
        return acc
      }, data.type === 'object' ? {} : [])
    },
    restoreValue (val, type) {
      switch (type) {
        case 'boolean':
          if (val === 'true' || val === 'false') {
            val = val === 'true'
          }
          break
        case 'number':
          if (/^\d*$/.test(val)) {
            val = +val
          }
          break
      }
      return val
    },
    emitData (data) {
      console.log('data change and save', data)
      this.$emit('on-change', data)
    }
  }
}
</script>

<style lang='scss' scoped>
.json-editor{
  position: relative;
  // padding-left: 15px;
}
</style>
