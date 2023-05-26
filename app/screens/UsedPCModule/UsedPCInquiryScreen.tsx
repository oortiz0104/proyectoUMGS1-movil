import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { AppStackParamList } from "../../navigators"
import { palette, typography } from "../../theme"
import { StackScreenProps } from "@react-navigation/stack"
import { LinearGradient } from "expo-linear-gradient"
import { Icon, Input } from "@rneui/base"
import { Text, PCCard } from "../../components"
import { ScrollView } from "react-native-gesture-handler"
import { PC } from "app/utils/interfaces"
import { api } from "app/services/api"
import apiRoutes from "app/services/api/apiRoutes"

interface switchButton {
  label: "Entrada" | "Salida"
  value: "Entrada" | "Salida" | "Entrada"
  icon: "package-dependencies" | "package-dependents"
}

export const UsedPCInquiryScreen: FC<StackScreenProps<AppStackParamList, "UsedPCInquiry">> =
  observer(({ navigation, route }) => {
    let switchButtons: switchButton[] = [
      {
        label: "Entrada",
        value: "Entrada",
        icon: "package-dependencies",
      },
      {
        label: "Salida",
        value: "Salida",
        icon: "package-dependents",
      },
    ]

    const [switchValue, setSwitchValue] = useState<"Entrada" | "Salida" | null>(null)
    const [pcData, setPCData] = useState<PC[]>([])
    const [filteredPCData, setFilteredPCData] = useState<PC[]>([])
    const [isLoadingData, setIsLoadingData] = useState(true)

    const [search, setSearch] = useState<string>("")

    const handleSwitch = (value: "Entrada" | "Salida") => {
      setSwitchValue(value)

      if (value === switchValue) {
        setSwitchValue(null)
      }
    }

    useEffect(() => {
      if (search.length === 0) {
        setFilteredPCData(pcData)
        return
      }

      setFilteredPCData(
        pcData.filter((pc) => {
          return (
            pc.brand.toLowerCase().includes(search.toLowerCase()) ||
            pc.model.toLowerCase().includes(search.toLowerCase()) ||
            pc.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
            pc.purchaseOrder.toLowerCase().includes(search.toLowerCase())
          )
        }),
      )
    }, [search])

    const getDataRequests = async () => {
      try {
        setIsLoadingData(true)

        let responseUsedPC = await api.get(apiRoutes.usedPC.getUsedPCs)

        if (responseUsedPC.status === 200) {
          setPCData(responseUsedPC.data.usedPCs as PC[])
          setFilteredPCData(responseUsedPC.data.usedPCs as PC[])

          setIsLoadingData(false)
        }
      } catch (error) {
        console.log("🚀 ~ file: NewPCInquiryScreen.tsx:122 ~ getDataRequests ~ error:", error)
      }
    }

    useEffect(() => {
      getDataRequests()
    }, [route.params?.willRefresh])

    useEffect(() => {
      if (switchValue === null) {
        setFilteredPCData(pcData)
        return
      }

      setFilteredPCData(
        pcData.filter((pc) => {
          return pc.state === switchValue
        }),
      )
    }, [switchValue])

    return (
      <>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: palette.primary400 }} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: "#fff",
              flexDirection: "column",
              display: "flex",
            }}
          >
            <View style={$containerIconMenu}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Menu")}
                activeOpacity={0.5}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="three-bars" type="octicon" color={"#FFF"} size={26} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.5}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="x" type="octicon" color={"#FFF"} size={26} />
              </TouchableOpacity>
            </View>

            {isLoadingData ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={palette.primary400} />
              </View>
            ) : (
              <>
                <ScrollView
                  horizontal={false}
                  style={{ flex: 1 }}
                  contentContainerStyle={$contentWrapper}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={$containerBackground}>
                    <LinearGradient
                      colors={[palette.primary400, palette.primary400]}
                      style={$background}
                    />
                  </View>

                  <Text text="Equipos usados" style={$title} />

                  <View style={$switchContainer}>
                    {switchButtons.map((button) => (
                      <TouchableOpacity
                        key={button.value}
                        onPress={() => handleSwitch(button.value)}
                        style={{
                          ...$switchButton,
                          backgroundColor:
                            switchValue === button.value && switchValue === "Entrada"
                              ? palette.secondary400
                              : switchValue === button.value && switchValue === "Salida"
                              ? palette.primary400
                              : "#FFF",
                        }}
                      >
                        <Icon
                          name={button.icon}
                          type="octicon"
                          color={switchValue === button.value ? "#FFF" : "#000"}
                          size={24}
                          style={{ marginBottom: 4 }}
                        />
                        <Text
                          text={button.label}
                          style={{
                            ...$labelButtonSwitch,
                            color: switchValue === button.value ? "#FFF" : "#000",
                          }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Input
                    autoComplete="off"
                    placeholder="Buscar por marca, modelo, número de serie u orden de compra"
                    placeholderTextColor="#000000AA"
                    containerStyle={{
                      borderRadius: 10,
                      paddingHorizontal: 0,
                    }}
                    keyboardType="default"
                    returnKeyType="search"
                    inputContainerStyle={{
                      backgroundColor: palette.primary100,
                      borderRadius: 10,
                      borderBottomColor: "transparent",
                      paddingHorizontal: 12,
                    }}
                    inputStyle={{
                      ...$text,
                      color: "#000",
                      fontSize: 14,
                    }}
                    leftIconContainerStyle={{ marginRight: 8 }}
                    leftIcon={<Icon name="search" type="octicon" color="#000000AA" />}
                    onChangeText={setSearch}
                    value={search}
                  />

                  <View style={$divider} />

                  <View style={$containerFilter}>
                    <Text text={`${filteredPCData?.length ?? 0} Resultados`} style={$labelSort} />
                  </View>

                  <View style={$cardWrapper}>
                    {filteredPCData?.map((item, index) => (
                      <PCCard
                        key={index}
                        card={item}
                        willRefresh={route.params?.willRefresh}
                        type="used"
                      />
                    ))}
                  </View>
                </ScrollView>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={$fab}
                  onPress={() =>
                    navigation.navigate("AddUsedPC", { willRefresh: route.params?.willRefresh })
                  }
                >
                  <Icon name="plus" type="octicon" color="#FFF" size={24} />
                </TouchableOpacity>
              </>
            )}
          </SafeAreaView>
        </KeyboardAvoidingView>
      </>
    )
  })

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
  height: Dimensions.get("window").height * 0.05,
}

