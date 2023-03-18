import { View, Text, TextInput } from "react-native";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface Props {
  control: Control;
  errors?: any;
  inputName: string;
  placeholder: string;
  required?: boolean;
  defaultValue?: string;
}

const CreateSurgeryInput = ({
  control,
  errors,
  inputName,
  placeholder,
  required,
  defaultValue,
}: Props) => {
  return (
    <Controller
      rules={required ? { required: "Obrigatório" } : undefined}
      name={inputName}
      defaultValue={defaultValue}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <TextInput
            defaultValue={defaultValue}
            placeholderTextColor={"rgb(150, 150, 150)"}
            onChangeText={onChange}
            value={value}
            className={`border ${
              errors ? "border-red-400" : "border-neutral-300"
            } rounded-md px-2 h-10`}
            placeholder={placeholder}
          />
        );
      }}
    />
  );
};

export default CreateSurgeryInput;
