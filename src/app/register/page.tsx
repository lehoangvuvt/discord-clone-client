"use client";

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import {
  Container,
  Form,
  LinkText,
} from "@/components/LoginRegister/components";
import { UserService } from "@/services/UserService";
import { IRegisterData } from "@/types/api.type";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    const data: IRegisterData = {
      username,
      password,
      name,
      email,
    };
    const response = await UserService.register(data);
    if (response.status === "Success") {
      router.push(`/verify/${response.data.url}`);
    } else {
      alert("Error");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <InputField
          onValidChange={(fieldName, isValid) => {
            if (!isValid) {
              setErrorFields([...errorFields, fieldName]);
            } else {
              setErrorFields((errorFields) =>
                errorFields.filter((errorField) => errorField !== fieldName)
              );
            }
          }}
          onChange={(value) => setUsername(value)}
          field={{
            fieldName: "Username",
            required: true,
            value: username,
            fieldProperty: {
              type: "text",
              validateRules: {
                minLength: 5,
              },
            },
          }}
        />

        <InputField
          onValidChange={(fieldName, isValid) => {
            if (!isValid) {
              setErrorFields([...errorFields, fieldName]);
            } else {
              setErrorFields((errorFields) =>
                errorFields.filter((errorField) => errorField !== fieldName)
              );
            }
          }}
          onChange={(value) => setEmail(value)}
          field={{
            fieldName: "Email",
            required: true,
            value: email,
            fieldProperty: {
              type: "text",
            },
          }}
        />

        <InputField
          onValidChange={(fieldName, isValid) => {
            if (!isValid) {
              setErrorFields([...errorFields, fieldName]);
            } else {
              setErrorFields((errorFields) =>
                errorFields.filter((errorField) => errorField !== fieldName)
              );
            }
          }}
          onChange={(value) => setName(value)}
          field={{
            fieldName: "Display name",
            value: name,
            fieldProperty: {
              type: "text",
            },
          }}
        />

        <InputField
          onValidChange={(fieldName, isValid) => {
            if (!isValid) {
              setErrorFields([...errorFields, fieldName]);
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
              validateRules: {
                minLength: 5,
              },
            },
          }}
        />

        <InputField
          onValidChange={(fieldName, isValid) => {
            if (!isValid) {
              setErrorFields([...errorFields, fieldName]);
            } else {
              setErrorFields((errorFields) =>
                errorFields.filter((errorField) => errorField !== fieldName)
              );
            }
          }}
          onChange={(value) => setRePassword(value)}
          field={{
            fieldName: "Repeat password",
            value: rePassword,
            required: true,
            fieldProperty: {
              type: "password",
              validateRules: {
                equalValue: {
                  value: password,
                  fieldName: "password",
                },
              },
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
          Register
        </Button>
        <LinkText>
          <span>Already have an account?</span>{" "}
          <span onClick={() => router.push("/login")}>Login</span>
        </LinkText>
      </Form>
    </Container>
  );
};

export default Login;
