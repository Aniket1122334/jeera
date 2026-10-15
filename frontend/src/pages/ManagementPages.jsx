import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import {
  Activity,
  Building2,
  CheckCircle2,
  Circle,
  Clock3,
  FolderKanban,
  Plus,
  Search,
  Shield,
  Trash2,
  Users,
  UserRound,
  X,
} from "lucide-react";

/* Data-loading effects below intentionally update local view state after API calls. */
/* eslint-disable react-hooks/set-state-in-effect */

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
const errText = (error) =>
  error.response?.data?.error ||
  error.response?.data?.message ||
  "Something went wrong. Please try again.";
const list = (response) => response.data?.data || [];
const Page = ({ eyebrow, title, description, action, children }) => (
  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-indigo-600">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
      {action}
    </div>
    {children}
  </div>
);
const Card = ({ children, className = "" }) => (
  <section
    className={`rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 ${className}`}
  >
    {children}
  </section>
);
const Button = ({ children, secondary = false, ...props }) => (
  <button
    {...props}
    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${secondary ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : "bg-indigo-600 text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700"} ${props.className || ""}`}
  >
    {children}
  </button>
);
const Field = ({ label, ...props }) => (
  <label className="block text-sm font-medium text-slate-700">
    {label}
    <input
      {...props}
      className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
    />
  </label>
);
const Select = ({ label, children, ...props }) => (
  <label className="block text-sm font-medium text-slate-700">
    {label}
    <select
      {...props}
      className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
    >
      {children}
    </select>
  </label>
);
const Empty = ({ icon: Icon = FolderKanban, title, text }) => (
  <div className="px-5 py-14 text-center">
    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
      <Icon size={22} />
    </span>
    <p className="mt-4 font-semibold text-slate-800">{title}</p>
    <p className="mt-1 text-sm text-slate-500">{text}</p>
  </div>
);
const Badge = ({ children, tone = "slate" }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-600",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[tone]}`}
    >
      {children}
    </span>
  );
};

