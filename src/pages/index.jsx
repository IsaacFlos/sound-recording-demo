import React from 'react';
import { useRef } from 'react';
import { start, stop } from '../utils/sound';

export default function Index() {
  const audioRef = useRef(null);
  
  return (
    <div>
      <audio ref={audioRef} controls>
        <source type="audio/mpeg" />
        <source type="audio/ogg" />
        <embed height="50" width="100" type="" />
      </audio>
      <br />

      <button style={{ marginTop: '20px' }} onClick={() => start(audioRef)}>开始录音</button>
      <button onClick={() => stop()}>停止录音</button>
      <button onClick={() => audioRef.current.play()}>播放音频</button>
    </div>
  )
}
