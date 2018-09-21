//节点
class RBNode {
    constructor(key, data) {
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
}

//红黑树
class RBTree {
    constructor() {
        this.root = null;
    }
    /**
     * 插入节点
     * @param  {[type]} key  节点的key
     * @param  {[type]} data 节点的数据
     * @return {Boolean}     插入是否成功
     */
    insert(key, data) {
        var node = new RBNode(key, data);
        if (!this.root) {
            node.color = 0;
            this.root = node;
            return true;
        }
        return this._insert(this.root, node);
    }
    /**
     * 删除节点
     * @param  {[type]}	 key 需要删除的节点的key
     * @return {RBNode}     被删除后的点
     */
    delete(key) {
        var result = this._delete(this.root, key);
        if (result.pre) {
            result.pre.next = result.next;
        }
        if (result.next) {
            result.next.pre = result.pre;
        }
        return result;
    }
    /**
     * 查找节点
     * @param  {[type]}  key 需要查找的节点的key
     * @return {RBNode}     查找结果
     */
    search(key) {
        return this._search(this.root, key);
    }
    /**
     * 插入节点
     * @param  {RBNode} root 子树的根节点
     * @param  {RBNode} node 待插入的节点
     * @return {Boolean}      插入是否成功
     */
    _insert(root, node) {
        if (root.key == node.key) {
            return false;
        } else if (root.key > node.key) { //插入左子树
            if (root.lChild) { //在左子树上递归插入
                if (!this._insert(root.lChild, node)) {
                    return false;
                }
                this._insertBalance(root);
            } else { //插入叶子节点
                root.lChild = node;
                node.pNode = root;
            }
        } else { //插入右子树
            if (root.rChild) { //在右子树上递归插入
                if (!this._insert(root.rChild, node)) {
                    return false;
                }
                this._insertBalance(root);
            } else { //插入叶子节点
                root.rChild = node;
                node.pNode = root;
            }
        }
        //生成中序遍历前后件关系
        if (!node.next && root.key > node.key) {
            node.next = root;
            root.pre = node;
        } else if (!node.pre && root.key < node.key) {
            node.pre = root;
            root.next = node;
        }
        //更新节点的高度
        this._setHeight(root);

        return true;
    }
    /**
     * 删除节点
     * @param  {RBNode} root 	子树的根节点 
     * @param  {[type]}	 key  	待删除的节点的key
     * @return {Boolean}      	是否删除成功
     */
    _delete(root, key) {
        if (!root) {
            return false;
        }
        if (root.key == key) {
            if (!root.lChild && !root.rChild) { //叶子节点，直接删除
                if (this.root == root) {
                    this.root = null;
                } else {
                    if (root.color == 0) { //待删除节点为黑色，需要调整树
                        this._deleteBalance(root);
                    }
                    if (root.pNode.lChild == root) {
                        root.pNode.lChild = null;
                    } else {
                        root.pNode.rChild = null;
                    }
                    this._setHeight(root.pNode);
                }
                return root;
            } else if (!root.lChild || !root.rChild) { //没有右子树或者没有左子树
                var child = root.lChild || root.rChild;
                if (this.root == root) {
                    this.root = child;
                    this.root.color = 0;
                    this.root.pNode = null;
                } else {
                    if (root.color == 0 && child.color == 0) { //待删除节点为黑色，且其子节点也为黑色，需要调整树
                        this._deleteBalance(root);
                    } else if (root.color == 1 && child.color == 1) {
                        child.color = 0;
                    }
                    if (root.pNode.lChild == root) {
                        root.pNode.lChild = child;
                    } else {
                        root.pNode.rChild = child;
                    }
                    child.pNode = root.pNode;
                    this._setHeight(root.pNode);
                }
                return root;
            } else { //用左子树上最大的节点代替root
                var rChild = root.lChild.rChild;
                var lChild = root.lChild;
                while (rChild && rChild.rChild) {
                    rChild = rChild.rChild;
                }
                if (!rChild) {
                    rChild = lChild;
                }
                //交换root和lChild
                this._change(root, rChild);
                //保证删除的节点没有左子树，或者没有右子树，用来递归更新所有需要更新高度的节点
                var result = this._delete(root.lChild, key);
                this._setHeight(rChild);
                return result;
            }
        } else if (root.key > key) { //在左子树上递归删除
            var result = this._delete(root.lChild, key);
            if (!result) {
                return false;
            }
            return result;
        } else { //在右子树上删除
            var result = this._delete(root.rChild, key);
            if (!result) {
                return false;
            }
            return result;
        }
    }
    /**
     * 搜索节点
     * @param  {RBNode} root   子树的根节点 
     * @param  {[type]}  key    待查找的节点的key
     * @return {RBNode}        查找结果
     */
    _search(root, key) {
        if (!root) {
            return false;
        }
        if (root.key == key) {
            return root;
        } else if (root.key > key) {
            return this._search(root.lChild, key);
        } else {
            return this._search(root.rChild, key);
        }
    }
    /**
     * 右旋转
     * @param  {RBNdde}	 node          需要旋转的节点
     * @param  {Boolean} ifChangeColor 是否需要更改节点颜色
     */
    _rRotate(node, ifChangeColor) {
        var lc = node.lChild;
        lc.pNode = node.pNode;
        node.lChild = lc.rChild;
        lc.rChild && (lc.rChild.pNode = node);
        lc.rChild = node;
        if (ifChangeColor) {
            node.color = 1;
            lc.color = 0;
        }
        if (node == this.root) {
            this.root = lc;
            this.root.color = 0;
        } else {
            if (node.pNode.lChild == node) {
                node.pNode.lChild = lc;
            } else {
                node.pNode.rChild = lc;
            }
        }
        node.pNode = lc;
    }
    /**
     * 左旋转
     * @param  {RBNdde}	 node          需要旋转的节点
     * @param  {Boolean} ifChangeColor 是否需要更改节点颜色
     */
    _lRotate(node, ifChangeColor) {
        var rc = node.rChild;
        rc.pNode = node.pNode;
        node.rChild = rc.lChild;
        rc.lChild && (rc.lChild.pNode = node);
        rc.lChild = node;
        if (ifChangeColor) {
            node.color = 1;
            rc.color = 0;
        }
        if (node == this.root) {
            this.root = rc;
            this.root.color = 0;
        } else {
            if (node.pNode.lChild == node) {
                node.pNode.lChild = rc;
            } else {
                node.pNode.rChild = rc;
            }
        }
        node.pNode = rc;
    }
    //先左选转（不需要变色），再右选转
    _lrRotate(node) {
        //先左旋转左子节点
        this._lRotate(node.lChild);
        //右旋转
        this._rRotate(node, true);
    }
    //先右旋转（不需要变色），再左旋转
    _rlRotate(node) {
        //先右旋转右子节点
        this._lRotate(node.rChild);
        //左旋转
        this._lRotate(node, true);
    }
    //插入后检查并调整树
    _insertBalance(node) {
        if (node.rChild && node.rChild.color == 1 && (node.rChild.lChild && node.rChild.lChild.color == 1 || node.rChild.rChild && node.rChild.rChild.color == 1)) { //右子树不平衡，需要调整
            var rc = null;
            if (node.lChild && node.lChild.color == 1) { //如果左节点为红节点，不需要旋转，只需要改变颜色
                node.lChild.color = 0;
                node.rChild.color = 0;
                if (node != this.root) { //如果是根节点，不需要变色
                    node.color = 1;
                }
            } else {
                rc = node.rChild;
                if (node.rChild.rChild && node.rChild.rChild.color == 1) { //左旋转
                    this._lRotate(node, true);
                } else { //先右旋转，再左旋转
                    this._rlRotate(node);
                }
            }
            //root将变lc的子节点，需要先更新root节点的高度
            this._setHeight(node);
            rc && this._setHeight(rc);
        } else if (node.lChild && node.lChild.color == 1 && (node.lChild.lChild && node.lChild.lChild.color == 1 || node.lChild.rChild && node.lChild.rChild.color == 1)) { //左子树不平衡，需要调整
            var lc = null;
            if (node.rChild && node.rChild.color == 1) { //如果右节点为红节点，不需要旋转，只需要改变颜色
                node.lChild.color = 0;
                node.rChild.color = 0;
                if (node != this.root) { //如果是根节点，不需要变色
                    node.color = 1;
                }
            } else {
                lc = node.lChild;
                if (node.lChild.lChild && node.lChild.lChild.color == 1) { //左旋转
                    this._rRotate(node, true);
                } else { //先左旋转，再右旋转
                    this._lrRotate(node);
                }
            }
            //root将变lc的子节点，需要先更新root节点的高度
            this._setHeight(node);
            lc && this._setHeight(lc);
        } else {
            this._setHeight(node);
        }
    }
    //删除后检查并调整树
    _deleteBalance(node) {
        if (!node.pNode) {
            return;
        }
        var pNode = node.pNode;
        if (pNode.lChild == node) {
            if (pNode.rChild && pNode.rChild.color == 1) { //兄弟节点为红色
                pNode.rChild.color = 0;
                pNode.rChild.lChild && (pNode.rChild.lChild.color = 1);
                this._lRotate(pNode);
            } else {
                if (pNode.rChild && pNode.rChild.rChild && pNode.rChild.rChild.color == 1) { //兄弟节点的右子节点为红色
                    pNode.color = 0;
                    pNode.rChild.color = 1;
                    pNode.rChild.rChild.color = 0;
                    this._lRotate(pNode);
                } else if (pNode.rChild && pNode.rChild.lChild && pNode.rChild.lChild.color == 1) { //兄弟节点的左子节点为红色
                    pNode.color = 0;
                    this._rRotate(pNode.rChild);
                    this._lRotate(pNode);
                } else if (pNode.color == 1 && (pNode.lChild || pNode.rChild)) { //父节点为红色
                    pNode.color = 0;
                    if (pNode.lChild) {
                        pNode.lChild.color = 1;
                    } else {
                        pNode.rChild.color = 1;
                    }
                } else {
                    pNode.rChild && (pNode.rChild.color = 1);
                    this._deleteBalance(pNode);
                }
            }
        } else {
            if (pNode.lChild && pNode.lChild.color == 1) { //兄弟节点为红色
                pNode.lChild.color = 0;
                pNode.lChild.rChild && (pNode.lChild.rChild.color = 1);
                this._rRotate(pNode);
            } else {
                if (pNode.lChild && pNode.lChild.lChild && pNode.lChild.lChild.color == 1) { //兄弟节点的左子节点为红色
                    pNode.color = 0;
                    pNode.lChild.color = 1;
                    pNode.lChild.lChild.color = 0;
                    this._rRotate(pNode);
                } else if (pNode.lChild && pNode.lChild.rChild && pNode.lChild.rChild.color == 1) { //兄弟节点的左子节点为红色
                    pNode.color = 0;
                    this._lRotate(pNode.lChild);
                    this._rRotate(pNode);
                } else if (pNode.color == 1 && (pNode.lChild || pNode.rChild)) { //父节点为红色
                    pNode.color = 0;
                    if (pNode.lChild) {
                        pNode.lChild.color = 1;
                    } else {
                        pNode.rChild.color = 1;
                    }
                } else {
                    pNode.lChild && (pNode.lChild.color = 1);
                    this._deleteBalance(pNode);
                }
            }
        }
    }
    /**
     * 交换两个节点
     * @param  {RBNode} node1 
     * @param  {RBNode} node2
     */
    _change(node1, node2) {
        var key = node1.key;
        var data = node1.data;

        node1.key = node2.key;
        node1.data = node2.data;

        node2.key = key;
        node2.data = data;
    }
    //获取树的高度
    _getHeight(node) {
        if (!node) {
            return 0;
        }
        return node.height;
    }
    //设置树的高度
    _setHeight(node) {
        var height = Math.max(this._getHeight(node.lChild), this._getHeight(node.rChild)) + 1;
        //如果是叶子节点，不用加1
        if (!node.lChild && !node.rChild) {
            height = 0;
        }
        node.height = height;
    }
}