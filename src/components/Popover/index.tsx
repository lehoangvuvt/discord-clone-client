"use client";

import styled from "styled-components";

const Container = styled.div<{ marginTop: string }>`
  position: absolute;
  top: calc(100% + ${(props) => props.marginTop});
  transform: scaleY(0) translateX(-50%);
  left: 50%;
  z-index: 90;
  animation: channelPopupAppear 0.1s ease forwards;
  transform-origin: center top;
  @keyframes channelPopupAppear {
    to {
      transform: scaleY(1) translateX(-50%);
    }
  }
`;

const Popover = ({
  marginTop = "10px",
  children = "Default content",
  isOpen = false,
}: {
  marginTop?: string;
  children?: React.ReactNode;
  isOpen?: boolean;
}) => {
  return isOpen ? (
    <Container marginTop={marginTop}>{children}</Container>
  ) : null;
};

export default Popover;
