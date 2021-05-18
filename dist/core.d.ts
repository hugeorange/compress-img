interface IsizeType {
    targetW?: number;
    targetH?: number;
    scale?: number;
}
declare type Itype = 'jpg' | 'jpeg' | 'png' | 'webp';
export default class CompressImg {
    file: any;
    originFile: any;
    targetW: number;
    targetH: number;
    scale: number;
    type: Itype;
    /**
     *
     * @param imgfile 文件对象
     * @param obj 裁剪尺寸
     * type 压缩后的图片的格式，默认和原图片一致
     */
    constructor(imgfile: any, obj: IsizeType, type?: Itype);
    getCompressImage: () => Promise<unknown>;
    /**
     * 执行压缩图片，返回压缩后的图片及尺寸
     * @returns { base64, blob, width, height }
     */
    excuteCompressImg(): {
        base64: string;
        blob: Blob;
        width: number;
        height: number;
    };
    /**
     *
     * @param base64 base64字符串
     * @returns 将base64字符出转成blob二进制格式，可利用 formData 通过 ajax 传到后台
     */
    createBlob(base64: string): Blob;
    getScaleWH: () => {
        w: any;
        h: any;
    };
    scaleCompress(): string;
    drawImage(): any;
    clipSmallSizeImg(file: any, ctx: any, canvas: any): any;
    clipBigSizeImg(file: any, ctx: any, canvas: any): string;
    getBase64Image(ctx: any, obj: any): HTMLCanvasElement;
    /**
     * 图片某一边或两边均小于目标宽高
     * @param {*} w
     * @param {*} h
     * @return {object} 裁剪尺寸、图片尺寸
     */
    calcSmallSize(w: number, h: number): any;
    /**
     * 宽高均大于目标尺寸
     * @param {*} w 图片原始宽
     * @param {*} h 图片原始高
     * @returns {object} 裁剪尺寸、结果尺寸、目标尺寸
     */
    calcBigSize(w: number, h: number): any;
}
export {};
