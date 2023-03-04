import AsyncStorage from "@react-native-async-storage/async-storage";
import PocketBase, { Admin, BaseAuthStore, BaseModel } from "pocketbase";
import { Record } from "pocketbase";
import { Dispatch, SetStateAction } from "react";

class CustomAuthStore extends BaseAuthStore {
  async save(token: string, model: Record | Admin | null) {
    super.save(token, model);
    try {
      const jsonModel = JSON.stringify(model);
      await AsyncStorage.setItem("model", jsonModel);
      await AsyncStorage.setItem("token", token);
    } catch (err) {
      console.error(err);
    }
  }
  async clear() {
    super.clear();
    await AsyncStorage.removeItem("model");
    await AsyncStorage.removeItem("token");
  }
}

export const pb = new PocketBase(
  "https://pocketbase-doctors.fly.dev",
  new CustomAuthStore()
);
