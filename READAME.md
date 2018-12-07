# MVX

## MVC
```js
let view = new View({});
let model = new Model({});
view.render(model.data)
```

## Vue
```js

```

当需要更新的时候，mvc模式整个节点都变了，vue只更新变化了的数据节点(文本节点)