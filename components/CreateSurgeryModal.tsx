import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IDataToCreate, ISurgeryName, TRoomDataArray } from "../types";
import { AntDesign } from "@expo/vector-icons";
import createSurgery from "../hooks/createSurgery";
import getSurgeriesNames from "../hooks/getSurgeriesNames";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import formatName from "../hooks/formatName";
import verifyIsOccupied from "../hooks/verifyIsOccupied";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import CreateSurgeryInput from "./CreateSurgeryInput";
import Label from "./Label";
import Checkbox from "expo-checkbox";
import getHospitalizations from "../hooks/getHospitalizations";
import getPbDateString from "../hooks/getPbDateString";

interface Props {
  createSurgeryModalIsOpen: boolean;
  setCreateSurgeryModalIsOpen: Dispatch<SetStateAction<boolean>>;
  dataToCreate: IDataToCreate | undefined;
  roomsArray: TRoomDataArray;
}

export interface IHospitalization {
  name: string;
  id: string;
}

export interface ReactHookFormData {
  patient: string;
  anesthesist: boolean;
  healthInsurance?: string;
  observations?: string;
  surgeon?: string;
  bed?: string;
}

const CreateSurgeryModal = ({
  createSurgeryModalIsOpen,
  setCreateSurgeryModalIsOpen,
  dataToCreate,
  roomsArray,
}: Props) => {
  const [namePickerIsOpen, setNamePickerIsOpen] = useState(false);
  const [name, setName] = useState<null | string>(null);
  const [hospitalizationPickerIsOpen, setHospitalizationPickerIsOpen] =
    useState(false);
  const [hospitalization, setHospitalization] = useState<null | string>(null);
  const [endDate, setEndDate] = useState({
    time: dataToCreate?.endDate,
    showPicker: false,
    error: "",
  });
  const { surgeriesNames } = getSurgeriesNames();
  const { hospitalizations } = getHospitalizations();
  const { handleSubmit, control, reset } = useForm();

  useEffect(() => {
    setEndDate({ ...endDate, time: dataToCreate?.endDate });
  }, [dataToCreate]);

  function close() {
    reset();
    setName(null);
    setHospitalization(null);
    setHospitalizationPickerIsOpen(false);
    setNamePickerIsOpen(false);
    setCreateSurgeryModalIsOpen(false);
  }

  async function onSubmit(data: ReactHookFormData) {
    if (dataToCreate && name && hospitalization && endDate.time) {
      const fullData = {
        endDate: getPbDateString(endDate.time),
        room: dataToCreate.roomId,
        startDate: getPbDateString(dataToCreate.startDate),
        hospitalization: hospitalization,
        name: name,
        ...data,
      };
      await createSurgery({
        ...fullData,
      });
      close();
    }
  }

  return (
    <Modal transparent visible={createSurgeryModalIsOpen} animationType="fade">
      <View className="px-6 flex-1 bg-black-o-28 justify-center">
        <View className="w-full max-h-[85vh] rounded-xl overflow-hidden bg-white ">
          <View className="flex-row justify-between items-center px-2 py-1 mb-1">
            <Text className="text-base">
              Nova cirurgia às{" "}
              {dataToCreate?.startDate.toTimeString().slice(0, 5)}
            </Text>
            <Pressable className="p-2 " onPress={close}>
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </View>
          <ScrollView>
            <View className="px-2 mb-4 space-y-2">
              <View>
                <Label required>Operação</Label>
                <DropDownPicker
                  searchable={surgeriesNames.length > 5 ? true : false}
                  style={{
                    borderColor: "rgb(212, 212, 212)",
                    borderRadius: 6,
                  }}
                  placeholderStyle={{ color: "rgb(150, 150, 150)" }}
                  placeholder="Selecione uma cirurgia"
                  listMode="MODAL"
                  value={name}
                  setValue={setName}
                  multiple={false}
                  open={namePickerIsOpen}
                  setOpen={setNamePickerIsOpen}
                  items={surgeriesNames.map((surgeryName) => {
                    return {
                      value: surgeryName.name,
                      label: surgeryName.name,
                    };
                  })}
                />
              </View>
              <View>
                <Label required>Fim</Label>
                <Pressable
                  onPress={() => {
                    setEndDate({ ...endDate, showPicker: true });
                  }}
                  className="border border-neutral-300 rounded-md px-2 h-10 justify-center"
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
                <Label required>Paciente</Label>
                <CreateSurgeryInput
                  placeholder="Nome do paciente"
                  control={control}
                  inputName="patient"
                  key={"patient"}
                  required={true}
                />
              </View>
              <View>
                <Label required>Internação</Label>
                <DropDownPicker
                  style={{
                    borderColor: "rgb(212, 212, 212)",
                    borderRadius: 6,
                  }}
                  placeholderStyle={{ color: "rgb(150, 150, 150)" }}
                  placeholder="Selecione uma opção"
                  listMode="MODAL"
                  value={hospitalization}
                  setValue={setHospitalization}
                  multiple={false}
                  open={hospitalizationPickerIsOpen}
                  setOpen={setHospitalizationPickerIsOpen}
                  items={hospitalizations.map((hospitalizationFromArr) => {
                    return {
                      value: hospitalizationFromArr.name,
                      label: hospitalizationFromArr.name,
                    };
                  })}
                />
              </View>
              <View>
                <Label required>Com anestesista</Label>
                <Controller
                  name="anesthesist"
                  control={control}
                  defaultValue={false}
                  render={({ field: { onChange, value } }) => {
                    return <Checkbox onValueChange={onChange} value={value} />;
                  }}
                />
              </View>
              <View>
                <Label>Convênio</Label>
                <CreateSurgeryInput
                  control={control}
                  placeholder=""
                  inputName="healthInsurance"
                  key="healthInsurance"
                />
              </View>
              <View>
                <Label>OBS:</Label>
                <CreateSurgeryInput
                  control={control}
                  placeholder=""
                  inputName="observations"
                />
              </View>
              <View>
                <Label>Cirurgião</Label>
                <CreateSurgeryInput
                  control={control}
                  placeholder=""
                  inputName="surgeon"
                />
              </View>
              <View>
                <Label>Leito</Label>
                <CreateSurgeryInput
                  control={control}
                  placeholder=""
                  inputName="bed"
                />
              </View>
            </View>
            <Pressable
              onPress={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
              className="bg-cyan-500 py-3 items-center"
            >
              <Text className="text-white text-base">Criar</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CreateSurgeryModal;
