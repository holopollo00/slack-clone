import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useChannelStateContext } from "stream-chat-react";
import { HashIcon, UserIcon, LockIcon, PinIcon, VideoIcon } from "lucide-react";
import MembersModal from "./MembersModal";
import PinnedMessagesModal from "./PinnedMessagesModal";
import InviteModal from "./InviteModal";

const CustomChannelHeader = () => {
  const { channel } = useChannelStateContext();
  const { user } = useUser();
  const memberCount = Object.keys(channel.state.members).length;

  const [showInvite, setShowInvite] = useState(false);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState([]);

  const otherUser = Object.values(channel.state.members).find(
    (member) => member.user.id !== user.id
  );

  const isDirectMessage =
    channel.data?.member_count === 2 && channel.data?.id.includes("user_");

  const handleShowPinnedMessages = async () => {
    const channelState = await channel.query();
    setPinnedMessages(channelState.pinned_messages);
    setShowPinnedMessages(true);
  };

  const handleVideoCall = async () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      await channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
    }
  };
  return (
    <div className="h-14 border-b border-gray-200 flex items-center justify-between bg-white px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {channel.data?.private ? (
            <LockIcon className="size-4 text-[#616061]" />
          ) : (
            <HashIcon className="size-4 text-[#616061]" />
          )}

          {isDirectMessage && otherUser?.user?.image && (
            <img
              src={otherUser.user.image}
              alt={otherUser.user.name}
              className="size-7 rounded-full object-cover
              mr-1"
            />
          )}

          <span className="font-medium text-[#1D1C1D]">
            {isDirectMessage
              ? otherUser?.user?.name || otherUser?.user?.id
              : channel.data?.id}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="flex items-center hover:bg-[#F8F8F8] py-1 px-2 rounded"
          onClick={() => setShowMembers(true)}
        >
          <UserIcon className="size-5 text-[#616061]" />
          <span className="text-sm text-[#616061]">{memberCount}</span>
        </button>
        <button
          className="hover:bg-[#F8F8F8] p1 rounded"
          onClick={handleVideoCall}
          title="Start Video Call"
        >
          <VideoIcon className="size-5 text-[#1264A3]" />
        </button>
        {channel.data?.private && (
          <button
            className="btn btn-primary"
            onClick={() => setShowInvite(true)}
          >
            Invite
          </button>
        )}
        <button
          className="hover:bg-[#F8F8F8] p-1 rounded"
          onClick={handleShowPinnedMessages}
        >
          <PinIcon className="size-4 text-[#616061]" />
        </button>
      </div>

      {showMembers && (
        <MembersModal
          members={Object.values(channel.state.members)}
          onClose={() => setShowMembers(false)}
        />
      )}

      {showPinnedMessages && (
        <PinnedMessagesModal
          pinnedMessages={pinnedMessages}
          onClose={() => setShowPinnedMessages(false)}
        />
      )}

      {showInvite && (
        <InviteModal channel={channel} onClose={() => setShowInvite(false)} />
      )}
    </div>
  );
};

export default CustomChannelHeader;
