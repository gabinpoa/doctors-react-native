import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useContext, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import LoginInput from "../components/LoginInput";
import { pb } from "../lib/pocketbase";
import { AppContext, IContextDefaultValue } from "../context";
import useVerifyAuth from "../hooks/useVerifyAuth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackNavigationParamList } from "../types";

const Login = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { setLogged } = useContext(AppContext) as IContextDefaultValue;

  useVerifyAuth(setLogged);

  async function onSubmit(data: FieldValues) {
    try {
      await pb.collection("users").authWithPassword(data.email, data.password);
      pb.authStore.save(pb.authStore.token, pb.authStore.model);
      setLogged(true);
    } catch (e) {
      setLoginFailed(true);
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
      <LoginInput
        control={control}
        errors={errors}
        loginFailed={loginFailed}
        inputName="password"
        placeholder="Sua senha"
      />
      <Pressable
        onPressIn={() => {
          setLoading(true);
        }}
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
