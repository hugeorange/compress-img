# compressImages 纯前端通过canvas toDataURL api 截图

图片自动裁剪压缩上传 (upload)
根据目标尺寸自动裁剪并压缩的上传图片
使用 element-upload 自定义上传 http-request
使用方法:
const img = new CompressImg(imgDOM, targetWidth, targetHeight)
img.excuteCompressImg // 返回 base64 和 blob 对象格式
组件使用方法直接参照文件
 /**
 * 图片自动裁剪·压缩
 * 默认目标尺寸 1280*800
 * 
 * 如图片尺寸大于上述尺寸则按比例压缩并居中裁剪
 * 如图片小于目标尺寸则保持现有尺寸不做处理
 */
/**
 * 分成两种情况计算canvas及图片尺寸的原因
 * 
 * 1. 当图片某一边或两边都小于目标宽高
 *    这种情况不需要对图片进行缩放，直接用 drawImage 九参数 直接在画布上进行裁剪
 * 
 * 2. 图片宽高均大于 目标宽高尺寸 
 *    受限于 drawImage 九参数时只可以在图片原始尺寸上裁剪，不可在缩放后的尺寸上裁剪
 * 
 *    若非要使用 drawImage 九参数就需要创建一个和图片原始尺寸等大的canvas画布，这样有可能绘制的canvas尺寸特别大，因而产生性能问题
 * 
 *    故采用第二种方案
 *    drawImage 五参数将图片缩放放在画布内，然后用 clip 裁剪，getImageData ==> putImageData 绘制在新画布内 
 */