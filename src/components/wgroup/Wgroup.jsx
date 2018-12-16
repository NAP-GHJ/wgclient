import React, { Component } from 'react';
import {Row, Col} from 'antd';

import { Tree, Spin} from 'antd'
import {connect} from 'dva';

const {TreeNode} = Tree;

let timer, ws, time;
class Wgroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageLoading:false,

            // 绑定到canvas上的事件
            mouseDown:false,
            mouseUp:false,
            mouseMove:false,
            mouseMoveCount:0,
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0
        }
    }

    componentDidMount(){
        this.open()
    }

    onSelect = (selectedKeys, info)=>{
        console.log("selected",selectedKeys,info);
        const selectedNodes = info.selectedNodes;
        const node = selectedNodes[0];
        if(!node || node == null) return null;
        const title = node.props.title
        let x1,x2,y1,y2;
        if(title.indexOf("天猫")!=-1) {
            console.log("天猫")
            x1 = 38/4;
            y1 = 418/4;
            x2 = 272/4 - x1;
            y2 = 675/4 - y1;
            this.draw(x1,y1,x2,y2)
        }else if(title.indexOf("RecyclerView")!=-1){
            console.log("第二层")
        }else if(title.indexOf("FrameLayout")!=-1){
            console.log("第一层")
        }
    }

    // 画矩形
    draw(x1,y1,x2,y2){
        var canvas = document.getElementById("operation");
        for(let i = 0; i < 5; i++){
            var context = canvas.getContext('2d');
            context.fillStyle = "#000";
            if(i > 0) context.strokeStyle = "#0E490A"
            else context.strokeStyle = "#f60";
            context.lineWidth = 2;
            // context.fillRect(0,0,500,350);
            context.strokeRect(x1,y1,x2,y2);
            x1 += 71;
        }


        // 绘制其他九个同组的元素
        x1 = 38/4;
        y1 = 698/4
        for(let i = 0; i < 5; i++){
            var context = canvas.getContext('2d');
            context.fillStyle = "#000";
            context.strokeStyle = "#0E490A"
            context.lineWidth = 2;
            // context.fillRect(0,0,500,350);
            context.strokeRect(x1,y1,x2,y2);
            x1 += 71;
        }

    }


    /**
     * 触发一次鼠标点击事件
     */
    mouseClickHandle = () =>{
        const ip = this.props.selectDevice;
        if(!ip || ip === undefined) return alert("未选择虚拟机");

        // 计算映射的坐标位置
        const extendX = 600 / 360
        const extendY = 1000 / 600
        const realX = this.state.startX * extendX;   // 600 * 1000 和 360 * 600 的缩放比例
        const realY = (this.state.startY  + 20) * extendY;
        this.props.dispatch({
            type:"assistantList/operation",
            payload:{ip,values:{
                action:"click",
                startX: realX,
                startY: realY
            }}
        })
        console.log("初始坐标: ",this.state.startX,this.state.startY," 真实坐标: ",realX,realY)
    }

    /**
     * 触发一次鼠标滑动事件
     */
    mouseSwipeHandle = () =>{
        const ip = this.props.selectDevice;
        if(!ip || ip === undefined) return alert("未选择虚拟机");

        // 计算映射的坐标位置
        const extendX = 600 / 360
        const extendY = 1000 / 600
        const startX = this.state.startX * extendX;   // 600 * 1000 和 360 * 600 的缩放比例
        const startY = (this.state.startY + 20) * extendX;   // TODO
        const endX = this.state.endX * extendY;
        const endY = (this.state.endY + 20) * extendY;
        this.props.dispatch({
            type:"assistantList/operation",
            payload:{ip,values:{
                action:"swipe",
                startX,
                startY,
                endX,
                endY
            }}
        })
    }

    /**
     * 触发一次鼠标Up事件
     */
    mouseUpHandle = () =>{
        // console.log("鼠标Up事件",this.state)
        if(this.props.loading) return alert("请耐心等待上一个事件的处理")
        if(this.state.mouseDown && this.state.mouseUp){   // 点击事件: down —> up
            if(!this.state.mouseMove || this.state.mouseMoveCount <= 10){  // 点击事件
                this.mouseClickHandle();
            }else if(this.state.mouseMove && this.state.mouseMoveCount >10){ // 滑动事件
                this.mouseSwipeHandle();
            }else{ // do nothing
            }
            this.setState({
                mouseDown:false,
                mouseUp:false,
                mouseMove:false,
                mouseMoveCount:0
            })
        }
    }

    /**
     * 建立连接
     */
    open(ip) {
         
        this.setState({imgLoading: true });
        timer = setTimeout(() => {
            const BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
            const canvas = document.getElementById('operation');

            canvas.onmousedown = (e)=>{
                //x和y参数分别传入的是鼠标距离窗口的坐标，然后减去canvas距离窗口左边和顶部的距离。
                let rect = canvas.getBoundingClientRect()
                let x = e.clientX - rect.left * (canvas.width/rect.width);
                let y = e.clientY - rect.top * (canvas.height/rect.height);
                console.log("鼠标位置",x,y);
                this.setState({
                    mouseDown:true,
                    startX:x,
                    startY:y
                })    
            }

            canvas.onmouseup = (e)=>{
                let rect = canvas.getBoundingClientRect()
                let x = e.clientX - rect.left * (canvas.width/rect.width);
                let y = e.clientY - rect.top * (canvas.height/rect.height);
                this.setState({
                    mouseUp:true,
                    endX:x,
                    endY:y
                })
                this.mouseUpHandle();
            }

            canvas.onmousemove = (e)=>{
                if(this.state.mouseDown){
                    let count = this.state.mouseMoveCount + 1;
                    this.setState({
                        mouseMove: true,
                        mouseMoveCount: count
                    })
                }
            }

            var g = canvas.getContext('2d');
            var wsUrl = "ws://localhost:9002"
            ws = new WebSocket(wsUrl);

            ws.onerror = function() {
                console.log('onerror');
            };
            let _this = this;
            ws.onmessage = function(message) {
                var blob = new Blob([message.data], {
                    type: 'image/jpeg'
                });
                var URL = window.URL || window.webkitURL
                var img = new Image();
                img.onload = function() {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    // 进行图片的裁剪
                    g.drawImage(img, 0, 0)
                    // g.drawImage(img,0,20,360,550,0,0,360,550)
                    img.onload = null
                    img.src = BLANK_IMG
                    img = null
                    u = null
                    blob = null
                };
                var u = URL.createObjectURL(blob);
                img.src = u;
                _this.setState({ imgLoading: false });
            };

            ws.onopen = function() {
                ws.send('1920x1080/0');
            };
        }, 300);
    }

    render() {
        console.log(this.state.imageLoading)

        return (
            <div id = "wgroup">
                <Row>
                    {/* 第一部分:画布呈现 minicap 界面 */}
                    <Col span={8}>
                        <div id="minicap">
                            <Spin size="large" spinning={this.state.imageLoading}>
                                <canvas ref="canvas" id="operation" width="360" height="640">
                                    你的浏览器不支持
                                </canvas>
                            </Spin>
                        </div>
                    </Col>
                    <Col span={1}></Col>
                    {/* 第二部分:树状的显示UI树 */}
                    <Col span={11}>
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
                        <TreeNode title="LinearLayout{首页} [321,418][555,675]" key="1-0-0-0">
                            <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                                <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                            </TreeNode>
                            <TreeNode title="LinearLayout{微淘} [321,418][555,675]" key="1-0-0-0">
                                <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                                <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                            </TreeNode>
                            <TreeNode title="LinearLayout{消息} [321,418][555,675]" key="1-0-0-0">
                                <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                                <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                            </TreeNode>
                            <TreeNode title="LinearLayout{购物车} [321,418][555,675]" key="1-0-0-0">
                                <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                                <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                            </TreeNode>
                            <TreeNode title="LinearLayout{我的淘宝} [321,418][555,675]" key="1-0-0-0">
                                <TreeNode title="ImageView [321,418][272,602]" key="0-0-0-1" />
                                <TreeNode title="TextView [321,418][272,602]" key="0-0-0-2" />
                            </TreeNode>
                        </TreeNode>
                        </TreeNode>
                    </Tree>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {};
}
export default connect(mapStateToProps)(Wgroup)
