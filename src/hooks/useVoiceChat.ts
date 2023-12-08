"use client";

import { Socket } from "@/services/socket";
import useStore from "@/zustand/useStore";
import { useCallback, useEffect, useState } from "react";

const useVoiceChat = (socket: Socket, type: "channel" | "p2p") => {
  const { userInfo } = useStore();
  const [serverId, setServerId] = useState<string | null>(null);
  const [inVoiceChannel, setInVoiceChannel] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const { userVoiceState } = useStore();

  const handleOnReceiveVoice = useCallback(
    (data: any) => {
      if (!userInfo) return;
      const formattedData = JSON.parse(data);
      const audio = new Audio(formattedData.base64);
      audio.play();
      if (formattedData.senderId !== userInfo._id) {
      }
    },
    [userInfo]
  );

  const start = (serverId: string) => {
    if (!userInfo || typeof window === undefined) return;
    setServerId(serverId);
    socket.on(`receiveVoiceServer`, handleOnReceiveVoice);

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      setMediaStream(stream);
      setMediaRecorder(mediaRecorder);

      const time = 1000;
      mediaRecorder.start();

      let audioChunks: any = [];

      mediaRecorder.addEventListener("start", function (event) {
        setInVoiceChannel(true);
      });

      mediaRecorder.addEventListener("dataavailable", function (event) {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", function () {
        const audioBlob = new Blob(audioChunks);
        audioChunks = [];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(audioBlob);
        fileReader.onloadend = function () {
          const base64String = fileReader.result;
          const data = {
            base64: base64String,
            serverId: serverId,
            userId: userInfo?._id,
          };
          socket.emit("sendVoice", JSON.stringify(data));
        };

        try {
          mediaRecorder.start();
        } catch (ex) {}

        setTimeout(function () {
          mediaRecorder.stop();
        }, time);
      });
      setTimeout(function () {
        mediaRecorder.stop();
      }, time);
    });
  };

  const stop = (serverId: string) => {
    socket.off(`receiveVoiceServer`);
    setInVoiceChannel(false);
    setServerId(null);
  };

  useEffect(() => {
    return () => {
      if (mediaStream && mediaRecorder) {
        mediaStream.getAudioTracks().forEach((aTrack) => aTrack.stop());
        setMediaRecorder(null);
        setMediaStream(null);
      }
    };
  }, [mediaStream, mediaRecorder]);

  useEffect(() => {
    if (!mediaStream) return;
    if (userVoiceState.mute) {
      mediaStream.getAudioTracks()[0].enabled = false;
    } else {
      mediaStream.getAudioTracks()[0].enabled = true;
    }
  }, [userVoiceState, mediaStream]);

  useEffect(() => {
    if (
      !mediaRecorder ||
      !mediaStream ||
      !socket ||
      !serverId ||
      !handleOnReceiveVoice
    )
      return;
    if (userVoiceState.volumeState !== 0) {
      socket.on(`receiveVoiceServer`, handleOnReceiveVoice);
    } else {
      socket.off(`receiveVoiceServer`);
    }
  }, [
    userVoiceState,
    mediaRecorder,
    mediaStream,
    serverId,
    handleOnReceiveVoice,
    socket,
  ]);

  return {
    start,
    stop,
    inVoiceChannel,
    setInVoiceChannel,
  };
};

export default useVoiceChat;
