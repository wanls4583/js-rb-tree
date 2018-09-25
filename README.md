# js-rb-tree

> 使用 JavaScript 编写的红黑树，可以快速的插入，删除和查找数据。

## 内容

- [**`安装`**](#安装)
- [**`案例`**](#案例)
- [**`RBNode`**](#RBNode)
- [**`insert`**](#insert)
- [**`delete`**](#delete)
- [**`search`**](#rsearch)
- [**`贡献`**](#贡献)


## 安装

```bash
npm install js-rb-tree
```

## 案例

请查看[**`example`**](https://github.com/wanls4583/js-rb-tree/tree/master/src/example)

[**`online demo`**](https://blog.lisong.hn.cn/code/example/js-rb-tree/src/example/index.html)

## RBNode

```javascript
//节点
function RBNode(key, data) {
    this.key = key; //关键字
    this.data = data; //数据
    this.lChild = null; //左子树
    this.rChild = null; //右子树
    this.pNode = null; //父节点
    this.height = 0; //方便用canvas画树
    this.color = 1; //颜色，0:black,1:red
    this.pre = null; //前一个有序节点
    this.next = null; //后一个有序节点
}
```

## insert

```javascript
/**
 * 插入节点
 * @param  {[type]} key  节点的key
 * @param  {[type]} data 节点的数据
 * @return {Boolean}     插入是否成功
 */
insert = function(key, data)
```

## delete

```javascript
/**
 * 删除节点
 * @param  {[type]}  key 需要删除的节点的key
 * @return {RBNode}     被删除后的点
 */
delete = function(key)
```

## search

```javascript
/**
 * 查找节点
 * @param  {[type]}  key 需要查找的节点的key
 * @return {RBNode}     查找结果
 */
search = function(key)
```

## 贡献

欢迎给出一些意见和优化，期待你的 `Pull Request`