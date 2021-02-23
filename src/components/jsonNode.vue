<!--
 * @Author: ganlan
 * @Date: 2020-11-30 16:24:14
 * @Description:
-->
<template>
  <div class="json-node-line" :class="{
    first:first&&!nodeCanEdit,
    'can-edit': nodeCanEdit
  }">
    <div class="json-node-line-detail">
      <span class="operate-bar" v-if="canEdit">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-setting el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus" command="add">新增</el-dropdown-item>
            <el-dropdown-item icon="el-icon-delete" command="minus">删除</el-dropdown-item>
            <el-dropdown-item icon="el-icon-copy-document" command="copy">复制</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
      <span class="editable-key">
        <i
          class="toggle-icon el-icon-caret-top"
          v-if="hasChildren&&canToggle" :class="{
            'is-up':isOpen
          }"
          @click="toggleSlide"></i>
        <span
          class="editable-room key"
          :class="{
            'is-array':type==='array',
            'highlight':isHighlight,
            'show-back-color':(node.key==null||node.key===''||node.key===' ')
          }"
          :contenteditable="type!=='array'&&nodeCanEdit"
          ref="json_key"
        >{{node.key}}</span>
      </span>
      <span>：</span>
      <!-- <el-select class="select-style" v-if="!first&&nodeCanEdit" v-model="thisType" placeholder="请选择" size="mini" @change="handleTypeChange">
        <el-option
          v-for="item in typeEnum"
          :key="item.type"
          :label="item.label"
          :value="item.type">
        </el-option>
      </el-select> -->
      <span
        v-if="!hasChildren"
        class="editable-room value"
        :class="{
          'highlight':isHighlight,
          'show-back-color':(node.value==null||node.value===''||node.value===' ')
        }"
        :contenteditable="nodeCanEdit"
        ref="json_value"
      >{{node.value}}</span>
    </div>
    <div v-if="hasChildren">
      <json-node
        v-show="isOpen"
        v-for="(item,index) in node.children"
        :key="index"
        :node="item"
        :type="node.type"
        @on-key-change="(val)=>handleKeyChange(index,val)"
        @on-value-change="(val)=>handleValueChange(index,val)"
        @on-delete="handleDelete(index)"
        @on-copy="handleCopy(index)"
        @on-type-change="handleTypeChange"
      ></json-node>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
