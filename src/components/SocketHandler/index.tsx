// "use-client";

// import { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// import { socket } from "@/services/socket";

// const SocketHandler = () => {
//   const userInfo = useSelector((state: RootState) => state.app.userInfo);
//   const onConnect = () => {};
//   const onDisconnect = () => {};

//   useEffect(() => {
//     if (userInfo) {
//       socket.auth = { accessToken: userInfo.accessToken };
//       socket.connect();
//       socket.on("connect", onConnect);
//       socket.on("disconnect", onConnect);

//       return () => {
//         socket.off("connect", onConnect);
//         socket.off("disconnect", onDisconnect);
//       };
//     }
//   }, [userInfo]);

//   return <></>;
// };

// export default SocketHandler;
