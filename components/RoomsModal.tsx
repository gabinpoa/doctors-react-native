import { View, Text, Modal } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import getRooms from "../hooks/getRooms";
import RoomOnSettings from "./RoomOnSettings";

interface Props {
  roomsModalIsOpen: boolean;
  setRoomsModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IRoomOnSettings {
  name: string;
  id: string;
}

const RoomsModal = ({ roomsModalIsOpen, setRoomsModalIsOpen }: Props) => {
  const [rooms, setRooms] = useState<IRoomOnSettings[] | undefined>();

  useEffect(() => {
    getRooms().then((roomsFromGetRooms) => {
      setRooms(
        roomsFromGetRooms?.map((room) => {
          return { name: room.name, id: room.id };
        })
      );
    });
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={roomsModalIsOpen}
      onRequestClose={() => {
        setRoomsModalIsOpen(false);
      }}
    >
      <View className="px-6 flex-1 bg-black-o-28 justify-center">
        <View className="w-full rounded-xl overflow-hidden bg-white ">
          <View className="flex-row py-2 items-center justify-between px-3">
            <Text className="text-base font-medium">Salas</Text>
            <AntDesign
              onPress={() => {
                setRoomsModalIsOpen(false);
              }}
              name="close"
              size={24}
              color="black"
            />
          </View>
          <View className="px-3 pb-3">
            {rooms &&
              rooms.map((room, index) => (
                <RoomOnSettings
                  index={index}
                  setRooms={setRooms}
                  key={index}
                  room={room}
                />
              ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RoomsModal;
