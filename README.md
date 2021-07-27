# compressImages 纯前端通过canvas api 裁剪压缩图片
- 演示地址：https://hugeorange.github.io/toolpage/img.html

使用方法:
```ts
interface IsizeType {
    targetW?: number 需裁剪到的目标宽
    targetH?: number 需裁剪到的目标搞
    scale?: number 缩放==> 缩放到指定宽度，高度自适应 和上面两项互斥，上面两项成对出现，
}

// cdn 地址引用 https://unpkg.com/compress-image-canvas@latest/dist/compress-image-canvas.min.js
import CompressImage from "compress-image-canvas";

// 使用示例
/**
 * file 经过input上传后拿到的图片文件
 * obj  所需裁剪到的尺寸
 * type 裁剪压缩后的图片格式，默认以原图片文件格式为准，若指定则以指定类型为准
*/
const cImage = new CompressImage(file, obj: IsizeType, type)
const res = await cImage.getCompressImage(me.file)

/**
 *  返回格式
 *  base64: base64图片 
 *  blob: Blob {size: 4982, type: "image/png"}
 *  height: 33.3822091886608
 *  width: "50"
*/
```
- 基本原理
```
  图片自动裁剪·压缩
  默认目标尺寸 1280*800
  
  如图片尺寸大于上述尺寸则按比例压缩并居中裁剪
  如图片小于目标尺寸则保持现有尺寸不做处理
```
- canvas 处理原理
```
  分成两种情况计算canvas及图片尺寸的原因
  
  1. 当图片某一边或两边都小于目标宽高
     这种情况不需要对图片进行缩放，直接用 drawImage 九参数 直接在画布上进行裁剪
  
  2. 图片宽高均大于 目标宽高尺寸 
     受限于 drawImage 九参数时只可以在图片原始尺寸上裁剪，不可在缩放后的尺寸上裁剪
  
     若非要使用 drawImage 九参数就需要创建一个和图片原始尺寸等大的canvas画布，这样有可能绘制的canvas尺寸特别大，因而产生性能问题
  
     故采用第二种方案
     drawImage 五参数将图片缩放放在画布内，然后用 clip 裁剪，getImageData ==> putImageData 绘制在新画布内 
```
- 压缩即通过 `canvas.toDataURL()` 
