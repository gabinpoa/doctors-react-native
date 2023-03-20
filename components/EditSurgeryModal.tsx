import { AntDesign } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  AditionalField,
  IEditSurgeryModalState,
  TRoomDataArray,
} from "../types";
import DateTimePicker from "@react-native-community/datetimepicker";
import getSurgeriesNames from "../hooks/getSurgeriesNames";
import pbDateStringToDate from "../hooks/pbDateStringToDate";
import getPbDateString from "../hooks/getPbDateString";
import updateSurgery from "../hooks/updateSurgery";
import verifyIsOccupied from "../hooks/verifyIsOccupied";
import { ReactHookFormData } from "./CreateSurgeryModal";
import getHospitalizations from "../hooks/getHospitalizations";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Label from "./Label";
import CreateSurgeryInput from "./CreateSurgeryInput";
import Checkbox from "expo-checkbox";
import getOtherFields, { FieldType } from "../hooks/getOtherFields";
import { ScrollView } from "react-native";

interface Props {
  editSurgeryModal: IEditSurgeryModalState;
  setEditSurgeryModal: Dispatch<SetStateAction<IEditSurgeryModalState>>;
  roomsArray: TRoomDataArray;
}

const EditSurgeryModal = ({
  editSurgeryModal,
  setEditSurgeryModal,
  roomsArray,
}: Props) => {
  if (editSurgeryModal.data) {
    const [name, setName] = useState(editSurgeryModal.data.name);
    const [namePickerIsOpen, setNamePickerIsOpen] = useState(false);
    const [hospitalizationPickerIsOpen, setHospitalizationPickerIsOpen] =
      useState(false);
    const [hospitalization, setHospitalization] = useState<null | string>(
      editSurgeryModal.data.hospitalization
    );
    const [endDate, setEndDate] = useState({
      time: pbDateStringToDate(editSurgeryModal.data.endDate),
      showPicker: false,
      error: "",
    });
    const { surgeriesNames } = getSurgeriesNames();
    const { hospitalizations } = getHospitalizations();
    const { handleSubmit, control, reset } = useForm();

    const aditionalFields = editSurgeryModal.data
      .aditionalFields as AditionalField[];

    function close() {
      reset();
      setNamePickerIsOpen(false);
      setEndDate({ ...endDate, showPicker: false, error: "" });
      setEditSurgeryModal({ data: undefined, isOpen: false });
    }

    async function onSubmit(data: ReactHookFormData) {
      if (editSurgeryModal.data && hospitalization && name) {
        const fullData = {
          endDate: getPbDateString(endDate.time),
          hospitalization: hospitalization,
          name: name,
          ...data,
        };
        await updateSurgery(editSurgeryModal.data.id, fullData);
        close();
      }
    }
    return (
      <Modal transparent visible={editSurgeryModal.isOpen} animationType="fade">
        <View className="px-6 flex-1 bg-black-o-28 justify-center">
          <View className="w-full max-h-[85vh] rounded-xl overflow-hidden bg-white ">
            <View className="flex-row justify-between items-center px-2 py-1 mb-1">
              <Text className="text-base">
                Editar cirurgia ás{" "}
                {`${pbDateStringToDate(editSurgeryModal.data.startDate)
                  .toTimeString()
                  .slice(0, 5)} em ${editSurgeryModal.data.expand.room.name}`}
              </Text>
              <Pressable className="p-2" onPress={close}>
                <AntDesign name="close" size={24} color="black" />
              </Pressable>
            </View>
            <ScrollView>
              <View className="px-2 mb-4">
                <Text className="font-medium mb-1">Nome</Text>
                <DropDownPicker
                  searchable={surgeriesNames.length > 5 ? true : false}
                  style={{
                    borderColor: "rgb(212, 212, 212)",
                    borderRadius: 6,
                  }}
                  placeholderStyle={{ color: "rgb(150, 150, 150)" }}
                  placeholder="Selecione uma cirurgia"
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

                {endDate.showPicker && (
                  <DateTimePicker
                    minuteInterval={30}
                    value={endDate.time as Date}
                    mode="time"
                    is24Hour={true}
                    onChange={(e, selected) => {
                      if (editSurgeryModal.data && selected) {
                        const roomIndex = roomsArray.findIndex(
                          (room) => room.id === editSurgeryModal.data?.room
                        );
                        if (
                          verifyIsOccupied({
                            exists: true,
                            oldEndDate: pbDateStringToDate(
                              editSurgeryModal.data.endDate
                            ),
                            endDate: selected,
                            roomDatesArray: roomsArray[roomIndex].dates,
                          })
                        ) {
                          setEndDate({
                            ...endDate,
                            error: "O horário já está ocupado",
                            showPicker: false,
                          });
                        } else if (
                          selected >
                            pbDateStringToDate(
                              editSurgeryModal.data.startDate
                            ) &&
                          (selected.getHours() < 23 ||
                            (selected.getHours() === 23 &&
                              selected.getMinutes() === 0))
                        ) {
                          setEndDate({
                            error: "",
                            time: selected,
                            showPicker: false,
                          });
                        } else if (selected.getHours() >= 23) {
                          setEndDate({
                            ...endDate,
                            error: "O horário de fim não pode passar das 23h",
                            showPicker: false,
                          });
                        } else if (
                          selected <
                          pbDateStringToDate(editSurgeryModal.data.startDate)
                        ) {
                          setEndDate({
                            ...endDate,
                            error:
                              "O horário de fim não pode ser antes do início",
                            showPicker: false,
                          });
                        }
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
                  defaultValue={editSurgeryModal.data.patient}
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
                  defaultValue={editSurgeryModal.data.anesthesist}
                  render={({ field: { onChange, value } }) => {
                    return <Checkbox onValueChange={onChange} value={value} />;
                  }}
                />
                <Label>Convênio</Label>
                <CreateSurgeryInput
                  defaultValue={editSurgeryModal.data.healthInsurance}
                  control={control}
                  placeholder=""
                  inputName="healthInsurance"
                  key="healthInsurance"
                />
                <Label>OBS:</Label>
                <CreateSurgeryInput
                  defaultValue={editSurgeryModal.data.observations}
                  control={control}
                  placeholder=""
                  inputName="observations"
                />
                <Label>Cirurgião</Label>
                <CreateSurgeryInput
                  defaultValue={editSurgeryModal.data.surgeon}
                  control={control}
                  placeholder=""
                  inputName="surgeon"
                />
                <Label>Leito</Label>
                <CreateSurgeryInput
                  defaultValue={editSurgeryModal.data.bed}
                  control={control}
                  placeholder=""
                  inputName="bed"
                />
                {aditionalFields.map((field) => {
                  return (
                    <View key={field.name + "edit"}>
                      <Label>{field.name}</Label>
                      {typeof field.value === "string" ? (
                        <CreateSurgeryInput
                          defaultValue={field.value}
                          control={control}
                          placeholder=""
                          inputName={field.name}
                        />
                      ) : (
                        <Controller
                          name={field.name}
                          control={control}
                          defaultValue={field.value}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <Checkbox
                                onValueChange={onChange}
                                value={value}
                              />
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
                <Text className="text-white text-base">Salvar</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  } else {
    return null;
  }
};

export default EditSurgeryModal;
