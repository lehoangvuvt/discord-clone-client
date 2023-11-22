"use client";

import { RootState } from "@/redux/store";
import { Socket } from "@/services/socket";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useVoiceChat = (socket: Socket) => {
  const userInfo = useSelector((state: RootState) => state.app.userInfo);
  const [inVoiceChannel, setInVoiceChannel] = useState(false);
  const params = useParams();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const userVoiceSetting = useSelector(
    (state: RootState) => state.app.userVoiceState
  );

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

  const startVoice = () => {
    if (!userInfo || typeof window === undefined) return;

    socket.on(`receiveVoiceServer=${params.serverId}`, handleOnReceiveVoice);

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      setMediaStream(stream);
      setMediaRecorder(mediaRecorder);
    });
  };

  useEffect(() => {
    if (mediaRecorder && params?.serverId && userInfo && socket) {
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
            serverId: params?.serverId,
            userId: userInfo?._id,
          };
          socket.emit("sendVoice", JSON.stringify(data));
        };

        mediaRecorder.start();

        setTimeout(function () {
          mediaRecorder.stop();
        }, time);
      });
      setTimeout(function () {
        mediaRecorder.stop();
      }, time);
    }
  }, [mediaRecorder, params, userInfo, socket]);

  useEffect(() => {
    if (!mediaStream) return;
    if (userVoiceSetting.mute) {
      mediaStream.getAudioTracks()[0].enabled = false;
    } else {
      mediaStream.getAudioTracks()[0].enabled = true;
    }
  }, [userVoiceSetting, mediaStream]);

  useEffect(() => {
    if (
      !mediaRecorder ||
      !mediaStream ||
      !socket ||
      !params ||
      !handleOnReceiveVoice
    )
      return;
    if (userVoiceSetting.volumeState !== 0) {
      socket.on(`receiveVoiceServer=${params.serverId}`, handleOnReceiveVoice);
    } else {
      socket.off(`receiveVoiceServer=${params.serverId}`);
    }
  }, [
    userVoiceSetting,
    mediaRecorder,
    mediaStream,
    params,
    handleOnReceiveVoice,
    socket,
  ]);
  return {
    startVoice,
    inVoiceChannel,
    setInVoiceChannel,
  };
};

export default useVoiceChat;
