import { createContext, useState } from "react";
import * as React from "react";
import { IDataToCreate, TCalendar } from "../types";

export interface IContextDefaultValue {
  logged: boolean;
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
  dataToCreate: IDataToCreate | undefined;
  setDataToCreate: React.Dispatch<
    React.SetStateAction<IDataToCreate | undefined>
  >;
  calendar: TCalendar | [];
  setCalendar: React.Dispatch<React.SetStateAction<TCalendar | []>>;
}

export const AppContext = createContext<IContextDefaultValue | null>(null);

export const AppContextProvider = ({ children }: React.PropsWithChildren) => {
  const [dataToCreate, setDataToCreate] = useState<IDataToCreate>();
  const [calendar, setCalendar] = useState<TCalendar | []>([]);
  const [logged, setLogged] = useState(false);

  return (
    <AppContext.Provider
      value={{
        logged,
        setLogged,
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
