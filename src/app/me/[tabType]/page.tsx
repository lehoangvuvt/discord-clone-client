"use client";

import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useFriendsList from "@/react-query/hooks/useFriendsList";
import Image from "next/image";
import { NotificationDot, SeparateLine } from "@/components/StyledComponents";
import SearchBar from "@/components/SearchBar";
import {
  IUserInfoLite,
  IUserRelationship,
  RelationshipTypeEnum,
} from "@/types/api.type";
import { UserService } from "@/services/UserService";
import usePendingRequests from "@/react-query/hooks/usePendingRequests";
import Button from "@/components/Button";
import Popover from "@/components/Popover";
import { useQueryClient } from "react-query";
import QUERY_KEY from "@/react-query/consts";
import { socket } from "@/services/socket";
import ChatP2P from "./chat";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useStore from "@/zustand/useStore";

const Container = styled.div`
  background: #313338;
  position: absolute;
  width: calc(100% - 70px);
  margin-left: 70px;
  height: calc(100% - 50px);
  display: flex;
  flex-flow: row wrap;
  margin-top: 50px;
`;

const Left = styled.div`
  width: 16.5%;
  height: 100%;
  background: #2b2d31;
  color: white;
  padding-top: 10px;
`;

const TabsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  gap: 3px;
`;

const TabItem = styled.div`
  width: 94%;
  margin: auto auto;
  padding: 10px 12px;
  border-radius: 5px;
  font-size: 15px;
  transition: all 0.15s ease;
  cursor: pointer;
  display: flex;
  flex-flow: row wrap;
  gap: 15px;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  &.selected,
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  &.selected {
    color: white;
    font-weight: 500;
  }
`;

const Center = styled.div`
  width: calc(100% - 5px);
  flex: 1;
  display: flex;
  flex-flow: column;
  gap: 10px;
  padding-top: 15px;
  position: relative;

  &::-webkit-scrollbar {
    width: 10px;
    background: rgba(0, 0, 0, 0.125);
  }
  &::-webkit-scrollbar-thumb {
    width: 10px;
    background: #111111;
    border-radius: 6px;
  }
`;

const FriendsListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  position: absolute;
  top: -50.5px;
  z-index: 91;
`;

const FriendsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
`;

const FriendItem = styled.div`
  width: 100%;
  padding: 12px 10px;
  display: flex;
  flex-flow: row wrap;
  position: relative;
  gap: 12px;
  align-items: center;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.05s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const FriendRequestItem = styled.div`
  width: 100%;
  padding: 12px 10px;
  display: flex;
  flex-flow: row wrap;
  position: relative;
  gap: 12px;
  align-items: center;
  color: white;
  font-size: 13px;
  font-weight: 600;
  border-radius: 5px;
  transition: all 0.05s ease;
`;

const FriendRequestButtonsContainer = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const SearchResult = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding-top: 25px;
  padding-bottom: 18px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
  font-weight: 600;
`;

const FriendsFilter = styled.div`
  width: 100%;
  height: 51px;
  border-bottom: 1px solid #111111;
  box-sizing: border-box;
  box-shadow: 0px 10px 13px -7px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0px 20px;
  gap: 15px;
`;

const FilterItem = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  padding: 3px 8px;
  border-radius: 5px;
  transition: all 0.1s ease;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.selected {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 1);
  }
`;

const AddFriendItem = styled(FilterItem)`
  color: white;
  background: #248046;
  &:hover {
    background: #248046;
    color: white;
  }
  &.selected {
    background: transparent;
    color: #2dbe5a;
  }
`;

const FriendViewContainer = styled.div`
  padding: 0px 30px;
`;

const AddFriendContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  position: relative;
  h1 {
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
    font-size: 15px;
    padding-bottom: 8px;
  }
  p {
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
    padding-bottom: 20px;
  }
