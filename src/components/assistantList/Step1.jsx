import React, { Component } from 'react'
import {Select,Input,Divider,notification} from 'antd'
import {connect} from 'dva'

const Search = Input.Search;
const Option = Select.Option;

/**
 * 绑定手机号与虚拟机
 */
class Step1 extends Component{
    constructor(props){
        super(props)
    }

    handleChange = (value) =>{
        this.props.dispatch({
            type:"assistantList/selectDevice",
            payload:{selectDevice:value}
        })
    }

    /**
     * 绑定手机与虚拟机
     */
    handleInput = (value)=>{

        console.log("输入的手机号为 :",value)
        console.log("状态为:",this.props.selectDevice,this.props.loading)
        if(this.props.selectDevice != null || this.props.loading) {
            return notification['warning']({
                message: '部署状态',
                description: '已经分配虚拟机.',
            });
        }
        this.props.dispatch({
            type:"assistantList/bindNumberDevice",
            payload:{
                number:value
            }
        }).then((err)=>{
            if(err === undefined) return;
            return notification['warning']({
                message: '部署状态',
                description: '部署失败,没有可以分配的虚拟机.',
            });
        })
    }

    render(){
        // 虚拟机选择
        // const children = [];
        // children.push(<Option key={'192.168.2.196:5555'}>192.168.2.196:5555</Option>)
        // children.push(<Option key={'192.168.2.197:5555'}>192.168.2.197:5555</Option>)
        // children.push(<Option key={'114.212.189.146:10001'}>114.212.189.146:10001</Option>)
        
        return(
            <div>
                {/* 使用用户选择的方式获取空闲的虚拟机 */}
                {/* 选择空闲的虚拟机 */}
                {/* <Select
                    // defaultValue={children[0]}
                    onChange={this.handleChange}
                    style={{ width: 200, marginLeft:20}}
                    >
                    {children}
                </Select> */}
                提示: 绑定手机号,才能分配虚拟机
                <Divider dashed/>
                <Search
                    placeholder="请输入手机号"
                    enterButton="进行绑定"
                    size="default"
                    onSearch={this.handleInput}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {selectDevice,selectNumber} = state.assistantList;
    const loading = state.loading.models.assistantList;
    return {selectDevice,selectNumber,loading}
}
export default connect(mapStateToProps)(Step1)