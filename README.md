# simple-vue-json-editor

## 使用组件
```
npm install simple-vue-json-editor -S

import vueJsonEditor from 'simple-vue-json-editor'

import 'simple-vue-json-editor/lib/vue-json-editor.css'

<vue-json-editor :sourceObj="obj"></vue-json-editor>
```

## 参数配置

| 参数名  | 功能  | 类型  | 默认值  |
|:----------|:----------|:----------|:----------|
| canEdit    | 是否可以编辑，为false时，整个json格式只读不可编辑    | Boolean   | true    |
| sourceObj    | 源对象，需要展示的对象内容   | Object    |     |
| highlightFileds    | 作为高亮依据的字段，暂时只有“isNew”可配置，配置之后新创建的字段会标红高亮   | Array    |   []  |
| isNewEditableOnly    | 已有数据不可编辑，新增数据才可编辑   | Boolean    |  false   |
| canToggle    | 是否需要展开收起的功能，为false时，收缩icon会隐藏   | Boolean    |  true   |


## 使用效果

![效果图](https://cdn.wanwudezhi.com/static/web-static/image/7693ee5c9b6139c1534b54ca1151bcf4/6BA66032-A8C2-4B40-BCB0-792BE66F0CC5.png "效果图")

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
