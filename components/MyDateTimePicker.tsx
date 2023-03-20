import DateTimePicker from "@react-native-community/datetimepicker";
import React, { Dispatch, SetStateAction } from "react";

export interface DateState {
  time: undefined | Date;
  showPicker: boolean;
  error: string;
}

interface Props {
  dateState: DateState;
  setDateState: Dispatch<SetStateAction<DateState>>;
}

const MyDateTimePicker = ({ dateState, setDateState }: Props) => {
  return (
    <DateTimePicker
      minuteInterval={30}
      value={dateState.time as Date}
      mode="time"
      is24Hour={true}
      onChange={(e, selected) => {
        if (selected) {
          setDateState({
            ...dateState,
            time: selected,
            showPicker: false,
          });
        }
      }}
    />
  );
};

export default MyDateTimePicker;
