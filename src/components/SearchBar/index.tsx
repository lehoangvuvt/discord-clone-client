"use client";

import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  background: #1e1f22;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  font-size: 15px;
  svg {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    &:hover {
      color: rgba(255, 255, 255, 1);
    }
    &.clear-btn {
      animation: clearBtnSpin 0.15s ease;
      @keyframes clearBtnSpin {
        from {
          transform: translateY(-50%) rotate(0deg);
        }
        to {
          transform: translateY(-50%) rotate(180deg);
        }
      }
    }
    &.search-btn {
      animation: searchBtnSpin 0.15s ease;
      @keyframes searchBtnSpin {
        from {
          transform: translateY(-50%) rotate(180deg);
        }
        to {
          transform: translateY(-50%) rotate(0deg);
        }
      }
    }
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  padding: 9px 11px;
  background: none;
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const SearchBar = ({
  value,
  onChange,
  onClickSearch,
  onClickClear,
  style,
}: {
  style?: React.CSSProperties;
  value: string;
  onChange: (value: string) => void;
  onClickSearch?: () => void;
  onClickClear?: () => void;
}) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    if (onClickClear) onClickClear();
  };

  const handleSearch = () => {
    if (onClickSearch) onClickSearch();
  };

  return (
    <Container style={style}>
      <Input value={value} placeholder="Search" onChange={handleOnChange} />
      {value.length > 0 ? (
        <ClearIcon
          className="clear-btn"
          onClick={handleClear}
          color="inherit"
        />
      ) : (
        <SearchIcon
          className="search-btn"
          onClick={handleSearch}
          color="inherit"
        />
      )}
    </Container>
  );
};

export default SearchBar;
