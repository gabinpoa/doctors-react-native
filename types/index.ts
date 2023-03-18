import {
  NativeStackNavigationProp,
  NativeStackNavigatorProps,
} from "@react-navigation/native-stack/lib/typescript/src/types";
import { Record } from "pocketbase";

export interface IDateObj {
  startDate: Date;
  endDate: Date;
  reserved: boolean;
  data?: ISurgeryData;
  roomId: string;
  isStart?: boolean;
  isEnd?: boolean;
}

export interface IRoomOnExpand {
  name: string;
  id: string;
  institutiton: string;
}

export interface ISurgeryData {
  doctor: string;
  endDate: string;
  expand: {
    doctor: IUser;
    room: IRoomOnExpand;
  };
  id: string;
  name: string;
  patient: string;
  room: string;
  startDate: string;
  color?: string;
  healthInsurance: string;
  surgeon?: string;
  observations?: string;
  anesthesist: boolean;
  bed?: string;
  hospitalization: string;
}

export interface IUser {
  id: string;
  created: string;
  updated: string;
  username?: string;
  email: string;
  emailVisibility?: boolean;
  verified?: boolean;
  name: string;
  institution: string;
  role: string;
}

export class SurgeriesRecord extends Record {
  doctor!: string;
  endDate!: string;
  name!: string;
  patient!: string;
  room!: string;
  startDate!: string;
  color?: string;
  healthInsurance!: string;
  surgeon?: string;
  observations?: string;
  anesthesist!: boolean;
  bed?: string;
  hospitalization!: string;
}

export class RoomsRecord extends Record {
  name!: string;
  institution!: string;
}

export class RoomsWithDate extends RoomsRecord {
  dates?: IDateObj[];
}

export interface IHourRow {
  hour: number;
}

export type THourRowArray = IHourRow[];

export type TCalendar = [THourRowArray, TRoomDataArray];

export type TRoomDataArray = IRoomData[];

export interface IRoomData {
  collectionId: string;
  collectionName: string;
  created: string;
  dates: IDateObj[];
  expand: any;
  id: string;
  institution: string;
  name: string;
  updated: string;
}

export interface IDataToCreate {
  startDate: Date;
  endDate: Date;
  roomId: string;
}

export type TSurgeriesNames = ISurgeryName[];

export interface ISurgeryName {
  name: string;
  id: string;
}

export interface IEditSurgeryModalState {
  isOpen: boolean;
  data: ISurgeryData | undefined;
}

export interface IUpdateSurgeryData {
  name?: string;
  endDate?: string;
  patient?: string;
}

export type RootStackNavigationParamList = {
  Login: undefined;
  Drawer: undefined;
};
