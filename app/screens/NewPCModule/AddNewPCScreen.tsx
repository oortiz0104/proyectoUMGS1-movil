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

export const AddNewPCScreen: FC<StackScreenProps<AppStackParamList, "AddNewPC">> = observer(
  ({ navigation, route }) => {
    const [loading, setLoading] = useState(true)

    const [allValid, setAllValid] = useState(false)
    const [editForm, setEditForm] = useState(false)
    const [id, setID] = useState("")
    const [brand, setBrand] = useState("")
    const [model, setModel] = useState("")
    const [serialNumber, setSerialNumber] = useState("")
    const [purchaseOrder, setPurchaseOrder] = useState("")

    const [isModalUbicationsVisible, setIsModalUbicationsVisible] = useState(false)
    const [ubicationOptions, setUbicationOptions] = useState<option[]>([])
    const [ubication, setUbication] = useState<option>({
      value: null,
      label: "Selecciona una ubicación para el equipo",
    })

    const preFillData = async (pcData: PC) => {
      const { _id, brand, model, serialNumber, purchaseOrder, ubication } = pcData

      let newUbication: option = {
        value: ubication._id,
        label: `${ubication.cellarNumber} - ${ubication.shelve}`,
      }

      setEditForm(true)

      setID(_id)
      setBrand(brand)
      setModel(model)
      setSerialNumber(serialNumber)
      setPurchaseOrder(purchaseOrder)
      setUbication(newUbication)
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
      if (
        brand === "" ||
        model === "" ||
        serialNumber === "" ||
        purchaseOrder === "" ||
        ubication.value === null
      ) {
        alertRequiredFieldsNoTranslate({
          Marca: brand,
          Modelo: model,
          "Número de serie": serialNumber,
          "Orden de compra": purchaseOrder,
          Ubicación: ubication.value,
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

      if (brand.search(patterns.noSpecialCharacters)) {
        showErrorAlertField("Marca", "No se permiten caracteres especiales en el campo")

        return
      }

      if (model.search(patterns.genericField)) {
        showErrorAlertField("Modelo", "No se permiten caracteres especiales en el campo")

        return
      }

      if (serialNumber.search(patterns.onlyLettersAndNumbers)) {
        showErrorAlertField("Número de serie", "No se permiten caracteres especiales en el campo")

        return
      }

      if (purchaseOrder.search(patterns.genericField)) {
        showErrorAlertField("Orden de compra", "No se permiten caracteres especiales en el campo")

        return
      }

      setAllValid(true)

      if (editForm) {
        editPC()
      } else {
        submitPC()
      }
    }

    const editPC = async () => {
      setLoading(true)

      const response = await api.put(`${apiRoutes.newPC.updateNewPC}/${id}`, {
        brand: brand.trim(),
        model: model.trim(),
        serialNumber: serialNumber.trim(),
        purchaseOrder: purchaseOrder.trim(),
        ubication: ubication.value,
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

        navigation.navigate("NewPCInquiry", {
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

    const submitPC = async () => {
      setLoading(true)

      const response = await api.post(apiRoutes.newPC.checkIn, {
        brand: brand.trim(),
        model: model.trim(),
        serialNumber: serialNumber.trim(),
        purchaseOrder: purchaseOrder.trim(),
        ubication: ubication.value,
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
          navigation.navigate("NewPCInquiry", {
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
      if (route.params.pcData) {
        preFillData(route.params.pcData)
      }
    }, [loading])

    useEffect(() => {
      ;(async () => {
        let responseCellar = await api.get(apiRoutes.cellar.getNotOccupiedCellarUbications)

        if (responseCellar.status === 200) {
          let cellarOptions: option[] = responseCellar.data.cellars.map((cellar: ubication) => {
            return {
              value: cellar._id,
              label: `${cellar.cellarNumber} - ${cellar.shelve}`,
            }
          })

          setUbicationOptions(cellarOptions)
        } else {
          setUbicationOptions([])
        }
      })()
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
                  navigation.navigate("NewPCInquiry", { willRefresh: !route.params?.willRefresh })
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
                text={!editForm ? "Añadir equipo nuevo" : "Editar equipo nuevo"}
                style={$title}
              />

              <View style={$divider} />

              <Text text="Datos sobre el equipo" style={$subtitle} />

              <View style={$rowInput}>
                <View style={{ width: "100%" }}>
                  <Text text="Marca" style={$inputLabel} />
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
                    value={brand}
                    onChangeText={(value) => setBrand(removeEmojis(value))}
                  />
                </View>
              </View>

              <View style={$rowInput}>
                <View style={{ width: "100%" }}>
                  <Text text="Modelo" style={$inputLabel} />
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
                    value={model}
                    onChangeText={(value) => setModel(removeEmojis(value))}
                  />
                </View>
              </View>

              <View style={$rowInput}>
                <View style={{ width: "100%" }}>
                  <Text text="Código serial" style={$inputLabel} />
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
                      <Icon
                        name="barcode-outline"
                        type="ionicon"
                        color={palette.primary400}
                        size={18}
                      />
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
                    value={serialNumber}
                    onChangeText={(value) => setSerialNumber(removeEmojis(value))}
                  />
                </View>
              </View>

              <View style={$rowInput}>
                <View style={{ width: "100%" }}>
                  <Text text="Orden de compra" style={$inputLabel} />
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
                      <Icon name="log" type="octicon" color={palette.primary400} size={18} />
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
                    value={purchaseOrder}
                    onChangeText={(value) => setPurchaseOrder(removeEmojis(value))}
                  />
                </View>
              </View>

              <View style={$divider} />

              <Text text="Ubicación en bodega" style={$inputLabel} />
              <TouchableOpacity
                style={$pickerButton}
                activeOpacity={0.5}
                onPress={() => setIsModalUbicationsVisible(true)}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    testID="text_card_1"
                    text={ubication.label.toString()}
                    style={$optionButton}
                  />
                </View>

                <View
                  style={{
                    ...$iconButton,
                    justifyContent: "flex-end",
                  }}
                >
                  <Icon name="chevron-down" type="octicon" color={palette.primary400} size={16} />
                </View>
              </TouchableOpacity>

              <ModalPicker
                key={"modalUbications"}
                title="Ubicaciones"
                isVisible={isModalUbicationsVisible}
                setIsVisible={setIsModalUbicationsVisible}
                options={ubicationOptions}
                actualValue={ubication}
                setActualValue={setUbication}
              />
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
                  navigation.navigate("NewPCInquiry", { willRefresh: !route.params?.willRefresh })
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
