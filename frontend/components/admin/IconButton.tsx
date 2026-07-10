export function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9-4 1 1-4 9.9-9.9a2 2 0 012.828 0z"
      />
    </svg>
  );
}

export function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z"
      />
    </svg>
  );
}

export const iconButtonClass = (variant: "edit" | "delete") =>
  `flex h-7 w-7 items-center justify-center rounded-md border ${
    variant === "edit"
      ? "border-pink-300 text-pink-600 hover:bg-pink-50"
      : "border-red-300 text-red-600 hover:bg-red-50"
  }`;

export default function IconButton({
  onClick,
  variant,
  label,
  disabled,
}: {
  onClick: (e: React.MouseEvent) => void;
  variant: "edit" | "delete";
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      aria-label={label}
      className={`${iconButtonClass(variant)} disabled:opacity-50`}
    >
      {variant === "edit" ? <EditIcon /> : <DeleteIcon />}
    </button>
  );
}
