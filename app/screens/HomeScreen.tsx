import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { AppStackParamList } from "../navigators"
import { colors, spacing, typography } from "../theme"
import { StackScreenProps } from "@react-navigation/stack"
import { LinearGradient } from "expo-linear-gradient"
import { Icon } from "@rneui/base"
import { Text, HomeCard } from "../components"
import { ScrollView } from "react-native-gesture-handler"
import { Reactotron } from "app/services/reactotron/reactotronClient"
import { getIdentity } from "app/utils/session"

const { width, height } = Dimensions.get("window")

export const HomeScreen: FC<StackScreenProps<AppStackParamList, "Home">> = observer(
  ({ navigation }) => {
    const [name, setName] = useState("")
    const [role, setRole] = useState("")

    const cardInfo = [
      {
        icon: "device-desktop",
        title: "Equipos nuevos",
        text: "Ingresa, modifica o elimina equipos nuevos",
        onPress: () =>
          navigation.navigate("NewPCInquiry", {
            willRefresh: true,
          }),
        accessRoll: "any",
      },
      {
        icon: "log",
        title: "Registros de equipos nuevos",
        text: "Consulta los registros de los equipos nuevos",
        onPress: () => navigation.navigate("NewPCRegisterInquiry"),
        accessRoll: "any",
      },
      {
        icon: "device-desktop",
        title: "Equipos usados",
        text: "Ingresa, modifica o elimina equipos usados",
        onPress: () =>
          navigation.navigate("UsedPCInquiry", {
            willRefresh: true,
          }),
        accessRoll: "any",
      },
      {
        icon: "log",
        title: "Registros de equipos usados",
        text: "Consulta los registros de los equipos usados",
        onPress: () => navigation.navigate("UsedPCRegisterInquiry"),
        accessRoll: "any",
      },
      {
        icon: "people",
        title: "Usuarios",
        text: "Ingresa, modifica o elimina usuarios",
        onPress: () =>
          navigation.navigate("UserInquiry", {
            willRefresh: true,
          }),
        accessRoll: "ADMIN",
      },
      {
        icon: "archive",
        title: "Ubicaciones en bodega",
        text: "Ingresa, modifica o elimina ubicaciones en bodega",
        onPress: () =>
          navigation.navigate("CellarUbicationsInquiry", {
            willRefresh: true,
          }),
        accessRoll: "ADMIN",
      },
    ]

    useEffect(() => {
      ;(async () => {
        const infoUser = await getIdentity()

        let names = infoUser.name
        setName(names)
        setRole(infoUser.role)
      })()
    }, [])

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fdfdff",
          flexDirection: "column",
          display: "flex",
        }}
      >
        <StatusBar barStyle="light-content" />

        <View style={$containerBackground}>
          <LinearGradient
            colors={[colors.palette.primary400, colors.palette.accent400]}
            style={$background}
          />
        </View>

        <View style={$containerIconMenu}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Menu")}
            activeOpacity={0.5}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="three-bars" type="octicon" color={"#FFF"} size={26} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal={false}
          style={{ flex: 1 }}
          contentContainerStyle={$contentWrapper}
          showsVerticalScrollIndicator={false}
        >
          <View style={$welcomeContainer}>
            <Text
              testID="welcome"
              text={`Hola, ${name}`}
              style={[
                $text,
                $bold,
                { fontSize: spacing.extraLarge, color: "#FFF", lineHeight: 40 },
              ]}
            />
            <Text
              testID="welcome_message"
              text="Bienvenido de nuevo"
              style={{
                ...$text,
                fontSize: 18,
                color: "#FFF",
                opacity: 0.5,
              }}
            />
          </View>

          <View>
            <Text
              text="Aquí hay algunas cosas que puedes hacer"
              style={{
                ...$text,
                color: "#fff",
                fontSize: 14,
                marginBottom: spacing.medium + spacing.tiny,
              }}
            />

            <View style={$cardsWrapper}>
              {cardInfo.map((card, index) => {
                if (card.accessRoll === role) {
                  return <HomeCard key={index} index={index} card={card} />
                }

                if (card.accessRoll === "any") {
                  return <HomeCard key={index} index={index} card={card} />
                }
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  },
)

const $text: TextStyle = {
  color: "#000",
  fontFamily: typography.fonts.spaceGrotesk.normal,
}

const $bold: TextStyle = {
  fontFamily: typography.fonts.spaceGrotesk.semiBold,
}

const $containerBackground: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "50%",
}

const $background: ViewStyle = {
  width: "280%",
  height: "130%",
  borderBottomLeftRadius: 3500,
  borderBottomRightRadius: 3500,
}

const $containerIconMenu: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  height: 80,
  width: "100%",
  paddingHorizontal: 30,
  zIndex: 1,
}

const $welcomeContainer: ViewStyle = {
  marginBottom: spacing.massive + spacing.medium,
}

const $contentWrapper: ViewStyle = {
  paddingTop: height * 0.1,
  paddingHorizontal: spacing.medium + spacing.tiny,
}

const $cardsWrapper: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: 10,
}
