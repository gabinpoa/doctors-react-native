import { View, Text, TextInput } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ISurgeryName } from "../types";
import { AntDesign } from "@expo/vector-icons";
import { pb } from "../lib/pocketbase";

interface Props {
  surgeryType: ISurgeryName;
  setSurgeriesNames: Dispatch<SetStateAction<ISurgeryName[]>>;
  surgeriesTypesArr: ISurgeryName[];
  index: number;
}

const SurgeryTypeOnSettings = ({
  surgeryType,
  setSurgeriesNames,
  surgeriesTypesArr,
  index,
}: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedSurgeryType, setUpdatedSurgeryType] = useState("");

  async function deleteSurgeryType() {
    try {
      setEditMode(false);
      await pb.collection("surgeries_names").delete(surgeryType.id);
      const newSurgeriesTypes = [...surgeriesTypesArr].filter(
        (e, i) => i !== index
      );

      setSurgeriesNames(newSurgeriesTypes);
    } catch (err) {
      console.log(err);
    }
  }

  async function updateSurgeryType() {
    if (updatedSurgeryType.length > 3) {
      try {
        await pb.collection("surgeries_names").update(surgeryType.id, {
          name: updatedSurgeryType,
        });
      } catch (err) {
        console.log(err);
      }

      const updatedSurgeriesNames = [...surgeriesTypesArr];
      updatedSurgeriesNames[index] = {
        ...updatedSurgeriesNames[index],
        name: updatedSurgeryType,
      };
    }
  }

  return !editMode ? (
    <View
      className="border border-neutral-300 pl-2 h-10 items-center flex-row justify-between mt-2"
      style={{ borderRadius: 6 }}
    >
      <Text>{surgeryType.name}</Text>
      <AntDesign
        onPress={() => {
          setEditMode(true);
        }}
        style={{ padding: 8 }}
        name="edit"
        size={20}
        color="black"
      />
    </View>
  ) : (
    <View
      className="border border-neutral-300 pl-2 h-10 items-center flex-row mt-2"
      style={{ borderRadius: 6 }}
    >
      <TextInput
        className="flex-1"
        defaultValue={surgeryType.name}
        onChangeText={(text) => {
          setUpdatedSurgeryType(text);
        }}
      />
      <AntDesign
        onPress={deleteSurgeryType}
        style={{ padding: 8 }}
        name="delete"
        size={20}
        color="black"
      />
      <AntDesign
        onPress={updateSurgeryType}
        style={{ padding: 8 }}
        name="check"
        size={20}
        color="black"
      />
      <AntDesign
        onPress={() => {
          setEditMode(false);
        }}
        style={{ padding: 8 }}
        name="close"
        size={20}
        color="black"
      />
    </View>
  );
};

export default SurgeryTypeOnSettings;
