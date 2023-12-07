"use client";

import { ILoginData } from "@/types/api.type";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Container,
  Form,
  LinkText,
} from "@/components/LoginRegister/components";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { UserService } from "@/services/UserService";
import useUserInfo from "@/zustand/useUserInfo";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const { userInfo, setUserInfo } = useUserInfo();
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: ILoginData = { username, password };
    const response = await UserService.login(data);
    if (response.status === "Success") {
      setUserInfo(response.data);
      router.push("/me/friends");
    } else {
      alert(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <InputField
          onValidChange={(fieldName, isValid) => {
            if (!isValid) {
              setErrorFields((oldValue) => [...oldValue, fieldName]);
            } else {
              setErrorFields((errorFields) =>
                errorFields.filter((errorField) => errorField !== fieldName)
              );
            }
          }}
          onChange={(value) => setUsername(value)}
          field={{
            fieldName: "Username",
            value: username,
            required: true,
            fieldProperty: {
              type: "text",
            },
          }}
        />
        <InputField
          onValidChange={(fieldName, isValid) => {
            if (!isValid) {
              setErrorFields((oldValue) => [...oldValue, fieldName]);
            } else {
              setErrorFields((errorFields) =>
                errorFields.filter((errorField) => errorField !== fieldName)
              );
            }
          }}
          onChange={(value) => setPassword(value)}
          field={{
            fieldName: "Password",
            value: password,
            required: true,
            fieldProperty: {
              type: "password",
            },
          }}
        />
        <Button
          style={{
            height: "40px",
            borderRadius: "5px",
            width: "90%",
            background: "#5865f2",
            border: "none",
            color: "white",
            fontWeight: 700,
            fontSize: "15px",
            marginTop: "15px",
          }}
          disabled={
            errorFields.length > 0 ||
            username.length === 0 ||
            password.length === 0
          }
        >
          Login
        </Button>
        <LinkText>
          <span>Need an account?</span>{" "}
          <span onClick={() => router.push("/register")}>Register</span>
        </LinkText>
      </Form>
    </Container>
  );
};

export default Login;