export function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setTeams(
        list(await api.get("/api/admin/teams")).filter((team) => team.isActive),
      );
    } catch (e) {
      toast.error(errText(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/api/admin/teams", { name });
      setName("");
      toast.success("Team created");
      refresh();
    } catch (error) {
      toast.error(errText(error));
    } finally {
      setBusy(false);
    }
  };
  const deactivate = async (team) => {
    if (!window.confirm(`Deactivate ${team.name}?`)) return;
    try {
      await api.patch(`/api/admin/teams/${team._id}`, {
        name: team.name,
        isActive: false,
      });
      setTeams((current) => current.filter((item) => item._id !== team._id));
      toast.success("Team deactivated");
    } catch (e) {
      toast.error(errText(e));
    }
  };
  const rename = async (team) => {
    const nextName = window.prompt("Team name", team.name)?.trim();
    if (!nextName || nextName === team.name) return;
    try {
      await api.patch(`/api/admin/teams/${team._id}`, {
        name: nextName,
        isActive: team.isActive,
      });
      toast.success("Team renamed");
      refresh();
    } catch (e) {
      toast.error(errText(e));
    }
  };
  return (
    <Page
      eyebrow="Workspace"
      title="Teams"
      description="Organize people into focused teams and keep work moving together."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-slate-900">Your teams</h2>
            <p className="mt-1 text-sm text-slate-500">
              {teams.length} active team{teams.length === 1 ? "" : "s"}
            </p>
          </div>
          {loading ? (
            <p className="p-8 text-center text-sm text-slate-500">
              Loading teamsâ€¦
            </p>
          ) : teams.length ? (
            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
              {teams.map((team) => (
                <div
                  key={team._id}
                  className="rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Users size={19} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {team.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {team.activeEmployees || 0} members Â·{" "}
                          {team.activeTasks || 0} active tasks
                        </p>
                      </div>
                    </div>
                    <Badge tone="green">Active</Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => rename(team)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => deactivate(team)}
                      aria-label={`Deactivate ${team.name}`}
                      title="Deactivate team"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon={Users}
              title="No active teams"
              text="Create a team to start organizing employees."
            />
          )}
        </Card>
        <Card className="h-fit p-5 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Plus size={19} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Create a team
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Set up a team for a project, department, or function.
          </p>
          <form onSubmit={create} className="mt-5 space-y-4">
            <Field
              label="Team name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={50}
              placeholder="e.g. Product design"
            />
            <Button className="w-full" disabled={busy}>
              <Plus size={16} />
              {busy ? "Creatingâ€¦" : "Create team"}
            </Button>
          </form>
        </Card>
      </div>
    </Page>
  );
}

export function EmployeesPage() {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    teamId: "",
  });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const ts = list(await api.get("/api/admin/teams")).filter(
        (team) => team.isActive,
      );
      setTeams(ts);
      const batches = await Promise.all(
        ts.map((t) =>
          api
            .get(`/api/admin/teams/${t._id}/employee`)
            .catch(() => ({ data: { data: [] } })),
        ),
      );
      setEmployees(
        batches.flatMap((r, i) =>
          list(r).map((person) => ({ ...person, teamName: ts[i].name })),
        ),
      );
      setForm((f) => ({ ...f, teamId: f.teamId || ts[0]?._id || "" }));
    } catch (e) {
      toast.error(errText(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post(`/api/admin/teams/${form.teamId}/employee`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success("Employee added");
      setForm((f) => ({ ...f, name: "", email: "", password: "" }));
      refresh();
    } catch (e) {
      toast.error(errText(e));
    } finally {
      setBusy(false);
    }
  };
  const deactivate = async (person) => {
    try {
      await api.delete(`/api/admin/employees/${person._id}`);
      toast.success("Employee deactivated");
      refresh();
    } catch (e) {
      toast.error(errText(e));
    }
  };
  const renameEmployee = async (person) => {
    const name = window.prompt("Employee name", person.name)?.trim();
    if (!name || name === person.name) return;
    try {
      await api.patch(`/api/admin/employees/${person._id}`, { name });
      toast.success("Employee updated");
      refresh();
    } catch (e) {
      toast.error(errText(e));
    }
  };
  const shown = employees.filter((p) =>
    `${p.name} ${p.email} ${p.teamName}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <Page
      eyebrow="People"
      title="Employees"
      description="Invite people to your teams and manage workspace access."
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-900">Team members</h2>
              <p className="mt-1 text-sm text-slate-500">
                {employees.length} employees
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search people"
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-400"
              />
            </div>
          </div>
          {loading ? (
            <p className="p-8 text-center text-sm text-slate-500">
              Loading employeesâ€¦
            </p>
          ) : shown.length ? (
            <div className="divide-y divide-slate-100">
              {shown.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                      {p.name?.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {p.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {p.email} Â· {p.teamName}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => renameEmployee(p)}
                      className="rounded-lg px-2 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deactivate(p)}
                      aria-label={`Deactivate ${p.name}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon={UserRound}
              title="No employees found"
              text="Add an employee or try another search."
            />
          )}
        </Card>
        <Card className="h-fit p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Add an employee
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            They can sign in with the email and password you provide.
          </p>
          {teams.length ? (
            <form onSubmit={create} className="mt-5 space-y-4">
              <Field
                label="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                minLength={2}
                maxLength={20}
                required
                placeholder="Employee name"
              />
              <Field
                label="Work email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="name@company.com"
              />
              <Field
                label="Temporary password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
                placeholder="Use a strong password"
              />
              <Select
                label="Team"
                value={form.teamId}
                onChange={(e) => setForm({ ...form, teamId: e.target.value })}
              >
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </Select>
              <Button className="w-full" disabled={busy}>
                <Plus size={16} />
                {busy ? "Addingâ€¦" : "Add employee"}
              </Button>
            </form>
          ) : (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              Create a team before adding employees.
            </p>
          )}
        </Card>
      </div>
    </Page>
  );
}

