import { shareType } from "./util/bridge";
declare class HPBridge {
    isInApp: boolean;
    /**
     * 获取虎扑userInfo
     * @returns
     */
    getHpUserInfo: () => Promise<unknown>;
    closeAppSlide: () => void;
    openAppSlide: () => void;
    callBindPhone: () => void;
    /**
     * 未登录自定义执行逻辑
     */
    notLogin: () => Promise<never>;
    setNativeShare: (params: shareType) => void;
    customeShare: (params: shareType) => void;
    /**
     * 跳转到app打开指定url
     * @param url
     */
    gotoApp: (url?: string) => void;
}
declare const hpBridge: HPBridge;
export default hpBridge;
