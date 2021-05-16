import { Bridge } from "@hupu/api-bridge";
export declare const bridge: Bridge;
export declare const isInApp: boolean;
/**
 * 校验登陆
 * 未登录状态拉起登录框，已登录状态返回用户信息，登录成功后会刷新当前页面
 * @param  {function} loginCallback 登陆回调
 * @return {void}
 */
export declare function gotoLogin(): void;
export declare function closeAppSlide(): void;
export declare function openAppSlide(): void;
/**
 * 绑定手机号
 */
export declare function gotoBindPhone(): void;
/**
 *
 * @param {*} params
 * 更新分享内容(JS -> Native)，只是自定义分享方式，参数同 customeShare，不会自动弹出底部分享组件
 * JSBridgeName: hupu.share.setNative
 */
export declare type shareType = {
    imageUrl?: string;
    title?: string;
    text?: string;
    linkUrl?: string;
};
export declare function setNativeShare(params: shareType): void;
/**
 * 调用此方法会自动从下方弹出分享组件
 * @param {*} params
 *  imageUrl: "http://192.168.9.29:8080/upload/cMjYuvuCbDjiIrbWPLo877yb.png",
    title: "分享图书",
    text: "这本书的简介大概是这样",
    linkUrl: "http://hupu.com"
 */
export declare function customeShare(params: shareType): void;
/**
 * 站外拉新 下载或打开app
 * @param schema
 * @param key
 */
export declare function gotoApp(url: string, key?: string): void;
/**
 * 判断app是否登录，未登录拉起登录框
 * @param userInfo
 * @returns
 */
declare type userType = {
    puid?: string | number;
    islogin?: number;
};
export declare function judgeIsLogin(userInfo: userType): boolean;
export declare const getPhoneByPuid: (puid: number | string, token: string) => Promise<unknown>;
export {};
