import React, { Component } from 'react'
import { Modal,Spin} from 'antd'
import {connect} from 'dva'

let timer, ws, time;

class MinicapModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            imgLoading: false,
            ip:''
        }
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    /**
     * 显示初始化
     */
    showModalHandler = e => {
        if (e) e.stopPropagation()
        const {ip} = this.props.record;
        this.setState({
            visible: true,
            ip
        })
        if(!ws || !ws.url || ws.readyState === 3){  // readyState为3表示WebSocket已经处于关闭状态
            this.open(ip)
        }
    }

    /**
     * 关闭弹窗的事件处理
     */
    hideModalHandler = (e) => {
        if (e) e.stopPropagation()
        this.setState({
            visible: false,
            imgLoading: false
        })
        if (ws && ws.url) {
            ws.close();
        }
    }

    okHandler = e => {
        if (e) e.stopPropagation()
        this.hideModalHandler()
    }

    /**
     * 建立连接
     */
    open(ip) {
        this.setState({imgLoading: true });  
        timer = setTimeout(() => {
            const BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
            const canvas = document.getElementById(`myCanvas-${ip}`);
            var g = canvas.getContext('2d');
            var wsUrl = `ws://221.228.66.83:14000/minicap/?ip=${ip}`;
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
                    g.drawImage(img, 0, 0)
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
            clearTimeout(timer);
        }, 300);
    }



    render() {
        const { children } = this.props
        return (
            <span>
                <span onClick={this.showModalHandler}>
                    {children}
                    <Modal
                        title="更新表项"
                        visible={this.state.visible}
                        onOk={this.okHandler}
                        onCancel={this.hideModalHandler}
                    >
                        <Spin size="large" spinning={this.state.imgLoading}>
                            <canvas ref="canvas" id={`myCanvas-${this.state.ip}`} width="360" height="600">
                                你的浏览器不支持
                            </canvas>
                        </Spin>
                    </Modal>
                </span>
            </span>
        )
    }
}


function mapStateToProps(state) {
    return {}
}
export default connect(mapStateToProps)(MinicapModal)
