export type ButtonVariant = "primary" | "secondary";

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-(--accent-action) text-white hover:brightness-110",
  secondary: "border border-(--line) bg-white text-(--ink) hover:bg-(--sage)",
};

export function buttonClasses(variant: ButtonVariant = "primary"): string {
  return `${BASE_CLASSES} ${VARIANT_CLASSES[variant]}`;
}
