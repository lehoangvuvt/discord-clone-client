"use client";

import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
`;

const TreeItemCotainer = styled.div<{ $pl: number }>`
  //   padding-left: ${(props) => props.$pl + 12}px;
  padding-left: 0px;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  cursor: pointer;
  position: relative;
`;

const TreeItemTitle = styled.div<{ $canDropDown: boolean }>`
  padding-left: 8px;
  display: flex;
  position: relavite;
  flex: 1;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  &:hover {
  }
`;

const TreeItemRightContent = styled.div`
  flex: 1;
  position: absolute;
  right: 0;
`;

const TreeItemTitleText = styled.div`
  flex: 1;
`;

const TreeChildrensContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  cursor: pointer;
  position: relative;
  gap: 2px;

  animation: TreeChildrensContainer 0.4s ease;
  @keyframes TreeChildrensContainer {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const DropdownIcon = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  padding-top: 13px;
  padding-left: 5px;
  font-size: 7px;
  span {
    transition: transform 0.25s ease;
    &.opened {
      transform: rotate(0deg);
    }
    &.closed {
      transform: rotate(-90deg);
    }
  }
`;

type ITreeItem = {
  title: React.ReactNode;
  childs?: ITreeItem[];
  treeItemRightContent?: React.ReactNode;
};

const TreeItem = ({
  title,
  children,
  defaultOpen,
  treeItemRightContent,
  pl,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen: boolean;
  treeItemRightContent?: React.ReactNode;
  pl: number;
}) => {
  const [isOpen, setOpen] = useState(defaultOpen);

  return (
    <TreeItemCotainer $pl={pl}>
      {children && (
        <DropdownIcon>
          <DownOutlined className={isOpen ? "opend" : "closed"} />
        </DropdownIcon>
      )}
      <TreeItemTitle $canDropDown={children ? true : false}>
        <TreeItemTitleText
          onClick={(e) => {
            setOpen(!isOpen);
          }}
        >
          {title}
        </TreeItemTitleText>
        {TreeItemRightContent && (
          <TreeItemRightContent>{treeItemRightContent}</TreeItemRightContent>
        )}
      </TreeItemTitle>
      {isOpen && <TreeChildrensContainer>{children}</TreeChildrensContainer>}
    </TreeItemCotainer>
  );
};

const Tree = ({ data }: { data: ITreeItem[] }) => {
  const generateTree = (
    data: ITreeItem,
    level: number,
    defaultOpen: boolean,
    isAnimation: boolean
  ) => {
    const pl = level * 2;
    let treeItem = (
      <TreeItem
        pl={pl}
        title={data.title}
        defaultOpen={defaultOpen}
        treeItemRightContent={data.treeItemRightContent ?? null}
      >
        {data.childs &&
          data.childs.length > 0 &&
          data.childs.map((childItem) =>
            generateTree(childItem, level + 1, false, true)
          )}
      </TreeItem>
    );
    return treeItem;
  };

  return (
    <Container>
      {data.map((item) => generateTree(item, 0, true, false))}
    </Container>
  );
};

export default Tree;
