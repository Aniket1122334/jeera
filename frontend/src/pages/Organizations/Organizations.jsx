import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { getOrgs, deleteOrg } from "../../utils/redux/slices/orgSlice";

import EditOrg from "../../components/OwnerComponents/EditOrg";
import CreateOrg from "../../components/OwnerComponents/CreateOrg";

const Organizations = () => {
  const dispatch = useDispatch();

  // ============================================================
  // STATE
  // ============================================================

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Selected organization for Edit modal
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  // Create organization modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Organization delete/deactivate loading
  const [deletingId, setDeletingId] = useState(null);

  // Backend se ek page par kitni organizations fetch karni hain
  const organizationsPerPage = 6;

  // ============================================================
  // ORGANIZATION DATA FROM REDUX
  // ============================================================

  const organizations = useSelector((state) => state?.org?.org?.data) || [];

  const pagination = useSelector((state) => state?.org?.org?.pagination) || {};

  const loading = useSelector((state) => state?.org?.loading);

  // Backend se total organizations
  const totalOrganizations = pagination?.totalOrganisations || 0;

  // Backend se total pages
  const totalPages = pagination?.totalPages || 0;

  // ============================================================
  // FETCH ORGANIZATIONS
  // ============================================================

  useEffect(() => {
    dispatch(
      getOrgs({
        page: currentPage,
        limit: organizationsPerPage,
      }),
    );
  }, [dispatch, currentPage]);

  // ============================================================
  // SEARCH
  // ============================================================

  /*
    NOTE:

    Abhi backend search support nahi karta.

    Isliye ye search sirf currently loaded page ki
    organizations ko filter karega.
  */

  const filteredOrganizations = organizations.filter((organization) =>
    organization?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  // ============================================================
  // SEARCH HANDLER
  // ============================================================

  const handleSearch = (value) => {
    setSearch(value);
  };

  // ============================================================
  // PAGE CHANGE
  // ============================================================

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  // ============================================================
  // OPEN EDIT ORGANIZATION MODAL
  // ============================================================

  const handleViewOrganization = (organization) => {
    setSelectedOrganization(organization);
  };

  // ============================================================
  // CLOSE EDIT ORGANIZATION MODAL
  // ============================================================

  const handleCloseEditModal = () => {
    setSelectedOrganization(null);
  };

  // ============================================================
  // OPEN CREATE ORGANIZATION MODAL
  // ============================================================

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  // ============================================================
  // CLOSE CREATE ORGANIZATION MODAL
  // ============================================================

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  // ============================================================
  // DELETE / DEACTIVATE ORGANIZATION
  // ============================================================

  const handleToggleStatus = async (id) => {
    try {
      setDeletingId(id);

      await dispatch(deleteOrg(id)).unwrap();

      toast.success("Organization deactivated successfully");

      // Same page refresh
      await dispatch(
        getOrgs({
          page: currentPage,
          limit: organizationsPerPage,
        }),
      ).unwrap();
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to deactivate organization",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // PAGINATION DISPLAY
  // ============================================================

  const startIndex =
    totalOrganizations === 0 ? 0 : (currentPage - 1) * organizationsPerPage + 1;

  const endIndex = Math.min(
    currentPage * organizationsPerPage,
    totalOrganizations,
  );

  // ============================================================
  // RENDER
  // ============================================================

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
        "
      >
        <div className="mx-auto max-w-7xl">
          {/* =================================================
              PAGE HEADER
          ================================================= */}

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
                <div className="flex items-center gap-2">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-indigo-50
                      text-indigo-600
                    "
                  >
                    <Building2 size={19} />
                  </div>

                  <h1
                    className="
                      text-2xl
                      font-bold
                      tracking-tight
                      text-slate-950
                      sm:text-3xl
                    "
                  >
                    Organizations
                  </h1>
                </div>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Manage and monitor all organizations across your platform.
                </p>
              </div>

              {/* =================================================
                  CREATE ORGANIZATION
              ================================================= */}

              <button
                type="button"
                onClick={handleOpenCreateModal}
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
                Create Organization
              </button>
            </div>
          </section>

          {/* =================================================
              ORGANIZATION CARD
          ================================================= */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
            "
          >
            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div
              className="
                flex
                flex-col
                gap-4
                border-b
                border-slate-100
                px-5
                py-4
                sm:px-6
                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              {/* Title */}

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  All Organizations
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {totalOrganizations} organizations found
                </p>
              </div>

              {/* Search */}

              <div className="relative w-full md:w-80 lg:w-96">
                <Search
                  size={17}
                  strokeWidth={1.8}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search organizations..."
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    pl-9
                    pr-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-indigo-300
                    focus:bg-white
                    focus:ring-2
                    focus:ring-indigo-100
                  "
                />
              </div>
            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <div
                  className="
                    h-8
                    w-8
                    animate-spin
                    rounded-full
                    border-2
                    border-slate-200
                    border-t-indigo-600
                  "
                />
              </div>
            ) : (
              <>
                {/* =================================================
                    DESKTOP / TABLET TABLE
                ================================================= */}

                <div className="hidden md:block">
                  {/* Table Header */}

                  <div
                    className="
                      grid
                      grid-cols-12
                      items-center
                      border-b
                      border-slate-100
                      bg-slate-50/60
                      px-6
                      py-3
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    <div className="col-span-4">Organization</div>

                    <div className="col-span-2">Admins</div>

                    <div className="col-span-2">Users</div>

                    <div className="col-span-2">Status</div>

                    <div className="col-span-2 text-right">Action</div>
                  </div>

                  {/* Organization Rows */}

                  {filteredOrganizations.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {filteredOrganizations.map((organization) => (
                        <OrganizationRow
                          key={organization._id}
                          organization={organization}
                          deletingId={deletingId}
                          onView={() => handleViewOrganization(organization)}
                          onToggleStatus={() =>
                            handleToggleStatus(organization._id)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState search={search} />
                  )}
                </div>

                {/* =================================================
                    MOBILE LIST
                ================================================= */}

                <div className="md:hidden">
                  {filteredOrganizations.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {filteredOrganizations.map((organization) => (
                        <MobileOrganizationCard
                          key={organization._id}
                          organization={organization}
                          deletingId={deletingId}
                          onView={() => handleViewOrganization(organization)}
                          onToggleStatus={() =>
                            handleToggleStatus(organization._id)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState search={search} />
                  )}
                </div>

                {/* =================================================
                    PAGINATION
                ================================================= */}

                {totalPages > 0 && (
                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      border-t
                      border-slate-100
                      px-5
                      py-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      sm:px-6
                    "
                  >
                    {/* Results */}

                    <p className="text-xs text-slate-500 sm:text-sm">
                      Showing{" "}
                      <span className="font-medium text-slate-700">
                        {startIndex}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium text-slate-700">
                        {endIndex}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-slate-700">
                        {totalOrganizations}
                      </span>
                    </p>

                    {/* Pagination */}

                    <div className="flex items-center gap-1">
                      {/* Previous */}

                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-slate-200
                          text-slate-500
                          transition
                          hover:bg-slate-50
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                      >
                        <ChevronLeft size={17} />
                      </button>

                      {/* Page Numbers */}

                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1,
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`
                            flex
                            h-9
                            min-w-9
                            items-center
                            justify-center
                            rounded-lg
                            px-2
                            text-sm
                            font-medium
                            transition
                            ${
                              currentPage === page
                                ? "bg-indigo-600 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }
                          `}
                        >
                          {page}
                        </button>
                      ))}

                      {/* Next */}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-slate-200
                          text-slate-500
                          transition
                          hover:bg-slate-50
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                      >
                        <ChevronRight size={17} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* ============================================================
          EDIT ORGANIZATION MODAL
      ============================================================ */}

      {selectedOrganization && (
        <EditOrg
          organization={selectedOrganization}
          currentPage={currentPage}
          limit={organizationsPerPage}
          onClose={handleCloseEditModal}
        />
      )}

      {/* ============================================================
          CREATE ORGANIZATION MODAL
      ============================================================ */}

      {showCreateModal && (
        <CreateOrg
          currentPage={currentPage}
          limit={organizationsPerPage}
          onClose={handleCloseCreateModal}
        />
      )}
    </div>
  );
};

/* ============================================================
   DESKTOP / TABLET ORGANIZATION ROW
============================================================ */

const OrganizationRow = ({
  organization,
  onView,
  onToggleStatus,
  deletingId,
}) => {
  const isDeleting = deletingId === organization._id;

  return (
    <div
      className="
        grid
        grid-cols-12
        items-center
        px-6
        py-4
        transition
        hover:bg-slate-50/70
      "
    >
      {/* Organization */}

      <div className="col-span-4 flex min-w-0 items-center gap-3">
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
          <p className="truncate text-sm font-semibold text-slate-800">
            {organization.name}
          </p>
        </div>
      </div>

      {/* Admins */}

      <div className="col-span-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users size={15} className="text-slate-400" />

          {organization.adminCount}
        </div>
      </div>

      {/* Users */}

      <div className="col-span-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <UserRound size={15} className="text-slate-400" />

          {organization.userCount}
        </div>
      </div>

      {/* Status */}

      <div className="col-span-2">
        <OrganizationStatus active={organization.isActive} />
      </div>

      {/* Actions */}

      <div className="col-span-2 flex items-center justify-end gap-2">
        {/* View */}

        <button
          type="button"
          onClick={onView}
          title="View organization"
          aria-label="View organization"
          className="
            flex
            h-8
            w-8
            cursor-pointer
            items-center
            justify-center
            rounded-lg
            text-slate-500
            transition
            hover:bg-indigo-50
            hover:text-indigo-600
          "
        >
          <Eye size={17} strokeWidth={2} />
        </button>

        {/* Deactivate */}

        <button
          type="button"
          onClick={onToggleStatus}
          disabled={!organization.isActive || isDeleting}
          title={
            organization.isActive
              ? "Deactivate organization"
              : "Organization is already inactive"
          }
          aria-label={
            organization.isActive
              ? "Deactivate organization"
              : "Organization is already inactive"
          }
          className="
            flex
            h-8
            w-8
            cursor-pointer
            items-center
            justify-center
            rounded-lg
            text-slate-500
            transition
            hover:bg-red-50
            hover:text-red-500
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:bg-transparent
          "
        >
          {isDeleting ? (
            <span
              className="
                h-4
                w-4
                animate-spin
                rounded-full
                border-2
                border-slate-300
                border-t-red-500
              "
            />
          ) : (
            <Trash2 size={17} strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   MOBILE ORGANIZATION CARD
============================================================ */

const MobileOrganizationCard = ({
  organization,
  onView,
  onToggleStatus,
  deletingId,
}) => {
  const isDeleting = deletingId === organization._id;

  return (
    <div className="p-4 transition hover:bg-slate-50/70">
      {/* Organization Header */}

      <div className="flex items-start justify-between gap-3">
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
            <p className="truncate text-sm font-semibold text-slate-800">
              {organization.name}
            </p>
          </div>
        </div>

        <OrganizationStatus active={organization.isActive} />
      </div>

      {/* Meta */}

      <div
        className="
          mt-4
          flex
          flex-col
          gap-3
          border-t
          border-slate-100
          pt-3
        "
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users size={14} />
            {organization.adminCount} admins
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <UserRound size={14} />
            {organization.userCount} users
          </div>
        </div>

        {/* Actions */}

        <div className="flex items-center justify-end gap-2">
          {/* View */}

          <button
            type="button"
            onClick={onView}
            title="View organization"
            aria-label="View organization"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-slate-500
              transition
              hover:bg-indigo-50
              hover:text-indigo-600
            "
          >
            <Eye size={17} strokeWidth={2} />
          </button>

          {/* Deactivate */}

          <button
            type="button"
            onClick={onToggleStatus}
            disabled={!organization.isActive || isDeleting}
            title={
              organization.isActive
                ? "Deactivate organization"
                : "Organization is already inactive"
            }
            aria-label={
              organization.isActive
                ? "Deactivate organization"
                : "Organization is already inactive"
            }
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-slate-500
              transition
              hover:bg-red-50
              hover:text-red-500
              disabled:cursor-not-allowed
              disabled:opacity-40
              disabled:hover:bg-transparent
            "
          >
            {isDeleting ? (
              <span
                className="
                  h-4
                  w-4
                  animate-spin
                  rounded-full
                  border-2
                  border-slate-300
                  border-t-red-500
                "
              />
            ) : (
              <Trash2 size={17} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   STATUS
============================================================ */

const OrganizationStatus = ({ active }) => {
  return (
    <span
      className={`
        inline-flex
        w-fit
        items-center
        rounded-md
        px-2.5
        py-1
        text-xs
        font-medium
        ${
          active
            ? "bg-emerald-50 text-emerald-600"
            : "bg-slate-100 text-slate-500"
        }
      `}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
};

/* ============================================================
   EMPTY STATE
============================================================ */

const EmptyState = ({ search }) => {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          bg-slate-100
          text-slate-400
        "
      >
        <Building2 size={22} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {search ? "No organizations found" : "No organizations yet"}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500 sm:text-sm">
        {search
          ? "Try searching with a different organization name."
          : "Create your first organization to start managing your platform."}
      </p>
    </div>
  );
};

export default Organizations;
