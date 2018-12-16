import * as AssistantService from '../services/assistantList';

export default {
    namespace: 'wgoup',
    state: {
        vmList:[],   // 微信小助手列表
        assistantList:[], // 微信小助手列表
        selectNumber:null, // 正在部署的手机号
        selectDevice:null, // 正在部署的小助手
    },
    reducers:{
        save(state, {payload:{vmList,assistantList}}){
            return {...state,vmList,assistantList}
        },
        saveSelectDevice(state,{payload:{selectDevice,selectNumber}}){
            return {...state,selectDevice,selectNumber}
        }
    },
    effects:{
        *fetch({payload},{call,put}){  // 获取系统的虚拟机状态以及每个的微信小助手状态
            const result = yield call(AssistantService.getVMLists);
            let assistantList = []
            for(const vm of result.data){
                const assistant = yield call(AssistantService.getAssistantByVm,vm);
                assistantList.push(assistant.data)
            }
            yield put({
                type:'save',
                payload:{ vmList:result.data,assistantList}
            })
        },
        *reconnectADB({payload},{call,put}){
            const res = yield call(AssistantService.reconnectADB,payload.ip)
            return res.data
        },
        *wakeupWechat({payload},{call,put}){
            const res = yield call(AssistantService.wakeUpWechat,payload.ip)
            return res.data
        },
        *updateState({payload},{call,select,put}){
            const {vmList} = yield select(state => state.assistantList);
            for(const element of vmList){
                yield call(AssistantService.updateState,element.ip);
            };
        },
        *operation({payload},{call,put}){
            return yield call(AssistantService.operation,payload.ip,payload.values)
        },
        *bindNumberDevice({payload},{call,put}){   // 绑定手机号
            let result = null;
            const number = payload.number;
            // 从后台获取绑定手机号码的虚拟机
            result = yield call(AssistantService.bindNumberDevice,number);
            if(result.data == null || result.error != null) return false;
            // result = "114.212.189.146:10001";  // default value
            console.log("获取到的状态",result,result.data.vmIP);

            yield put({
                type:"saveSelectDevice",
                payload:{selectDevice:result.data.vmIP,selectNumber:number}
            })
        },
        *deployStatus({payload},{call,put}){
            console.log("部署状态",payload.number,payload.ip,payload.result)
            let result = yield call(AssistantService.deployStatus,payload.number,payload.ip,payload.result);
            yield put({
                type:"saveSelectDevice",
                payload:{selectDevice:null,selectNumber:null}
            })
        },
        *selectDevice({payload},{call,put}){
            const ip = payload.selectDevice;
            const result = yield call(AssistantService.wakeUpWechat,`vm/${ip}/status/wechat`);
            yield put({
                type:'saveSelectDevice',
                payload
            })
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({pathname,query})=>{
                if(pathname.indexOf('/wgroup')!== -1 || pathname == '/'){
                    // dispatch({type:'fetch',payload:{}})
                    console.log("分组页面加载")
                }
            })
        },
    },
}