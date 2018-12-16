import React from 'react';
import {connect} from 'dva';
import {Layout, Table, Modal, Badge, Divider, message, Spin, Button} from 'antd';
import MinicapModal from './MinicapModal';
import AddModal from './AddModal';

const {Content} = Layout;
let timer;
class List extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            page:1
        };
    }

    componentDidMount(){
        this.updateState();
    }

    componentWillUnmount(){
        clearInterval(timer)
    }

    /**
     * 定时更新状态
     */
    updateState(){
        timer = setInterval(()=>{
            this.props.dispatch({
                type:"assistantList/updateState",
                payload:{}
            }).then(res =>{
                this.props.dispatch({
                    type:"assistantList/fetch",
                    payload:{}
                }).then(()=>{
                    console.log("定时更新状态",this.props.assistantList)
                })
            })
        },600000)
    }


	/**
	 * 分页处理的事件
	 */
	pageChangeHand = (page)=>{
		this.setState({
			page:page
        });
	}

    /**
     * 处理重连接ADB的事件
     */
    handleConnect = (record,text) =>{
        console.log("重新连接",record.ip)
        clearInterval(timer);
        const ip = `vm/${record.ip}/status/adb`
        this.props.dispatch({
            type:"assistantList/reconnectADB",
            payload:{ip}
        }).then(res =>{
            if (res.isAdbConnected) {
                message.success('连接成功');
                this.props.dispatch({
                    type:"assistantList/fetch",
                    payload:{}
                })
            } else {
                message.error('连接失败');
            }
        })
    }

    /**
     * 唤醒微信
     */
    handleWakeUp = (record,text) =>{
        console.log("唤醒微信",record.ip);
        clearInterval(timer);
        const ip = `vm/${record.ip}/status/wechat`;
        this.props.dispatch({
            type:"assistantList/wakeupWechat",
            payload:{ip}
        }).then(res =>{
            if (res.isWechatForeground) {
                message.success('唤起成功');
                this.props.dispatch({
                    type:"assistantList/fetch",
                    payload:{}
                })
            } else {
                message.error('唤起失败');
            }
        })
    }

    render(){
        const columns = [
            {
                title: '微信ID',
                dataIndex: 'wxid',
                width: 100
            }, {
                title: '昵称',
                dataIndex: 'nickname',
                width: 100
            }, {
                title: '手机号',
                dataIndex: 'name',
                width: 120,
            }, {
                title: <span>虚拟机网络<br/>连接状态</span>,
                dataIndex: 'isNetConnected',
                width: 110,
                render: (text, record) => (
                    <Badge
                        status={record && record.isNetConnected ? "success" : "error"}
                        text={record && record.isNetConnected ? '正常' : '异常'}
                    />
                )
            }, {
                title: <span>虚拟机Adb<br/>连接状态</span>,
                dataIndex: 'isAdbConnected',
                width: 110,
                render: (text, record) => (
                    <Badge
                        status={record && record.isAdbConnected ? "success" : "error"}
                        text={record && record.isAdbConnected ? '正常' : '异常'}
                    />
                )
            }, {
                title: '微信前台',
                dataIndex: 'isWechatForeground',
                width: 90,
                render: (text, record) => (
                    <Badge
                        status={record && record.isWechatForeground ? "success" : "error"}
                        text={record && record.isWechatForeground ? '正常' : '异常'}
                    />
                )
            }, {
                title: '微信进程',
                dataIndex: 'psList',
                width: 200,
                render: (text, record) => (
                    <div>
                        {
                            record.psList && record.psList.length > 0 ?
                                record.psList.map((it, i) => {
                                    return <p key={i} style={{ margin: 0 }}>{it}</p>
                                })
                                : '-'
                        }
                    </div>
                )
            }, {
                title: '操作',
                dataIndex: 'operate',
                width: 200,
                render: (text, record) => (
                    <div>
                        {
                            record.isAdbConnected ?
                                ''
                                :
                                <a href="javascript:;" onClick={()=>this.handleConnect(record,text)}>重新连接</a>
                        }
                        {record.isAdbConnected ? '' : <Divider type="vertical" />}
                        {
                            (record.isWechatForeground || record.name == null)?
                                ''
                                :
                                <a href="javascript:;" onClick={()=>this.handleWakeUp(record,text)}>唤起</a>
                        }
                        {(record.isWechatForeground || record.name == null) ? '' : <Divider type="vertical" />}
                        <MinicapModal record={record}>
                            <a href="javascript:;" >查看</a>
                        </MinicapModal>
                    </div>
                )
            }
        ];



        return(
            <Layout className="layout" style={{ background: 'white' }}>
                <Content style={{ padding: '50px' }}>
                	<AddModal>
						<Button type="primary">部署小助手</Button>
					</AddModal>
                    <Divider dashed/>
                    <Table
                        rowKey={data => data._id}                    
                        columns={columns}
                        dataSource={this.props.assistantList}
                        loading={this.props.loading}
                        pagination={{
							className:"ant-table-pagination",
							total:this.props.assistantList.length,
							current:this.state.page,
                            onChange:this.pageChangeHand,
                            showTotal:total => `共计 ${total} 项`,
                            showSizeChanger:true,
                            defaultPageSize:20,
                            pageSizeOptions:['10','20','50']
						}}                      
                    />
                </Content>
            </Layout>
        )
    }
}

function mapStateToProps(state){
    const {vmList,assistantList} = state.assistantList;
    const loading = state.loading.models.assistantList;
    return {vmList,assistantList,loading}
}

export default connect(mapStateToProps)(List);