const $background: ViewStyle = {
  width: Dimensions.get("window").width * 2,
  height: Dimensions.get("window").height * 0.3,
  borderBottomLeftRadius: 500,
  borderBottomRightRadius: 500,
}

const $containerIconMenu: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: 80,
  width: "100%",
  paddingHorizontal: 30,
  zIndex: 1,
  backgroundColor: palette.primary400,
}

const $title: TextStyle = {
  ...$text,
  ...$bold,
  fontSize: 24,
  color: "#FFF",
  textAlign: "center",
  marginBottom: 20,
}

const $contentWrapper: ViewStyle = {
  paddingTop: 30,
  paddingBottom: 50,
  paddingHorizontal: 20,
}

const $switchContainer: ViewStyle = {
  backgroundColor: "#FFF",
  borderRadius: 10,
  padding: 10,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  gap: 10,
  marginBottom: 20,

  shadowColor: palette.neutral300,
  shadowOffset: {
    width: 20,
    height: 20,
  },
  shadowOpacity: 0.1,
  shadowRadius: 20,
  elevation: 20,
}

const $switchButton: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  paddingVertical: 14,
  paddingHorizontal: 8,
  borderRadius: 10,
  width: "50%",
}

const $labelButtonSwitch: TextStyle = {
  ...$text,
  color: "#FFF",
  fontSize: 12,
  textAlign: "center",
}

const $divider: ViewStyle = {
  width: "100%",
  height: 3,
  backgroundColor: "#000",
  opacity: 0.05,
  borderRadius: 20,
  marginBottom: 20,
}

const $containerFilter: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginBottom: 20,
}

const $labelSort: TextStyle = {
  ...$text,
  fontSize: 14,
  color: "#000",
  lineHeight: 20,
}

const $cardWrapper: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}

const $fab: ViewStyle = {
  position: "absolute",
  bottom: 20,
  right: 20,
  zIndex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: palette.primary400,
  width: 60,
  height: 60,
  borderRadius: 50,
}
