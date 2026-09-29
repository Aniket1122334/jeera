import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  CheckSquare,
  ListTodo,
  MessageSquare,
  Plus,
  UserRound,
  Users,
} from "lucide-react";

const AdminDashboard = ({ user }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className="
          min-h-screen
          px-4
          py-6
          sm:px-6
          lg:px-8
          lg:ml-19
        "
      >
        <div className="mx-auto max-w-375">
          {/* =================================================
              HEADER
          ================================================= */}

          <section className="mb-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              {/* Heading */}

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Welcome back, {user?.name || "Admin"}
                  <span className="ml-2">👋</span>
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Manage your teams, employees, tasks, and organization activity
                  from one place.
                </p>
              </div>

              {/* Action */}

              <button
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-indigo-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-indigo-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                  focus:ring-offset-2
                  sm:w-auto
                "
              >
                <Plus size={17} />
                Create Task
              </button>
            </div>
          </section>

          {/* =================================================
              STATS
          ================================================= */}

          <section
            className="
              mb-7
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            <AdminStat title="Total Teams" value="12" icon={Users} />

            <AdminStat title="Total Employees" value="48" icon={UserRound} />

            <AdminStat title="Active Tasks" value="26" icon={ListTodo} />

            <AdminStat title="Completed Tasks" value="84" icon={CheckCircle2} />
          </section>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <section
            className="
              grid
              grid-cols-1
              gap-6
              xl:grid-cols-3
            "
          >
            {/* =================================================
                RECENT TASKS
            ================================================= */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                xl:col-span-2
              "
            >
              {/* Header */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-slate-100
                  px-5
                  py-5
                  sm:px-6
                "
              >
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Recent Tasks
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Monitor the latest task activity.
                  </p>
                </div>

                <button
                  className="
                    inline-flex
                    items-center
                    gap-1
                    text-xs
                    font-semibold
                    text-indigo-600
                    transition
                    hover:text-indigo-700
                    sm:text-sm
                  "
                >
                  View all
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Task List */}

              <div className="divide-y divide-slate-100">
                <TaskRow
                  title="Complete authentication module"
                  employee="Rahul Sharma"
                  team="Development"
                  priority="High"
                  status="In Progress"
                />

                <TaskRow
                  title="Update dashboard UI"
                  employee="Priya Singh"
                  team="Design"
                  priority="Medium"
                  status="Completed"
                />

                <TaskRow
                  title="Fix payment API issue"
                  employee="Aman Kumar"
                  team="Development"
                  priority="High"
                  status="Pending"
                />

                <TaskRow
                  title="Prepare monthly report"
                  employee="Neha Verma"
                  team="Management"
                  priority="Low"
                  status="In Progress"
                />
              </div>

              {/* Mobile Action */}

              <div className="border-t border-slate-100 p-4 sm:hidden">
                <button
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-slate-200
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  View all tasks
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div
              className="
                flex
                min-h-[300px]
                flex-col
                justify-between
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                sm:p-6
              "
            >
              <div>
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-50
                    text-indigo-600
                  "
                >
                  <Activity size={21} />
                </div>

                <h2
                  className="
                    mt-5
                    text-lg
                    font-semibold
                    tracking-tight
                    text-slate-900
                  "
                >
                  Manage your workspace
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Create teams, add employees, assign tasks, and keep your
                  organization moving.
                </p>
              </div>

              {/* Quick Actions */}

              <div className="mt-7 grid grid-cols-2 gap-2">
                <QuickAction icon={Users} label="Teams" />

                <QuickAction icon={UserRound} label="Employees" />

                <QuickAction icon={CheckSquare} label="Tasks" />

                <QuickAction icon={MessageSquare} label="Chat" />
              </div>
            </div>
          </section>

          {/* =================================================
              SECOND ROW
          ================================================= */}

          <section
            className="
              mt-6
              grid
              grid-cols-1
              gap-6
              xl:grid-cols-3
            "
          >
            {/* =================================================
                TEAMS
            ================================================= */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                xl:col-span-2
              "
            >
              {/* Header */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-slate-100
                  px-5
                  py-5
                  sm:px-6
                "
              >
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Teams
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Overview of your organization teams.
                  </p>
                </div>

                <button
                  className="
                    inline-flex
                    items-center
                    gap-1
                    text-xs
                    font-semibold
                    text-indigo-600
                    transition
                    hover:text-indigo-700
                    sm:text-sm
                  "
                >
                  View all
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Team List */}

              <div
                className="
                  grid
                  grid-cols-1
                  divide-y
                  divide-slate-100
                  sm:grid-cols-2
                  sm:divide-x
                  sm:divide-y-0
                "
              >
                <TeamRow
                  name="Development"
                  employees="14 employees"
                  tasks="18 active tasks"
                />

                <TeamRow
                  name="Design"
                  employees="8 employees"
                  tasks="9 active tasks"
                />

                <TeamRow
                  name="Marketing"
                  employees="11 employees"
                  tasks="12 active tasks"
                />

                <TeamRow
                  name="Management"
                  employees="6 employees"
                  tasks="5 active tasks"
                />
              </div>
            </div>

            {/* =================================================
                TASK SUMMARY
            ================================================= */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                sm:p-6
              "
            >
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Task Summary
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Current task distribution.
                </p>
              </div>

              <div className="mt-6 space-y-5">
                <TaskSummary
                  label="Completed"
                  value="48"
                  percentage="58%"
                  type="completed"
                />

                <TaskSummary
                  label="In Progress"
                  value="26"
                  percentage="31%"
                  type="progress"
                />

                <TaskSummary
                  label="Pending"
                  value="9"
                  percentage="11%"
                  type="pending"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              ANALYTICS
          ================================================= */}

          <section
            className="
              mt-6
              grid
              grid-cols-1
              gap-6
              lg:grid-cols-2
            "
          >
            <AnalyticsCard
              title="Task Activity"
              description="Task activity over the last 6 months."
              type="tasks"
            />

            <AnalyticsCard
              title="Employee Activity"
              description="Employee activity across your organization."
              type="employees"
            />
          </section>
        </div>
      </main>
    </div>
  );
};

/* ============================================================
   ADMIN STAT
============================================================ */

const AdminStat = ({ title, value, icon: Icon }) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        transition
        hover:-translate-y-0.5
        hover:shadow-sm
      "
    >
      <div className="flex items-start justify-between">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-indigo-50
            text-indigo-600
          "
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>

        <ArrowUpRight size={17} className="text-emerald-500" />
      </div>

      <p className="mt-5 text-sm text-slate-500">{title}</p>

      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-emerald-600">This month</p>
    </div>
  );
};

