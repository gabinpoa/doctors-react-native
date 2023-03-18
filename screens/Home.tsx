import {
  Text,
  Pressable,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
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
import { AntDesign } from "@expo/vector-icons";
import ViewSurgeryModal from "../components/ViewSurgeryModal";

const Home = ({ navigation }: any) => {
  const { calendar, setCalendar, dataToCreate, limitHours } = useContext(
    AppContext
  ) as IContextDefaultValue;
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState(0);
  const [createSurgeryModalIsOpen, setCreateSurgeryModalIsOpen] =
    useState(false);
  const [editSurgeryModal, setEditSurgeryModal] =
    useState<IEditSurgeryModalState>({ isOpen: false, data: undefined });
  const [viewSurgeryModal, setViewSurgeryModal] =
    useState<IEditSurgeryModalState>({ isOpen: false, data: undefined });

  useCalendar(day, setCalendar, setLoading, limitHours);

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
    <ScrollView className="bg-slate-200">
      <View className="flex-row justify-center items-center gap-x-10">
        <Pressable
          disabled={loading}
          onPress={() => {
            if (day > 0) {
              setDay(day - 1);
            }
          }}
          className="p-2"
        >
          <Text className="font-medium text-lg">{"<"}</Text>
        </Pressable>
        <View className="items-center justify-center">
          <AntDesign name="calendar" size={18} color="black" />
          <Text>{date}</Text>
        </View>
        <Pressable
          disabled={loading}
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
      <ViewSurgeryModal
        viewSurgeryModal={viewSurgeryModal}
        setViewSurgeryModal={setViewSurgeryModal}
        setEditSurgeryModal={setEditSurgeryModal}
      />
      {calendar.length > 0 && !loading ? (
        <Calendar
          setViewSurgeryModal={setViewSurgeryModal}
          setCreateSurgeryModalIsOpen={setCreateSurgeryModalIsOpen}
          calendar={calendar as TCalendar}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      )}
    </ScrollView>
  );
};

export default Home;
