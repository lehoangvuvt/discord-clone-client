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

export { SeparateLine };
