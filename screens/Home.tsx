import { Text, Pressable, View, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { pb } from "../lib/pocketbase";
import { AppContext, IContextDefaultValue } from "../context";
import Calendar from "../components/Calendar";
import useCalendar from "../hooks/useCalendar";
import { IEditSurgeryModalState, TCalendar } from "../types";
import CreateSurgeryModal from "../components/CreateSurgeryModal";
import useSubscribeToSurgeries from "../hooks/useSubscribeToSurgeries";
import EditSurgeryModal from "../components/EditSurgeryModal";
import * as SplashScreen from "expo-splash-screen";
import getDayDate from "../hooks/getDayDate";

const Home = ({ navigation }: any) => {
  const { calendar, setCalendar, dataToCreate } = useContext(
    AppContext
  ) as IContextDefaultValue;
  const [day, setDay] = useState(0);
  const [createSurgeryModalIsOpen, setCreateSurgeryModalIsOpen] =
    useState(false);
  const [editSurgeryModal, setEditSurgeryModal] =
    useState<IEditSurgeryModalState>({ isOpen: false, data: undefined });

  useCalendar(day, setCalendar);
  useSubscribeToSurgeries(day, setDay, calendar[1], calendar[0], setCalendar);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e: any) => {
        e.preventDefault();
      }),
    [navigation]
  );

  function logout() {
    pb.authStore.clear();
    navigation.navigate("Login");
  }

  const date = getDayDate(day)
    .toLocaleDateString()
    .split("/")
    .filter((subStr, index) => index !== 2)
    .join("/");
  return (
    <ScrollView className="bg-neutral-50">
      <View className="flex-row justify-center items-center gap-x-10">
        <Pressable
          onPress={() => {
            if (day > 0) {
              setDay(day - 1);
            }
          }}
          className="p-2"
        >
          <Text className="font-medium text-lg">{"<"}</Text>
        </Pressable>
        <Text>{date}</Text>
        <Pressable
          onPress={() => {
            if (day < 5) {
              setDay(day + 1);
            }
          }}
          className="p-2"
        >
          <Text className="font-medium text-lg">{">"}</Text>
        </Pressable>
      </View>
      {calendar.length === 2 && (
        <>
          <CreateSurgeryModal
            roomsArray={calendar[1]}
            dataToCreate={dataToCreate}
            createSurgeryModalIsOpen={createSurgeryModalIsOpen}
            setCreateSurgeryModalIsOpen={setCreateSurgeryModalIsOpen}
          />
          <EditSurgeryModal
            roomsArray={calendar[1]}
            editSurgeryModal={editSurgeryModal}
            setEditSurgeryModal={setEditSurgeryModal}
          />
        </>
      )}
      {calendar.length > 0 && (
        <Calendar
          setEditSurgeryModal={setEditSurgeryModal}
          setCreateSurgeryModalIsOpen={setCreateSurgeryModalIsOpen}
          calendar={calendar as TCalendar}
        />
      )}
    </ScrollView>
  );
};

export default Home;
