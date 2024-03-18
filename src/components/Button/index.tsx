"use client";

import styled from "styled-components";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Container = styled.button`
  padding: 0px 20px;
  background: #248046;
  color: white;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 33px;
  border-radius: 3px;
  cursor: pointer;
  transition: filter 0.2s ease;
  border: none;
  outline: none;
  font-weight: 600;
  &:hover {
    filter: brightness(80%);
  }
  &.loading {
    background: rgba(255, 255, 255, 0.15) !important;
    cursor: progress;
    &:hover {
      filter: brightness(100%);
    }
  }
  &.disabled {
    cursor: not-allowed;
    filter: brightness(60%);
  }
`;

const Button = ({
  onClick,
  loading = false,
  disabled = false,
  style,
  children,
}: {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) => {
  return (
    <Container
      style={style}
      disabled={disabled}
      className={disabled ? "disabled" : loading ? "loading" : ""}
      onClick={() => {
        if (disabled || loading) return;
        onClick && onClick();
      }}
      type="submit"
    >
      {loading ? (
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 24, color: "white" }} spin />
          }
        />
      ) : (
        "Login"
      )}
    </Container>
  );
};

export default Button;
