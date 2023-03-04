import { createContext, useState } from "react";
import * as React from "react";
import { IDataToCreate, TCalendar } from "../types";

export interface IContextDefaultValue {
  limitHour: {
    initial: number;
    final: number;
  };
  dataToCreate: IDataToCreate | undefined;
  setDataToCreate: React.Dispatch<
    React.SetStateAction<IDataToCreate | undefined>
  >;
  calendar: TCalendar | [];
  setCalendar: React.Dispatch<React.SetStateAction<TCalendar | []>>;
}

export const AppContext = createContext<IContextDefaultValue | null>(null);

export const AppContextProvider = ({ children }: React.PropsWithChildren) => {
  const [limitHour, setLimitHours] = useState({
    initial: 6,
    final: 23,
  });
  const [dataToCreate, setDataToCreate] = useState<IDataToCreate>();
  const [calendar, setCalendar] = useState<TCalendar | []>([]);

  return (
    <AppContext.Provider
      value={{
        limitHour,
        dataToCreate,
        setDataToCreate,
        calendar,
        setCalendar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
