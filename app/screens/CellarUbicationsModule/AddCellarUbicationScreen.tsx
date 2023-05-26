import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import {
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
import { colors, palette, spaceGrotesk, spacing } from "../../theme"
import { StackScreenProps } from "@react-navigation/stack"
import { Button, Icon, Input } from "@rneui/base"
import { ScrollView } from "react-native-gesture-handler"
import { ModalPicker, Text } from "../../components"
import { Notifier, NotifierComponents } from "react-native-notifier"
import { patterns } from "../../utils/regexPatterns"
import { alertRequiredFieldsNoTranslate, removeEmojis } from "../../utils/miscellaneous"
import { api } from "../../services/api"
import apiRoutes from "../../services/api/apiRoutes"
import { PC, ubication } from "app/utils/interfaces"
import { delay } from "app/utils/delay"

interface option {
  value: string | number
  label: string | number
}

export const AddCellarUbicationScreen: FC<
  StackScreenProps<AppStackParamList, "AddCellarUbication">
> = observer(({ navigation, route }) => {
  const [loading, setLoading] = useState(true)

  const [allValid, setAllValid] = useState(false)
  const [editForm, setEditForm] = useState(false)
  const [id, setID] = useState("")
  const [cellarNumber, setCellarNumber] = useState("")
  const [shelve, setShelve] = useState("")

  const preFillData = async (cellarData: ubication) => {
    const { _id, cellarNumber, shelve } = cellarData

    setEditForm(true)

    setID(_id)
    setCellarNumber(cellarNumber.toString())
    setShelve(shelve)
    setLoading(false)
  }

  const showErrorAlertField = (
    field: string,
    type: "Datos inválidos en el campo" | "No se permiten caracteres especiales en el campo",
  ) => {
    Notifier.showNotification({
      title: `${type} ${field}`,
      description: `Por favor, revisa el campo ${field} e intenta nuevamente.`,
      duration: 5000,
      showAnimationDuration: 800,
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: "error",
      },
    })
  }

  const validateForm = () => {
    if (cellarNumber === null || parseInt(cellarNumber) === 0 || shelve === "") {
      alertRequiredFieldsNoTranslate({
        "Número de bodega": cellarNumber,
        Estante: shelve,
      }).then((message) => {
        Notifier.showNotification({
          title: message,
          description: "Todos los campos son obligatorios.",
          duration: 5000,
          showAnimationDuration: 800,
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "error",
          },
        })
      })
      return
    }

    if (
      cellarNumber.toString().search(patterns.onlyNumbers) ||
      cellarNumber.toString().length > 3
    ) {
      showErrorAlertField("Número de bodega", "Datos inválidos en el campo")

      return
    }

    if (shelve.search(patterns.onlyLettersAndNumbers)) {
      showErrorAlertField("Estante", "Datos inválidos en el campo")

      return
    }

    setAllValid(true)

    if (editForm) {
      editCellar()
    } else {
      submitCellar()
    }
  }

  const editCellar = async () => {
    setLoading(true)

    const response = await api.put(`${apiRoutes.cellar.updateCellarUbication}/${id}`, {
      cellarNumber: parseInt(cellarNumber),
      shelve: shelve.trim(),
    })

    if (response.status === 200) {
      Notifier.showNotification({
        title: response.data.message,
        duration: 2000,
        showAnimationDuration: 800,
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: "success",
        },
      })

      setAllValid(true)
      setLoading(false)

      navigation.navigate("CellarUbicationsInquiry", {
        willRefresh: !route.params?.willRefresh,
      })
      setAllValid(false)
      return
    }

    setAllValid(false)
    setLoading(false)

    Notifier.showNotification({
      title: response.data.message,
      duration: 2000,
      showAnimationDuration: 800,
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: "error",
      },
    })
  }

  const submitCellar = async () => {
    setLoading(true)

    const response = await api.post(apiRoutes.cellar.add, {
      cellarNumber: parseInt(cellarNumber),
      shelve: shelve.trim(),
    })

    if (response.status === 200) {
      Notifier.showNotification({
        title: response.data.message,
        duration: 2000,
        showAnimationDuration: 800,
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: "success",
        },
      })

      setAllValid(true)
      setLoading(false)

      delay(1000).then(() => {
        navigation.navigate("CellarUbicationsInquiry", {
          willRefresh: !route.params?.willRefresh,
        })
        setAllValid(false)
      })
      return
    }

    setLoading(false)
    setAllValid(false)

    Notifier.showNotification({
      title: response.data.message,
      duration: 2000,
      showAnimationDuration: 800,
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: "error",
      },
    })
  }

  useEffect(() => {
    if (route.params.cellarUbicationData) {
      preFillData(route.params.cellarUbicationData)
    }
  }, [loading])

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
          <View style={$containerNavbar}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Menu")}
              activeOpacity={0.5}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="three-bars" type="octicon" color={"#FFF"} size={26} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CellarUbicationsInquiry", {
                  willRefresh: !route.params?.willRefresh,
                })
              }
              activeOpacity={0.5}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="x" type="octicon" color={"#FFF"} size={26} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal={false}
            style={{ flex: 1 }}
            contentContainerStyle={$contentWrapper}
            showsVerticalScrollIndicator={false}
          >
            <Text
              text={!editForm ? "Añadir ubicación en bodega" : "Editar ubicación en bodega"}
              style={$title}
            />

            <View style={$divider} />

            <Text text="Datos" style={$subtitle} />

            <View style={$rowInput}>
              <View style={{ width: "100%" }}>
                <Text text="Bodega" style={$inputLabel} />
                <Input
                  autoComplete="off"
                  keyboardType="default"
                  autoCapitalize="characters"
                  containerStyle={{
                    borderRadius: 10,
                    paddingHorizontal: 0,
                    height: 50,
                    borderColor: allValid ? "transparent" : palette.primary400,
                    backgroundColor: allValid ? palette.primary100 : "transparent",
                    borderWidth: 2,
                  }}
                  inputContainerStyle={{
                    borderRadius: 10,
                    borderBottomColor: "transparent",
                    paddingHorizontal: spacing.small,
                    display: "flex",
                  }}
                  inputStyle={{
                    ...$text,
                    color: "#000",
                    lineHeight: 22,
                  }}
                  leftIcon={
                    <Icon name="info" type="octicon" color={palette.primary400} size={18} />
                  }
                  rightIcon={
                    allValid && (
                      <Icon
                        name="check-circle-fill"
                        type="octicon"
                        color={colors.palette.primary400}
                        size={18}
                      />
                    )
                  }
                  value={cellarNumber}
                  onChangeText={(value) => setCellarNumber(removeEmojis(value))}
                  maxLength={2}
                />
              </View>
            </View>

            <View style={$rowInput}>
              <View style={{ width: "100%" }}>
                <Text text="Estantería" style={$inputLabel} />
                <Input
                  autoComplete="off"
                  keyboardType="default"
                  containerStyle={{
                    borderRadius: 10,
                    paddingHorizontal: 0,
                    height: 50,
                    borderColor: allValid ? "transparent" : palette.primary400,
                    backgroundColor: allValid ? palette.primary100 : "transparent",
                    borderWidth: 2,
                  }}
                  inputContainerStyle={{
                    borderRadius: 10,
                    borderBottomColor: "transparent",
                    paddingHorizontal: spacing.small,
                    display: "flex",
                  }}
                  inputStyle={{
                    ...$text,
                    color: "#000",
                    lineHeight: 22,
                  }}
                  leftIcon={
                    <Icon name="info" type="octicon" color={palette.primary400} size={18} />
                  }
                  rightIcon={
                    allValid && (
                      <Icon
                        name="check-circle-fill"
                        type="octicon"
                        color={colors.palette.primary400}
                        size={18}
                      />
                    )
                  }
                  value={shelve}
                  onChangeText={(value) => setShelve(removeEmojis(value))}
                />
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              position: "absolute",
              bottom: 20,
              width: "100%",
              paddingHorizontal: spacing.medium + spacing.tiny,
              paddingBottom: spacing.medium + spacing.tiny,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button
              buttonStyle={{
                borderRadius: 10,
                backgroundColor: "#FFF",
                borderWidth: 2,
                borderColor: palette.primary400,
                paddingVertical: spacing.medium,
                paddingHorizontal: spacing.medium + spacing.extraSmall,
              }}
              icon={<Icon name="chevron-left" type="octicon" color={palette.primary400} />}
              containerStyle={{
                flexShrink: 1,
              }}
              onPress={() =>
                navigation.navigate("CellarUbicationsInquiry", { willRefresh: !route.params?.willRefresh })
              }
            />

            <Button
              title="Guardar"
              titleStyle={{ ...$text, color: "#fff" }}
              buttonStyle={{
                borderRadius: 10,
                backgroundColor: palette.primary400,
                paddingVertical: spacing.medium,
              }}
              containerStyle={{
                flexGrow: 1,
                paddingLeft: spacing.medium + spacing.tiny,
              }}
              onPress={validateForm}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  )
})

