/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { PC, User, ubication } from "app/utils/interfaces"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  // 🔥 Your screens go here
  Login: undefined
  Home: undefined
  Menu: undefined

  NewPCInquiry: { willRefresh: boolean }
  AddNewPC: { willRefresh: boolean; pcData?: PC }
  NewPCRegisterInquiry: undefined

  UsedPCInquiry: { willRefresh: boolean }
  AddUsedPC: { willRefresh: boolean; pcData?: PC }
  UsedPCRegisterInquiry: undefined

  UserInquiry: { willRefresh: boolean }
  AddUser: { willRefresh: boolean }
  EditUser: { willRefresh: boolean; userData: User }

  CellarUbicationsInquiry: { willRefresh: boolean }
  AddCellarUbication: { willRefresh: boolean; cellarUbicationData?: ubication }
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
      {/** 🔥 Your screens go here */}
      <Stack.Screen name="Login" component={Screens.LoginScreen} options={{ animation: "fade" }} />
      <Stack.Screen
        name="Home"
        component={Screens.HomeScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen name="Menu" component={Screens.MenuScreen} options={{ animation: "fade" }} />

      <Stack.Screen
        name="NewPCInquiry"
        component={Screens.NewPCInquiryScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="AddNewPC"
        component={Screens.AddNewPCScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="NewPCRegisterInquiry"
        component={Screens.NewPCRegisterInquiryScreen}
        options={{ animation: "slide_from_right" }}
      />

      <Stack.Screen
        name="UsedPCInquiry"
        component={Screens.UsedPCInquiryScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="AddUsedPC"
        component={Screens.AddUsedPCScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="UsedPCRegisterInquiry"
        component={Screens.UsedPCRegisterInquiryScreen}
        options={{ animation: "slide_from_right" }}
      />

      <Stack.Screen
        name="UserInquiry"
        component={Screens.UserInquiryScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="AddUser"
        component={Screens.AddUserScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="EditUser"
        component={Screens.EditUserScreen}
        options={{ animation: "slide_from_right" }}
      />

      <Stack.Screen
        name="CellarUbicationsInquiry"
        component={Screens.CellarUbicationsInquiryScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="AddCellarUbication"
        component={Screens.AddCellarUbicationScreen}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} theme={DarkTheme} {...props}>
      <AppStack />
    </NavigationContainer>
  )
})
