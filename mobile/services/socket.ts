import io  from "socket.io-client";

const isNative =
  typeof navigator === "undefined" || navigator.product === "ReactNative";

// Creamos la conexión
const socket = io("http://localhost:4000", {
  transports: ["websocket"],
  ...(isNative
    ? {
        extraHeaders: {
          "Access-Control-Allow-Credentials": "true",
        },
      }
    : {}),
});

socket.on("connect", () => console.log("✅ Socket conectado:", socket.id));
socket.on("disconnect", (reason: any) =>
  console.log("Socket desconectado:", reason)
);
socket.on("connect_error", (err: any) =>
  console.error("⚠️ Error de conexión:", err)
);

export default socket;
