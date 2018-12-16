import React, { Component } from 'react'
import {connect} from 'dva';
import {Input} from 'antd';

const Search = Input.Search;

class Step3 extends Component{
    constructor(props){
        super(props)
    }

    handleInput = (value)=>{
        const ip = this.props.selectDevice;
        if(!ip || ip === undefined) return alert("未选择虚拟机");
        this.props.dispatch({
            type:"assistantList/operation",
            payload:{ip,values:{
                action:"text",
                text:value
            }}
        })
    }

    render(){

        return(
            <div>
                <Search
                    placeholder="输入文本"
                    enterButton="输入文本"
                    size="default"
                    onSearch={this.handleInput}
                />
            </div>
        )
    }
}

// 绑定可以使用的手机号列表
function mapStateToProps(state) {
    const {selectDevice} = state.assistantList;
    return {selectDevice}
}
export default connect(mapStateToProps)(Step3)