export function TasksPage() {
  const user = useSelector((s) => s.user.user?.data);
  const isEmployee = user?.role === "employee";
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [people, setPeople] = useState([]);
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    teamId: "",
    assignedTo: "",
  });
  const refresh = useCallback(async () => {
    try {
      const res = await api.get(
        isEmployee ? "/api/employee/tasks" : "/api/admin/tasks",
      );
      setTasks(list(res));
      if (!isEmployee) {
        const ts = list(await api.get("/api/admin/teams")).filter(
          (team) => team.isActive,
        );
        setTeams(ts);
        const batches = await Promise.all(
          ts.map((t) =>
            api
              .get(`/api/admin/teams/${t._id}/employee`)
              .catch(() => ({ data: { data: [] } })),
          ),
        );
        setPeople(
          batches.flatMap((r, i) =>
            list(r).map((p) => ({
              ...p,
              teamName: ts[i].name,
              teamId: ts[i]._id,
            })),
          ),
        );
        setForm((f) => ({
          ...f,
          teamId: ts.some((team) => team._id === f.teamId)
            ? f.teamId
            : ts[0]?._id || "",
        }));
      }
    } catch (e) {
      toast.error(errText(e));
    }
  }, [isEmployee]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  const teamPeople = people.filter((p) => p.teamId === form.teamId);
  useEffect(() => {
    if (teamPeople.length && !teamPeople.some((p) => p._id === form.assignedTo))
      setForm((f) => ({ ...f, assignedTo: teamPeople[0]._id }));
  }, [form.teamId, form.assignedTo, teamPeople]);
  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status || "todo",
        priority: form.priority,
        dueDate: form.dueDate,
        teamId: form.teamId,
        assignedTo: form.assignedTo,
      };
      if (editingId) await api.patch(`/api/admin/tasks/${editingId}`, payload);
      else
        await api.post(`/api/admin/tasks/employee/${form.assignedTo}`, payload);
      toast.success(editingId ? "Task updated" : "Task created");
      setShow(false);
      setEditingId(null);
      setForm((f) => ({
        ...f,
        title: "",
        description: "",
        dueDate: "",
        status: "todo",
      }));
      refresh();
    } catch (e) {
      toast.error(errText(e));
    } finally {
      setBusy(false);
    }
  };
  const editTask = (t) => {
    setEditingId(t._id);
    setForm({
      title: t.title,
      description: t.description || "",
      priority: t.priority || "medium",
      status: t.status || "todo",
      dueDate: t.dueDate?.slice(0, 10) || "",
      teamId: t.teamId?._id || "",
      assignedTo: t.assignedTo?._id || "",
    });
    setShow(true);
  };
  const removeTask = async (t) => {
    if (!window.confirm(`Delete â€œ${t.title}â€?`)) return;
    try {
      await api.delete(`/api/admin/tasks/${t._id}`);
      toast.success("Task deleted");
      refresh();
    } catch (e) {
      toast.error(errText(e));
    }
  };
  const status = async (task, value) => {
    try {
      await api.patch(`/api/employee/tasks/${task._id}`, { status: value });
      toast.success("Task status updated");
      refresh();
    } catch (e) {
      toast.error(errText(e));
    }
  };
  const visible = tasks.filter((t) =>
    `${t.title} ${t.description} ${t.assignedTo?.name || ""} ${t.teamId?.name || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <Page
      eyebrow="Work management"
      title={isEmployee ? "My tasks" : "Tasks"}
      description={
        isEmployee
          ? "See what needs your attention and keep your work status up to date."
          : "Plan, assign, and track work across your teams."
      }
      action={
        !isEmployee && (
          <Button onClick={() => setShow((v) => !v)}>
            <Plus size={17} />
            New task
          </Button>
        )
      }
    >
      {show && !isEmployee && (
        <Card className="mb-5 p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                {editingId ? "Edit task" : "Create a task"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Assign work to an active employee.
              </p>
            </div>
            <button
              onClick={() => {
                setShow(false);
                setEditingId(null);
              }}
              aria-label="Close"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            >
              <X size={19} />
            </button>
          </div>
          {people.length ? (
            <form
              onSubmit={create}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <Field
                label="Task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                minLength={2}
                maxLength={100}
                placeholder="What needs to get done?"
              />
              <Select
                label="Team"
                value={form.teamId}
                onChange={(e) =>
                  setForm({ ...form, teamId: e.target.value, assignedTo: "" })
                }
              >
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Assignee"
                value={form.assignedTo}
                onChange={(e) =>
                  setForm({ ...form, assignedTo: e.target.value })
                }
              >
                {teamPeople.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
              <Select
                label="Status"
                value={form.status || "todo"}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </Select>
              <Field
                label="Due date"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
              />
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2 lg:col-span-3">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  maxLength={1000}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="Add context or acceptance criteria"
                />
              </label>
              <div className="sm:col-span-2 lg:col-span-3">
                <Button disabled={busy || !form.assignedTo}>
                  {busy
                    ? editingId
                      ? "Savingâ€¦"
                      : "Creatingâ€¦"
                    : editingId
                      ? "Save changes"
                      : "Create task"}
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-amber-700">
              Create a team and add an employee before assigning a task.
            </p>
          )}
        </Card>
      )}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-semibold text-slate-900">
              {isEmployee ? "Assigned to me" : "All tasks"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {tasks.length} total tasks
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks"
              className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-400"
            />
          </div>
        </div>
        {visible.length ? (
          <div className="divide-y divide-slate-100">
            {visible.map((t) => (
              <article
                key={t._id}
                className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${t.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"}`}
                  >
                    {t.status === "completed" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Circle size={18} />
                    )}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">{t.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {t.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {t.assignedTo?.name || "You"} Â·{" "}
                      {t.teamId?.name || "My team"} Â· Due{" "}
                      {t.dueDate
                        ? new Date(t.dueDate).toLocaleDateString()
                        : "â€”"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  {!isEmployee && (
                    <>
                      <button
                        onClick={() => editTask(t)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeTask(t)}
                        aria-label={`Delete ${t.title}`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                  <Badge
                    tone={
                      t.priority === "high"
                        ? "red"
                        : t.priority === "medium"
                          ? "amber"
                          : "slate"
                    }
                  >
                    {t.priority || "medium"} priority
                  </Badge>
                  <Badge
                    tone={
                      t.status === "completed"
                        ? "green"
                        : t.status === "in-progress"
                          ? "indigo"
                          : "slate"
                    }
                  >
                    {t.status?.replace("-", " ") || "todo"}
                  </Badge>
                  {isEmployee && t.status !== "completed" && (
                    <select
                      aria-label="Update task status"
                      value={t.status}
                      onChange={(e) => status(t, e.target.value)}
                      className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium"
                    >
                      <option value="todo">To do</option>
                      <option value="in-progress">In progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Empty
            title="Nothing to show"
            text={
              query
                ? "Try a different search term."
                : "Tasks will appear here when they are created."
            }
          />
        )}
      </Card>
    </Page>
  );
}

export function AdminsPage() {
  const [orgs, setOrgs] = useState([]);
  const [orgId, setOrgId] = useState("");
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const os = list(await api.get("/api/org", { params: { limit: 50 } }));
      setOrgs(os);
      setOrgId((id) => id || os[0]?._id || "");
    } catch (e) {
      toast.error(errText(e));
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  useEffect(() => {
    if (!orgId) {
      setAdmins([]);
      return;
    }
    api
      .get(`/api/org/organisation/${orgId}/admin`)
      .then((r) => setAdmins(list(r)))
      .catch((e) => toast.error(errText(e)));
  }, [orgId]);
  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post(`/api/org/organisation/${orgId}/admin`, form);
      toast.success("Administrator created");
      setForm({ name: "", email: "", password: "" });
      const r = await api.get(`/api/org/organisation/${orgId}/admin`);
      setAdmins(list(r));
    } catch (e) {
      toast.error(errText(e));
    } finally {
      setBusy(false);
    }
  };
  const toggle = async (a) => {
    try {
      if (a.isActive) await api.delete(`/api/org/admin/${a._id}`);
      else await api.patch(`/api/org/admin/${a._id}`);
      toast.success(a.isActive ? "Admin deactivated" : "Admin activated");
      const r = await api.get(`/api/org/organisation/${orgId}/admin`);
      setAdmins(list(r));
    } catch (e) {
      toast.error(errText(e));
    }
  };
  return (
    <Page
      eyebrow="Platform management"
      title="Administrators"
      description="Create and manage organization administrators across your platform."
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-900">
                Organization admins
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select an organization to view its admins.
              </p>
            </div>
            <select
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm sm:w-auto"
            >
              {orgs.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          {admins.length ? (
            <div className="divide-y divide-slate-100">
              {admins.map((a) => (
                <div
                  key={a._id}
                  className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-700">
                      {a.name?.slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {a.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {a.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={a.isActive ? "green" : "slate"}>
                      {a.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <button
                      onClick={() => toggle(a)}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                    >
                      {a.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon={Shield}
              title="No administrators yet"
              text="Create the first administrator for this organization."
            />
          )}
        </Card>
        <Card className="h-fit p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Add an administrator
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            The admin will get access to the selected organization.
          </p>
          {orgs.length ? (
            <form onSubmit={create} className="mt-5 space-y-4">
              <Field
                label="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                minLength={2}
                maxLength={20}
                placeholder="Administrator name"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="admin@company.com"
              />
              <Field
                label="Temporary password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
                placeholder="Use a strong password"
              />
              <Button className="w-full" disabled={busy}>
                {busy ? "Creatingâ€¦" : "Create administrator"}
              </Button>
            </form>
          ) : (
            <p className="mt-4 text-sm text-amber-700">
              Create an organization first.
            </p>
          )}
        </Card>
      </div>
    </Page>
  );
}

export function AnalyticsPage() {
  const user = useSelector((s) => s.user.user?.data);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get(`/api/analytics/dashboard/${user?.role}`)
      .then((r) => setStats(r.data.data))
      .catch((e) => setError(errText(e)));
  }, [user?.role]);
  const owner = user?.role === "owner";
  const tiles = owner
    ? [
        ["Active organizations", stats?.totalOrganisations, Building2],
        ["Active administrators", stats?.activeAdmins, Shield],
        ["Platform users", stats?.totalUsers, Users],
        ["Platform activity", `${stats?.platformActivity || 0}%`, Activity],
      ]
    : [
        ["Teams", stats?.totalTeams, Users],
        ["Employees", stats?.totalEmployees, UserRound],
        ["Active tasks", stats?.activeTasks, Clock3],
        ["Completed tasks", stats?.completedTasks, CheckCircle2],
      ];
  return (
    <Page
      eyebrow="Insights"
      title="Analytics"
      description="A live snapshot of activity across your workspace."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(([label, value, Icon]) => (
          <Card key={label} className="p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon size={19} />
            </span>
            <p className="mt-5 text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {value ?? (error ? "â€”" : "Â·Â·Â·")}
            </p>
          </Card>
        ))}
      </div>
      {error && (
        <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </p>
      )}
      <Card className="mt-5 p-5 sm:p-6">
        <h2 className="font-semibold text-slate-900">
          Your workspace at a glance
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {owner
            ? "Track the health of your organizations and platform accounts from one place."
            : "Use these totals to understand team capacity and the work currently in progress."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="indigo">Updated just now</Badge>
          <Badge>Live workspace data</Badge>
        </div>
      </Card>
    </Page>
  );
}

export function SettingsPage() {
  const user = useSelector((s) => s.user.user?.data);
  return (
    <Page
      eyebrow="Account"
      title="Profile & settings"
      description="Your identity and access details for this workspace."
    >
      <div className="grid gap-5 md:grid-cols-[240px_minmax(0,1fr)]">
        <Card className="flex flex-col items-center p-6 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white">
            {user?.name?.slice(0, 1).toUpperCase()}
          </span>
          <h2 className="mt-4 font-semibold text-slate-900">{user?.name}</h2>
          <p className="mt-1 text-sm capitalize text-slate-500">{user?.role}</p>
          <Badge tone="green">Active account</Badge>
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="font-semibold text-slate-900">Account information</h2>
          <p className="mt-1 text-sm text-slate-500">
            These details are managed by your organization.
          </p>
          <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {[
              ["Full name", user?.name],
              ["Email address", user?.email],
              ["Role", user?.role],
              ["Organization", user?.organisationId?.name || "Platform owner"],
              ["Team", user?.teamId?.name || "â€”"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {k}
                </dt>
                <dd className="mt-1.5 break-words text-sm font-medium capitalize text-slate-800">
                  {v || "â€”"}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </Page>
  );
}
