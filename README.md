# vue-json-editor

## 使用组件
```
npm install vue-json-editor -S

import vueJsonEditor from 'vue-json-editor'

<editors :sourceObj="obj"></editors>
```

## 参数配置

| 参数名  | 功能  | 类型  | 默认值  |
|:----------|:----------|:----------|:----------|
| canEdit    | 是否可以编辑，为false时，整个json格式只读不可编辑    | Boolean   | true    |
| sourceObj    | 源对象，需要展示的对象内容   | Object    |     |
| highlightFileds    | 作为高亮依据的字段，暂时只有“isNew”可配置，配置之后新创建的字段会标红高亮   | Array    |   []  |
| isNewEditableOnly    | 已有数据不可编辑，新增数据才可编辑   | Boolean    |  false   |
| canToggle    | 是否需要展开收起的功能，为false时，收缩icon会隐藏   | Boolean    |  true   |


### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
