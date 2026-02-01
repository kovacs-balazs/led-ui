import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  type = "default",
  className = "",
  ...props
}: ThemedTextProps) {
  let typeClass = "";

  switch (type) {
    case "title":
      typeClass = "text-3xl font-bold leading-8";
      break;
    case "defaultSemiBold":
      typeClass = "text-base font-semibold leading-6";
      break;
    case "subtitle":
      typeClass = "text-xl font-bold";
      break;
    case "link":
      typeClass = "text-base leading-[30px] text-sky-600";
      break;
    default:
      typeClass = "text-base leading-6";
  }

  return (
    <Text
      {...props}
      className={`text-black dark:text-white ${typeClass} ${className}`}
    />
  );
}
