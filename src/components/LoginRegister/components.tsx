import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url("/images/login-animated-bg.gif");
  background-size: cover;
  background-position: top;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  width: 400px;
  padding: 50px 20px 30px 20px;
  background: #36393f;
  border-radius: 6px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const FieldContainer = styled.div`
  width: 90%;
  display: flex;
  flex-flow: column wrap;
  span {
    text-transform: uppercase;
    color: #b8babd;
    font-weight: 600;
    font-size: 11px;
    letter-spacing: 0.5px;
    filter: brightness(120%);
  }
  input {
    margin-top: 10px;
    border: none;
    outline: none;
    background: #111111;
    height: 40px;
    border-radius: 5px;
    color: rgba(255, 255, 255, 0.7);
    padding-left: 10px;
    padding-right: 10px;
    font-size: 14px;
  }
`;

const LinkText = styled.div`
  width: 90%;
  margin-top: -5px;
  text-align: center;
  span:nth-child(1) {
    font-weight: 300;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
  }
  span:nth-child(2) {
    font-weight: 400;
    font-size: 13px;
    color: #1ab7ea;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export { Container, FieldContainer, Form, LinkText };
