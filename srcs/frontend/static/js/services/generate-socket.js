import { socketListeners, variables } from "./index.js";

const generateSocket = async () => {
  if (!USER_ID) return;

  if (variables.socket) {
    variables.socket.disconnect();
  }

  try {
    // Create a socket (the server will receive this data)
    variables.socket = io({
      extraHeaders: {
        "x-user-id": USER_ID
      }
    });

    socketListeners();
  } catch(e) {
    // console.error(e);
  }
}

export default generateSocket;
