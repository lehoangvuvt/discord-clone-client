"use client";

import {
  Container,
  FieldContainer,
  Form,
  LinkText,
  SubmitButton,
} from "@/components/LoginRegister/components";
import { APIService } from "@/services/ApiService";
import { IRegisterData } from "@/types/api.type";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    const data: IRegisterData = {
      username,
      password,
      name,
    };
    const response = await APIService.register(data);
    if (response.data) {
      router.push("/login");
    } else {
      alert("Error");
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
          <span>Display name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <FieldContainer>
          <span>Confirm password</span>
          <input
            required
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </FieldContainer>
        <SubmitButton type="submit">Register</SubmitButton>
        <LinkText>
          <span>Already have an account?</span>{" "}
          <span onClick={() => router.push("/login")}>Login</span>
        </LinkText>
      </Form>
    </Container>
  );
};

export default Login;
