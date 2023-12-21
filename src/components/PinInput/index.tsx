"use client";

import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  gap: 15px;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  height: 52px;
  aspect-ratio: 1;
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
  outline: none;
  font-size: 18px;
  transition: all 0.05s ease;
  color: #5865f2;
  background: #252432;
  &.focus {
    outline: 2px solid #5865f2;
  }
  &.filled {
    filter: brightness(130%);
    color: white;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
  }
  &.error {
    outline: 2px solid #e53935;
    filter: brightness(130%);
    color: white;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
    animation: shakeInput 0.25s ease;
    @keyframes shakeInput {
      0% {
        transform: translate(1px, 1px) rotate(0deg);
      }
      10% {
        transform: translate(-1px, -2px) rotate(-1deg);
      }
      20% {
        transform: translate(-3px, 0px) rotate(1deg);
      }
      30% {
        transform: translate(3px, 2px) rotate(0deg);
      }
      40% {
        transform: translate(1px, -1px) rotate(1deg);
      }
      50% {
        transform: translate(-1px, 2px) rotate(-1deg);
      }
      60% {
        transform: translate(-3px, 1px) rotate(0deg);
      }
      70% {
        transform: translate(3px, 1px) rotate(-1deg);
      }
      80% {
        transform: translate(-1px, -1px) rotate(1deg);
      }
      90% {
        transform: translate(1px, 2px) rotate(0deg);
      }
      100% {
        transform: translate(1px, -2px) rotate(-1deg);
      }
    }
  }
`;

type Props = {
  codeLength: number;
  onValuesChange: (values: string[]) => void;
  onFilledStateChange?: (state: boolean) => void;
  isReset?: boolean;
  isError?: boolean;
};

const PinInput = ({
  codeLength,
  onFilledStateChange,
  onValuesChange,
  isError = false,
  isReset = false,
}: Props) => {
  const [values, setValues] = useState<string[]>([]);
  const [focusIndex, setFocusIndex] = useState(0);

  useEffect(() => {
    setValues(Array(codeLength).fill(""));
  }, [codeLength]);

  useEffect(() => {
    if (isReset) {
      setValues(Array(codeLength).fill(""));
      setFocusIndex(0);
    }
  }, [isReset, codeLength]);

  useEffect(() => {
    const currentEle = document.getElementById(`input_${focusIndex}`);
    if (!currentEle) return;
    currentEle.focus();
  }, [focusIndex]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (parseInt(value) || value === "0" || value === "") {
      const updatedValues = [...values];
      if (value.length > 1) {
        updatedValues[index] = value.slice(-1);
      } else {
        updatedValues[index] = value;
      }
      setValues(updatedValues);
      if (index < values.length - 1 && value !== "") {
        setFocusIndex(index + 1);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    const value = e.clipboardData.getData("text");
    let lengthToPaste = 0;
    if (values.length > index) {
      lengthToPaste = values.length - index;
    } else {
      lengthToPaste = values.length;
    }
    const updatedValues = [...values];
    let lengthToEnd = 0;
    if (value.length >= lengthToPaste) {
      lengthToEnd = lengthToPaste;
    } else {
      lengthToEnd = value.length;
    }
    for (let i = 0; i < lengthToEnd; i++) {
      const char = value.charAt(i);
      updatedValues[index + i] = char;
    }
    setTimeout(() => {
      setFocusIndex(lengthToEnd - 1);
      setValues(updatedValues);
    }, 10);
  };

  useEffect(() => {
    if (onFilledStateChange) {
      if (values.filter((value) => value === "").length === 0) {
        onFilledStateChange(true);
      } else {
        onFilledStateChange(false);
      }
    }
    onValuesChange(values);
  }, [values]);

  const handleOnKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedValues = [...values];
    switch (e.key) {
      case "Backspace":
        updatedValues[index] = "";
        setValues(updatedValues);
        setTimeout(() => {
          setFocusIndex(index - 1);
        }, 10);

        break;
    }
  };

  return (
    <Container>
      {values.map((value, i) => (
        <Input
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            handleOnKeyDown(e, i)
          }
          autoComplete="new-password"
          onPaste={(e) => handlePaste(e, i)}
          onClick={() => setFocusIndex(i)}
          id={`input_${i}`}
          key={i}
          className={
            isError
              ? "error"
              : values[i] !== ""
              ? "filled"
              : focusIndex === i
              ? "focus"
              : ""
          }
          onChange={(e) => handleChange(e, i)}
          value={value}
          type="password"
        />
      ))}
    </Container>
  );
};

export default PinInput;
