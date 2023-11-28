"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  display: none;
  z-index: 103;
  display: none;
  align-items: center;
  justify-content: center;
  animation: serverPopUpContainerAppear 0.1s ease 0.08s forwards;
  @keyframes serverPopUpContainerAppear {
    from {
      background-color: rgba(0, 0, 0, 0);
    }
    to {
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
`;

const Content = styled.div`
  border-radius: 5px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  padding: 25px 20px 0px 20px;
  position: relative;
  overflow: hidden;
  animation: formAppear 0.2s ease;
  @keyframes formAppear {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
`;

const Popup = ({
  children,
  closePopup,
  isOpen = false,
  contentStyle,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  closePopup: () => void;
  contentStyle?: React.CSSProperties;
}) => {
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!myRef || !myRef.current) return;
    if (isOpen) {
      myRef.current.style.display = "flex";
    } else {
      myRef.current.style.display = "none";
    }
  }, [isOpen]);

  return (
    <Container
      ref={myRef}
      onClick={(e) => e.target === e.currentTarget && closePopup()}
    >
      <Content style={contentStyle}>{children}</Content>
    </Container>
  );
};

export default Popup;
