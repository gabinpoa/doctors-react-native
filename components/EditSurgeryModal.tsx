import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  IDateObj,
  IEditSurgeryModalState,
  IUpdateSurgeryData,
  TCalendar,
  TRoomDataArray,
} from "../types";
import DateTimePicker from "@react-native-community/datetimepicker";
import getSurgeriesNames from "../hooks/getSurgeriesNames";
import pbDateStringToDate from "../hooks/pbDateStringToDate";
import getPbDateString from "../hooks/getPbDateString";
import createSurgeryName from "../hooks/createSurgeryName";
import formatName from "../hooks/formatName";
import updateSurgery from "../hooks/updateSurgery";
import verifyIsOccupied from "../hooks/verifyIsOccupied";
import deleteSurgery from "../hooks/deleteSurgery";

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
    const [newSurgeryName, setNewSurgeryName] = useState({
      isOpen: false,
      name: "",
      error: false,
    });
    const [endDate, setEndDate] = useState({
      time: pbDateStringToDate(editSurgeryModal.data.endDate),
      showPicker: false,
      error: "",
    });
    const [patient, setPatient] = useState(editSurgeryModal.data.patient);
    const { surgeriesNames } = getSurgeriesNames();

    function close() {
      setNamePickerIsOpen(false);
      setNewSurgeryName({ isOpen: false, name: "", error: false });
      setEndDate({ ...endDate, showPicker: false, error: "" });
      setEditSurgeryModal({ data: undefined, isOpen: false });
    }

    async function onSubmit() {
      if (editSurgeryModal.data) {
        if (
          newSurgeryName.isOpen &&
          newSurgeryName.name.length > 3 &&
          newSurgeryName.error === false
        ) {
          createSurgeryName(formatName(newSurgeryName.name));
        }
        const newData = {
          endDate: getPbDateString(endDate.time),
          name:
            newSurgeryName.name.length > 3 &&
            newSurgeryName.isOpen &&
            newSurgeryName.error === false
              ? newSurgeryName.name
              : undefined,
          patient: patient?.length !== 0 ? patient : undefined,
        };
        await updateSurgery(editSurgeryModal.data.id, newData);
        close();
      }
    }
    return (
      <Modal transparent visible={editSurgeryModal.isOpen} animationType="fade">
        <View className="px-6 flex-1 bg-black-o-28 justify-center">
          <View className="w-full rounded-xl overflow-hidden bg-white ">
            <View className="flex-row justify-between items-center px-2 py-1 mb-1">
              <Text className="text-base">
                Editar cirurgia ás{" "}
                {pbDateStringToDate(editSurgeryModal.data.startDate)
                  .toTimeString()
                  .slice(0, 5)}
              </Text>
              <Pressable
                className="p-2"
                onPress={async () => {
                  if (editSurgeryModal.data) {
                    await deleteSurgery(editSurgeryModal.data.id);
                    close();
                  }
                }}
              >
                <AntDesign name="delete" size={24} color="black" />
              </Pressable>
              <Pressable className="p-2" onPress={close}>
                <AntDesign name="close" size={24} color="black" />
              </Pressable>
            </View>
            <View>
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
                <View>
                  <Text className="font-medium mb-1">Paciente</Text>
                  <TextInput
                    defaultValue={patient}
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
                <Text className="text-white text-base">Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  } else {
    return null;
  }
};

export default EditSurgeryModal;
