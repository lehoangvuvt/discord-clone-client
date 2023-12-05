"use client";

import Button from "@/components/Button";
import useServerInvitationDetails from "@/react-query/hooks/useServerInvitationDetails";
import { setUserInfo } from "@/redux/slices/appSlice";
import { ServerService } from "@/services/ServerService";
import { UserService } from "@/services/UserService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: red;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url("/images/invitation-bg.gif");
  background-size: cover;
  background-position: top;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 32%;
  padding: 40px;
  background: #313338;
  border-radius: 6px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  color: white;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  h1 {
    font-weight: 600;
    font-size: 23px;
  }
  h2 {
    font-weight: 350;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.65);
  }
`;

const Invitation = ({ params }: { params: { id: string } }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { serverInvitationDetails, isLoading, isError } =
    useServerInvitationDetails(params.id);

  const handleAcceptInvitation = async () => {
    if (params.id) {
      const response = await ServerService.acceptServerInvitation(params.id);
      if (response.status === "Success") {
        const response = await UserService.athentication();
        if (response.status === "Success") {
          dispatch(setUserInfo(response.data));
        }
        router.push(`/servers/${serverInvitationDetails?.serverDetails?._id}`);
      }
    }
  };

  return (
    <Container>
      <Content>
        <h2>You have been invited to join</h2>
        <h1>{serverInvitationDetails?.serverDetails?.name}</h1>
        <Button
          onClick={handleAcceptInvitation}
          style={{
            background: "#5865f2",
            width: "100%",
            padding: "22px",
            fontSize: "14px",
            marginTop: "40px",
          }}
        >
          Accept Invite
        </Button>
      </Content>
    </Container>
  );
};

export default Invitation;
