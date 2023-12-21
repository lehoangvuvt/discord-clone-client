"use client";

import Button from "@/components/Button";
import { Container, Form } from "@/components/LoginRegister/components";
import PinInput from "@/components/PinInput";
import { UserService } from "@/services/UserService";
import {
  IPendingRegisterWithOTP,
  IPendingRegisterOTP,
  VerifyErrorTypeEnum,
  IPendingRegister,
} from "@/types/api.type";
import { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  font-weight: 700;
  font-size: 20px;
`;
const Description = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  font-weight: 700;
  font-size: 20px;
`;
const SubDescription = styled.div`
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  padding-bottom: 10px;
  font-size: 14px;
  color: #797979;
  font-weight: 600;
  span {
    color: #fc4f69;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const TopBG = styled.div`
  position: relative;
  background: #c0392b;
  background: -webkit-linear-gradient(
    -150eg,
    #8e44ad,
    #c0392b
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    -45deg,
    #8e44ad,
    #c0392b
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  width: 100%;
  height: 135px;
  border-radius: 5px;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  justify-content: center;
  padding-left: 25px;
  padding-right: 25px;
  gap: 5px;
  animation: gradient 5s ease infinite alternate;
  background-size: 300% 300%;
  @keyframes gradient {
    0% {
      background-position: 0% 10%;
    }
    50% {
      background-position: 100% 20%;
    }
    100% {
      background-position: 0% 30%;
    }
  }
`;

const RightImage = styled(Image)`
  position: absolute;
  right: 30px;
`;

const NotificationBox = styled.div`
  width: 100%;
  background: #00b489;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  height: 36px;
  width: 90%;
  border-radius: 4px;
  font-weight: 600;
  animation: notificationBoxAppear 0.25s ease;
  @keyframes notificationBoxAppear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const VerifyClient = ({
  pendingRegisterInfo,
}: {
  pendingRegisterInfo: IPendingRegister | null;
}) => {
  const [values, setValues] = useState<string[]>([]);
  const [filled, setFilled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isResendSuccess, setResendSuccess] = useState(false);
  const [isResendError, setResendError] = useState(false);
  const [isReset, setReset] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pendingRegisterInfo) return;
    setResendSuccess(false);
    setResendError(false);
    setError(null);
    const otp = parseInt(values.reduce((prev, current) => prev + current, ""));
    const response = await UserService.verify(otp, pendingRegisterInfo.url);
    if (response.status === "Success") {
      router.push("/login");
    } else {
      switch (response.errorMessage) {
        case VerifyErrorTypeEnum.EXPIRED:
          setError("OTP expired");
          break;
        case VerifyErrorTypeEnum.INVALID_OTP:
          setError("OTP invalid");
          break;
        case VerifyErrorTypeEnum.INVALID_URL:
          break;
        case VerifyErrorTypeEnum.OTHERS:
          setError("Something error");
          break;
      }
    }
  };

  const resendCode = async () => {
    if (!pendingRegisterInfo) return;
    setResendSuccess(false);
    setResendError(false);
    const response = await UserService.resend(pendingRegisterInfo.url);
    if (response.status === "Success") {
      setResendSuccess(true);
    } else {
      setResendError(true);
    }
    setReset(true);
    setTimeout(() => setReset(false), 10);
  };

  return (
    <Container>
      <Form
        style={{
          width: "30%",
          justifyContent: "flex-start",
          minHeight: "510px",
          background: "#1d1d27",
          paddingTop: "30px",
        }}
        onSubmit={handleSubmit}
      >
        {pendingRegisterInfo ? (
          <>
            <TopBG>
              <Title>Verify</Title>
              <Description>Your Account</Description>
              <RightImage
                src="/images/horse.png"
                alt="horse-icon"
                width={80}
                height={80}
              />
            </TopBG>
            <SubDescription>Enter the OTP sent to your email</SubDescription>
            <PinInput
              isReset={isReset}
              isError={typeof error === "string"}
              codeLength={5}
              onValuesChange={(values) => {
                setError(null);
                setValues(values);
              }}
              onFilledStateChange={(filledState) => setFilled(filledState)}
            />
            <SubDescription
              style={{ paddingBottom: "0px", paddingTop: "10px" }}
            >
              Did not receive the code?&nbsp;
              <span onClick={resendCode}>Resend code</span>
            </SubDescription>
            <Button
              style={{
                height: "40px",
                borderRadius: "5px",
                width: "90%",
                border: "none",
                color: "white",
                fontWeight: 700,
                fontSize: "15px",
                marginTop: "20px",
                background: "#302f41",
              }}
              disabled={!filled || typeof error === "string"}
            >
              Continue
            </Button>
            {isResendSuccess && (
              <NotificationBox
                style={{ paddingBottom: "0px", paddingTop: "0px" }}
              >
                A new OTP code has been sent to your email
              </NotificationBox>
            )}
            {isResendError && (
              <NotificationBox
                style={{
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  background: "#E4405F",
                }}
              >
                Cannot resend OTP code to your email. Please try again
              </NotificationBox>
            )}
            {error && (
              <NotificationBox
                style={{
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  background: "#E4405F",
                }}
              >
                {error}
              </NotificationBox>
            )}
          </>
        ) : (
          <SubDescription>Invalid</SubDescription>
        )}
      </Form>
    </Container>
  );
};

export default VerifyClient;
