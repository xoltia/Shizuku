import 'expo-dev-client';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from "react";
import {
  NativeBaseProvider,
  extendTheme,
  StatusBar,
} from "native-base";
import NavigationDrawer from './components/NavigationDrawer';
import { NavigationContainer } from "@react-navigation/native";
import { RealmProvider } from "./database/RealmConfig";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import BrowseScreen from './screens/BrowseScreen';

// define the configs
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module "native-base" {
  interface ICustomTheme extends MyThemeType {}
}

const routes = [
  {
    name: 'Log',
    component: HomeScreen
  },
  {
    name: 'History',
    component: BrowseScreen
  },
  {
    name: 'Settings',
    component: SettingsScreen
  },
]

export default function App() {
  return (
    <RealmProvider>
      <NavigationContainer>
        <NativeBaseProvider theme={theme}>
          <StatusBar/>
          <NavigationDrawer routes={routes}/>
        </NativeBaseProvider>
      </NavigationContainer>
    </RealmProvider>
  );
}
