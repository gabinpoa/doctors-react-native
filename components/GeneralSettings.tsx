import { View, Text, Pressable } from "react-native";
import React, { useContext } from "react";
import { pb } from "../lib/pocketbase";
import { useNavigation } from "@react-navigation/native";
import { AppContext, IContextDefaultValue } from "../context";

const GeneralSettings = () => {
  const navigation = useNavigation();
  const { setLogged } = useContext(AppContext) as IContextDefaultValue;
  return (
    <View className="p-3">
      <Pressable style={{ borderRadius: 6 }} className="bg-white p-3">
        <Text
          className="text-base"
          onPress={() => {
            pb.authStore.clear();
            setLogged(false);
          }}
        >
          Sair
        </Text>
      </Pressable>
    </View>
  );
};

export default GeneralSettings;
