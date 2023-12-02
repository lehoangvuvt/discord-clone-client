"use client";

import styled from "styled-components";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import EditIcon from "@mui/icons-material/Edit";
import { IUserInfo } from "@/types/api.type";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getBase64FromFile } from "@/utils/file.utils";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/redux/slices/appSlice";
import { LoadingOutlined } from "@ant-design/icons";
import Button from "../Button";
import { FileService } from "@/services/FileService";
import { UserService } from "@/services/UserService";

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 102;
  background: #313338;
  display: flex;
  flex-flow: row wrap;
  &.init {
    opacity: 0;
    pointer-events: none;
  }
  &.open {
    opacity: 1;
    animation: UserDetaisPopupOpen 0.25s ease;
  }
  @keyframes UserDetaisPopupOpen {
    from {
      opacity: 0;
      transform: scale(1.4);
    }
    to {
      to: 1;
      transform: scale(1);
    }
  }
`;

const UserDetailsPopupLeft = styled.div`
  background: #2b2d31;
  width: 31%;
  height: 100%;
`;

const UserDetailsPopupRight = styled.div`
  width: 55%;
  height: 100%;
  padding: 50px 40px;
  font-weight: 600;
  font-size: 18px;
`;

const UserDetailsPopupRightTitle = styled.div`
  width: 100%;
  color: white;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  svg {
    font-size: 40px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.5);
    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
`;

const FieldContainer = styled.div<{ $withborder: boolean }>`
  width: 50%;
  display: flex;
  flex-flow: column wrap;
  margin-bottom: 30px;
  border-bottom: ${(props) =>
    props.$withborder ? "1px solid rgba(255, 255, 255, 0.1)" : "none"};
  padding-bottom: 25px;
`;

const FieldTitle = styled.div`
  width: 100%;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.5px;
`;

const FieldInput = styled.input`
  margin-top: 13px;
  width: 100%;
  border-radius: 5px;
  height: 42px;
  background: #1e1f22;
  border: none;
  outline: none;
  color: rgba(255, 255, 255, 0.7);
  padding-left: 10px;
  padding-right: 10px;
  font-size: 16px;
  &.readonly {
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
  }
`;

const AvatarImage = styled.label`
  margin-top: 30px;
  width: 140px;
  height: 140px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    div {
      display: flex;
    }
  }
`;

const UploadButton = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.2);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
  pointer-events: none;
  font-size: 23px;
`;

const SaveInfoContainer = styled.div`
  width: 50%;
  height: 55px;
  bottom: 20px;
  background: #111111;
  border-radius: 4px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  position: fixed;
  &.show {
    transform: translateY(0px);
    animation: saveInfoContainerAppear 0.25s ease;
    @keyframes saveInfoContainerAppear {
      from {
        transform: translateY(80px);
      }
      to {
        transform: translateY(0px);
      }
    }
  }
  &.hidden {
    transform: translateY(80px);
    animation: saveInfoContainerHidden 0.25s ease;
    @keyframes saveInfoContainerHidden {
      from {
        transform: translateY(0px);
      }
      to {
        transform: translateY(80px);
      }
    }
  }
`;

