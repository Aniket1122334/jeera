import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Building2, Check, X } from "lucide-react";
import { toast } from "sonner";

import { createOrg, getOrgs } from "../../utils/redux/slices/orgSlice";

const CreateOrg = ({ onClose }) => {
  const dispatch = useDispatch();

  const name = useRef(null);
  const [isActive, setIsActive] = useState(true);
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const organizationName = name.current?.value?.trim();

    if (!organizationName) {
      toast.error("Organization name is required");
      return;
    }

    const formData = {
      name: organizationName,
      isActive,
    };

    try {
      setCreating(true);

      // Create organization
      await dispatch(createOrg(formData)).unwrap();

      // Refresh organization list on dashboard
      await dispatch(getOrgs(4));

      // Success message
      toast.success("Organization created successfully");

      // Close modal
      onClose();
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to create organization",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

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
        {/* Header */}
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

            <div>
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                Create Organization
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Add a new organization to your platform.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
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
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 px-5 py-6 sm:px-6">
            {/* Organization Name */}
            <div>
              <label
                htmlFor="organizationName"
                className="block text-sm font-semibold text-slate-700"
              >
                Organization Name
              </label>

              <input
                ref={name}
                id="organizationName"
                type="text"
                placeholder="e.g. Acme Technologies"
                required
                autoFocus
                disabled={creating}
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

            {/* Status */}
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
                <p className="text-sm font-semibold text-slate-700">
                  Organization Status
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Active organizations can be accessed and managed normally.
                </p>
              </div>

              <button
                type="button"
                disabled={creating}
                onClick={() => setIsActive((prev) => !prev)}
                className={`
                  relative
                  flex
                  h-6
                  w-11
                  shrink-0
                  items-center
                  rounded-full
                  transition
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

          {/* Footer */}
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
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
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

            <button
              type="submit"
              disabled={creating}
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
              {creating ? "Creating..." : "Create Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrg;
