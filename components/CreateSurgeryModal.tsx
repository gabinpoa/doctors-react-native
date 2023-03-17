import { View, Text, Modal, Pressable, TextInput } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IDataToCreate, TRoomDataArray } from "../types";
import { AntDesign } from "@expo/vector-icons";
import createSurgery from "../hooks/createSurgery";
import getSurgeriesNames from "../hooks/getSurgeriesNames";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import createSurgeryName from "../hooks/createSurgeryName";
import formatName from "../hooks/formatName";
import verifyIsOccupied from "../hooks/verifyIsOccupied";

interface Props {
  createSurgeryModalIsOpen: boolean;
  setCreateSurgeryModalIsOpen: Dispatch<SetStateAction<boolean>>;
  dataToCreate: IDataToCreate | undefined;
  roomsArray: TRoomDataArray;
}

const CreateSurgeryModal = ({
  createSurgeryModalIsOpen,
  setCreateSurgeryModalIsOpen,
  dataToCreate,
  roomsArray,
}: Props) => {
  const [namePickerIsOpen, setNamePickerIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [patient, setPatient] = useState("");
  const [newSurgeryName, setNewSurgeryName] = useState({
    isOpen: false,
    name: "",
    error: false,
  });
  const [endDate, setEndDate] = useState({
    time: dataToCreate?.endDate,
    showPicker: false,
    error: "",
  });
  const { surgeriesNames } = getSurgeriesNames();

  useEffect(() => {
    setEndDate({ ...endDate, time: dataToCreate?.endDate });
  }, [dataToCreate]);

  function close() {
    reset();
    setCreateSurgeryModalIsOpen(false);
  }

  function reset() {
    setName("");
    setNamePickerIsOpen(false);
    setPatient("");
    setNewSurgeryName({ name: "", isOpen: false, error: false });
  }
  async function onSubmit() {
    const patientName = patient.length > 0 ? patient : undefined;
    if (dataToCreate && name.length > 0) {
      await createSurgery({
        roomId: dataToCreate.roomId,
        name: name,
        startDate: dataToCreate.startDate,
        endDate: endDate.time as Date,
        patient: patientName,
      });
      close();
    } else if (dataToCreate && newSurgeryName.isOpen) {
      if (newSurgeryName.name.length < 3) {
        setNewSurgeryName({ ...newSurgeryName, error: true });
      } else {
        await createSurgery({
          roomId: dataToCreate.roomId,
          name: formatName(newSurgeryName.name),
          startDate: dataToCreate.startDate,
          endDate: endDate.time as Date,
          patient: patientName,
        });
        await createSurgeryName(formatName(newSurgeryName.name));
        close();
      }
    }
  }

  return (
    <Modal transparent visible={createSurgeryModalIsOpen} animationType="fade">
      <View className="px-6 flex-1 bg-black-o-28 justify-center">
        <View className="w-full rounded-xl overflow-hidden bg-white ">
          <View className="flex-row justify-between items-center px-2 py-1 mb-1">
            <Text className="text-base">
              Nova cirurgia às{" "}
              {dataToCreate?.startDate.toTimeString().slice(0, 5)}
            </Text>
            <Pressable className="p-2 " onPress={close}>
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </View>
          <View className="">
            <View className="px-2 mb-4">
              <View className="mb-2">
                <Text className="font-medium mb-1">Nome</Text>

                <View className="flex-row justify-between">
                  {!newSurgeryName.isOpen ? (
                    <DropDownPicker
                      searchable={surgeriesNames.length > 5 ? true : false}
                      style={{
                        borderColor: "rgb(212, 212, 212)",
                        borderRadius: 6,
                      }}
                      placeholderStyle={{ color: "rgb(150, 150, 150)" }}
                      placeholder="Selecione uma cirurgia"
                      containerStyle={{ width: "80%" }}
                      listMode="MODAL"
                      value={name}
                      multiple={false}
                      setValue={setName}
                      open={namePickerIsOpen}
                      setOpen={setNamePickerIsOpen}
                      items={surgeriesNames.map((surgeryName) => {
                        return {
                          value: surgeryName.name,
                          label: surgeryName.name,
                        };
                      })}
                    />
                  ) : (
                    <TextInput
                      placeholderTextColor="rgb(150, 150, 150)"
                      onChangeText={(value) => {
                        setNewSurgeryName({ ...newSurgeryName, name: value });
                      }}
                      placeholder="Digite uma nova cirurgia"
                      className="w-4/5 border border-neutral-300 rounded-md px-2 h-[50px]"
                    />
                  )}
                  <Pressable
                    onPress={() => {
                      !newSurgeryName.isOpen
                        ? setNewSurgeryName({
                            isOpen: true,
                            name: "",
                            error: false,
                          })
                        : setNewSurgeryName({
                            isOpen: false,
                            name: "",
                            error: false,
                          });
                    }}
                    className="justify-center items-center border border-neutral-300 w-12 rounded-md"
                  >
                    <Ionicons name="add" size={24} color="black" />
                  </Pressable>
                </View>
              </View>
              <View className="mb-2">
                <Text className="font-medium mb-1">Fim</Text>
                <Pressable
                  onPress={() => {
                    setEndDate({ ...endDate, showPicker: true });
                  }}
                  className="border border-neutral-300 rounded-md px-2 h-[50px] justify-center"
                >
                  <Text>{endDate.time?.toTimeString().slice(0, 5)}</Text>
                </Pressable>
                {endDate.error.length > 0 && (
                  <Text className="text-red-500 mt-1">{endDate.error}</Text>
                )}
              </View>

              {endDate.showPicker && (
                <DateTimePicker
                  minuteInterval={30}
                  value={endDate.time as Date}
                  mode="time"
                  is24Hour={true}
                  onChange={(e, selected) => {
                    const roomIndex = roomsArray.findIndex(
                      (room) => room.id === dataToCreate?.roomId
                    );
                    if (
                      selected &&
                      verifyIsOccupied({
                        exists: false,
                        endDate: selected,
                        roomDatesArray: roomsArray[roomIndex].dates,
                        startDate: dataToCreate?.startDate,
                      })
                    ) {
                      setEndDate({
                        ...endDate,
                        error: "O horário já está ocupado",
                        showPicker: false,
                      });
                    } else if (
                      dataToCreate &&
                      selected &&
                      selected > dataToCreate?.startDate &&
                      (selected.getHours() < 23 ||
                        (selected.getHours() === 23 &&
                          selected.getMinutes() === 0))
                    ) {
                      setEndDate({
                        error: "",
                        time: selected,
                        showPicker: false,
                      });
                    } else if (selected && selected.getHours() >= 23) {
                      setEndDate({
                        ...endDate,
                        error: "O horário de fim não pode passar das 23h",
                        showPicker: false,
                      });
                    } else if (
                      selected &&
                      dataToCreate &&
                      selected < dataToCreate?.startDate
                    ) {
                      setEndDate({
                        ...endDate,
                        error: "O horário de fim não pode ser antes do início",
                        showPicker: false,
                      });
                    }
                  }}
                />
              )}
              <View>
                <Text className="font-medium mb-1">
                  Paciente{" "}
                  <Text className="font-normal text-neutral-500">
                    (opcional)
                  </Text>
                </Text>
                <TextInput
                  placeholderTextColor={"rgb(150, 150, 150)"}
                  placeholder="Nome do paciente"
                  className="border border-neutral-300 rounded-md px-2 h-[50px]"
                  onChangeText={(value) => {
                    setPatient(value);
                  }}
                />
              </View>
            </View>
            <Pressable
              onPress={onSubmit}
              className="bg-cyan-500 py-3 items-center"
            >
              <Text className="text-white text-base">Criar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateSurgeryModal;