const ResetButton = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  padding: 0px 25px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const LoadingPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: #00aff0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
`;

const UserDetailsPopup = ({
  isOpen,
  setOpenPopup,
  userInfo,
}: {
  isOpen: boolean;
  setOpenPopup: (state: boolean) => void;
  userInfo: IUserInfo;
}) => {
  const [cloneUserInfo, setCloneUserInfo] = useState<IUserInfo | null>(null);
  const [isInit, setInit] = useState(true);
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [base64UploadFile, setBase64UploadFile] = useState<string | null>(null);
  const [isUpdating, setUpdating] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const dispatch = useDispatch();

  const handleChangeField = (
    value: string,
    field: "name" | "username" | "avatar"
  ) => {
    if (!cloneUserInfo) return;
    const updatedUserInfo = structuredClone(cloneUserInfo);
    updatedUserInfo[field] = value;
    setCloneUserInfo(updatedUserInfo);
  };

  const handleOnChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploadImage(e.target.files[0]);
  };

  useEffect(() => {
    if (!uploadImage) return;
    getBase64FromFile(uploadImage, (result: string) => {
      setBase64UploadFile(result);
    });
  }, [uploadImage]);

  const handleUpdateUserInfo = async () => {
    if (!cloneUserInfo) return;
    setUpdating(true);
    let path = null;
    if (base64UploadFile) {
      const type = base64UploadFile.split(",")[0];
      const name = `avatar-user-${userInfo._id}`;
      const section = "user";
      const uploadImgRes = await FileService.uploadFile({
        base64: base64UploadFile,
        name,
        type,
        section,
      });
      if (uploadImgRes.status === "Success") {
        path = uploadImgRes.data.path;
      } else {
        alert("error upload avatar");
      }
    }
    const data: { name: string; avatar: string } = {
      name: cloneUserInfo.name,
      avatar: cloneUserInfo.avatar,
    };
    if (path) {
      data.avatar = path;
    }
    const response = await UserService.updateUserInfo(data);
    if (response.status === "Success") {
      dispatch(setUserInfo(response.data));
    }
    setBase64UploadFile(null);
    setUploadImage(null);
    setUpdating(false);
  };

  const handleReset = () => {
    setCloneUserInfo(structuredClone(userInfo));
    setBase64UploadFile(null);
    setUploadImage(null);
  };

  useEffect(() => {
    setCloneUserInfo(structuredClone(userInfo));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setInit(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!cloneUserInfo || !userInfo) return;
    if (cloneUserInfo.name.trim() !== userInfo.name || base64UploadFile) {
      setCanSave(true);
    } else {
      setCanSave(false);
    }
  }, [cloneUserInfo, userInfo, base64UploadFile]);

  return (
    <Container className={isInit ? "init" : isOpen ? "open" : ""}>
      {cloneUserInfo && (
        <>
          <UserDetailsPopupLeft></UserDetailsPopupLeft>
          <UserDetailsPopupRight>
            <UserDetailsPopupRightTitle>
              Profiles
              <HighlightOffIcon
                onClick={() => setOpenPopup(false)}
                fontSize="inherit"
                color="inherit"
              />
            </UserDetailsPopupRightTitle>
            <FieldContainer $withborder>
              <FieldTitle>USERNAME</FieldTitle>
              <FieldInput
                className="readonly"
                type="text"
                readOnly
                value={cloneUserInfo?.username}
              />
            </FieldContainer>
            <FieldContainer $withborder>
              <FieldTitle>DISPLAY NAME</FieldTitle>
              <FieldInput
                type="text"
                value={cloneUserInfo?.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChangeField(e.target.value, "name")
                }
              />
            </FieldContainer>
            <FieldContainer $withborder={false}>
              <FieldTitle>AVATAR</FieldTitle>

              <AvatarImage htmlFor="upload-file=input">
                <UploadButton>
                  <EditIcon
                    fontSize="inherit"
                    htmlColor="rgba(255,255,255,1)"
                  />
                </UploadButton>
                <Image
                  src={
                    base64UploadFile ? base64UploadFile : userInfo?.avatar ?? ""
                  }
                  alt="user-avatar"
                  fill
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    pointerEvents: "none",
                  }}
                />
                <input
                  style={{ display: "none" }}
                  type="file"
                  name="upload-file=input"
                  id="upload-file=input"
                  onChange={(e) => handleOnChangeFile(e)}
                />
              </AvatarImage>
            </FieldContainer>
            <SaveInfoContainer className={canSave ? "show" : "hidden"}>
              <ResetButton onClick={() => handleReset()}>Reset</ResetButton>
              <Button
                loading={isUpdating}
                disabled={!canSave}
                onClick={() => handleUpdateUserInfo()}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </SaveInfoContainer>
          </UserDetailsPopupRight>
        </>
      )}
      {isUpdating && (
        <LoadingPopup>
          <LoadingOutlined spin />
        </LoadingPopup>
      )}
    </Container>
  );
};

export default UserDetailsPopup;
