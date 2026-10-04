import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { Building2, Check, X } from "lucide-react";
import { toast } from "sonner";

import { getOrgs, updateOrg } from "../../utils/redux/slices/orgSlice";

const EditOrg = ({ organization, currentPage, limit, onClose }) => {
  const dispatch = useDispatch();

  // ============================================================
  // FORM
  // ============================================================

  const name = useRef(null);

  const [isActive, setIsActive] = useState(organization?.isActive ?? true);

  const [updating, setUpdating] = useState(false);

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const organizationName = name.current?.value?.trim();

    // Validation
    if (!organizationName) {
      toast.error("Organization name is required");
      return;
    }

    const formData = {
      name: organizationName,
      isActive,
    };

    try {
      setUpdating(true);

      // ========================================================
      // UPDATE ORGANIZATION
      // ========================================================

      await dispatch(
        updateOrg({
          id: organization._id,
          data: formData,
        }),
      ).unwrap();

      // ========================================================
      // REFRESH CURRENT PAGE
      // ========================================================

      await dispatch(
        getOrgs({
          page: currentPage || 1,
          limit: limit || 6,
        }),
      ).unwrap();

      toast.success("Organization updated successfully");

      // Close modal
      onClose();
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to update organization",
      );
    } finally {
      setUpdating(false);
    }
  };

  // ============================================================
  // BACKDROP CLICK
  // ============================================================

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      onMouseDown={handleBackdropClick}
      className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-slate-950/30
        px-4
        py-6
        backdrop-blur-[2px]
      "
    >
      {/* ======================================================
          MODAL
      ======================================================= */}

      <div
        className="
          w-full
          max-w-lg
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
      >
        {/* ====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            flex
            items-start
            justify-between
            border-b
            border-slate-100
            px-5
            py-5
            sm:px-6
          "
        >
          <div className="flex items-start gap-3">
            {/* Icon */}

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-indigo-50
                text-indigo-600
              "
            >
              <Building2 size={20} />
            </div>

            {/* Heading */}

            <div>
              <h2
                className="
                  text-base
                  font-semibold
                  text-slate-900
                  sm:text-lg
                "
              >
                Edit Organization
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                  sm:text-sm
                "
              >
                Update organization details and status.
              </p>
            </div>
          </div>

          {/* Close */}

          <button
            type="button"
            onClick={onClose}
            disabled={updating}
            className="
              ml-3
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              text-slate-400
              transition
              hover:bg-slate-50
              hover:text-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* ====================================================
            FORM
        ===================================================== */}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 px-5 py-6 sm:px-6">
            {/* ==================================================
                ORGANIZATION NAME
            =================================================== */}

            <div>
              <label
                htmlFor="organizationName"
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Organization Name
              </label>

              <input
                ref={name}
                id="organizationName"
                type="text"
                defaultValue={organization?.name || ""}
                placeholder="e.g. Acme Technologies"
                required
                autoFocus
                disabled={updating}
                className="
                  mt-2
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-indigo-500
                  focus:ring-2
                  focus:ring-indigo-100
                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                "
              />
            </div>

            {/* ==================================================
                STATUS
            =================================================== */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                rounded-xl
                border
                border-slate-200
                bg-slate-50/50
                p-4
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Organization Status
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  Active organizations can be accessed and managed normally.
                </p>
              </div>

              {/* Toggle */}

              <button
                type="button"
                disabled={updating}
                onClick={() => setIsActive((prev) => !prev)}
                aria-label="Toggle organization status"
                className={`
                  relative
                  flex
                  h-6
                  w-11
                  shrink-0
                  items-center
                  rounded-full
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  ${isActive ? "bg-indigo-600" : "bg-slate-300"}
                `}
              >
                <span
                  className={`
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    shadow-sm
                    transition-transform
                    ${isActive ? "translate-x-5" : "translate-x-0.5"}
                  `}
                >
                  {isActive && (
                    <Check
                      size={12}
                      className="text-indigo-600"
                      strokeWidth={3}
                    />
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* ==================================================
              FOOTER
          =================================================== */}

          <div
            className="
              flex
              flex-col-reverse
              gap-2
              border-t
              border-slate-100
              bg-slate-50/50
              px-5
              py-4
              sm:flex-row
              sm:justify-end
              sm:px-6
            "
          >
            {/* Cancel */}

            <button
              type="button"
              onClick={onClose}
              disabled={updating}
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-auto
              "
            >
              Cancel
            </button>

            {/* Update */}

            <button
              type="submit"
              disabled={updating}
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
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-auto
              "
            >
              {updating ? "Updating..." : "Update Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrg;
