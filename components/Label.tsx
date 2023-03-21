import { Text } from "react-native";
import React from "react";

const Label = ({
  children,
  required,
  addStyle,
}: {
  children: string;
  required?: boolean;
  addStyle?: string;
}) => {
  return (
    <Text className={"font-medium mb-1 mt-2 " + addStyle}>
      {children} {required && <Text className="text-red-600">*</Text>}
    </Text>
  );
};

export default Label;
