export type ButtonVariant = "primary" | "secondary";

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-[#a73a00] text-white hover:bg-[#fd651e]",
  secondary: "border border-[#c6c6cd] bg-white text-[#0b1c30] hover:bg-[#eff4ff]",
};

export function buttonClasses(variant: ButtonVariant = "primary"): string {
  return `${BASE_CLASSES} ${VARIANT_CLASSES[variant]}`;
}