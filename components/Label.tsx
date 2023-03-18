import { Text } from "react-native";
import React from "react";

const Label = ({
  children,
  required,
}: {
  children: string;
  required?: boolean;
}) => {
  return (
    <Text className="font-medium mb-1">
      {children} {required && <Text className="text-red-600">*</Text>}
    </Text>
  );
};

export default Label;
