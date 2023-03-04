import { View, Text, TextInput } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { IRoomOnSettings } from "./RoomsModal";

interface Props {
  room: IRoomOnSettings;
  setRooms: Dispatch<SetStateAction<IRoomOnSettings[] | undefined>>;
  index: number;
}

const RoomOnSettings = ({ room, setRooms, index }: Props) => {
  const [editSurgeryType, setEditSurgeryType] = useState(false);
  const [newSurgeryType, setNewSurgeryType] = useState("");

  return !editSurgeryType ? (
    <View
      className="border border-neutral-300 px-2 h-10 items-center flex-row justify-between mt-2"
      style={{ borderRadius: 6 }}
    >
      <Text>{room.name}</Text>
      <AntDesign
        onPress={() => {
          setEditSurgeryType(true);
        }}
        name="edit"
        size={20}
        color="black"
      />
    </View>
  ) : (
    <View
      className="border border-neutral-300 px-2 h-10 items-center flex-row mt-2"
      style={{ borderRadius: 6 }}
    >
      <TextInput
        className="flex-1"
        defaultValue={room.name}
        onChangeText={(text) => {
          setNewSurgeryType(text);
        }}
      />
      <AntDesign name="check" size={20} color="black" />
      <AntDesign
        onPress={() => {
          setEditSurgeryType(false);
        }}
        name="close"
        size={20}
        color="black"
      />
    </View>
  );
};

export default RoomOnSettings;
