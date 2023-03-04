import { View, Text, Pressable } from "react-native";
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
    <View>
      <View className="flex-row">
        <View className="w-8"></View>
        {calendar[1].map((room, index) => {
          return (
            <View
              key={index}
              className="flex-1 border border-neutral-300 justify-center items-center h-10"
            >
              <Text>{room.name}</Text>
            </View>
          );
        })}
      </View>
      <View className="flex-row">
        <View>
          {calendar[0].map(({ hour }: IHourRow, index) => {
            return (
              <View
                key={index}
                className="h-12 items-center justify-center w-8 border border-neutral-300"
              >
                <Text className="">{hour.toString() + "h"}</Text>
              </View>
            );
          })}
        </View>
        <View className="flex-1 flex-row">
          {calendar[1].map((room: IRoomData, index, rooms) => {
            return (
              <View key={index} className="flex-1">
                {room.dates.map((dateObj, index) => {
                  return (
                    <Pressable
                      key={index}
                      style={{
                        width: "100%",
                      }}
                      className={`h-6 border-neutral-200 ${
                        !dateObj.reserved && "border-y"
                      } ${dateObj.isStart && "border-t"} ${
                        dateObj.isEnd && "border-b"
                      }`}
                      onPress={() => {
                        if (!dateObj.reserved) {
                          setDataToCreate({
                            roomId: dateObj.roomId,
                            startDate: dateObj.startDate,
                            endDate: dateObj.endDate,
                          });
                          setCreateSurgeryModalIsOpen(true);
                        } else if (dateObj.data) {
                          setEditSurgeryModal({
                            data: dateObj.data,
                            isOpen: true,
                          });
                        }
                      }}
                    >
                      {dateObj.data && dateObj.isStart && (
                        <Pressable
                          onPress={() => {
                            setEditSurgeryModal({
                              data: dateObj.data,
                              isOpen: true,
                            });
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
                          } mx-1 px-2 rounded`}
                        >
                          <Text className="text-white text-[13px] font-medium">
                            {dateObj.data.doctor.name ||
                              dateObj.data.expand.doctor.name}
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
        </View>
      </View>
    </View>
  );
};

export default Calendar;
