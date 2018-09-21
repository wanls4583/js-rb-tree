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
     * 插入节点
     * @param  {AVLNode} root 子树的根节点
     * @param  {AVLNode} node 待插入的节点
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
                this._checkBalance(root);
            } else { //插入叶子节点
                root.lChild = node;
                node.pNode = root;
            }
        } else { //插入右子树
            if (root.rChild) { //在右子树上递归插入
                if (!this._insert(root.rChild, node)) {
                    return false;
                }
                this._checkBalance(root);
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
    //右旋转
    _rRotate(node) {
        var lc = node.lChild;
        lc.pNode = node.pNode;
        node.lChild = lc.rChild;
        lc.rChild && (lc.rChild.pNode = node);
        lc.rChild = node;
        node.color = 1;
        lc.color = 0;
        if (node == this.root) {
            this.root = lc;
        } else {
            if (node.pNode.lChild == node) {
                node.pNode.lChild = lc;
            } else {
                node.pNode.rChild = lc;
            }
        }
        node.pNode = lc;
    }
    //左选转
    _lRotate(node) {
        var rc = node.rChild;
        rc.pNode = node.pNode;
        node.rChild = rc.lChild;
        rc.lChild && (rc.lChild.pNode = node);
        rc.lChild = node;
        node.color = 1;
        rc.color = 0;
        if (node == this.root) {
            this.root = rc;
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
        var rc = node.lChild.rChild;
        node.lChild.rChild = rc.lChild;
        rc.lChild && (rc.lChild.pNode = node.lChild);
        rc.lChild = node.lChild;
        node.lChild.pNode = rc;
        node.lChild = rc;
        rc.pNode = node;
        //右旋转
        this._rRotate(node);
    }
    //先右旋转（不需要变色），再左旋转
    _rlRotate(node) {
        //先右旋转右子节点
        var lc = node.rChild.lChild;
        node.rChild.lChild = lc.rChild;
        lc.rChild && (lc.rChild.pNode = node.rChild);
        lc.rChild = node.rChild;
        node.rChild.pNode = lc;
        node.rChild = lc;
        lc.pNode = node;
        //左旋转
        this._lRotate(node);
    }
    //检查并调整树
    _checkBalance(node) {
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
                    this._lRotate(node);
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
                    this._rRotate(node);
                } else { //先左旋转，再右旋转
                    this._lrRotate(node);
                }
            }
            //root将变lc的子节点，需要先更新root节点的高度
            this._setHeight(node);
            lc && this._setHeight(lc);
        }
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