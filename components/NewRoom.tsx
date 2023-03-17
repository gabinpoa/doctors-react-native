import { View, Text, Pressable, TextInput } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { pb } from "../lib/pocketbase";
import { IRoomOnSettings } from "./RoomsModal";

interface Props {
  setRooms: Dispatch<SetStateAction<IRoomOnSettings[] | undefined>>;
  rooms: IRoomOnSettings[] | undefined;
}

const NewRoom = ({ setRooms, rooms }: Props) => {
  const [createMode, setCreateMode] = useState(false);
  const [newRoom, setNewRoom] = useState("");

  async function createRoom() {
    if (rooms && newRoom.length > 3 && pb.authStore.model) {
      try {
        const newRoomRecord = await pb.collection("rooms").create({
          name: newRoom,
          institution: pb.authStore.model.institution,
        });
        const newRoomsArray = [
          ...rooms,
          { name: newRoomRecord.name, id: newRoomRecord.id },
        ];
        setCreateMode(false);
        setRooms(newRoomsArray);
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
          setNewRoom(text);
        }}
      />
      <AntDesign
        onPress={createRoom}
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

export default NewRoom;
