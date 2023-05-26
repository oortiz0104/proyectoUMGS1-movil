import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { AppStackParamList } from "../navigators"
import { palette, spaceGrotesk, spacing } from "../theme"
import { StackScreenProps } from "@react-navigation/stack"
import { Icon } from "@rneui/base"
import { Text } from "../components"
import { MenuCard } from "../components/MenuCard"
import { getIdentity, signOut } from "../utils/session"
import { Reactotron } from "../services/reactotron/reactotronClient"

const { width, height } = Dimensions.get("window")

export const MenuScreen: FC<StackScreenProps<AppStackParamList, "Menu">> = observer(
  ({ navigation }) => {
    const [userNames, setUserNames] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")

    const cardProfile = {
      icon: "person",
      title: userNames,
      text: email,
      onPress: () => console.log("Profile"),
      type: "profile" as "profile",
      navigation,
    }

    const cardInfo = [
      {
        icon: "device-desktop",
        title: "Equipos nuevos",
        text: "Ingresa, modifica o elimina equipos nuevos",
        onPress: () =>
          navigation.navigate("NewPCInquiry", {
            willRefresh: true,
          }),
        type: "shortcut" as "shortcut",
        accessRoll: "any",
        navigation,
      },
      {
        icon: "log",
        title: "Registros de equipos nuevos",
        text: "Consulta los registros de los equipos nuevos",
        onPress: () => navigation.navigate("NewPCRegisterInquiry"),
        type: "shortcut" as "shortcut",
        accessRoll: "any",
        navigation,
      },
      {
        icon: "device-desktop",
        title: "Equipos usados",
        text: "Ingresa, modifica o elimina equipos usados",
        onPress: () =>
          navigation.navigate("UsedPCInquiry", {
            willRefresh: true,
          }),
        type: "shortcut" as "shortcut",
        accessRoll: "any",
        navigation,
      },
      {
        icon: "log",
        title: "Registros de equipos usados",
        text: "Consulta los registros de los equipos usados",
        onPress: () => navigation.navigate("UsedPCRegisterInquiry"),
        type: "shortcut" as "shortcut",
        accessRoll: "any",
        navigation,
      },
      {
        icon: "people",
        title: "Usuarios",
        text: "Ingresa, modifica o elimina usuarios",
        onPress: () =>
          navigation.navigate("UserInquiry", {
            willRefresh: true,
          }),
        type: "shortcut" as "shortcut",
        accessRoll: "ADMIN",
        navigation,
      },
      {
        icon: "archive",
        title: "Ubicaciones en bodega",
        text: "Ingresa, modifica o elimina ubicaciones en bodega",
        onPress: () =>
          navigation.navigate("CellarUbicationsInquiry", {
            willRefresh: true,
          }),
        type: "shortcut" as "shortcut",
        accessRoll: "ADMIN",
        navigation,
      },
    ]

    const logOut = async () => {
      await signOut()
      navigation.navigate("Login")
    }

    useEffect(() => {
      ;(async () => {
        const infoUser = await getIdentity()

        const name = infoUser.name
        const surname = infoUser.surname

        setUserNames(`${name} ${surname}`)
        setEmail(infoUser.email)
        setRole(infoUser.role)
      })()
    }, [])

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: palette.primary400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StatusBar barStyle="light-content" />

        <View style={$containerIconClose}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.5}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              backgroundColor: "#0000001A",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="x" type="octicon" color={"#FFF"} size={26} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={$wrapper}>
            <Text testID="menu profile" text="Perfil" style={$title} />
            <MenuCard card={cardProfile} />

            <Text testID="menu shortcuts" text="Accesos directos" style={$title} />
            {cardInfo.map((card, index) => {
              if (card.accessRoll === role) {
                return <MenuCard key={index} card={card} />
              }
              if (card.accessRoll === "any") {
                return <MenuCard key={index} card={card} />
              }

              return null
            })}

            <TouchableOpacity style={$card} activeOpacity={0.5} onPress={logOut}>
              <Text testID="title_card_1" text="Cerrar sesión" style={$titleCard} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  },
)

const $text: TextStyle = {
  color: "#FFF",
  fontFamily: spaceGrotesk.normal,
}

const $bold: TextStyle = {
  ...$text,
  fontFamily: spaceGrotesk.semiBold,
}

const $containerIconClose: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  height: 80,
  width: "100%",
  paddingHorizontal: 30,
  zIndex: 1,
}

const $containerLogo: ViewStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  marginTop: 100,
  marginBottom: 60,
}

const $wrapper: ViewStyle = {
  paddingHorizontal: 30,
}

const $title: TextStyle = {
  ...$bold,
  color: "#FFFFFF",
  marginBottom: 16,
}

const $card: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: 67,
  backgroundColor: "#FFFFFF1A",
  borderRadius: 10,
  paddingVertical: spacing.medium,
  paddingHorizontal: spacing.medium,
  marginTop: spacing.massive,
  marginBottom: spacing.extraLarge,
}

const $titleCard: TextStyle = {
  ...$text,
  ...$bold,
  fontSize: 16,
  textAlign: "center",
}
