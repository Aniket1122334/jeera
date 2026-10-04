import axios from "axios";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getOrgs } from "../../utils/redux/slices/orgSlice";
import CreateOrg from "../OwnerComponents/CreateOrg";

const OwnerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orgs = useSelector((store) => store?.org?.org?.data) || [];

  const [analytics, setAnalytics] = useState(null);
  const [showCreateOrg, setShowCreateOrg] = useState(false);

  // ============================================================
  // FETCH DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/analytics/dashboard/owner`,
          {
            withCredentials: true,
          },
        );

        setAnalytics(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard analytics:", error);
      }
    };

    fetchDashboardData();

    dispatch(getOrgs(5));
  }, [dispatch]);

  // ============================================================
  // OPEN CREATE ORGANIZATION MODAL
  // ============================================================

  const handleCreateOrganization = () => {
    setShowCreateOrg(true);
  };

  // ============================================================
  // CLOSE CREATE ORGANIZATION MODAL
  // ============================================================

  const handleCloseCreateOrg = () => {
    setShowCreateOrg(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ========================================================
          MAIN CONTENT
      ========================================================= */}

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
          {/* ====================================================
              HEADER
          ==================================================== */}

          <section className="mb-7">
            <div
              className="
                flex
                flex-col
                gap-5
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              {/* Heading */}

              <div>
                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-950
                    sm:text-3xl
                  "
                >
                  Welcome back, {user?.name || "Admin"}
                  <span className="ml-2">👋</span>
                </h1>

                <p
                  className="
                    mt-2
                    max-w-xl
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  Monitor organizations, admins, users, and overall platform
                  activity from one place.
                </p>
              </div>

              {/* Create Organization */}

              <button
                type="button"
                onClick={handleCreateOrganization}
                className="
                  inline-flex
                  w-full
                  cursor-pointer
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
                Create Organization
              </button>
            </div>
          </section>

          {/* ====================================================
              STATS
          ==================================================== */}

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
            <OwnerStat
              title="Organizations"
              value={analytics?.totalOrganisations ?? 0}
              icon={Building2}
            />

            <OwnerStat
              title="Active Admins"
              value={analytics?.activeAdmins ?? 0}
              icon={ShieldCheck}
            />

            <OwnerStat
              title="Total Active Users"
              value={analytics?.totalUsers ?? 0}
              icon={Users}
            />

            <OwnerStat
              title="Platform Activity"
              value={analytics?.platformActivity ?? 0}
              icon={Activity}
            />
          </section>

          {/* ====================================================
              MAIN GRID
          ==================================================== */}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* ==================================================
                ORGANIZATIONS
            ================================================== */}

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
                    Organizations
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Manage and monitor your organizations.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/organizations")}
                  className="
                    inline-flex
                    cursor-pointer
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

              {/* Organization List */}

              <div className="divide-y divide-slate-100">
                {orgs.length > 0 ? (
                  orgs
                    .slice(0, 4)
                    .map((item) => (
                      <OrganizationRow
                        key={item._id}
                        name={item.name}
                        admins={`${item.adminCount ?? 0} admins`}
                        users={`${item.userCount ?? 0} users`}
                        status={item.isActive ? "Active" : "Inactive"}
                      />
                    ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <Building2 size={28} className="mx-auto text-slate-300" />

                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No organizations found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Create your first organization to get started.
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile / Bottom Action */}

              <div className="border-t border-slate-100 p-4 sm:hidden">
                <button
                  type="button"
                  onClick={() => navigate("/organizations")}
                  className="
                    flex
                    w-full
                    cursor-pointer
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
                  View all organizations
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* ==================================================
                CREATE ORGANIZATION CARD
            ================================================== */}

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
                {/* Icon */}

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
                  <Building2 size={21} />
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
                  Create an Organization
                </h2>

                <p
                  className="
                    mt-2
                    max-w-sm
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  Set up a new organization and start managing its admins,
                  teams, employees, and tasks from one place.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCreateOrganization}
                className="
                  mt-7
                  inline-flex
                  w-full
                  cursor-pointer
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
                  sm:w-fit
                "
              >
                <Plus size={17} />
                Create Organization
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* ====================================================
              ANALYTICS
          ==================================================== */}

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
              title="Organization Growth"
              description="Organization growth over time."
              type="organization"
            />

            <AnalyticsCard
              title="User Growth"
              description="Platform user growth over time."
              type="users"
            />
          </section>
        </div>
      </main>

      {/* ========================================================
          CREATE ORGANIZATION MODAL
      ========================================================= */}

      {showCreateOrg && <CreateOrg onClose={handleCloseCreateOrg} />}
    </div>
  );
};

/* ==============================================================
   OWNER STAT
================================================================ */

const OwnerStat = ({ title, value, change, icon: Icon }) => {
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

      <p
        className="
          mt-1
          text-2xl
          font-bold
          tracking-tight
          text-slate-900
        "
      >
        {value}
      </p>

      {change && (
        <p className="mt-1 text-xs font-medium text-emerald-600">{change}</p>
      )}
    </div>
  );
};

/* ==============================================================
   ORGANIZATION ROW
================================================================ */

const OrganizationRow = ({ name, admins, users, status }) => {
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
      <div className="flex min-w-0 items-center gap-3">
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
          <Building2 size={18} />
        </div>

        <div className="min-w-0">
          <p
            className="
              truncate
              text-sm
              font-semibold
              text-slate-800
            "
          >
            {name}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {admins}

            <span className="mx-1.5">·</span>

            {users}
          </p>
        </div>
      </div>

      <span
        className={`
          w-fit
          rounded-md
          px-2.5
          py-1
          text-xs
          font-medium

          ${
            status === "Active"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }
        `}
      >
        {status}
      </span>
    </div>
  );
};

/* ==============================================================
   ANALYTICS CARD
================================================================ */

const AnalyticsCard = ({ title, description, type }) => {
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
          {/* Grid Lines */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-3
              top-8
              border-t
              border-slate-200
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-x-3
              top-1/2
              border-t
              border-slate-200
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-x-3
              bottom-3
              border-t
              border-slate-200
            "
          />

          {/* Bars */}

          {[35, 48, 42, 62, 72, type === "users" ? 88 : 78].map(
            (height, index) => (
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
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
