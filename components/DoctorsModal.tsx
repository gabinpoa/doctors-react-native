import { View, Text, Modal, ScrollView } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import getUsers from "../hooks/getUsers";
import DoctorOnSettings from "./DoctorOnSettings";

interface Props {
  modalIsOpen: boolean;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IUserOnSettings {
  name: string;
  id: string;
  role: string;
  email: string;
}

const DoctorsModal = ({ modalIsOpen, setModalIsOpen }: Props) => {
  const [users, setUsers] = useState<IUserOnSettings[] | undefined>();

  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(
          res?.map((usr) => {
            return {
              name: usr.name,
              id: usr.id,
              role: usr.role,
              email: usr.email,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalIsOpen}
      onRequestClose={() => {
        setModalIsOpen(false);
      }}
    >
      <View className="px-6 flex-1 bg-black-o-28 justify-center">
        <View className="w-full rounded-xl overflow-hidden bg-white ">
          <View className="flex-row py-2 items-center justify-between px-3">
            <Text className="text-base font-medium">Usuários</Text>
            <AntDesign
              onPress={() => {
                setModalIsOpen(false);
              }}
              name="close"
              size={24}
              color="black"
            />
          </View>
          <ScrollView className="px-3 pb-3">
            {users &&
              users.map((usr, index, usrArr) => {
                return (
                  <DoctorOnSettings
                    doctor={usr}
                    setDoctors={setUsers}
                    key={index}
                  />
                );
              })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DoctorsModal;
