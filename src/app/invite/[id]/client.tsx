"use client";

import Button from "@/components/Button";
import { ServerService } from "@/services/ServerService";
import { UserService } from "@/services/UserService";
import { IServerInvitationDetails } from "@/types/api.type";
import useStore from "@/zustand/useStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useEffect } from "react";

const Container = styled.div`
  width: 100%;
  height: 100%;
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
  padding: 0px 40px 40px 40px;
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

const InvitationClient = ({
  invitationDetails,
}: {
  invitationDetails: IServerInvitationDetails | null;
}) => {
  const { setUserInfo } = useStore();
  const router = useRouter();

  const handleAcceptInvitation = async () => {
    if (invitationDetails) {
      const response = await ServerService.acceptServerInvitation(
        invitationDetails.invitation_short_id
      );
      if (response.status === "Success") {
        const response = await UserService.athentication();
        if (response.status === "Success") {
          setUserInfo(response.data);
        }
        router.push(`/servers/${invitationDetails.serverDetails._id}`);
      }
    }
  };

  return (
    <Container>
      {invitationDetails && !invitationDetails.isExpired ? (
        <Content>
          <h2>
            <Image
              width={60}
              height={60}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: "50%",
                background: "#111111",
                margin: "20px auto",
              }}
              alt="creator-avatar"
              src={invitationDetails?.creator.avatar ?? ""}
            />
            {invitationDetails?.creator?.name} (
            {invitationDetails?.creator.username}) invited you to join
          </h2>
          <h1>{invitationDetails?.serverDetails?.name}</h1>
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
      ) : (
        <Content style={{ background: "#33363b" }}>
          <Image
            src="/images/shit.png"
            alt="shit-img"
            width={200}
            height={150}
            style={{ marginTop: "30px" }}
          />
          <h1 style={{ paddingTop: "20px", fontSize: "23px" }}>
            Invite Invalid
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.55)",
              fontSize: "14px",
            }}
          >
            This invite may be expired, or you might not have permission to
            join.
          </p>
          <Button
            onClick={() => router.push("/me/friends")}
            style={{
              background: "#5865f2",
              width: "100%",
              padding: "22px",
              fontSize: "14px",
              marginTop: "40px",
            }}
          >
            Continue to Chat
          </Button>
        </Content>
      )}
    </Container>
  );
};

export default InvitationClient;