// Select, Option
export default {
  name: 'json-node',
  inject: ['watchObjChange', 'highlightFileds', 'canEdit', 'isNewEditableOnly', 'canToggle'],
  props: {
    node: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    },
    first: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem
    // 'el-select': Select,
    // 'el-option': Option
  },
  data () {
    return {
      isOpen: true,
      typeEnum: [
        {
          type: 'boolean',
          label: '布尔'
        },
        {
          type: 'number',
          label: '数字'
        },
        {
          type: 'string',
          label: '字符串'
        },
        {
          type: 'object',
          label: '对象'
        },
        {
          type: 'array',
          label: '数组'
        }
      ]
    }
  },
  computed: {
    hasChildren () {
      return this.node.children && this.node.children.length
    },
    isHighlight () {
      return this.highlightFileds.reduce((acc, item) => {
        if (acc) {
          return acc
        } else {
          return this.node[item]
        }
      }, false)
    },
    nodeCanEdit () {
      return ((this.isNewEditableOnly && this.node.isNew) || !this.isNewEditableOnly) && this.canEdit
    },
    thisType () {
      return this.node.type
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (!this.nodeCanEdit) {
        return
      }
      // 修改值重新渲染导致光标位置不准，改为失去焦点才传值
      this.$refs.json_key.addEventListener('blur', e => {
        this.$emit('on-key-change', e.target.innerText)
      })
      if (!this.hasChildren) {
        this.$refs.json_value && this.$refs.json_value.addEventListener('blur', e => {
          this.$emit('on-value-change', e.target.innerText)
        })
      }
    })
  },
  methods: {
    changeType (val) {
      this.$emit('on-type-change', val)
    },
    handleTypeChange (val) {
      if (!val) {
        return
      }
      this.node.type = val
      if (val === 'boolean') {
        this.node.value = Boolean(this.node.value)
        this.node.children = []
      } else if (val === 'number') {
        this.node.value = typeof this.node.value === 'object' ? 0 : Number(this.node.value)
        this.node.children = []
      } else if (val === 'string') {
        this.node.value = typeof this.node.value === 'object' ? '' : String(this.node.value)
        this.node.children = []
      } else if (val === 'object') {
        this.node.value = {}
      } else if (val === 'array') {
        this.node.value = []
        this.node.children = (this.node.children && this.node.children.length) ? this.node.children.map((t, i) => ({
          ...t,
          key: i
        })) : []
      }
    },
    handleCommand (command) {
      this[command] && this[command]()
    },
    add () {
      // TODO:创建时复制的内容可能有问题
      if (this.hasChildren) {
        const children = this.node.children
        const { length } = children
        const item = _.cloneDeep(children[length - 1])
        if (this.node.type === 'array') {
          item.key++
        } else {
          item.key = ' '
        }
        item.value = ' '
        item.isNew = true
        // item.originData = {}
        item.children = []
        this.node.children.push(item)
      } else {
        if (this.node.type !== 'array') {
          this.$set(this.node, 'type', 'object')
        }
        this.node.children.push({
          index: 0,
          key: this.node.type !== 'array' ? ' ' : 0,
          type: 'string',
          value: ' ',
          isNew: true,
          children: []
        })
      }
      this.watchObjChange()
    },
    minus () {
      // 子节点往上传递
      this.$emit('on-delete')
    },
    copy () {
      this.$emit('on-copy')
    },
    handleDelete (index) {
      // 接收到子节点的删除操作
      this.node.children.splice(index, 1)
      this.watchObjChange()
    },
    handleCopy (index) {
      const children = this.node.children
      const { length } = children
      const item = _.cloneDeep(children[index])
      if (this.node.type === 'array') {
        item.key = length
      } else {
        item.key = ' '
      }
      item.isNew = true
      // item.index = length
      this.node.children.splice((index + 1), 0, item)
      this.watchObjChange()
    },
    handleBooleanChange (val) {
      this.$emit('on-value-change', val)
    },
    toggleSlide () {
      this.isOpen = !this.isOpen
    },
    handleKeyChange (index, val) {
      if (this.node.children[index].key !== val) {
        this.$set(this.node.children[index], 'key', val)
        this.watchObjChange()
      }
    },
    handleValueChange (index, val) {
      // TODO: 初始化有值就不会在失焦的重复内容，不知道什么原理，待细查
      if (this.node.children[index].value !== val) {
        this.$set(this.node.children[index], 'value', val)
        this.watchObjChange()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.json-node-line{
  line-height: 1.9;
  padding-left: 24px;
  margin-top: 6px;
  &-detail{
    display: flex;
    align-items: baseline;
  }
  &.can-edit{
    .editable-room{
      &:not(.is-array):hover{
        background-color: #ffffab;
        border: 1px solid #fe0;
        cursor: pointer;
        outline: none;
      }
    }
    .show-back-color{
      background-color: #ffffab;
      border: 1px solid #fe0;
    }
  }
  .operate-bar{
    position: absolute;
    left: 0;
    .icon{
      font-size: 12px;
      cursor: pointer;
      margin-right: 2px;
    }
  }
  .editable-key{
    position: relative;
    padding-left: 12px;
    .toggle-icon{
      position: absolute;
      top: 9px;
      left: -4px;
      color: #606266;
      cursor: pointer;
      transition: transform 0.2s ease;
      &.is-up{
        transform: rotate(-180deg);
      }
    }
  }
  .editable-room{
    padding: 0 8px;
    line-height: 1.6;
    // font: 14px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
    border: 1px solid transparent;
    border-radius: 2px;
    white-space: nowrap;

    &.highlight{
      color: red;
    }
    &.is-array{
      color: #ccc;
      cursor: not-allowed;
    }
    &:not(.is-array):focus{
      outline: none;
    }
    &.key{
      display: inline-block;
      flex: 1;
      white-space: nowrap;
    }
  }
  .special-value{
      width: 120px;
  }
  .value-style{
    display: inline-block;
    text-align: left;
    &-item{
      background-color: #fe0;
      padding: 1px 6px;
      border-radius: 4px;
      margin: 0 3px 2px 0;
      white-space: nowrap;
    }
  }
  .select-style{
    width: 100px;
    margin-right: 10px;
  }
}
</style>
