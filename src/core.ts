
interface IsizeType {
    targetW?: number
    targetH?: number
    scale?: number
}

type Itype = 'jpg' | 'jpeg' | 'png' | 'webp'

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
    constructor(imgfile: any, obj: IsizeType, type?: Itype) {
        this.originFile = imgfile;
        this.type = type || imgfile.type?.split('/')[1];
        this.targetW = obj.targetW; // 图片裁剪到的宽
        this.targetH = obj.targetH; // 图片裁剪到的搞
        this.scale = obj.scale || 1500; // 图片宽度缩放到的尺寸
        this.file = null; // 经过FileReader转换后的file文件
    }

    // 获取压缩后的图片
    getCompressImage = () => {
        const me = this
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(this.originFile)
            reader.onload = function (e) {
                const img:any = new Image()
                img.src = e.target.result
                // 获取file逻辑
                img.onload = function () {
                    me.file = this
                    const file = me.excuteCompressImg()
                    resolve(file)
                }
                img.onerror = function () {
                    reject('图片裁剪压缩失败')
                }
            }
        })
    }
    
    /**
     * 执行压缩图片，返回压缩后的图片及尺寸
     * @returns { base64, blob, width, height }
     */
    excuteCompressImg() {
        let img: string;
        let width = this.targetW;
        let height = this.targetH;
        if (!this.targetW && !this.targetH) {
            img = this.scaleCompress();
            width = this.getScaleWH()?.w;
            height = this.getScaleWH()?.h;
        } else {
            img = this.drawImage();
        }
        return {
            base64: img,
            blob: this.createBlob(img),
            width,
            height,
        };
    }
    
    /**
     * 
     * @param base64 base64字符串
     * @returns 将base64字符出转成blob二进制格式，可利用 formData 通过 ajax 传到后台
     */
    createBlob(base64: string) {
        var data = base64.split(",")[1];
        data = window.atob(data);
        var ia = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) {
            ia[i] = data.charCodeAt(i);
        }
        var blob = new Blob([ia], { type: `image/${this.type}`});
        return blob;
    }

    // 获取不裁剪，直接进行缩放处理的图片尺寸
    getScaleWH = () => {
        let w = this.file.width;
        let h = this.file.height;
        if (w > this.scale) {
            h = (this.scale / w) * h;
            w = this.scale;
        }
        return { w, h };
    };
    // 不进行裁剪，直接缩放压缩处理
    scaleCompress() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const { w, h } = this.getScaleWH();
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = w / 2 + "px";
        canvas.style.height = h / 2 + "px";

        ctx.drawImage(this.file, 0, 0, w, h);
        return canvas.toDataURL(`image/${this.type}`, 0.9);
    }

    // 图片绘制到指定区域的 canvas 上
    drawImage() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (this.file.width >= this.targetW && this.file.height >= this.targetH) {
            return this.clipBigSizeImg(this.file, ctx, canvas);
        } else {
            return this.clipSmallSizeImg(this.file, ctx, canvas);
        }
    }

    // 裁剪小图片
    // 图片宽或高某一边或两边均小于目标尺寸
    clipSmallSizeImg(file, ctx, canvas) {
        const obj = this.calcSmallSize(file.width, file.height);
        canvas.width = obj.dw;
        canvas.height = obj.dh;
        canvas.style.width = obj.dw / 2 + "px";
        canvas.style.height = obj.dh / 2 + "px";

        ctx.drawImage(file, obj.sw, obj.sh, obj.dw, obj.dh, 0, 0, obj.dw, obj.dh);
        return canvas.toDataURL(`image/${this.type}`);
    }

    // 裁剪大图片
    // 图片宽高均大于目标宽高特殊处理
    clipBigSizeImg(file, ctx, canvas) {
        const obj = this.calcBigSize(file.width, file.height);
        canvas.width = obj.resultW;
        canvas.height = obj.resultH;
        // 防止 canvas 绘制的图片变得模糊
        canvas.style.width = obj.resultW / 2 + "px";
        canvas.style.height = obj.resultH / 2 + "px";

        ctx.beginPath();
        ctx.rect(obj.sw, obj.sh, obj.targetW, obj.targetH);
        ctx.clip();
        ctx.closePath();
        ctx.drawImage(file, 0, 0, obj.resultW, obj.resultH);

        const clipCanvas = this.getBase64Image(ctx, obj);

        return clipCanvas.toDataURL(`image/${this.type}`);
    }

    // 获取并返回指定区域内 canvas 图像
    getBase64Image(ctx, obj) {
        const dataImg = ctx.getImageData(obj.sw, obj.sh, obj.targetW, obj.targetH);
        const canvas2 = document.createElement("canvas");
        canvas2.width = obj.targetW;
        canvas2.height = obj.targetH;
        canvas2.style.width = obj.targetW / 2 + "px";
        canvas2.style.height = obj.targetH / 2 + "px";
        const ctx2 = canvas2.getContext("2d");
        ctx2.putImageData(dataImg, 0, 0, 0, 0, obj.targetW, obj.targetH);
        return canvas2;
    }

    /**
     * 图片某一边或两边均小于目标宽高
     * @param {*} w
     * @param {*} h
     * @return {object} 裁剪尺寸、图片尺寸
     */
    calcSmallSize(w: number, h: number): any {
        const targetW = this.targetW;
        const targetH = this.targetH;
        let sw = 0;
        let sh = 0;
        if (w > targetW) {
            sw = (w - targetW) / 2;
        }
        if (h > targetH) {
            sh = (h - targetH) / 2;
        }
        let dw = w - sw * 2;
        let dh = h - sh * 2;
        return {
            sw,
            sh,
            dw,
            dh,
        };
    }

    /**
     * 宽高均大于目标尺寸
     * @param {*} w 图片原始宽
     * @param {*} h 图片原始高
     * @returns {object} 裁剪尺寸、结果尺寸、目标尺寸
     */
    calcBigSize(w: number, h: number): any {
        const targetW = this.targetW;
        const targetH = this.targetH;
        const targetRate = targetW / targetH;
        const rate = w / h;
        // 裁剪后宽高
        let resultW;
        let resultH;
        // 需裁减尺寸
        let sw = 0;
        let sh = 0;

        if (rate > targetRate) {
            // 宽 大
            const resultR = targetH / h;
            resultW = Math.round(w * resultR);
            resultH = targetH;
        } else {
            // 高 大
            const resultR = targetW / w;
            resultW = targetW;
            resultH = Math.round(h * resultR);
        }
        sw = (resultW - targetW) / 2;
        sh = (resultH - targetH) / 2;
        return {
            sw,
            sh,
            resultW,
            resultH,
            targetW,
            targetH,
        };
    }
}
