import { Controller } from "react-hook-form";

import { View, Text, TextInput } from "react-native";
import React from "react";
import { Control } from "react-hook-form";
import { FieldErrors } from "react-hook-form";

interface Props {
  control: Control;
  errors: FieldErrors;
  inputName: string;
  placeholder: string;
  loginFailed: boolean;
  addStyle?: string;
  showPassword?: boolean;
}

const LoginInput = ({
  control,
  errors,
  inputName,
  placeholder,
  loginFailed,
  addStyle,
  showPassword = undefined,
}: Props) => {
  return (
    <Controller
      name={inputName}
      control={control}
      rules={{ required: "Required" }}
      render={({ field: { onChange, value } }) => {
        return (
          <TextInput
            secureTextEntry={showPassword === false ? true : false}
            onChangeText={onChange}
            value={value}
            className={`border ${
              (errors.email && inputName === "email") ||
              (errors.password && inputName === "password") ||
              loginFailed
                ? "border-red-400"
                : "border-neutral-300"
            } px-1 h-12 ${addStyle} rounded-lg mb-2`}
            placeholder={placeholder}
          />
        );
      }}
    />
  );
};

export default LoginInput;
