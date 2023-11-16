"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { Server, UserInfo } from "@/types/api.type";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: #1e1f22;
  height: 100%;
  width: 70px;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  gap: 15px;
  padding-top: 20px;
`;

const PanelItem = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  &:after {
    content: "";
    position: absolute;
    left: -6px;
    background: white;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    transition: all 0.2s ease;
  }

  &.selected {
    &:after {
      height: 100%;
      border-radius: 5px;
    }
  }

  img {
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  &:hover {
    &.non-selected {
      &:after {
        height: 15px;
        border-radius: 2px;
      }
      img {
        border-radius: 20%;
        filter: brightness(110%);
      }
    }
  }
`;

const LeftPanel = () => {
  const [currentServer, setCurrentServer] = useState<Server | null>(null);
  const router = useRouter();
  const params = useParams();
  const userInfo = useSelector((state: RootState) => state.app.userInfo);

  useEffect(() => {
    if (params && userInfo && userInfo.joinedServers?.length > 0) {
      if (params.serverId) {
        const foundServers = userInfo.joinedServers.filter(
          (server) => server._id == params.serverId
        );
        if (foundServers?.length > 0) {
          setCurrentServer(foundServers[0]);
        }
      }
    }
  }, [params, userInfo]);

  return (
    <Container>
      {userInfo &&
        userInfo.joinedServers?.length > 0 &&
        userInfo.joinedServers.map((ele) => (
          <PanelItem
            onClick={() => router.push(`/servers/${ele._id}`)}
            className={
              currentServer?._id == ele._id ? "selected" : "non-selected"
            }
            key={ele._id}
          >
            <Image alt="channel-img" src={ele.avatar} width={48} height={48} />
          </PanelItem>
        ))}
    </Container>
  );
};

export default LeftPanel;
