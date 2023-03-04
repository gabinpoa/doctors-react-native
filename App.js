import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppContextProvider } from "./context";
import eventsource from "react-native-sse";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import "react-native-gesture-handler";
const fetch = require("cross-fetch");
global.EventSource = eventsource;

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AppContextProvider>
          <Navigation />
          <StatusBar />
        </AppContextProvider>
      </SafeAreaProvider>
    );
  }
}