const $text: TextStyle = {
  color: "#000",
  fontFamily: spaceGrotesk.normal,
}

const $bold: TextStyle = {
  fontFamily: spaceGrotesk.semiBold,
}

const $containerNavbar: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: 80,
  width: "100%",
  paddingHorizontal: 30,
  backgroundColor: palette.primary400,
}

const $contentWrapper: ViewStyle = {
  paddingHorizontal: spacing.medium + spacing.tiny,
  paddingTop: 30,
  paddingBottom: 100,
}

const $divider: ViewStyle = {
  width: "100%",
  height: 3,
  backgroundColor: "#000",
  opacity: 0.05,
  borderRadius: 20,
  marginBottom: 20,
}

const $title: TextStyle = {
  ...$text,
  ...$bold,
  fontSize: 24,
  color: palette.primary400,
  marginBottom: 20,
}

const $subtitle: TextStyle = {
  ...$title,
  fontSize: 18,
  color: "#16171C",
}

const $pickerButton: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",

  width: "100%",
  minHeight: 60,
  backgroundColor: palette.primary100,
  borderRadius: 10,

  paddingVertical: spacing.small,
  paddingHorizontal: spacing.large,
  marginBottom: 20,
}

const $iconButton: ViewStyle = {
  width: 40,
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
}

const $optionButton: TextStyle = {
  ...$text,
  color: "#000",
  fontSize: 14,
  lineHeight: 16,
}

const $rowInput: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  marginBottom: 20,
}

const $inputLabel: TextStyle = {
  ...$text,
  fontSize: 14,
  marginBottom: 8,
}
