export default class{constructor(t,e,i){this.getCompressImage=()=>{const t=this;return new Promise(((e,i)=>{const s=new FileReader;s.readAsDataURL(this.originFile),s.onload=function(s){const a=new Image;a.src=s.target.result,a.onload=function(){t.file=this;const i=t.excuteCompressImg();e(i)},a.onerror=function(){i("图片裁剪压缩失败")}}}))},this.getScaleWH=()=>{let t=this.file.width,e=this.file.height;return t>this.scale&&(e=this.scale/t*e,t=this.scale),{w:t,h:e}},this.originFile=t,this.type=i||t.type?.split("/")[1],this.targetW=e.targetW,this.targetH=e.targetH,this.scale=e.scale||1500,this.file=null}excuteCompressImg(){let t,e=this.targetW,i=this.targetH;return this.targetW||this.targetH?t=this.drawImage():(t=this.scaleCompress(),e=this.getScaleWH()?.w,i=this.getScaleWH()?.h),{base64:t,blob:this.createBlob(t),width:e,height:i}}createBlob(t){var e=t.split(",")[1];e=window.atob(e);for(var i=new Uint8Array(e.length),s=0;s<e.length;s++)i[s]=e.charCodeAt(s);return new Blob([i],{type:`image/${this.type}`})}scaleCompress(){const t=document.createElement("canvas"),e=t.getContext("2d"),{w:i,h:s}=this.getScaleWH();return t.width=i,t.height=s,t.style.width=i/2+"px",t.style.height=s/2+"px",e.drawImage(this.file,0,0,i,s),t.toDataURL(`image/${this.type}`,.9)}drawImage(){const t=document.createElement("canvas"),e=t.getContext("2d");return this.file.width>=this.targetW&&this.file.height>=this.targetH?this.clipBigSizeImg(this.file,e,t):this.clipSmallSizeImg(this.file,e,t)}clipSmallSizeImg(t,e,i){const s=this.calcSmallSize(t.width,t.height);return i.width=s.dw,i.height=s.dh,i.style.width=s.dw/2+"px",i.style.height=s.dh/2+"px",e.drawImage(t,s.sw,s.sh,s.dw,s.dh,0,0,s.dw,s.dh),i.toDataURL(`image/${this.type}`)}clipBigSizeImg(t,e,i){const s=this.calcBigSize(t.width,t.height);i.width=s.resultW,i.height=s.resultH,i.style.width=s.resultW/2+"px",i.style.height=s.resultH/2+"px",e.beginPath(),e.rect(s.sw,s.sh,s.targetW,s.targetH),e.clip(),e.closePath(),e.drawImage(t,0,0,s.resultW,s.resultH);return this.getBase64Image(e,s).toDataURL(`image/${this.type}`)}getBase64Image(t,e){const i=t.getImageData(e.sw,e.sh,e.targetW,e.targetH),s=document.createElement("canvas");s.width=e.targetW,s.height=e.targetH,s.style.width=e.targetW/2+"px",s.style.height=e.targetH/2+"px";return s.getContext("2d").putImageData(i,0,0,0,0,e.targetW,e.targetH),s}calcSmallSize(t,e){const i=this.targetW,s=this.targetH;let a=0,h=0;return t>i&&(a=(t-i)/2),e>s&&(h=(e-s)/2),{sw:a,sh:h,dw:t-2*a,dh:e-2*h}}calcBigSize(t,e){const i=this.targetW,s=this.targetH;let a,h,r=0,g=0;if(t/e>i/s){const i=s/e;a=Math.round(t*i),h=s}else{const s=i/t;a=i,h=Math.round(e*s)}return r=(a-i)/2,g=(h-s)/2,{sw:r,sh:g,resultW:a,resultH:h,targetW:i,targetH:s}}}
