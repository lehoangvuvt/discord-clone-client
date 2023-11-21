import { socket } from "@/services/socket";
import { useEffect } from "react";

const VoiceChatHandler = () => {
  useEffect(() => {
    if (socket) {
      socket.emit("userInformation", "");
      handleVoice();
    }
  }, []);

  const handleVoice = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const madiaRecorder = new MediaRecorder(stream);
    madiaRecorder.start();
    let audioChunks: BlobPart[] = [];

    madiaRecorder.addEventListener("dataavailable", function (event) {
      audioChunks.push(event.data);
    });

    madiaRecorder.addEventListener("stop", function () {
      var audioBlob = new Blob(audioChunks);

      audioChunks = [];

      var fileReader = new FileReader();
      fileReader.readAsDataURL(audioBlob);
      fileReader.onloadend = function () {
        const base64String = fileReader.result;
        socket.emit("sendVoice", base64String);
      };

      madiaRecorder.start();

      setTimeout(function () {
        madiaRecorder.stop();
      }, 1000);
    });

    socket.on("receiveVoice", function (data) {
      var audio = new Audio(data);
      audio.play();
    });
  };

  return <h1>VoiceChatHandler</h1>;
};
