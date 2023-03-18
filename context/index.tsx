import { createContext, useState } from "react";
import * as React from "react";
import { IDataToCreate, TCalendar } from "../types";

export interface LimitHours {
  start: number;
  end: number;
}

export interface IContextDefaultValue {
  logged: boolean;
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
  dataToCreate: IDataToCreate | undefined;
  setDataToCreate: React.Dispatch<
    React.SetStateAction<IDataToCreate | undefined>
  >;
  calendar: TCalendar | [];
  setCalendar: React.Dispatch<React.SetStateAction<TCalendar | []>>;
  limitHours: LimitHours;
  setLimitHours: React.Dispatch<React.SetStateAction<LimitHours>>;
}

export const AppContext = createContext<IContextDefaultValue | null>(null);

export const AppContextProvider = ({ children }: React.PropsWithChildren) => {
  const [dataToCreate, setDataToCreate] = useState<IDataToCreate>();
  const [calendar, setCalendar] = useState<TCalendar | []>([]);
  const [logged, setLogged] = useState(false);
  const [limitHours, setLimitHours] = useState<LimitHours>({
    start: 6,
    end: 23,
  });

  return (
    <AppContext.Provider
      value={{
        logged,
        setLogged,
        dataToCreate,
        setDataToCreate,
        calendar,
        setCalendar,
        setLimitHours,
        limitHours,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
