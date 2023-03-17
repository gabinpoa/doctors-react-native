import { View, Text, ScrollView, Modal } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { AntDesign } from "@expo/vector-icons";
import getSurgeriesNames from "../hooks/getSurgeriesNames";
import SurgeryTypeOnSettings from "./SurgeryTypeOnSettings";
import NewSurgeryType from "./NewSurgeryType";

interface Props {
  modalIsOpen: boolean;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

const SurgeryTypesModal = ({ modalIsOpen, setModalIsOpen }: Props) => {
  const { setSurgeriesNames, surgeriesNames } = getSurgeriesNames();
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
            <Text className="text-base font-medium">Tipos de cirurgia</Text>
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
            {surgeriesNames.map((surgeryType, index, surgeriesTypesArr) => {
              return (
                <SurgeryTypeOnSettings
                  index={index}
                  key={index}
                  surgeriesTypesArr={surgeriesTypesArr}
                  surgeryType={surgeryType}
                  setSurgeriesNames={setSurgeriesNames}
                />
              );
            })}
            <NewSurgeryType
              setSurgeriesNames={setSurgeriesNames}
              surgeriesNames={surgeriesNames}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SurgeryTypesModal;
