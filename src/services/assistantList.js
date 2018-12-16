import request from '../utils/request';

import CONFIG from '../../config/config';

// export function setCookie(name, val, expires) {
//     document.cookie = `${name}=${val};expires=${expires};path=/`;
// }

// export function getCookie(name) {
//     const str = RegExp("" + name + "[^;]+").exec(document.cookie);
//     return str ? str.toString().replace(/^[^=]+./, "") : "";
// }

// export function delCookie(name) {
//     setCookie(name, '', 'Thu, 01 Jan 1970 00:00:01 GMT');
// }

/**
 * 获取虚拟机的列表
 */
export function getVMLists(){
    const url = `${CONFIG.SERVER.DOMAIN}/vms/used`;
    return request(url)
}

/**
 * 获取虚拟机的网络状态,adb连接状态，微信状态，微信线程
 * @param {*} ip 
 */
export const updateState = async (ip)=>{
    await request(`${CONFIG.SERVER.DOMAIN}/vm/${ip}/status/net`)
    await request(`${CONFIG.SERVER.DOMAIN}/vm/${ip}/status/adb`)
    await request(`${CONFIG.SERVER.DOMAIN}/vm/${ip}/status/wechat`)
    await request(`${CONFIG.SERVER.DOMAIN}/vm/${ip}/status/ps`)
}

/**
 * 根据虚拟机获取微信小助手的状态
 */
export function getAssistantByVm(vm){
    const url = `${CONFIG.SERVER.DOMAIN}/vm/${vm.ip}`
    return request(url)
}

/**
 * 重新连接ADB
 */
export function reconnectADB(ip){
    const url = `${CONFIG.SERVER.DOMAIN}/${ip}`
    return request(url,{
        method:"POST"
    })
}

/**
 * 唤醒微信到前台
 */
export function wakeUpWechat(ip){
    const url = `${CONFIG.SERVER.DOMAIN}/${ip}`
    console.log("启动微信",ip)
    return request(url,{
        method:"POST"
    })
}

/**
 * 触发手机事件
 */
export function operation(ip,values){
    const url = `${CONFIG.SERVER.DOMAIN}/vm/${ip}/operation`
    return request(url,{
        method:"POST",
        body:JSON.stringify(values),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

/**
 * 绑定手机号到虚拟机
 * @param {*} phone
 */
export function bindNumberDevice(phone){
    const url = `${CONFIG.SERVER.DOMAIN}/vm/device`;

    return request(url,{
        method:"POST",
        body:JSON.stringify({"phone":phone}),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

/**
 * 返回虚拟机部署的状态
 * @param {*} ip 
 */
export function deployStatus(phone,ip,result){
    const url = `${CONFIG.SERVER.DOMAIN}/vm/${ip}/status/deploy`;
    console.log("发起请求: ",url,JSON.stringify({"wxid":phone,"result":result}));
    return request(url,{
        method:"POST",
        body:JSON.stringify({"wxid":phone,"result":result}),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}