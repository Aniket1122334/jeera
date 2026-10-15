import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  FileText,
  Image,
  MessageCircle,
  Paperclip,
  Pin,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import socket from "../../utils/socket/socket";

export default function Chatting({ contact, onBack }) {
  const user = useSelector((state) => state.user.user?.data);

  const messageRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [messages, setMessages] = useState(() => contact?.messages || []);

  // Store live status by user ID instead of syncing state in an effect.
  const [onlineStatusById, setOnlineStatusById] = useState({});

  const contactId = contact?._id ? String(contact._id) : null;
  const currentUserId = user?._id ? String(user._id) : null;

  const isOnline = contactId
    ? (onlineStatusById[contactId] ?? Boolean(contact?.isOnline))
    : false;

  // Join the conversation, including when the socket connects later.
  useEffect(() => {
    if (!currentUserId || !contactId) return;

    const joinConversation = () => {
      socket.emit("join-chat", {
        sender: currentUserId,
        receiver: contactId,
      });
    };

    if (socket.connected) {
      joinConversation();
    }

    socket.on("connect", joinConversation);

    return () => {
      socket.off("connect", joinConversation);
    };
  }, [currentUserId, contactId]);

  // Listen for online/offline status updates.
  useEffect(() => {
    if (!contactId) return;

    const handleUserStatus = ({ userId, isOnline: online } = {}) => {
      if (!userId) return;

      setOnlineStatusById((previous) => ({
        ...previous,
        [String(userId)]: Boolean(online),
      }));
    };

    const handleOnlineUsers = (ids = []) => {
      const onlineIds = new Set(ids.map(String));

      setOnlineStatusById((previous) => ({
        ...previous,
        [contactId]: onlineIds.has(contactId),
      }));
    };

    socket.on("user-status", handleUserStatus);
    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("user-status", handleUserStatus);
      socket.off("online-users", handleOnlineUsers);
    };
  }, [contactId]);

  // Receive messages for the selected conversation.
  useEffect(() => {
    if (!currentUserId || !contactId) return;

    const handleReceiveMessage = (message) => {
      const senderId = String(
        message?.senderId?._id || message?.senderId || "",
      );

      const receiverId = String(
        message?.receiverId?._id || message?.receiverId || "",
      );

      const belongsToConversation =
        (senderId === currentUserId && receiverId === contactId) ||
        (senderId === contactId && receiverId === currentUserId);

      if (!belongsToConversation) return;

      setMessages((previous) => {
        // Prevent duplicate messages.
        if (
          message?._id &&
          previous.some((item) => String(item._id) === String(message._id))
        ) {
          return previous;
        }

        return [...previous, message];
      });

      // Mark incoming messages as read.
      if (senderId === contactId && receiverId === currentUserId) {
        socket.emit("mark-read", {
          senderId: contactId,
        });

        socket.emit("refresh-unread-count");
      }
    };

    const handleMessageError = (data) => {
      toast.error(data?.message || "Failed to send message");
    };

    socket.on("rec-msg", handleReceiveMessage);
    socket.on("message-error", handleMessageError);

    return () => {
      socket.off("rec-msg", handleReceiveMessage);
      socket.off("message-error", handleMessageError);
    };
  }, [currentUserId, contactId]);

  // Scroll to the latest message.
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    const input = messageRef.current;

    if (!input || !currentUserId || !contactId) return;

    if (!socket.connected) {
      toast.error("Chat connection unavailable. Please try again.");
      return;
    }

    const content = input.value.trim();

    if (!content) return;

    const organisationId =
      typeof user.organisationId === "object"
        ? user.organisationId?._id
        : user.organisationId;

    if (!organisationId) {
      toast.error("Organisation information is missing");
      return;
    }

    socket.emit("send-msg", {
      sender: currentUserId,
      receiver: contactId,
      content,
      organisationId,
    });

    input.value = "";
    input.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!contact) {
    return (
      <section className="hidden min-h-0 min-w-0 flex-1 flex-col bg-slate-50/50 min-[560px]:flex">
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-indigo-600 shadow-sm">
            <MessageCircle size={24} strokeWidth={1.7} />
          </span>

          <h2 className="mt-4 text-sm font-semibold text-slate-800">
            Select a conversation
          </h2>

          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
            Choose a person from the list to start a conversation.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
      {/* Conversation header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-100 bg-white px-3 py-3 sm:px-5 sm:py-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to conversations"
          className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 min-[560px]:hidden"
        >
          <ArrowLeft size={19} />
        </button>

        {/* Avatar and online indicator */}
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200/70">
          {contact.name?.slice(0, 1).toUpperCase() || "?"}

          <span
            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
              isOnline ? "bg-emerald-500" : "bg-slate-300"
            }`}
          />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-slate-900 sm:text-[15px]">
            {contact.name || "Unnamed user"}
          </h2>

          <div className="mt-0.5 flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isOnline ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />

            <p
              className={`truncate text-[11px] ${
                isOnline ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Pin conversation"
            title="Pin conversation"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:flex"
          >
            <Pin size={17} strokeWidth={1.7} />
          </button>

          <button
            type="button"
            aria-label="Images"
            title="Images"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:flex"
          >
            <Image size={17} strokeWidth={1.7} />
          </button>

          <button
            type="button"
            aria-label="Files"
            title="Files"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:flex"
          >
            <FileText size={17} strokeWidth={1.7} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-slate-50/60 to-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      >
        {messages.length === 0 ? (
          <div className="m-auto flex max-w-sm flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-white text-indigo-600 shadow-md shadow-indigo-100/50">
              <MessageCircle size={24} strokeWidth={1.7} />
            </span>

            <p className="mt-4 text-sm font-semibold text-slate-800">
              Start a conversation with {contact.name}
            </p>

            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              No messages yet. Send the first message.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
            {messages.map((message, index) => {
              const senderId = String(
                message.senderId?._id || message.senderId || "",
              );

              const isMine = senderId === currentUserId;

              return (
                <div
                  key={message._id || `${message.createdAt}-${index}`}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm sm:max-w-[65%] ${
                      isMine
                        ? "rounded-br-md bg-indigo-600 text-white"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.message}
                    </p>

                    <p
                      className={`mt-1 text-[10px] ${
                        isMine ? "text-indigo-100" : "text-slate-400"
                      }`}
                    >
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message composer */}
      <div className="shrink-0 border-t border-slate-100 bg-white px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-2 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10">
          <button
            type="button"
            disabled
            aria-label="Attach file"
            title="Attachments are not connected yet"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 opacity-60"
          >
            <Paperclip size={17} strokeWidth={1.8} />
          </button>

          <textarea
            ref={messageRef}
            aria-label="Message composer"
            rows={1}
            placeholder="Write a message..."
            onKeyDown={handleKeyDown}
            className="max-h-24 min-h-9 min-w-0 flex-1 resize-none rounded-xl bg-transparent px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />

          <button
            type="button"
            onClick={handleSendMessage}
            aria-label="Send message"
            title="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
          >
            <Send size={15} strokeWidth={2} />
          </button>
        </div>

        <p className="mt-2 hidden text-center text-[10px] text-slate-400 sm:block">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </div>
    </section>
  );
}
