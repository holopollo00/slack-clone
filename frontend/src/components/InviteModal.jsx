import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useChatContext } from "stream-chat-react";

const InviteModal = ({ onClose, channel }) => {
  const { client } = useChatContext();

  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setError("");
      setIsLoadingUsers(true);

      try {
        const members = Object.keys(channel.state.members);
        const response = await client.queryUsers(
          {
            id: { $nin: members },
          },
          { name: 1 },
          { limit: 30 }
        );
        setUsers(response.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again.");
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [channel, client]);

  const handleInvite = async () => {
    if (selectedMembers.length === 0) return;

    setIsInviting(true);
    setError("");

    try {
      await channel.addMembers(selectedMembers);
      toast.success("Users invited successfully!");
      onClose();
    } catch (error) {
      setError("Failed to invite users. Please try again.");
      console.error("Error inviting users:", error);
    } finally {
      setIsInviting(false);
    }
  };
  return (
    <div className="create-channel-modal-overlay">
      <div className="create-channel-modal">
        <div className="create-channel-modal__header">
          <h2 className="text-2xl font-semibold">Invite Members</h2>
          <button className="create-channel-modal__close" onClick={onClose}>
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="create-channel-modal__form">
          {isLoadingUsers && <p>Loading users...</p>}
          {error && <p className="form-error">{error}</p>}
          {users.length === 0 && !isLoadingUsers && (
            <p className="text-gray-500">No users available to invite.</p>
          )}

          {users.length > 0 &&
            users.map((user) => {
              const isChecked = selectedMembers.includes(user.id);
              return (
                <label
                  key={user.id}
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all shadow-sm bg-white hover:bg-[#f5f3ff] border-2 ${
                    isChecked
                      ? "border-[#611f69] bg-[#f3e6fa]"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm accent-[#611f69]"
                    value={user.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers((prev) => [...prev, user.id]);
                      } else {
                        setSelectedMembers((prev) =>
                          prev.filter((id) => id !== user.id)
                        );
                      }
                    }}
                  />
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="size-9 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="size-9 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
                      {(user.name || user.id).charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="font-medium text-[#611f69] text-base">
                    {user.name || user.id}
                  </span>
                </label>
              );
            })}
          <div className="create-channel-modal__actions mt-4">
            <button
              className="btn btn-primary"
              onClick={onClose}
              disabled={isInviting}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleInvite}
              disabled={isInviting || selectedMembers.length === 0}
            >
              {isInviting ? "Inviting..." : "Invite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
