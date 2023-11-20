"use client";

import { CaretRightFilled, PauseCircleFilled } from "@ant-design/icons";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: column wrap;
  padding: 10px;
  background: #212121;
  border-radius: 5px;
`;

const Player = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-flow: row wrap;
  background: #111111;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
`;

const ProgressBar = styled.div`
  height: 10px;
  width: 60%;
  background: #616161;
  border-radius: 5px;
  position: relavite;
  overflow: hidden;
  cursor: pointer;
  filter: brightness(90%);
  transition: filter 0.25s ease;
  &:hover {
    filter: brightness(105%);
  }
`;

const CurrentProgressBar = styled.div<{ currentWidth: number }>`
  position: relavite;
  top: 0;
  left: 0;
  height: 100%;
  width: ${(props) => props.currentWidth}%;
  background: #651fff;
`;

const PlayButton = styled.div`
  width: 22px;
  height: 25px;
  color: #bdbdbd;
  font-size: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  &: hover {
    color: white;
  }
`;

const Duration = styled.div`
  height: 100%;
  width: 70px;
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-right: 5px;
  font-weight: 400;
`;

const FileInfo = styled.div`
  width: 100%;
  color: #8c9eff;
  font-size: 14px;
  padding-bottom: 10px;
  padding-left: 5px;
`;

export default function AudioItem({
  url,
  fileName,
  style,
}: {
  url: string;
  fileName: string;
  style?: React.CSSProperties;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const handleOnTimeUpdate = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    const { currentTime, duration } = e.currentTarget;
    const newProgress = (currentTime / duration) * 100;
    setCurrentTime(currentTime);
    setProgress(newProgress);
  };

  useEffect(() => {
    if (!audioRef || !audioRef.current) return;
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  const handleOnLoad = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    setDuration(Math.floor(e.currentTarget.duration));
    setLoaded(true);
  };

  const handleChangeProgress = (value: number) => {
    if (!audioRef || !audioRef.current || !loaded) return;
    audioRef.current.currentTime = (audioRef.current.duration / 100) * value;
  };

  const handleEnded = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    if (!audioRef || !audioRef.current || !loaded) return;
    setPlaying(false);
    audioRef.current.currentTime = 0;
  };

  const getFormatTime = (value: number) => {
    let seconds = "0";
    let minutes = "0";
    if (value <= 59) {
      if (value < 10) {
        seconds = "0" + Math.floor(value);
      } else {
        seconds = Math.floor(value).toString();
      }
    } else {
      if (Math.floor(value % 60) < 10) {
        seconds = "0" + Math.floor(value % 60).toString();
      } else {
        seconds = Math.floor(value % 60).toString();
      }
      minutes = Math.floor(value / 60).toString();
    }
    return `${minutes}:${seconds}`;
  };

  return (
    <Container style={style}>
      <audio
        onLoadedMetadata={handleOnLoad}
        onTimeUpdate={handleOnTimeUpdate}
        onEnded={handleEnded}
        ref={audioRef}
        src={url}
        controls
        autoPlay={false}
        style={{ display: "none" }}
      />
      {loaded && (
        <>
          <FileInfo>{fileName}</FileInfo>
          <Player>
            <PlayButton onClick={() => setPlaying(!playing)}>
              {playing ? <PauseCircleFilled /> : <CaretRightFilled />}
            </PlayButton>
            <Duration>
              {getFormatTime(currentTime)} / {getFormatTime(duration)}
            </Duration>
            <ProgressBar
              ref={progressBarRef}
              onClick={(e) => {
                if (!progressBarRef || !progressBarRef.current) return;
                const position =
                  e.clientX -
                  progressBarRef.current.getBoundingClientRect().left;
                handleChangeProgress(
                  (position / progressBarRef.current.clientWidth) * 100
                );
              }}
            >
              <CurrentProgressBar currentWidth={progress} />
            </ProgressBar>
          </Player>
        </>
      )}
    </Container>
  );
}
