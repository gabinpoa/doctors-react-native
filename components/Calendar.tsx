import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  IEditSurgeryModalState,
  IHourRow,
  IRoomData,
  SurgeriesRecord,
  TCalendar,
} from "../types";
import { AppContext, IContextDefaultValue } from "../context";
import getSurgeryHeight from "../hooks/getSurgeryHeight";
import pbDateStringToDate from "../hooks/pbDateStringToDate";
import { pb } from "../lib/pocketbase";
import calendarSubstring from "../hooks/calendarSubstring";
import startAndEndTimeString from "../hooks/startAndEndTimeString";

interface Props {
  calendar: TCalendar;
  setCreateSurgeryModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setViewSurgeryModal: Dispatch<SetStateAction<IEditSurgeryModalState>>;
}

const Calendar = ({
  calendar,
  setCreateSurgeryModalIsOpen,
  setViewSurgeryModal,
}: Props) => {
  const { setDataToCreate } = useContext(AppContext) as IContextDefaultValue;

  function viewSurgery(data: SurgeriesRecord) {
    setViewSurgeryModal({ data: data, isOpen: true });
  }

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
        <ScrollView className="rounded-md" horizontal>
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
                  className={`bg-white px-1 max-h-10 justify-center items-center h-10 ${
                    index === 0 && "rounded-tl-md"
                  } ${index === rooms.length - 1 && "rounded-tr-md"}`}
                >
                  <Text className="text-center">{room.name}</Text>
                </View>
                {room.dates.map((dateObj, index) => {
                  return (
                    <Pressable
                      key={index}
                      style={{
                        width: "100%",
                        overflow: "visible",
                      }}
                      className={`h-6 border-neutral-200 ${
                        !dateObj.reserved && "border-y bg-white"
                      }`}
                      onPress={() => {
                        if (pb.authStore.model?.role === "reader") {
                          Alert.alert("Você não pode criar cirurgias");
                        } else if (!dateObj.reserved) {
                          setDataToCreate({
                            roomId: dateObj.roomId,
                            startDate: dateObj.startDate,
                            endDate: dateObj.endDate,
                            roomName: room.name,
                          });
                          setCreateSurgeryModalIsOpen(true);
                        } else if (dateObj.data) {
                          viewSurgery(dateObj.data);
                        }
                      }}
                    >
                      {dateObj.data && dateObj.isStart && (
                        <Pressable
                          onPress={() => {
                            dateObj.data && viewSurgery(dateObj.data);
                          }}
                          style={{
                            height:
                              24 *
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
                          } px-1 rounded`}
                        >
                          <Text className="text-white text-[13px] font-medium">
                            {startAndEndTimeString(
                              dateObj.data.startDate,
                              dateObj.data.endDate
                            )}
                          </Text>
                          {getSurgeryHeight(
                            dateObj.startDate,
                            pbDateStringToDate(dateObj.data.endDate)
                          ) >= 3 ? (
                            <>
                              <Text className="text-white font-medium mt-1 text-xs">
                                {calendarSubstring(
                                  dateObj.data.expand.doctor.name,
                                  rooms.length,
                                  18
                                )}
                              </Text>
                              <Text className="text-white text-xs">
                                {calendarSubstring(
                                  dateObj.data.name,
                                  rooms.length,
                                  18
                                )}
                              </Text>
                            </>
                          ) : getSurgeryHeight(
                              dateObj.startDate,
                              pbDateStringToDate(dateObj.data.endDate)
                            ) !== 1 ? (
                            <Text className="text-white text-xs mt-1">
                              {calendarSubstring(
                                dateObj.data.expand.doctor.name,
                                rooms.length,
                                18
                              )}
                            </Text>
                          ) : null}
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