/* ============================================================
   TASK ROW
============================================================ */

const TaskRow = ({ title, employee, team, priority, status }) => {
  return (
    <div
      className="
        flex
        flex-col
        gap-3
        px-5
        py-4
        transition
        hover:bg-slate-50/70
        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:px-6
      "
    >
      {/* Task Information */}

      <div className="flex min-w-0 items-start gap-3">
        <div
          className="
            mt-0.5
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-indigo-50
            text-indigo-600
          "
        >
          <CheckSquare size={17} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {employee}
            <span className="mx-1.5">·</span>
            {team}
          </p>
        </div>
      </div>

      {/* Status */}

      <div className="flex items-center gap-2">
        <span
          className={`
            rounded-md
            px-2.5
            py-1
            text-xs
            font-medium

            ${
              priority === "High"
                ? "bg-red-50 text-red-600"
                : priority === "Medium"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-slate-100 text-slate-500"
            }
          `}
        >
          {priority}
        </span>

        <span
          className={`
            rounded-md
            px-2.5
            py-1
            text-xs
            font-medium

            ${
              status === "Completed"
                ? "bg-emerald-50 text-emerald-600"
                : status === "In Progress"
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-slate-100 text-slate-500"
            }
          `}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

/* ============================================================
   QUICK ACTION
============================================================ */

const QuickAction = ({ icon: Icon, label }) => {
  return (
    <button
      className="
        flex
        items-center
        gap-2
        rounded-lg
        border
        border-slate-200
        px-3
        py-2.5
        text-left
        text-sm
        font-medium
        text-slate-700
        transition
        hover:border-slate-300
        hover:bg-slate-50
      "
    >
      <Icon size={16} className="text-slate-500" strokeWidth={1.8} />

      <span>{label}</span>
    </button>
  );
};

/* ============================================================
   TEAM ROW
============================================================ */

const TeamRow = ({ name, employees, tasks }) => {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        px-5
        py-5
        transition
        hover:bg-slate-50/70
        sm:px-6
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-indigo-50
          text-indigo-600
        "
      >
        <Users size={18} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">{name}</p>

        <p className="mt-1 text-xs text-slate-400">
          {employees}
          <span className="mx-1.5">·</span>
          {tasks}
        </p>
      </div>
    </div>
  );
};

/* ============================================================
   TASK SUMMARY
============================================================ */

const TaskSummary = ({ label, value, percentage, type }) => {
  const progress =
    type === "completed"
      ? "w-[58%] bg-emerald-500"
      : type === "progress"
        ? "w-[31%] bg-indigo-500"
        : "w-[11%] bg-slate-400";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>

        <span className="text-xs text-slate-400">
          {value} · {percentage}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${progress}`} />
      </div>
    </div>
  );
};

/* ============================================================
   ANALYTICS CARD
============================================================ */

const AnalyticsCard = ({ title, description, type }) => {
  const bars =
    type === "employees" ? [32, 45, 38, 58, 68, 82] : [40, 52, 44, 65, 74, 88];

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        sm:p-6
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {description}
          </p>
        </div>

        <div
          className="
            hidden
            rounded-lg
            bg-slate-50
            px-2.5
            py-1.5
            text-xs
            font-medium
            text-slate-500
            sm:block
          "
        >
          Last 6 months
        </div>
      </div>

      {/* Chart */}

      <div className="mt-6 h-48">
        <div
          className="
            relative
            flex
            h-full
            items-end
            gap-2
            overflow-hidden
            rounded-xl
            bg-slate-50
            px-3
            pb-3
            pt-5
          "
        >
          {/* Grid */}

          <div className="pointer-events-none absolute inset-x-3 top-8 border-t border-slate-200" />

          <div className="pointer-events-none absolute inset-x-3 top-1/2 border-t border-slate-200" />

          <div className="pointer-events-none absolute inset-x-3 bottom-3 border-t border-slate-200" />

          {/* Bars */}

          {bars.map((height, index) => (
            <div
              key={index}
              className="
                relative
                z-10
                flex
                flex-1
                items-end
              "
            >
              <div
                style={{
                  height: `${height}%`,
                }}
                className="
                  w-full
                  rounded-t-md
                  bg-indigo-500/80
                  transition
                  hover:bg-indigo-600
                "
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
