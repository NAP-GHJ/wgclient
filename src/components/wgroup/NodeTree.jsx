import React, { Component } from 'react'
import {Tree} from 'antd'
import {connect} from 'dva'

const {TreeNode} = Tree;

class NodeTree extends Component{
    constructor(props){
        super(props)
        console.log(props)
    }

    onSelect = (selectedKeys, info)=>{
        console.log("selected",selectedKeys,info);
    }

    render(){
        
        return(
            <div id="nodeTree">
                <Tree
                    showLine
                    defaultExpandedKeys={['0-0']}
                    onSelect={this.onSelect}
                >
                    <TreeNode title="FrameLayout [0,0][1440,2392]" key="0-0">
                    <TreeNode title="android.support.v7.widget.RecyclerView [0,252][1440,2224]" key="0-0-0">
                        <TreeNode title="LinearLayout{天猫} [0,252][1440,403]" key="0-0-0-0">
                            <TreeNode title="ImageView [38,418][272,602]" key="0-0-0-0-1" />
                            <TreeNode title="TextView [38,418][272,602]" key="0-0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{聚划算} [321,418][555,675]" key="0-0-0-1">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-1-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{天猫国际} [321,418][555,675]" key="0-0-0-2">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{饿了么} [321,418][555,675]" key="0-0-0-3">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{天猫超市} [321,418][555,675]" key="0-0-0-4">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{充值中心} [321,418][555,675]" key="0-0-0-5">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{飞猪旅行} [321,418][555,675]" key="0-0-0-6">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{领金币} [321,418][555,675]" key="0-0-0-7">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{拍卖} [321,418][555,675]" key="0-0-0-8">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{分类} [321,418][555,675]" key="0-0-0-9">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                        
                    </TreeNode>
                    
                    <TreeNode title="FrameLayout [0,0][1440,2392]" key="0-1">
                        <TreeNode title="LinearLayout ..." key="0-0-1-0" />
                    </TreeNode>
                    <TreeNode title="TabWidget [0,0][1440,2392]" key="0-2">
                    <TreeNode title="LinearLayout{首页} [321,418][555,675]" key="0-0-0-0">
                        <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{微淘} [321,418][555,675]" key="0-0-0-0">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{消息} [321,418][555,675]" key="0-0-0-0">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{购物车} [321,418][555,675]" key="0-0-0-0">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="LinearLayout{我的淘宝} [321,418][555,675]" key="0-0-0-0">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                            <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                        </TreeNode>
                    </TreeNode>
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}
export default connect(mapStateToProps)(NodeTree)