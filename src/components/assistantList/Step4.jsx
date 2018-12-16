import React, { Component } from 'react'
import {connect} from 'dva';
import {Input} from 'antd';

const Search = Input.Search;

class Step4 extends Component{
    constructor(props){
        super(props)
    }

    render(){

        return(
            <div>
                <Search
                    placeholder="输入验证码"
                    enterButton="完成验证"
                    size="default"
                    onSearch={value => console.log(value)}
                />
            </div>
        )
    }
}

// 绑定可以使用的手机号列表
function mapStateToProps(state) {
    return {}
}
export default connect(mapStateToProps)(Step4)