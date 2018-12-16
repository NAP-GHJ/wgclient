/**
 * 返回参数
 * @type {{SUCCESS: number, ERROR: number, PARAM_ERROR: number, CREATE_FAILED: number, UPDATE_FAILED: number, FIND_NONE: number}}
 */
export const CODE = {
    SUCCESS: 0,
    MOBILE_EXIST: 20001, // 手机号已存在
    MOBILE_NO_EXIST: 20002, // 用户不存在
    LOGIN_PWD_ERROR: 20003, // 登录密码错误
    VALIDATE_CODE_EXPIRE: 20004, // 验证码过期
    VALIDATE_CODE_ERROR: 20005, // 验证码错误
    CURRENT_USER_NOT_PERMISSION: 20006, // 当前用户无权限
    REPEAT: 30001, // 已接受过此邀请
    FORMAT: 30002, // 参数格式不正确
    TEAM_NOT_FOUND: 30003, // 未找到团队
    MEMBER_NOT_FOUND: 30004, // 未找到此团队成员
    LEADER_NOT_FOUND: 30005, // 未找到此团队leader
    REQUEST_METHOD_NOT_SUPPORT: 40001, // 暂不支持该请求方法
    ASSISTANT_NOT_EXIST: 40002, // 助手不存在
    ASSISTANT_CIPHER_NOT_EXIST: 40003, // 验证好友记录不存在
    ASSISTANT_API_PARAMETER_ERROR: 40004, // 助手接口参数校验不通过
    ASSISTANT_API_INTERNAL_ERROR: 40005, // 助手内部错误，请稍后再试
    ASSISTANT_ASSIGN_ERROR: 40006, // 分配小助手异常
    GROUP_CHAT_NOT_EXIST: 50001, // 群聊不存在
    OWNERSHIP_YOURSELF: 50002, // 已经是群主了
    DOCTOR_NOT_WE_CHAT: 50003, // 医生还没有群聊
    MEMBER_NOT_JOIN_GROUP_CHAT: 60001, // 暂不支持该请求方法
    ORDER_DIAGNOSED: 80001, // 当前问诊已被其他医生接诊
    ORDER_NO_PERMISSION: 80002, // 当前问诊已被其他医生接诊
    VIP_EXIST: 90001, // 用户已领取会员资格
};