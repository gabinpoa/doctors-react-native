import { View, Text, Pressable, TextInput } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { ISurgeryName } from "../types";
import { pb } from "../lib/pocketbase";

interface Props {
  setSurgeriesNames: Dispatch<SetStateAction<ISurgeryName[]>>;
  surgeriesNames: ISurgeryName[];
}

const NewSurgeryType = ({ setSurgeriesNames, surgeriesNames }: Props) => {
  const [createMode, setCreateMode] = useState(false);
  const [newSurgeryType, setNewSurgeryType] = useState("");

  async function createSurgeryType() {
    if (newSurgeryType.length > 3 && pb.authStore.model) {
      try {
        const newSurgeryTypeRecord = await pb
          .collection("surgeries_names")
          .create({
            name: newSurgeryType,
            institution: pb.authStore.model.institution,
          });
        const newSurgeriesNamesArr = [
          ...surgeriesNames,
          { name: newSurgeryType, id: newSurgeryTypeRecord.id },
        ];
        setCreateMode(false);
        setSurgeriesNames(newSurgeriesNamesArr);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return !createMode ? (
    <Pressable
      onPress={() => {
        setCreateMode(true);
      }}
      className="border border-neutral-300 h-10 items-center flex-row justify-center mt-2"
      style={{ borderRadius: 6 }}
    >
      <AntDesign name="plus" size={22} color="black" />
    </Pressable>
  ) : (
    <View
      className="border border-neutral-300 pl-2 h-10 items-center flex-row mt-2"
      style={{ borderRadius: 6 }}
    >
      <TextInput
        className="flex-1"
        onChangeText={(text) => {
          setNewSurgeryType(text);
        }}
      />
      <AntDesign
        onPress={createSurgeryType}
        style={{ padding: 8 }}
        name="check"
        size={20}
        color="black"
      />
      <AntDesign
        onPress={() => {
          setCreateMode(false);
        }}
        style={{ padding: 8 }}
        name="close"
        size={20}
        color="black"
      />
    </View>
  );
};

export default NewSurgeryType;
