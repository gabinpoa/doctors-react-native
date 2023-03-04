import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import RoomsModal from "../components/RoomsModal";

const AdminSettings = () => {
  const [roomsModalIsOpen, setRoomsModalIsOpen] = useState(false);
  const [doctorsModalIsOpen, setDoctorsModalIsOpen] = useState(false);
  const [surgeriyTypesModalIsOpen, setSurgeriyTypesModalIsOpen] =
    useState(false);

  return (
    <View className="bg-neutral-100 gap-4 flex-1 px-4 py-3">
      <Pressable
        className="flex-row justify-between bg-white rounded-md shadow p-4"
        onPress={() => {
          setRoomsModalIsOpen(true);
        }}
      >
        <Text className="text-base">Salas</Text>
      </Pressable>
      {roomsModalIsOpen && (
        <RoomsModal
          roomsModalIsOpen={roomsModalIsOpen}
          setRoomsModalIsOpen={setRoomsModalIsOpen}
        />
      )}
      <Pressable
        onPress={() => {
          setDoctorsModalIsOpen(true);
        }}
        className="flex-row justify-between bg-white rounded-md shadow p-4"
      >
        <Text className="text-base">Médicos</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          setSurgeriyTypesModalIsOpen(true);
        }}
        className="flex-row justify-between bg-white rounded-md shadow p-4"
      >
        <Text className="text-base">Tipos de cirurgia</Text>
      </Pressable>
    </View>
  );
};

export default AdminSettings;
