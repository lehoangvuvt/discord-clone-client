"use client";

import styled from "styled-components";
import { ChangeEvent, useEffect, useState } from "react";

const Container = styled.div`
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
    span {
      color: #b71c1c;
      font-size: 12px;
    }
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

const ErrorMessage = styled.div`
  width: 100%;
  color: #f50057;
  font-size: 10px;
  padding-top: 8px;
  font-weight: bold;
  text-transform: uppercase;
  height: 20px;
  letter-spacing: 0.25px;
`;

type Field = {
  fieldName?: string;
  value: string | number;
  required?: boolean;
  fieldProperty: NumberField | TextField;
};

type NumberField = {
  type: "number";
  validateRules?: {
    minValue?: number;
    maxValue?: number;
    excludeValues?: number[];
  };
};

type TextField = {
  type: "text" | "password";
  validateRules?: {
    minLength?: number;
    maxLength?: number;
    excludeValues?: string[];
    mustContainsWildcards?: boolean;
    notContainsWildcards?: boolean;
    equalValue?: {
      fieldName?: string;
      value: string;
    };
  };
};

const InputField = ({
  field,
  onChange,
  onValidChange,
}: {
  field: Field;
  onValidChange?: (fieldName: string, isValid: boolean) => void;
  onChange: (value: any) => void;
}) => {
  const [isValid, setValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const validateNumber = (): { isValid: boolean; errorMsg: string } => {
    let isValid = true;
    let errorMsg = "";
    const type = field.fieldProperty.type;
    if (type === "number") {
      let isValidMinValue = true;
      let isValidMaxValue = true;
      if (field.fieldProperty.validateRules) {
        if (field.fieldProperty.validateRules.minValue) {
          const minValue = field.fieldProperty.validateRules.minValue;
          if (parseInt(field.value.toString()) < minValue) {
            isValidMinValue = false;
            errorMsg = `Min value is ${minValue}`;
          } else {
            isValidMinValue = true;
            errorMsg = "";
          }
        }

        if (field.fieldProperty.validateRules.maxValue) {
          const maxValue = field.fieldProperty.validateRules.maxValue;
          if (parseInt(field.value.toString()) > maxValue) {
            isValidMaxValue = false;
            errorMsg = `Max value is ${maxValue}`;
          } else {
            isValidMaxValue = true;
            errorMsg = "";
          }
        }

        if (!isValidMinValue || !isValidMaxValue) {
          isValid = false;
        } else {
          isValid = true;
        }
      }
    }
    return { isValid, errorMsg };
  };

  const validateString = (): { isValid: boolean; errorMsg: string } => {
    let isValid = true;
    let errorMsg = "";
    const type = field.fieldProperty.type;
    if (type === "text" || type === "password") {
      const value = field.value.toString();
      const validateRules = field.fieldProperty.validateRules;
      let isValidMinLength = true;
      let isValidMaxLength = true;
      let isValidExclude = true;
      let isValidEqualValue = true;
      let isValidRequired = true;
      if (field.required) {
        if (value.length === 0) {
          isValidRequired = false;
        } else {
          isValidRequired = true;
        }
      }
      if (validateRules) {
        if (validateRules.minLength) {
          const minLength = validateRules.minLength;
          if (value.length < minLength) {
            if (value.length === 0) return { isValid: false, errorMsg: "" };
            isValidMinLength = false;
            errorMsg = `Min length is ${minLength} characters`;
          } else {
            isValidMinLength = true;
            errorMsg = "";
          }
        }
        if (validateRules.maxLength) {
          const maxLength = validateRules.maxLength;
          if (value.length > maxLength) {
            isValidMaxLength = false;
            errorMsg = `Max length is ${maxLength} characters`;
          } else {
            isValidMaxLength = true;
            errorMsg = "";
          }
        }
        if (validateRules.excludeValues) {
          const excludeValues = validateRules.excludeValues;
          for (let i = 0; i < excludeValues.length; i++) {
            if (value.toUpperCase().includes(excludeValues[i].toUpperCase())) {
              isValidExclude = false;
            }
          }
          if (!isValidExclude) errorMsg = "Contains exclude values";
        }
        if (validateRules.equalValue) {
          const { value: valueToMatch, fieldName } = validateRules.equalValue;
          if (value !== valueToMatch) {
            isValidEqualValue = false;
            if (fieldName) {
              errorMsg = `${field.fieldName} not match with  ${fieldName}`;
            } else {
              errorMsg = `${field.fieldName} not equal ${valueToMatch}`;
            }
          } else {
            isValidEqualValue = true;
            errorMsg = "";
          }
        }
      }
      if (
        !isValidMaxLength ||
        !isValidMinLength ||
        !isValidExclude ||
        !isValidEqualValue ||
        !isValidRequired
      ) {
        isValid = false;
      } else {
        isValid = true;
      }
    }
    return { isValid, errorMsg };
  };

  useEffect(() => {
    let validateResult: { isValid: boolean; errorMsg: string } = {
      isValid: true,
      errorMsg: "",
    };
    switch (field.fieldProperty.type) {
      case "number":
        validateResult = validateNumber();
        break;
      case "text":
      case "password":
        validateResult = validateString();
        break;
    }
    setValid(validateResult.isValid);
    setErrorMsg(validateResult.errorMsg);
  }, [field.value]);

  useEffect(() => {
    if (field.fieldName) {
      onValidChange!(field.fieldName, isValid);
    }
  }, [isValid]);

  return (
    <Container>
      <span>
        {field.fieldName} {field.required && <span>*</span>}
      </span>
      <input
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        required
        type={field.fieldProperty.type}
        value={field.value}
      />
      {!isValid && errorMsg.length > 0 && (
        <ErrorMessage>{errorMsg}</ErrorMessage>
      )}
    </Container>
  );
};

export default InputField;
