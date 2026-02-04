import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "secondary";
};

export function ThemedText({
  type,
  className = "",
  ...props
}: ThemedTextProps) {
  let typeClass = "";

  switch (type) {
    /*     case "title":
      typeClass = "text-3xl font-bold leading-8";
      break; */
    case "secondary":
      typeClass = "text-neutral-700 dark:text-neutral-300";
      break;
    /*     case "defaultSemiBold":
      typeClass = "text-base font-semibold leading-6";
      break;
    case "subtitle":
      typeClass = "text-xl font-bold";
      break;
    case "link":
      typeClass = "text-base leading-[30px] text-sky-600";
      break; */
    default:
      typeClass = "text-neutral-800 dark:text-neutral-200";
  }

  return <Text {...props} className={`${typeClass} ${className}`} />;
}
