import styled from "styled-components";

const SeparateLine = styled.div<{
  color?: string;
  height?: string;
  width?: string;
}>`
  width: ${(props) => props.width ?? "100%"};
  height: ${(props) => props.height ?? "1px"};
  background: ${(props) => props.color ?? "rgba(255, 255, 255, 0.2)"};
  margin: 5px auto;
`;

const NotificationDot = styled.div<{
  color?: string;
  height?: string;
  width?: string;
  bgColor?: string;
}>`
  width: ${(props) => props.width ?? "19px"};
  height: ${(props) => props.height ?? "19px"};
  background: ${(props) => props.bgColor ?? "red"};
  color: ${(props) => props.bgColor ?? "white"};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 1.5px;
  padding-bottom: 1px;
  font-size: 12px;
  font-weight: bold;
`;

export { SeparateLine, NotificationDot };
