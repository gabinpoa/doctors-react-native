import { View, Text, Pressable, Modal } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { IEditSurgeryModalState } from "../types";
import { AntDesign } from "@expo/vector-icons";
import pbDateStringToDate from "../hooks/pbDateStringToDate";
import { pb } from "../lib/pocketbase";
import deleteSurgery from "../hooks/deleteSurgery";
import startAndEndTimeString from "../hooks/startAndEndTimeString";

interface Props {
  viewSurgeryModal: IEditSurgeryModalState;
  setViewSurgeryModal: Dispatch<SetStateAction<IEditSurgeryModalState>>;
  setEditSurgeryModal: Dispatch<SetStateAction<IEditSurgeryModalState>>;
}

const ViewSurgeryModal = ({
  viewSurgeryModal,
  setViewSurgeryModal,
  setEditSurgeryModal,
}: Props) => {
  if (viewSurgeryModal.data === undefined) {
    return null;
  } else {
    return (
      <Modal transparent visible={viewSurgeryModal.isOpen} animationType="fade">
        <View className="px-6 flex-1 bg-black-o-28 justify-center">
          <View className="w-full rounded-xl overflow-hidden bg-white ">
            <View className="flex-row justify-between items-center px-2">
              <Text className="font-light">
                Horário:{" "}
                <Text className="font-normal text-neutral-700">
                  {startAndEndTimeString(
                    viewSurgeryModal.data.startDate,
                    viewSurgeryModal.data.endDate
                  )}
                </Text>
              </Text>
              <Pressable
                className="p-2"
                onPress={() => {
                  setViewSurgeryModal({ data: undefined, isOpen: false });
                }}
              >
                <AntDesign name="close" size={24} color="black" />
              </Pressable>
            </View>
            <View className="px-2 pb-2 space-y-2">
              <Text className="font-light">
                Operação:{" "}
                <Text className="font-normal text-neutral-700">
                  {viewSurgeryModal.data.name}
                </Text>
              </Text>
              <Text className="font-light">
                Médico:{" "}
                <Text className="text-neutral-700 font-normal">
                  {viewSurgeryModal.data.expand.doctor.name}
                </Text>
              </Text>
              {viewSurgeryModal.data.surgeon && (
                <Text className="font-light">
                  Cirurgião:{" "}
                  <Text className="text-neutral-700 font-normal">
                    {viewSurgeryModal.data.surgeon}
                  </Text>
                </Text>
              )}
              <Text className="font-light">
                Sala:{" "}
                <Text className="text-neutral-700 font-normal">
                  {viewSurgeryModal.data.expand.room.name}
                </Text>
              </Text>
              <Text className="font-light">
                Paciente:{" "}
                <Text className="text-neutral-700 font-normal">
                  {viewSurgeryModal.data.patient}
                </Text>
              </Text>
              {viewSurgeryModal.data.healthInsurance && (
                <Text className="font-light">
                  Convênio:{" "}
                  <Text className="text-neutral-700 font-normal">
                    {viewSurgeryModal.data.healthInsurance}
                  </Text>
                </Text>
              )}
              <Text className="font-light">
                Internação:{" "}
                <Text className="text-neutral-700 font-normal">
                  {viewSurgeryModal.data.hospitalization}
                </Text>
              </Text>
              <Text className="font-light">
                Com anestesista:{" "}
                <Text className="text-neutral-700 font-normal">
                  {viewSurgeryModal.data.anesthesist ? "Sim" : "Não"}
                </Text>
              </Text>
              {viewSurgeryModal.data.observations && (
                <Text className="font-light">
                  OBS:{" "}
                  <Text className="text-neutral-700 font-normal">
                    {viewSurgeryModal.data.observations}
                  </Text>
                </Text>
              )}
              {viewSurgeryModal.data.bed && (
                <Text className="font-light">
                  Leito:{" "}
                  <Text className="text-neutral-700 font-normal">
                    {viewSurgeryModal.data.bed}
                  </Text>
                </Text>
              )}
              {(pb.authStore.model?.role === "admin" ||
                pb.authStore.model?.id === viewSurgeryModal.data.doctor) && (
                <>
                  <Pressable
                    onPress={() => {
                      setEditSurgeryModal({
                        data: viewSurgeryModal.data,
                        isOpen: true,
                      });
                      setViewSurgeryModal({ data: undefined, isOpen: false });
                    }}
                    className="h-8 border bg-neutral-100 border-neutral-400 my-2 rounded-md justify-center"
                  >
                    <Text className="text-center">Editar</Text>
                  </Pressable>
                  <Pressable
                    onPress={async () => {
                      await deleteSurgery(viewSurgeryModal.data?.id as string);

                      setViewSurgeryModal({ data: undefined, isOpen: false });
                    }}
                    className="bg-red-500 h-8 rounded-md justify-center"
                  >
                    <Text className="text-center text-white">Deletar</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

export default ViewSurgeryModal;
