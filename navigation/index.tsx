import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import * as SplashScreen from "expo-splash-screen";
import Home from "../screens/Home";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { RootStackNavigationParamList } from "../types";
import AdminSettings from "../screens/AdminSettings";
import { pb } from "../lib/pocketbase";
import GeneralSettings from "../components/GeneralSettings";
import { useContext, useEffect, useState } from "react";
import { AppContext, IContextDefaultValue } from "../context";

const Stack = createNativeStackNavigator<RootStackNavigationParamList>();
const Drawer = createDrawerNavigator();

SplashScreen.preventAutoHideAsync();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Calendário" component={Home} />
      <Drawer.Screen name="Configurações gerais" component={GeneralSettings} />
    </Drawer.Navigator>
  );
};

export default function Navigation() {
  const { logged } = useContext(AppContext) as IContextDefaultValue;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!logged ? (
          <Stack.Screen name="Login" component={Login} />
        ) : (
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
