let mediaRecorder = null;

// 开始录音
const start = (audioRef) => {
  let audioContext = null;
  // 创建音频环境
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (!audioContext) {
      console.log('浏览器不支持 webAudioApi 相关接口。');
      return;
    }
  } catch (e) {
    console.log('e', e);
  }

  // 获取浏览器录音权限
  if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
    console.log('chrome 下获取浏览器功能，因为安全性问题，需要再 localhost 或 127.0.0.1 或 https 下才能获取权限。');
    if (audioContext && audioContext?.state !== 'closed') audioContext.close();
    return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream => {
      // 存储音频数据数组
      let chunks = [];

      // 提供用来进行媒体轻松录制的接口
      mediaRecorder = new MediaRecorder(stream);

      // 开始录制媒体
      mediaRecorder.start();

      // 用来处理  start 事件，该事件再媒体开始录制时触发
      mediaRecorder.onstart = () => {
        console.log('recore start');
      }

      // 改时间可用于获取录制的媒体资源（在事件的 data 属性中会提供一个可用的 Blob 对象）
      mediaRecorder.ondataavailable = e => {
        chunks.push(e.data);
      }

      // 用来处理 stop 事件，改时间再媒体录制结束时、媒体流结束时、或调用 stop 方法后触发
      mediaRecorder.onstop = e=> {
        // 获取到录音的 blob
        let blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });

        //  将 blob 转换为 file 对象，名字可以自己改，一般用于需要将文件上传到后台的情况
        // let file = new window.File([blob], "record.webm");

        // 将 blob 转换为地址，一般用于页面上面的回显，这个 url 可以直接被 audio 标签使用
        const url = window.URL.createObjectURL(blob);
        audioRef.current.src = url;
      }
    }))
    .catch(e => console.log('请求麦克风失败！', e));
};

// 停止录音
const stop = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    mediaRecorder = null;
  }
};

export {
  start,
  stop
}