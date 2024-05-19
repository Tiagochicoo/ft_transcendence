import { socketListeners } from "./index.js";

const generateSocket = async () => {
  if (!USER_ID) return;

  if (SOCKET) {
    SOCKET.disconnect();
  }

  try {
    // Create a socket (the server will receive this data)
    SOCKET = io({
      extraHeaders: {
        "x-user-id": USER_ID
      }
    });

    socketListeners();
  } catch(e) {
    console.error(e);
  }
}

export default generateSocket;
