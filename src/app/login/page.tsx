"use client";

import { setUserInfo } from "@/redux/slices/appSlice";
import { UserInfo } from "@/types/api.type";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import bcrypt from "bcryptjs";
import { saltHashed } from "@/const/bcrypt";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url("/images/login-bg.png");
  background-size: cover;
  background-position: top;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  width: 400px;
  padding: 50px 20px 50px 20px;
  background: #36393f;
  border-radius: 6px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 30px;
`;

const FieldContainer = styled.div`
  width: 90%;
  display: flex;
  flex-flow: column wrap;
  span {
    text-transform: uppercase;
    color: #b8babd;
    font-weight: 600;
    font-size: 11px;
    letter-spacing: 0.5px;
    filter: brightness(120%);
  }
  input {
    margin-top: 10px;
    border: none;
    outline: none;
    background: #111111;
    height: 40px;
    border-radius: 5px;
    color: rgba(255, 255, 255, 0.7);
    padding-left: 10px;
    padding-right: 10px;
    font-size: 14px;
  }
`;

const LoginButton = styled.button`
  height: 42px;
  border-radius: 5px;
  width: 90%;
  background: #5865f2;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: filter 0.2s ease;
  &:hover {
    filter: brightness(80%);
  }
`;

const ReisterText = styled.div`
  width: 90%;
  margin-top: -15px;
  span:nth-child(1) {
    font-weight: 300;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
  }
  span:nth-child(2) {
    font-weight: 400;
    font-size: 13px;
    color: #1ab7ea;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/login`;
    const hashedPassword = bcrypt.hashSync(password, saltHashed);
    const data = { username, password: hashedPassword };
    const response = await axios({
      url,
      method: "POST",
      data,
    });
    if (response.status === 200) {
      const data: UserInfo = response.data;
      dispatch(setUserInfo(data));
    } else {
      alert(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <FieldContainer>
          <span>Username</span>
          <input
            required
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FieldContainer>
        <FieldContainer>
          <span>Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FieldContainer>
        <LoginButton type="submit">Login</LoginButton>
        <ReisterText>
          <span>Need an account?</span>{" "}
          <span onClick={() => router.push("/register")}>Register</span>
        </ReisterText>
      </Form>
    </Container>
  );
};

export default Login;
