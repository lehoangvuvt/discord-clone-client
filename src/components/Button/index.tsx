"use client";

import styled from "styled-components";

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
    filter: brightness(80%);
    cursor: progress;
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
      onClick={onClick}
      type="submit"
    >
      {children}
    </Container>
  );
};

export default Button;
