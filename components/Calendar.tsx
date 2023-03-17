import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import {
  IEditSurgeryModalState,
  IHourRow,
  IRoomData,
  TCalendar,
} from "../types";
import { AppContext, IContextDefaultValue } from "../context";
import getSurgeryHeight from "../hooks/getSurgeryHeight";
import pbDateStringToDate from "../hooks/pbDateStringToDate";
import { getRandomColor } from "../lib/colors";
import { pb } from "../lib/pocketbase";

interface Props {
  calendar: TCalendar;
  setCreateSurgeryModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setEditSurgeryModal: Dispatch<SetStateAction<IEditSurgeryModalState>>;
}

const Calendar = ({
  calendar,
  setCreateSurgeryModalIsOpen,
  setEditSurgeryModal,
}: Props) => {
  const { setDataToCreate } = useContext(AppContext) as IContextDefaultValue;
  return (
    <View className="mb-5 p-1">
      <View className="flex-row">
        <View className="pt-10">
          {calendar[0].map(({ hour }: IHourRow, index, arr) => {
            return (
              index !== arr.length - 1 && (
                <View
                  key={index}
                  className="h-12 bg-white items-center justify-center w-8 border border-neutral-300"
                >
                  <Text className="">{hour.toString() + "h"}</Text>
                </View>
              )
            );
          })}
        </View>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          className="rounded-md"
          horizontal
        >
          {calendar[1].map((room: IRoomData, index, rooms) => {
            return (
              <View
                className={`${index !== 0 && "border-l"} border-neutral-100`}
                key={index}
                style={{
                  minWidth: 118,
                  height: "100%",
                  width: `${100 / rooms.length}%`,
                }}
              >
                <View
                  key={index}
                  className={`bg-white max-h-10 justify-center items-center h-10 ${
                    index === 0 && "rounded-tl-md"
                  } ${index === rooms.length - 1 && "rounded-tr-md"}`}
                >
                  <Text>{room.name}</Text>
                </View>
                {room.dates.map((dateObj, index) => {
                  return (
                    <Pressable
                      key={index}
                      style={{
                        width: "100%",
                      }}
                      className={`h-6 bg-white border-neutral-200 ${
                        !dateObj.reserved && "border-y"
                      } ${dateObj.isStart && "border-t"} ${
                        dateObj.isEnd && "border-b"
                      }`}
                      onPress={() => {
                        if (pb.authStore.model?.role === "reader") {
                          Alert.alert(
                            "Você não pode criar ou editar cirurgias"
                          );
                        } else if (!dateObj.reserved) {
                          setDataToCreate({
                            roomId: dateObj.roomId,
                            startDate: dateObj.startDate,
                            endDate: dateObj.endDate,
                          });
                          setCreateSurgeryModalIsOpen(true);
                        } else if (dateObj.data) {
                          if (
                            (dateObj.data.doctor.id ||
                              dateObj.data.expand.doctor.id) ===
                              pb.authStore.model?.id ||
                            pb.authStore.model?.role === "admin"
                          ) {
                            setEditSurgeryModal({
                              data: dateObj.data,
                              isOpen: true,
                            });
                          } else {
                            Alert.alert(
                              "Você não pode editar cirugias de outros médicos"
                            );
                          }
                        }
                      }}
                    >
                      {dateObj.data && dateObj.isStart && (
                        <Pressable
                          onPress={() => {
                            if (
                              (dateObj.data?.doctor.id ||
                                dateObj.data?.expand.doctor.id) ===
                                pb.authStore.model?.id ||
                              pb.authStore.model?.role === "admin"
                            ) {
                              setEditSurgeryModal({
                                data: dateObj.data,
                                isOpen: true,
                              });
                            } else {
                              Alert.alert(
                                "Você não pode editar cirugias de outros médicos"
                              );
                            }
                          }}
                          style={{
                            height:
                              23 *
                              getSurgeryHeight(
                                dateObj.startDate,
                                pbDateStringToDate(dateObj.data.endDate)
                              ),
                            backgroundColor: dateObj.data.color,
                          }}
                          className={`${
                            getSurgeryHeight(
                              dateObj.startDate,
                              pbDateStringToDate(dateObj.data.endDate)
                            ) > 1 && "py-1"
                          } ${
                            getSurgeryHeight(
                              dateObj.startDate,
                              pbDateStringToDate(dateObj.data.endDate)
                            ) === 1 && "flex-row space-x-3"
                          } px-1 rounded`}
                        >
                          <Text className="text-white text-[13px] font-medium">
                            {(dateObj.data.doctor.name &&
                              dateObj.data.doctor.name.substring(0, 16) +
                                ".") ||
                              (dateObj.data.expand.doctor.name &&
                                dateObj.data.expand.doctor.name.substring(
                                  0,
                                  16
                                ) + ".")}
                          </Text>
                          {!(
                            getSurgeryHeight(
                              dateObj.startDate,
                              pbDateStringToDate(dateObj.data.endDate)
                            ) === 1 && rooms.length > 1
                          ) && (
                            <Text className="text-white text-xs">
                              {dateObj.data.name}
                            </Text>
                          )}
                        </Pressable>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default Calendar;
