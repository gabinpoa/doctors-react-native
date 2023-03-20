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
import getOtherFields, { FieldType } from "../hooks/getOtherFields";

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
  [key: string]: string | boolean | undefined;
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
  const otherFields = getOtherFields();

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
      const aditionalFieldsArr = otherFields
        ?.map((field) => {
          if (`${field.name}` in data) {
            return { name: field.name, value: data[`${field.name}`] };
          } else {
            return undefined;
          }
        })
        .filter((e) => e !== undefined && e.value !== (undefined && ""));
      const fullData = {
        endDate: getPbDateString(endDate.time),
        room: dataToCreate.roomId,
        startDate: getPbDateString(dataToCreate.startDate),
        hospitalization: hospitalization,
        name: name,
        healthInsurance: data.healthInsurance,
        patient: formatName(data.patient),
        anesthesist: data.anesthesist,
        observations: data.observations,
        surgeon: data.surgeon,
        bed: data.bed,
      };
      await createSurgery(fullData, aditionalFieldsArr);
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
              {`${dataToCreate?.startDate.toTimeString().slice(0, 5)} em ${
                dataToCreate?.roomName
              }`}
            </Text>
            <Pressable className="p-2 " onPress={close}>
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </View>
          <ScrollView>
            <View className="px-2 mb-4">
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
                <Text className="text-red-500">{endDate.error}</Text>
              )}

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
              <Label required>Paciente</Label>
              <CreateSurgeryInput
                placeholder="Nome do paciente"
                control={control}
                inputName="patient"
                key={"patient"}
                required={true}
              />
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
              <Label required>Com anestesista</Label>
              <Controller
                name="anesthesist"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => {
                  return <Checkbox onValueChange={onChange} value={value} />;
                }}
              />
              <Label>Convênio</Label>
              <CreateSurgeryInput
                control={control}
                placeholder=""
                inputName="healthInsurance"
                key="healthInsurance"
              />
              <Label>OBS:</Label>
              <CreateSurgeryInput
                control={control}
                placeholder=""
                inputName="observations"
              />
              <Label>Cirurgião</Label>
              <CreateSurgeryInput
                control={control}
                placeholder=""
                inputName="surgeon"
              />
              <Label>Leito</Label>
              <CreateSurgeryInput
                control={control}
                placeholder=""
                inputName="bed"
              />
              {otherFields?.map((field) => {
                return (
                  <View key={field.name + "create"}>
                    <Label>{field.name}</Label>
                    {field.type === FieldType.text ? (
                      <CreateSurgeryInput
                        control={control}
                        placeholder=""
                        inputName={field.name}
                      />
                    ) : (
                      <Controller
                        name={field.name}
                        control={control}
                        defaultValue={false}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <Checkbox onValueChange={onChange} value={value} />
                          );
                        }}
                      />
                    )}
                  </View>
                );
              })}
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
