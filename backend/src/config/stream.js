import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

const streamClient = StreamChat.getInstance(
  ENV.STREAM_API_KEY,
  ENV.STREAM_API_SECRET
);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    console.log("Stream user upserted successfully", userData.name);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await streamClient.deleteUser(userId);
    console.log("Stream user deleted successfully");
  } catch (error) {
    console.error("Error deleting Stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};

export const addUserToPublicChannels = async (newUserId) => {
  const publicChannels = await streamClient.queryChannels({
    discoverable: true,
  });
  for (const channel of publicChannels) {
    await channel.addMembers([newUserId]);
  }
};
