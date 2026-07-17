import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost-destructive";
} & ComponentProps<"button">;

// type Variant = "primary" | "secondary" | "ghost-destructive";

// ...props is passing props to the button element, 
// which allows us to use all the props that a button element can have, 
// like onClick, disabled, etc.
// It also allows us to use the children prop, which is the content of the button.
// And it also passed the key prop, which is used to identify the button in a list of buttons (props.key).
// e.g. <Button onClick={() => console.log("clicked")}>Click me</Button> will be 
// props.onClick = () => console.log("clicked") and children will be "Click me".

export function Button({variant = "primary", className, ...props}: ButtonProps) {
    return <button 
    {...props}
    className={twMerge(
      "transition-colors rounded px-2 py-1 disabled:opacity-30 disabled:cursor-not-allowed",
      getVariantStyles(variant),
      className
    )}
    />
}

function getVariantStyles(variant: ButtonProps["variant"]) { // this could have been its own type, but we can use the ButtonProps type to get the variant type
  switch (variant) {
    case "primary":
      return "bg-violet-600 hover:bg-violet-500";
    case "secondary":
      return "bg-zinc-700 hover:bg-zinc-600 text-zinc-400";
    case "ghost-destructive":
      return "hover:bg-red-800 text-red-800 hover:text-red-200";
    default:
      throw new Error(`Unknown variant: ${variant satisfies never}`);
  }
}   