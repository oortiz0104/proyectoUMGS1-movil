import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Text } from "../components"
import { AppStackParamList } from "../navigators"
import { colors, spacing, typography } from "../theme"
import { Button, Icon, Input } from "@rneui/base"
import { StackScreenProps } from "@react-navigation/stack"
import { api } from "../services/api"
import apiRoutes from "../services/api/apiRoutes"
import { patterns } from "../utils/regexPatterns"
import { Notifier, NotifierComponents } from "react-native-notifier"
import NetInfo from "@react-native-community/netinfo"
import { ScrollView } from "react-native-gesture-handler"
import { delay } from "../utils/delay"
import { alertRequiredFieldsNoTranslate, removeEmojis } from "../utils/miscellaneous"
import { isSignedIn } from "app/utils/session"
import { Reactotron } from "app/services/reactotron/reactotronClient"
import { save } from "app/utils/storage"

export const LoginScreen: FC<StackScreenProps<AppStackParamList, "Login">> = observer(
  ({ navigation }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [allValid, setAllValid] = useState(false)

    const [loading, setLoading] = useState(false)

    const isLoggedIn = async () => {
      try {
        let connection = await NetInfo.fetch()

        if (!connection.isConnected) {
          Notifier.showNotification({
            title: "No hay conexión a internet",
            description: "Por favor, conéctese a internet y vuelva a intentarlo",
            duration: 5000,
            showAnimationDuration: 800,
            Component: NotifierComponents.Alert,
            componentProps: {
              alertType: "error",
            },
          })
          setLoading(false)
          setAllValid(false)

          return
        }

        const res = await isSignedIn()
        if (res) {
          setLoading(true)
          navigation.navigate("Home")
        }
        setLoading(false)
      } catch (err) {
        Notifier.showNotification({
          title: "Hubo un error al intentar iniciar sesión",
          duration: 5000,
          showAnimationDuration: 800,
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "error",
          },
        })
      }
    }

    const validateLogin = async () => {
      setLoading(true)
      let connection = await NetInfo.fetch()

      // Validar que los campos no estén vacíos no estén vacíos.
      if (username.trim() === "" || password.trim() === "") {
        alertRequiredFieldsNoTranslate({
          "Nombre de usuario": username,
          Contraseña: password,
        }).then((message) => {
          Notifier.showNotification({
            title: message,
            description: "Por favor, complete todos los campos",
            duration: 5000,
            showAnimationDuration: 800,
            Component: NotifierComponents.Alert,
            componentProps: {
              alertType: "error",
            },
          })
        })

        setLoading(false)
        setAllValid(false)

        return
      }

      if (username.search(patterns.username)) {
        Notifier.showNotification({
          title: "Usuario inválido",
          duration: 5000,
          showAnimationDuration: 800,
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "error",
          },
        })
        setLoading(false)
        setAllValid(false)

        return
      }

      if (!connection.isConnected) {
        Notifier.showNotification({
          title: "No hay conexión a internet",
          description: "Por favor, conéctese a internet y vuelva a intentarlo",
          duration: 5000,
          showAnimationDuration: 800,
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "error",
          },
        })
        setLoading(false)
        setAllValid(false)

        return
      }

      setAllValid(true)
      submit()
    }

    const submit = async () => {
      try {
        let response = await api.post(apiRoutes.user.login, {
          username: username,
          password: password,
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

          await save("identity", response.data.checkUser)
          await save("token", response.data.token)

          setAllValid(true)
          setLoading(false)

          delay(1000).then(() => {
            navigation.navigate("Home")

            setUsername("")
            setPassword("")
            setShowPassword(false)
            setAllValid(false)
          })
          return
        }

        Notifier.showNotification({
          title: response.data.message,
          duration: 2000,
          showAnimationDuration: 800,
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "error",
          },
        })

        setLoading(false)
        setAllValid(false)
      } catch (error) {
        Notifier.showNotification({
          title: error,
          duration: 2000,
          showAnimationDuration: 800,
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "error",
          },
        })
      }
    }

    useEffect(() => {
      isLoggedIn()
    }, [])

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 32,
              flex: 1,
            }}
            contentContainerStyle={{
              justifyContent: "center",
              paddingTop: 250,
              paddingBottom: 20,
            }}
          >
            <Text text="Iniciar sesión" style={$header} />

            <View>
              <Text text="Nombre de usuario" style={$label} />
              <Input
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={{
                  borderRadius: 10,
                  paddingHorizontal: 0,
                  height: 50,
                  marginBottom: 20,
                  borderColor: allValid ? "transparent" : colors.palette.primary400,
                  backgroundColor: allValid ? colors.palette.primary100 : "transparent",
                  borderWidth: 2,
                }}
                inputContainerStyle={{
                  borderRadius: 10,
                  borderBottomColor: "transparent",
                  paddingHorizontal: 8,
                }}
                inputStyle={{
                  ...$text,
                  color: "#000",
                  fontSize: 14,
                }}
                leftIcon={
                  <Icon name="person" type="octicon" color={colors.palette.primary400} size={18} />
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
                value={username}
                onChangeText={(value) => setUsername(removeEmojis(value))}
              />
            </View>

            <View>
              <Text text="Contraseña" style={$label} />
              <Input
                autoComplete="off"
                secureTextEntry={!showPassword}
                containerStyle={{
                  borderRadius: 10,
                  paddingHorizontal: 0,
                  height: 50,
                  marginBottom: 20,
                  borderColor: allValid ? "transparent" : colors.palette.primary400,
                  backgroundColor: allValid ? colors.palette.primary100 : "transparent",
                  borderWidth: 2,
                }}
                inputContainerStyle={{
                  borderRadius: 10,
                  borderBottomColor: "transparent",
                  paddingHorizontal: 8,
                }}
                inputStyle={{
                  ...$text,
                  color: "#000",
                  fontSize: 14,
                }}
                leftIcon={
                  <Icon name="lock" type="octicon" color={colors.palette.primary400} size={18} />
                }
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <Icon name="eye" type="octicon" color={colors.palette.primary400} size={18} />
                    ) : (
                      <Icon
                        name="eye-closed"
                        type="octicon"
                        color={colors.palette.primary400}
                        size={18}
                      />
                    )}
                  </TouchableOpacity>
                }
                value={password}
                onChangeText={(value) => setPassword(removeEmojis(value))}
              />
            </View>

            <Button
              title={loading ? <ActivityIndicator size="small" color="#fff" /> : "Iniciar sesión"}
              titleStyle={{ ...$text, color: "#fff" }}
              buttonStyle={{
                borderRadius: 10,
                backgroundColor: colors.palette.primary400,
                paddingVertical: 16,
              }}
              containerStyle={{ borderRadius: 10 }}
              disabled={loading}
              disabledStyle={{ backgroundColor: colors.palette.primary400 }}
              onPress={validateLogin}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  },
)

const $text: TextStyle = {
  color: "#000",
  fontFamily: typography.primary.normal,
}

const $bold: TextStyle = {
  fontFamily: typography.fonts.spaceGrotesk.semiBold,
}

const $label: TextStyle = {
  ...$text,
  fontSize: 14,
  marginBottom: 8,
}

const $header: TextStyle = {
  ...$bold,
  fontSize: 24,
  color: colors.palette.primary400,
  marginBottom: 20,
}
