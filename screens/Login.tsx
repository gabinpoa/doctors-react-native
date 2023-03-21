import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useContext, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import LoginInput from "../components/LoginInput";
import { pb } from "../lib/pocketbase";
import { AppContext, IContextDefaultValue } from "../context";
import { AntDesign } from "@expo/vector-icons";
import useVerifyAuth from "../hooks/useVerifyAuth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackNavigationParamList } from "../types";
import { Record } from "pocketbase";

export interface Institution extends Record {
  name: string;
  start: number;
  end: number;
}

const Login = ({ navigation }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { setLogged, setLimitHours } = useContext(
    AppContext
  ) as IContextDefaultValue;

  useVerifyAuth(setLogged);

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  async function onSubmit(data: FieldValues) {
    try {
      setLoading(true);
      await pb.collection("users").authWithPassword(data.email, data.password);
      pb.authStore.save(pb.authStore.token, pb.authStore.model);
      const institution = (await pb
        .collection("institutions")
        .getOne(pb.authStore.model?.institution)) as Institution;
      setLimitHours({ start: institution.start, end: institution.end });
      setLogged(true);
    } catch (e) {
      setLoginFailed(true);
      setLoading(false);
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center px-6">
      <Text className="text-red-600 text-center mb-3">
        {loginFailed && "E-mail ou senha inválidos"}
      </Text>
      <Text className="font-semibold text-base text-neutral-500">Email</Text>
      <LoginInput
        control={control}
        errors={errors}
        loginFailed={loginFailed}
        inputName="email"
        placeholder="Seu e-mail"
      />
      <Text className="font-semibold text-base text-neutral-500">Senha</Text>
      <View className="flex-row">
        <LoginInput
          control={control}
          errors={errors}
          loginFailed={loginFailed}
          inputName="password"
          placeholder="Sua senha"
          addStyle="flex-1"
          showPassword={showPassword}
        />
        <AntDesign
          name="eyeo"
          size={24}
          onPress={togglePasswordVisibility}
          style={{ paddingVertical: 12, paddingHorizontal: 10 }}
          color="gray"
        />
      </View>
      <Pressable
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
        className="bg-sky-400 h-12 rounded-lg justify-center"
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text className="text-white text-base text-center">Entrar</Text>
        )}
      </Pressable>
    </View>
  );
};

export default Login;
