//节点
class RBNode {
    constructor(key, data) {
        this.key = key; //关键字
        this.data = data; //数据
        this.lChild = null; //左子树
        this.rChild = null; //右子树
        this.pNode = null; //父节点
        this.height = 0; //方便用canvas画树
        this.color = 0; //颜色，0:black,1:red
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
        this._insert(node);
    }
    _insert(node) {
        if (!node) {
            return;
        }
    }
    //右旋转
    _rRotate(node) {
        var lc = node.lChild;
        node.lChild = lc.rChild;
        lc.rChild && (lc.rChild.pNode = node);
        lc.rChild = node;
        node.pNode = lc;
        node.color = 1;
        lc.color = 0;
        if (node == this.root) {
            this.root = lc;
        } else {
        	if(node.pNode.lChild = node) {
        		node.pNode.lChild = lc;
        	}else{
        		node.pNode.rChild = lc;
        	}
        }
        lc.pNode = node.pNode;
    }
    //左选转
    _lRotate(node) {
        var rc = node.rChild;
        node.rChild = rc.lChild;
        rc.lChild && (rc.lChild.pNode = node);
        rc.lChild = node;
        node.pNode = rc;
        node.color = 1;
        rc.color = 0;
        if (node == this.root) {
            this.root = rc;
        } else {
        	if(node.pNode.lChild = node) {
        		node.pNode.lChild = rc;
        	}else{
        		node.pNode.rChild = rc;
        	}
        }
        rc.pNode = node.pNode;
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
}