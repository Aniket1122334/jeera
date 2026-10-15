import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import socket from "../../utils/socket/socket";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export default function ChatUsers({
  role,
  selectedUserId,
  onSelect,
  className = "",
}) {
  const currentUser = useSelector((state) => state.user.user?.data);
  const currentUserId = currentUser?._id ? String(currentUser._id) : null;

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [error, setError] = useState("");

  const [onlineByUser, setOnlineByUser] = useState({});
  const [unreadByUser, setUnreadByUser] = useState({});

  const activeUserId = selectedUserId ? String(selectedUserId) : null;

  // Load users available for chat.
  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      if (!role) {
        setUsers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/api/chats/${role}`);

        if (active) {
          setUsers(response.data?.data || []);
        }
      } catch (requestError) {
        const message =
          requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          "Unable to load chat users";

        if (active) {
          setError(message);
          toast.error(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, [role]);

  // Fetch unread message counts from the backend.
  const loadUnreadCounts = useCallback(async () => {
    try {
      const response = await api.get("/api/chats/unread-counts");

      const data = response.data?.data;
      if (!data) return;

      setUnreadByUser(data.bySender || {});
    } catch (requestError) {
      console.error(
        "Unable to load unread counts:",
        requestError.response?.data || requestError.message,
      );
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    loadUnreadCounts();
  }, [currentUserId, loadUnreadCounts]);

  // Listen for online users, new messages, and unread count updates.
  useEffect(() => {
    if (!currentUserId) return;

    const handleOnlineUsers = (ids = []) => {
      const onlineIds = new Set(ids.map(String));

      setOnlineByUser((previous) => {
        const updated = { ...previous };

        users.forEach((person) => {
          updated[String(person._id)] = onlineIds.has(String(person._id));
        });

        return updated;
      });
    };

    const handleUserStatus = ({ userId, isOnline } = {}) => {
      if (!userId) return;

      setOnlineByUser((previous) => ({
        ...previous,
        [String(userId)]: Boolean(isOnline),
      }));
    };

    const handleNewMessage = (message) => {
      const senderId = String(
        message?.senderId?._id || message?.senderId || "",
      );

      const receiverId = String(
        message?.receiverId?._id || message?.receiverId || "",
      );

      // Only process messages received by the logged-in user.
      if (receiverId !== currentUserId || !senderId) return;

      // If this conversation is already open, Chatting marks it read.
      if (senderId === activeUserId) {
        return;
      }

      setUnreadByUser((previous) => ({
        ...previous,
        [senderId]: (previous[senderId] || 0) + 1,
      }));
    };

    socket.on("online-users", handleOnlineUsers);
    socket.on("user-status", handleUserStatus);
    socket.on("new-message", handleNewMessage);
    socket.on("unread-count-updated", loadUnreadCounts);

    // Request a fresh snapshot after reconnecting.
    const handleConnect = () => {
      loadUnreadCounts();
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("online-users", handleOnlineUsers);
      socket.off("user-status", handleUserStatus);
      socket.off("new-message", handleNewMessage);
      socket.off("unread-count-updated", loadUnreadCounts);
      socket.off("connect", handleConnect);
    };
  }, [currentUserId, activeUserId, users, loadUnreadCounts]);

  // Load a selected conversation.
  const loadConversation = async (person) => {
    const personId = String(person._id);

    if (chatLoading && loadingUserId === personId) return;

    setChatLoading(true);
    setLoadingUserId(personId);

    try {
      const response = await api.get(`/api/chats/messages/${person._id}`);

      const messages = response.data?.data || [];

      onSelect({
        ...person,
        messages,
        isOnline: Boolean(onlineByUser[personId] ?? person.isOnline),
      });

      // Clear the selected user's badge immediately.
      setUnreadByUser((previous) => ({
        ...previous,
        [personId]: 0,
      }));

      // Mark this conversation as read on the server.
      if (socket.connected) {
        socket.emit("mark-read", {
          senderId: person._id,
        });

        socket.emit("refresh-unread-count");
      }

      // Refresh the authoritative count from the backend.
      loadUnreadCounts();
    } catch (requestError) {
      const message =
        requestError.response?.data?.error ||
        requestError.response?.data?.message ||
        "Unable to load conversation";

      toast.error(message);
    } finally {
      setChatLoading(false);
      setLoadingUserId(null);
    }
  };

  // Filter contacts by name, email, or role.
  const visibleUsers = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    return users.filter((person) =>
      `${person.name || ""} ${person.email || ""} ${person.role || ""}`
        .toLowerCase()
        .includes(searchText),
    );
  }, [users, query]);

  return (
    <aside
      className={`
        flex min-h-0 min-w-0 flex-col
        border-slate-100 bg-white
        min-[560px]:border-r
        ${className}
      `}
    >
      {/* Search */}
      <div className="shrink-0 border-b border-slate-100 p-4 sm:p-5">
        <div className="relative">
          <Search
            size={15}
            strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search people"
            className="
              h-11 w-full rounded-xl border border-slate-200
              bg-slate-50/70 pl-9 pr-3 text-sm text-slate-700
              outline-none transition placeholder:text-slate-400
              hover:border-slate-300 focus:border-indigo-300
              focus:bg-white focus:ring-4 focus:ring-indigo-500/10
            "
          />
        </div>
      </div>

      {/* Messages header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Messages
          </h2>

          <p className="mt-0.5 text-[11px] text-slate-400">
            {users.length} {users.length === 1 ? "person" : "people"}
          </p>
        </div>

        <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-indigo-50 px-2 text-[11px] font-semibold text-indigo-700">
          {users.length}
        </span>
      </div>

      {/* Loading users */}
      {loading && (
        <div className="space-y-2 p-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex animate-pulse items-center gap-3 rounded-xl p-2.5"
            >
              <div className="h-11 w-11 shrink-0 rounded-full bg-slate-100" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-slate-100" />
                <div className="h-2.5 w-32 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-1 items-center justify-center px-5 text-center">
          <div>
            <p className="text-sm font-medium text-rose-600">
              Unable to load contacts
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* User list */}
      {!loading && !error && visibleUsers.length > 0 && (
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {visibleUsers.map((person) => {
            const personId = String(person._id);
            const isSelected = activeUserId === personId;
            const isOnline = Boolean(onlineByUser[personId] ?? person.isOnline);
            const unreadCount = unreadByUser[personId] || 0;
            const isLoadingThisUser = chatLoading && loadingUserId === personId;

            return (
              <button
                key={person._id}
                type="button"
                onClick={() => loadConversation(person)}
                disabled={chatLoading}
                aria-pressed={isSelected}
                className={`
                  group flex w-full items-center gap-3
                  rounded-xl p-3 text-left transition
                  disabled:cursor-wait disabled:opacity-70
                  ${isSelected ? "bg-indigo-50/80" : "hover:bg-slate-50"}
                `}
              >
                {/* Avatar and online indicator */}
                <span
                  className={`
                    relative flex h-11 w-11 shrink-0
                    items-center justify-center overflow-hidden
                    rounded-full text-sm font-semibold ring-1 ring-inset
                    ${
                      isSelected
                        ? "bg-indigo-100 text-indigo-700 ring-indigo-200"
                        : "bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-700 ring-indigo-100"
                    }
                  `}
                >
                  {person.name?.slice(0, 1).toUpperCase() || "?"}

                  <span
                    title={isOnline ? "Online" : "Offline"}
                    className={`
                      absolute bottom-0 right-0 h-2.5 w-2.5
                      rounded-full border-2 border-white
                      ${isOnline ? "bg-emerald-500" : "bg-slate-300"}
                    `}
                  />
                </span>

                {/* User details */}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span
                      className={`
                        truncate text-sm
                        ${
                          isSelected
                            ? "font-semibold text-indigo-950"
                            : unreadCount > 0
                              ? "font-semibold text-slate-900"
                              : "font-medium text-slate-800"
                        }
                      `}
                    >
                      {person.name || "Unnamed user"}
                    </span>

                    <span className="hidden shrink-0 text-[10px] capitalize text-slate-400 sm:block">
                      {person.role || "Member"}
                    </span>
                  </span>

                  <span className="mt-0.5 flex min-w-0 items-center justify-between gap-2">
                    <span className="truncate text-xs text-slate-400">
                      {person.email || "Available for conversation"}
                    </span>

                    {unreadCount > 0 && !isSelected && (
                      <span
                        aria-label={`${unreadCount} unread messages`}
                        className="
                          flex h-5 min-w-5 shrink-0 items-center
                          justify-center rounded-full bg-indigo-600
                          px-1.5 text-[10px] font-bold text-white
                        "
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </span>
                </span>

                {/* Loading indicator */}
                {isLoadingThisUser && (
                  <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && visibleUsers.length === 0 && (
        <div className="flex flex-1 items-center justify-center px-5 py-12 text-center">
          <div>
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Users size={20} strokeWidth={1.8} />
            </span>

            <p className="mt-3 text-sm font-semibold text-slate-800">
              {query ? "No matches" : "No people yet"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {query
                ? "Try another name or email."
                : "Active contacts will appear here."}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
