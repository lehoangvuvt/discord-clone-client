"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getBase64FromFile } from "@/utils/file.utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Popup from "../../Popup";
import Button from "@/components/Button";
import { FileService } from "@/services/FileService";
import { ServerService } from "@/services/ServerService";
import { UserService } from "@/services/UserService";
import useStore from "@/zustand/useStore";

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  z-index: 103;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: serverPopUpContainerAppear 0.1s ease 0.05s forwards;
  @keyframes serverPopUpContainerAppear {
    from {
      background-color: rgba(0, 0, 0, 0);
    }
    to {
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
`;

const FormContainer = styled.div`
  height: 370px;
  width: 440px;
  background: white;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  padding: 25px 20px 0px 20px;
  position: relative;
  overflow: hidden;
  animation: formAppear 0.2s ease;
  @keyframes formAppear {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
`;

const Title = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  padding-bottom: 30px;
`;

const FieldContainer = styled.div<{ $withborder: boolean }>`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  margin-bottom: 30px;
  border-bottom: ${(props) =>
    props.$withborder ? "1px solid rgba(255, 255, 255, 0.1)" : "none"};
  padding-bottom: 25px;
`;

const FieldTitle = styled.div`
  width: 100%;
  color: rgba(0, 0, 0, 0.65);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
`;

const FieldInput = styled.input`
  margin-top: 13px;
  width: 100%;
  border-radius: 5px;
  height: 42px;
  background: rgba(0, 0, 0, 0.07);
  border: none;
  outline: none;
  color: black;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.7);
`;

const ServerImageContainer = styled.label`
  width: 82px;
  height: 82px;
  border-radius: 50%;
  border: 3px rgba(0, 0, 0, 0.65) dashed;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;
  svg {
    font-size: 27px;
  }
  color: rgba(0, 0, 0, 0.7);
  text-transform: uppercase;
  font-weight: 800;
  font-size: 12px;
  cursor: pointer;
  margin-bottom: 30px;
  position: relative;
`;

const Bottom = styled.div`
  position: absolute;
  width: 100%;
  height: 70px;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CreateServerPopup = ({
  isOpen = false,
  closePopup,
}: {
  isOpen: boolean;
  closePopup: () => void;
}) => {
  const [serverName, setServerName] = useState("");
  const { userInfo, setUserInfo } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [base64Img, setBase64Img] = useState<string | null>(null);
  const serverAvatarInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (userInfo) {
      setServerName(`${userInfo.name}'s server`);
    }
  }, [userInfo]);

  useEffect(() => {
    if (file) {
      getBase64FromFile(file, (result: string) => setBase64Img(result));
    }
  }, [file]);

  const handleCreateServer = async () => {
    let path = null;
    if (base64Img) {
      const type = base64Img.split(",")[0];
      const name = `server-avatar-${new Date().getTime()}`;
      const section = "server";
      const uploadFileRes = await FileService.uploadFile({
        base64: base64Img,
        type,
        name,
        section,
      });
      if (uploadFileRes.status === "Success") {
        path = uploadFileRes.data.path;
      }
    }
    const response = await ServerService.createServer({
      avatar: path ?? "",
      name: serverName,
    });
    if (response.status === "Success") {
      router.push(`/servers/${response.data._id}`);
      const authenticationResponse = await UserService.athentication();
      if (authenticationResponse.status === "Success") {
        setUserInfo(authenticationResponse.data);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setBase64Img(null);
    }
  }, [isOpen]);

  return (
    <Popup
      contentStyle={{
        height: "370px",
        width: "440px",
        background: "white",
      }}
      isOpen={isOpen}
      closePopup={closePopup}
    >
      <Title>Create your own server</Title>
      <ServerImageContainer
        onClick={() => {
          if (serverAvatarInputRef && serverAvatarInputRef.current) {
            serverAvatarInputRef.current.click();
          }
        }}
      >
        <AddCircleIcon
          htmlColor="#5865f2"
          style={{
            display: base64Img ? "none" : "flex",
            position: "absolute",
            top: -6,
            right: -5,
            background: "white",
            borderRadius: "30%",
            fontSize: "30px",
          }}
        />
        {!base64Img ? (
          <CameraAltIcon color="inherit" fontSize="inherit" />
        ) : (
          <Image
            alt="server-name-img"
            src={base64Img}
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: "50%",
              transform: "scale(1.1)",
            }}
          />
        )}
        Upload
      </ServerImageContainer>
      <input
        type="file"
        style={{ display: "none" }}
        ref={serverAvatarInputRef}
        onChange={(e) => setFile(e.target.files![0])}
      />
      <FieldContainer $withborder>
        <FieldTitle>SERVER NAME</FieldTitle>
        <FieldInput
          onChange={(e) => setServerName(e.target.value)}
          value={serverName}
          type="text"
        />
      </FieldContainer>
      <Bottom>
        <Button
          style={{
            width: "90%",
            height: "44px",
            background: "#5865f2",
            color: "white",
            fontWeight: 600,
            borderRadius: "3px",
            fontSize: "14px",
          }}
          onClick={handleCreateServer}
        >
          Create
        </Button>
      </Bottom>
    </Popup>
  );
};

export default CreateServerPopup;
