import React, { Component } from 'react'
import {Select} from 'antd'
import {connect} from 'dva'

const Option = Select.Option;

class Step2 extends Component{
    constructor(props){
        super(props)
    }

    handleChange = (value) =>{
        console.log(`Selected: ${value}`);
    }

    render(){
        const children = [];
        for (let i = 10; i < 36; i++) {
            children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
        }

        return(
            <div>
                选择绑定的手机号
                <Select
                    defaultValue="12345678901"
                    onChange={this.handleChange}
                    style={{ width: 200, marginLeft:20}}
                    >
                    {children}
                </Select>
            </div>
        )
    }
}

// 绑定可以使用的手机号列表
function mapStateToProps(state) {
    return {}
}
export default connect(mapStateToProps)(Step2)