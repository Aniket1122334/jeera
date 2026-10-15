import { useState } from "react";
import { useSelector } from "react-redux";

import ChatUsers from "./ChatUsers";
import Chatting from "./Chatting";

export default function ChatPage() {
  const user = useSelector((state) => state.user.user?.data);

  const [selectedUser, setSelectedUser] = useState(null);

  const audience = user?.role === "admin" ? "your organization" : "your team";

  const handleSelectUser = (contact) => {
    setSelectedUser(contact);
  };

  const handleBackToContacts = () => {
    setSelectedUser(null);
  };

  return (
    <main
      className="
        mx-auto flex min-h-0 w-full max-w-[1600px]
        flex-col px-4 py-5
        sm:px-6 sm:py-6
        lg:px-8 lg:py-7
        xl:px-10
      "
    >
      {/* Page Header */}
      <header className="mb-5 shrink-0 sm:mb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          {/* Title */}
          <div>
            <p
              className="
                mb-1.5 text-[11px] font-bold uppercase
                tracking-[0.16em] text-indigo-600
              "
            >
              Team communication
            </p>

            <h1
              className="
                text-3xl font-bold tracking-tight text-slate-950
                sm:text-4xl
              "
            >
              Chat
            </h1>

            <p className="mt-1.5 text-sm text-slate-500 sm:text-[15px]">
              Connect with people in {audience}.
            </p>
          </div>

          {/* Workspace Badge */}
          <div
            className="
              hidden items-center gap-2 rounded-xl
              border border-slate-200 bg-white px-4 py-2.5
              shadow-sm sm:flex
            "
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

            <span className="text-sm font-medium capitalize text-slate-600">
              {user?.role || "Workspace"} workspace
            </span>
          </div>
        </div>
      </header>

      {/* Chat Workspace */}
      <div
        className="
          flex min-h-[500px] min-w-0 w-full flex-1
          overflow-hidden rounded-2xl border border-slate-200
          bg-white shadow-sm shadow-slate-200/50

          h-[calc(100dvh-15rem)]

          sm:h-[calc(100dvh-14rem)]
          sm:min-h-[560px]

          md:h-[calc(100dvh-14.5rem)]
          md:min-h-[600px]

          lg:h-[calc(100dvh-15rem)]
          lg:min-h-[620px]

          xl:h-[min(78dvh,900px)]
          xl:min-h-[680px]
        "
      >
        {/* Contacts Sidebar */}
        <ChatUsers
          role={user?.role}
          selectedUserId={selectedUser?._id}
          onSelect={handleSelectUser}
          className={`
            ${selectedUser ? "hidden min-[560px]:flex" : "flex"}

            w-full min-h-0 min-w-0

            min-[560px]:w-[280px]
            min-[560px]:shrink-0

            md:w-[300px]
            lg:w-[320px]
            xl:w-[340px]
          `}
        />

        {/* Conversation */}
        <Chatting
          key={selectedUser?._id || "empty-chat"}
          contact={selectedUser}
          onBack={handleBackToContacts}
        />
      </div>
    </main>
  );
}
