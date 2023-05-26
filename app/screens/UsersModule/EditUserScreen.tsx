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
import { delay } from "app/utils/delay"
import { MaskService } from "react-native-masked-text"

interface option {
  value: string | number
  label: string | number
}

export const EditUserScreen: FC<StackScreenProps<AppStackParamList, "EditUser">> = observer(
  ({ navigation, route }) => {
    const [loading, setLoading] = useState(true)

    const [allValid, setAllValid] = useState(false)

    const [id, setID] = useState("")
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("+502 ")

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
      if (
        name.trim() === "" ||
        surname.trim() === "" ||
        email.trim() === "" ||
        phone.trim() === ""
      ) {
        alertRequiredFieldsNoTranslate({
          Nombres: name,
          Apellidos: surname,
          "Correo electrónico": email,
          Teléfono: phone,
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

      if (name.search(patterns.noSpecialCharacters)) {
        showErrorAlertField("Nombres", "No se permiten caracteres especiales en el campo")

        return
      }

      if (surname.search(patterns.noSpecialCharacters)) {
        showErrorAlertField("Apellidos", "No se permiten caracteres especiales en el campo")

        return
      }

      if (email.search(patterns.email)) {
        showErrorAlertField("Correo electrónico", "Datos inválidos en el campo")

        return
      }

      if (phone.search(patterns.phone)) {
        showErrorAlertField("Teléfono", "Datos inválidos en el campo")

        return
      }

      setAllValid(true)

      submitUser()
    }

    const submitUser = async () => {
      setLoading(true)

      const response = await api.put(`${apiRoutes.user.update_OnlyAdmin}/${id}`, {
        name: name,
        surname: surname,
        email: email,
        phone: phone,
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
          navigation.navigate("UserInquiry", {
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
      setLoading(true)

      const { _id, name, surname, email, phone } = route.params?.userData

      setID(_id)
      setName(name)
      setSurname(surname)
      setEmail(email)
      setPhone(phone)
    }, [])

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
                  navigation.navigate("UserInquiry", { willRefresh: !route.params?.willRefresh })
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
              <Text text="Editar usuario" style={$title} />

              <View style={$divider} />

              <Text text="Datos del usuario" style={$subtitle} />

              <View style={$rowInput}>
                <View style={{ width: "100%" }}>
                  <Text text="Nombres" style={$inputLabel} />
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
                      <Icon name="person" type="octicon" color={palette.primary400} size={18} />
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
                    value={name}
                    onChangeText={(value) => setName(removeEmojis(value))}
                  />
                </View>
              </View>

              <View style={$rowInput}>
                <View style={{ width: "100%" }}>
                  <Text text="Apellidos" style={$inputLabel} />
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
                      <Icon name="person" type="octicon" color={palette.primary400} size={18} />
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
                    value={surname}
                    onChangeText={(value) => setSurname(removeEmojis(value))}
                  />
                </View>
              </View>

              <View style={$rowInput}>
                <View style={{ width: "100%" }}>
                  <Text text="Teléfono" style={$inputLabel} />
                  <Input
                    autoComplete="off"
                    keyboardType="phone-pad"
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
                      <Icon name="phone" type="feather" color={palette.primary400} size={18} />
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
                    value={phone}
                    onChangeText={(value) => {
                      value = removeEmojis(value)
                      value = MaskService.toMask("cel-phone", value, {
                        maskType: "BRL",
                        dddMask: "+502 ",
                      })

                      setPhone(value)
                    }}
                    maxLength={14}
                  />
                </View>
              </View>

              <View style={$rowInput}>
                <View style={{ width: "100%" }}>
                  <Text text="Correo" style={$inputLabel} />
                  <Input
                    autoComplete="off"
                    keyboardType="email-address"
                    autoCapitalize="none"
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
                      <Icon name="mention" type="octicon" color={palette.primary400} size={18} />
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
                    value={email}
                    onChangeText={(value) => setEmail(removeEmojis(value))}
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
                  navigation.navigate("UserInquiry", { willRefresh: !route.params?.willRefresh })
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
  },
)

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
