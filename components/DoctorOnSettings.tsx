import { View, Text } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { IUserOnSettings } from "./DoctorsModal";
import { TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

interface Props {
  doctor: IUserOnSettings;
  setDoctors: Dispatch<SetStateAction<IUserOnSettings[] | undefined>>;
}

function getRoleMap() {
  const roleMap: Map<string, string> = new Map();
  roleMap.set("admin", "Administrador");
  roleMap.set("reader", "Visualizador");
  roleMap.set("creator", "Médico");

  return roleMap;
}

function getRoleString(role: string): string {
  const roleMap = getRoleMap();

  const roleString = roleMap.get(role);

  return roleString || "Nenhum";
}

const DoctorOnSettings = ({ doctor, setDoctors }: Props) => {
  return (
    <View
      className="border border-neutral-300 mt-2 p-2"
      style={{ borderRadius: 6 }}
    >
      <Text>{`${doctor.name} - ${getRoleString(doctor.role)}`}</Text>
      <Text>{doctor.email}</Text>
    </View>
  );
};

export default DoctorOnSettings;