`;

const SendFriendRequestInput = styled.button`
  width: 100%;
  position: relative;
  input {
    width: 100%;
    border: none;
    outline: none;
    background: #1e1f22;
    border-radius: 7px;
    padding: 14px;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 500;
    font-size: 14px;
    &::placeholder {
      font-weight: 400;
      color: rgba(255, 255, 255, 0.4);
    }
    &:focus {
      outline: 1px solid #0099ff;
    }
    &.Error {
      &:focus {
        outline: 1px solid #ae3538;
      }
      outline: 1px solid #ae3538;
    }
    &.Success {
      &:focus {
        outline: 1px solid #27824f;
      }
      outline: 1px solid #27824f;
    }
  }
`;

const SendFriendRequestBTN = styled.button`
  position: absolute;
  right: 0;
  background: #5865f2;
  color: white;
  transform: translateY(-50%);
  top: 50%;
  margin-right: 12px;
  padding: 7px 15px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  transition: filter 0.1s ease;
  &:hover {
    filter: brightness(90%);
  }
  &:disabled {
    filter: brightness(60%);
    cursor: not-allowed;
  }
`;

const FriendsList = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cloneFriends, setCloneFriends] = useState<IUserInfoLite[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const [currentView, setcurrentView] = useState<
    "FRIEND_LIST" | "ADD_FRIEND" | "PENDING"
  >("FRIEND_LIST");
  const { friends } = useFriendsList();
  const { pendingRequests } = usePendingRequests();
  const [usernameFR, setUsernameFR] = useState("");
  const [sendFRState, setSendFRState] = useState<
    | { status: "Success" }
    | { status: "Error"; error: string }
    | { status: "Idle" }
  >({ status: "Idle" });
  const { notifications } = useStore();

  useEffect(() => {
    if (pendingRequests) {
      const { receiveFromUsers } = pendingRequests;
      const totalPending = receiveFromUsers.length;
    }
  }, [pendingRequests]);

  useEffect(() => {
    setSendFRState({ status: "Idle" });
    setUsernameFR("");
  }, [currentView]);

  useEffect(() => {
    if (friends && friends.length > 0) {
      setCloneFriends([...friends]);
    }
  }, [friends]);

  const handleOnChange = (value: string) => {
    setSearchValue(value);
  };

  const handleSendFR = async () => {
    const response = await UserService.sendFriendRequest(usernameFR);
    if (response.status === "Success") {
      if (response.data.status === "Success") {
        queryClient.invalidateQueries([QUERY_KEY.GET_PENDING_REQUESTS]);
        const targetUserId = response.data.targetUser._id;
        setSendFRState({
          status: "Success",
        });
      }
    } else {
      switch (response.errorMessage) {
        case "NOT_FOUND":
          setSendFRState({
            status: "Error",
            error:
              "Cannot find any user with that username. Please double check username again.",
          });
          break;
        case "FAILED":
          break;
        case "RECEIVED_FROM_TARGET":
          setSendFRState({
            status: "Error",
            error:
              "You have already received friend request from this user. Please check your incoming friend requests.",
          });
          break;
        case "ALREADY_FRIEND":
          setSendFRState({
            status: "Error",
            error: "You are already friend with this user.",
          });
          break;
        case "BLOCKED_FROM_TARGET":
          setSendFRState({
            status: "Error",
            error: "You have been blocked by this user.",
          });
          break;
        case "YOURSELF":
          setSendFRState({
            status: "Error",
            error:
              "You cannot send friend request to yourself. Please double check username again",
          });
          break;
        case "ALREADY_SENT":
          setSendFRState({
            status: "Error",
            error:
              "You have already sent friend request to this user. Please check your sent friend requests.",
          });
          break;
      }
    }
  };

  const handleFriendRequest = async (
    request: IUserRelationship,
    type: RelationshipTypeEnum
  ) => {
    const response = await UserService.handleFriendRequest(request._id, type);
    if (response.status === "Success") {
      queryClient.invalidateQueries([QUERY_KEY.GET_PENDING_REQUESTS]);
      queryClient.invalidateQueries([QUERY_KEY.GET_FRIENDS_LIST]);

      socket.emit(
        "updateActivities",
        JSON.stringify({
          targetUserId: response.data.userSecondId,
        })
      );

      socket.emit(
        "updatePendingRequest",
        JSON.stringify({
          receiverFromUserId: response.data.userFirstId,
        })
      );
    }
  };

  useEffect(() => {
    if (friends && friends.length > 0) {
      const valueLowerCase = searchValue.toLowerCase();
      const result = friends.filter(
        (friend) =>
          friend.username.toLowerCase().includes(valueLowerCase) ||
          friend.name.toLowerCase().includes(valueLowerCase)
      );
      setCloneFriends([...result]);
    }
  }, [searchValue, friends]);

  return (
    <FriendsListContainer>
      <FriendsFilter>
        <PeopleIcon
          style={{ fontSize: "25px", color: "rgba(255,255,255,0.6)" }}
        />
        <span
          style={{
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            marginLeft: "-8px",
          }}
        >
          Friends
        </span>
        <SeparateLine
          color="rgba(255,255,255,0.15)"
          width="0.5px"
          height="50%"
          style={{ margin: "0px 5px" }}
        />
        <FilterItem
          onClick={() => setcurrentView("FRIEND_LIST")}
          className={
            currentView === "FRIEND_LIST" ? "selected" : "not-selected"
          }
        >
          Friends
        </FilterItem>
        <FilterItem
          onClick={() => setcurrentView("PENDING")}
          className={currentView === "PENDING" ? "selected" : "not-selected"}
        >
          Pending{" "}
          {notifications && notifications.ADD_FRIEND.length > 0 && (
            <NotificationDot>{notifications.ADD_FRIEND.length}</NotificationDot>
          )}
        </FilterItem>
        <AddFriendItem
          onClick={() => setcurrentView("ADD_FRIEND")}
          className={currentView === "ADD_FRIEND" ? "selected" : "not-selected"}
        >
          Add Friend
        </AddFriendItem>
      </FriendsFilter>
      <FriendViewContainer>
        {currentView === "FRIEND_LIST" && (
          <>
            <SearchBar
              value={searchValue}
              onChange={handleOnChange}
              onClickClear={() => setSearchValue("")}
              style={{
                borderRadius: "5px",
                width: "100%",
                margin: "auto auto",
              }}
            />
            <SearchResult>ALL FRIENDS - {cloneFriends.length}</SearchResult>
            <FriendsContainer>
              {cloneFriends &&
                cloneFriends.length > 0 &&
                cloneFriends.map((friend, i) => (
                  <div key={friend._id}>
                    <SeparateLine
                      color="rgba(255,255,255,0.1)"
                      style={{ margin: "0px 0px" }}
                    />
                    <FriendItem
                      onClick={() => router.push(`/me/chat?id=` + friend._id)}
                      key={friend._id}
                    >
                      <Image
                        alt="user-avatar"
                        width={35}
                        height={35}
                        style={{
                          borderRadius: "50%",
                          height: "35px",
                          width: "35px",
                        }}
                        src={friend.avatar}
                      />
                      {friend.name}
                    </FriendItem>
                  </div>
                ))}
            </FriendsContainer>
          </>
        )}
        {currentView === "PENDING" &&
          pendingRequests &&
          pendingRequests.receiveFromUsers &&
          pendingRequests.sentToUsers && (
            <>
              {pendingRequests.receiveFromUsers.length > 0 && (
                <>
                  <SearchResult>
                    INCOMING FRIEND REQUESTS -{" "}
                    {pendingRequests.receiveFromUsers.length}
                  </SearchResult>
                  <FriendsContainer>
                    {pendingRequests.receiveFromUsers.map(
                      (pendingRequest, i) => (
                        <>
                          <SeparateLine
                            color="rgba(255,255,255,0.1)"
                            style={{ margin: "0px 0px" }}
                          />
                          <FriendRequestItem key={pendingRequest.request._id}>
                            <Image
                              alt="user-avatar"
                              width={35}
                              height={35}
                              style={{
                                borderRadius: "50%",
                                height: "35px",
                                width: "35px",
                              }}
                              src={pendingRequest.user.avatar}
                            />
                            {pendingRequest.user.username}
                            {pendingRequest.request.type ===
                              RelationshipTypeEnum.DECLINE && (
                              <FriendRequestButtonsContainer>
                                <Button
                                  disabled
                                  style={{
                                    background: "rgba(255,255,255,0.1)",
                                  }}
                                >
                                  Rejected
                                </Button>
                              </FriendRequestButtonsContainer>
                            )}
                            {pendingRequest.request.type ===
                              RelationshipTypeEnum.PENDING_REQUEST && (
                              <FriendRequestButtonsContainer>
                                <Button
                                  onClick={() =>
                                    handleFriendRequest(
                                      pendingRequest.request,
                                      RelationshipTypeEnum.FRIEND
                                    )
                                  }
                                  style={{ background: "#0099FF" }}
                                >
                                  Accept
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleFriendRequest(
                                      pendingRequest.request,
                                      RelationshipTypeEnum.DECLINE
                                    )
                                  }
                                  style={{
                                    background: "rgba(255,255,255,0.15)",
                                  }}
                                >
                                  Decline
                                </Button>
                              </FriendRequestButtonsContainer>
                            )}
                          </FriendRequestItem>
                        </>
                      )
                    )}
                  </FriendsContainer>
                </>
              )}
              {pendingRequests.sentToUsers.length > 0 && (
                <>
                  <SearchResult>
                    SENT FRIEND REQUESTS - {pendingRequests.sentToUsers.length}
                  </SearchResult>
                  <FriendsContainer>
                    {pendingRequests.sentToUsers.map((pendingRequest, i) => (
                      <>
                        <SeparateLine
                          color="rgba(255,255,255,0.1)"
                          style={{ margin: "0px 0px" }}
                        />
                        <FriendItem key={pendingRequest.request._id}>
                          <Image
                            alt="user-avatar"
                            width={35}
                            height={35}
                            style={{
                              borderRadius: "50%",
                              height: "35px",
                              width: "35px",
                            }}
                            src={pendingRequest.user.avatar}
                          />
                          {pendingRequest.user.username}
                        </FriendItem>
                      </>
                    ))}
                  </FriendsContainer>
                </>
              )}
            </>
          )}
        {currentView === "ADD_FRIEND" && (
          <AddFriendContainer>
            <h1>ADD FRIEND</h1>
            <p>You can add friends with their username</p>
            <SendFriendRequestInput>
              <input
                className={sendFRState.status}
                value={usernameFR}
                onChange={(e) => {
                  setSendFRState({ status: "Idle" });
                  setUsernameFR(e.target.value);
                }}
                placeholder="You can add friends with their username"
              />
              <SendFriendRequestBTN
                disabled={usernameFR.trim().length === 0}
                onClick={handleSendFR}
              >
                Send Friend Request
              </SendFriendRequestBTN>
            </SendFriendRequestInput>
            {sendFRState.status === "Error" && (
              <p
                style={{
                  color: "#d96c71",
                  paddingTop: "13px",
                  fontSize: "13px",
                }}
              >
                {sendFRState.error}
              </p>
            )}
            {sendFRState.status === "Success" && (
              <p
                style={{
                  color: "#2e9f61",
                  paddingTop: "13px",
                  fontSize: "13px",
                }}
              >
                Success! Your friend request to{" "}
                <span style={{ fontWeight: "700" }}>{usernameFR}</span> was
                sent.
              </p>
            )}
          </AddFriendContainer>
        )}
      </FriendViewContainer>
    </FriendsListContainer>
  );
};

export default function Me({ params }: { params: any }) {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("");

  useEffect(() => {
    if (!params || !params.tabType) return;
    setCurrentTab(params.tabType);
  }, [params]);

  return (
    <Container>
      <Left>
        <TabsContainer>
          <TabItem
            className={
              currentTab === "friends" || currentTab === "chat"
                ? "selected"
                : "not-selected"
            }
            onClick={() => router.push("/me/friends")}
          >
            <PeopleIcon style={{ fontSize: "23px" }} />
            Friends
          </TabItem>
          <TabItem
            className={currentTab === "shop" ? "selected" : "not-selected"}
            onClick={() => router.push("/me/shop")}
          >
            <StorefrontIcon style={{ fontSize: "23px" }} />
            Shop
          </TabItem>
        </TabsContainer>
      </Left>
      <Center>
        {currentTab === "chat" && <ChatP2P />}
        {currentTab === "friends" && <FriendsList />}
      </Center>
    </Container>
  );
}
