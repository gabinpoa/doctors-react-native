import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { pb } from "../lib/pocketbase";
import * as SplashScreen from "expo-splash-screen";

function useVerifyAuth(navigation) {
  async function saveAuthStoreFromAsyncStorage() {
    try {
      const token = await AsyncStorage.getItem("token");
      const jsonModel = await AsyncStorage.getItem("model");

      if (token !== null && jsonModel !== null) {
        const model = JSON.parse(jsonModel);
        pb.authStore.save(token, model);
        navigation.navigate("Drawer");
      } else {
        await SplashScreen.hideAsync();
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    saveAuthStoreFromAsyncStorage();
  }, []);
}

export default useVerifyAuth;
