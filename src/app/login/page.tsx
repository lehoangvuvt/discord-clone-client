"use client";

import { setUserInfo } from "@/redux/slices/appSlice";
import { ILoginData } from "@/types/api.type";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { APIService } from "@/services/ApiService";
import {
  Container,
  FieldContainer,
  Form,
  SubmitButton,
  LinkText,
} from "@/components/LoginRegister/components";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: ILoginData = { username, password };
    const response = await APIService.login(data);
    if (response.data) {
      dispatch(setUserInfo(response.data));
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
        <SubmitButton type="submit">Login</SubmitButton>
        <LinkText>
          <span>Need an account?</span>{" "}
          <span onClick={() => router.push("/register")}>Register</span>
        </LinkText>
      </Form>
    </Container>
  );
};

export default Login;
