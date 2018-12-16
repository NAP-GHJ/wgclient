import React, { Component } from 'react';
import {Row, Col} from 'antd';

import { Modal, Steps, Button, Divider, Icon, Spin} from 'antd'
import {connect} from 'dva';
const Step = Steps.Step;

let timer, ws, time;
class Wgroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            currentStep:0,   // 步骤计数
            currentStatus:"process",  //wait,process,finish,error
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

    /**
     * 显示初始化
     */
    showModalHandler = e => {
        if (e) e.stopPropagation()
        this.setState({
            visible: true,
        })
    }

    /**
     * 关闭弹窗的事件处理
     */
    hideModalHandler = (e) => {

        if (e) e.stopPropagation()
        this.setState({
            visible: false,
            currentStep:0,
            currentStatus:"process"
        })

        if (ws && ws.url) {
            ws.close();
        }
    }

    /**
     * 退出部署的事件回调
     *
     */
    cancelHandler = (e)=>{
        // 向服务器发送消息，取消手机绑定
        const number = this.props.selectNumber;
        const ip = this.props.selectDevice;
        if(number == null || ip == null) {
            alert("取消部署则会部署失败,请确定")
            return this.hideModalHandler(e)
        }
        alert("取消部署则会部署失败,请确定")
        this.props.dispatch({
            type:"assistantList/deployStatus",
            payload:{
                number: number,
                ip : ip,
                result: false
            }
        })
        
        this.hideModalHandler(e)
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
     * 完成部署的事件回调
     */
    okHandler = e => {
        if(this.state.currentStep == 0){
            this.handleNext()
        }else{
            if (e) e.stopPropagation()
            // 发送状态信息到服务器
            const number = this.props.selectNumber;
            const ip = this.props.selectDevice;
            if(number == null || ip == null) return alert("部署失败")
            alert("请确定完成部署")
            this.props.dispatch({
                type:"assistantList/deployStatus",
                payload:{
                    number: number,
                    ip : ip,
                    result: true
                }
            })
            this.hideModalHandler()
        }
    }

    /**
     * 手机绑定成功之后进入到下一步
     */
    handleNext = ()=>{
        // 绑定失败
        console.log("绑定手机状态",this.props.loading)
        if(this.props.loading){
            return alert("正在绑定手机号,请稍后重试 ... ")
        }else{
            if(this.props.selectDevice == null){
                alert("手机号码绑定失败,退出部署")
                this.hideModalHandler()
            }else{
                console.log(this.props.selectDevice)
                const nextStep = this.state.currentStep + 1
                this.setState({
                    currentStep:nextStep,
                })

                // readyState为3表示WebSocket已经处于关闭状态
                if(!ws || !ws.url || ws.readyState === 3){ 
                    this.open(this.props.selectDevice)
                }
            }
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
                    // g.drawImage(img, 0, 0)
                    g.drawImage(img,0,20,360,550,0,0,360,550)
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

        return (
            <div id = "wgroup">
                <Row>
                {/* 画布: minicap 界面 */}
                <Col span={6}>
                    <div id="minicap">
                        <Spin size="large" spinning={this.state.imgLoading}>
                            <canvas ref="canvas" id="operation" width="360" height="600">
                                你的浏览器不支持
                            </canvas>
                        </Spin>
                    </div>
                </Col>
                <Col span={12}>col-12</Col>
                </Row>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {};
}
export default connect(mapStateToProps)(Wgroup)
