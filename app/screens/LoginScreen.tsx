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
import { AppStackParamList, AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { Button, Icon, Input } from "@rneui/base"
import i18n from "i18n-js"
import { DEFAULT_API_CONFIG, api } from "../services/api"
import { load, remove, save } from "../utils/storage"
import { patterns } from "../utils/regexPatterns"
import { Notifier, NotifierComponents } from "react-native-notifier"
import NetInfo from "@react-native-community/netinfo"
import moment from "moment"
import { ScrollView } from "react-native-gesture-handler"
import { delay } from "../utils/delay"
import { alertRequiredFields, removeEmojis } from "../utils/miscellaneous"

export const LoginScreen: FC<AppStackScreenProps<AppStackParamList, "Login">> = observer(
  ({ navigation }) => {
    const [pin, setPin] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [allValid, setAllValid] = useState(false)

    const [loading, setLoading] = useState(false)
    const [expresiones, setExpresiones] = useState({})

    const isTenantConfigured = async () => {
      try {
        const tenantCode = await load("tenantCode")
        const tenantURL = await load("tenantURL")

        if (tenantCode && tenantURL) {
          DEFAULT_API_CONFIG.url = tenantURL

          return isLogin()
        }

        setLoading(false)
        navigation.navigate("Tenant")
      } catch (err) {
        Notifier.showNotification({
          title: i18n.translate("ALERTS.LOG_IN.PROBLEM"),
          duration: 5000,
          showAnimationDuration: 800,
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "error",
          },
        })
      }
    }

    const isLogin = async () => {
      try {
        const res = await isSignedIn()
        if (res) {
          setLoading(true)
          navigation.navigate("Home")
        }
        setLoading(false)
      } catch (err) {
        Notifier.showNotification({
          title: i18n.translate("ALERTS.LOG_IN.PROBLEM"),
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
      if (email.trim() === "" || password.trim() === "" || pin.trim() === "") {
        alertRequiredFields({
          PIN: pin,
          EMAIL: email,
          PASSWORD: password,
        }).then((message) => {
          Notifier.showNotification({
            title: message,
            description: i18n.translate("ALERTS.COMMONS.ALL_FIELDS_REQUIRED_DESCRIPTION"),
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

      if (pin.search(patterns.pin)) {
        Notifier.showNotification({
          title: i18n.translate("ALERTS.LOG_IN.NOT_VALID_PIN"),
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

      if (email.search(patterns.email)) {
        Notifier.showNotification({
          title: i18n.translate("ALERTS.LOG_IN.NOT_VALID_EMAIL"),
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
          title: i18n.translate("ALERTS.COMMONS.NO_INTERNET_TITLE"),
          description: i18n.translate("ALERTS.COMMONS.NO_INTERNET_DESCRIPTION"),
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
        let fcmT = await messaging().getToken()

        let response = await api.postLogin(apiRoutes.apiSrvAuth, {
          username: email,
          password: password,
          grant_type: "password",
          scope: `${pin.toUpperCase()} APP ${fcmT}`,
        })

        if (response.error) {
          if (response.error.includes("bloqueado")) {
            Notifier.showNotification({
              title: i18n.translate("ALERTS.LOG_IN.INVALID_AUTHORIZATION_TITLE"),
              description: i18n.translate("ALERTS.LOG_IN.INVALID_AUTHORIZATION_DESCRIPTION"),
              duration: 5000,
              showAnimationDuration: 800,
              Component: NotifierComponents.Alert,
              componentProps: {
                alertType: "error",
              },
            })
            setLoading(false)
            return
          }

          if (response.error === "") {
            Notifier.showNotification({
              title: i18n.translate("ALERTS.COMMONS.UNEXPECTED_ERROR_TITLE"),
              description: i18n.translate("ALERTS.COMMONS.UNEXPECTED_ERROR_DESCRIPTION"),
              duration: 5000,
              showAnimationDuration: 800,
              Component: NotifierComponents.Alert,
              componentProps: {
                alertType: "error",
              },
            })
            setLoading(false)
            return
          }

          if (response.error) {
            Notifier.showNotification({
              title: response.error,
              duration: 5000,
              showAnimationDuration: 800,
              Component: NotifierComponents.Alert,
              componentProps: {
                alertType: "error",
              },
            })
            setLoading(false)
            return
          }
        }

        let timeToken = moment().add(response.expires_in - 10, "s")

        await save("access_token", response.access_token)
        await save("expires_in", response.expires_in)
        await save("token_type", response.token_type)
        await save("refresh_token", response.refresh_token)
        await save("user", email)
        await save("password", password)
        await save("pinUser", pin)
        await save("time_exp", timeToken)

        let info = await api.get(apiRoutes.apiSrvUserAuthenticated)

        await save("info_user", info.data)

        if (info?.data?.Caduco_contrasenia) {
          Notifier.showNotification({
            title: i18n.translate("ALERTS.LOG_IN.PASSWORD_EXPIRED_TITLE"),
            description: i18n.translate("ALERTS.LOG_IN.PASSWORD_EXPIRED_DESCRIPTION"),
            duration: 5000,
            showAnimationDuration: 800,
            Component: NotifierComponents.Alert,
            componentProps: {
              alertType: "error",
            },
          })

          await remove("access_token")
          await remove("refresh_token")
          await remove("time_exp")

          setLoading(false)

          return
        }

        setAllValid(true)
        setLoading(false)

        delay(1000).then(() => {
          navigation.navigate("Home")

          setPin("")
          setEmail("")
          setPassword("")
          setShowPassword(false)
          setAllValid(false)
        })
      } catch (error) {
        console.log("🚀 ~ file: LoginScreen.tsx:280 ~ submit ~ error:", error)
        Notifier.showNotification({
          title: error,
          duration: 0,
          showAnimationDuration: 800,
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "error",
          },
        })
      }
    }

    useEffect(() => {
      ;(async () => {
        let response = await api.get(apiRoutes.apiSrvGetInicioSesionER)
        setExpresiones(response)

        const authStatus = await messaging().requestPermission()
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL

        if (enabled) {
          console.log("Authorization status:", authStatus)
        }

        return isTenantConfigured()
      })()
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
              paddingHorizontal: spacing.extraLarge,
              flex: 1,
            }}
            contentContainerStyle={{
              justifyContent: "center",
              minHeight: Dimensions.get("window").height,
            }}
          >
            <View style={$logo}>
              <CoveloHorizontal />
            </View>
            <Text testID="login-heading" tx="COMMONS.LABELS.LOG_IN" style={$header} />

            <View>
              <Text testID="login-pin-label" tx="COMMONS.LABELS.PIN" style={$label} />
              <Input
                autoComplete="off"
                containerStyle={{
                  borderRadius: 10,
                  paddingHorizontal: 0,
                  height: 50,
                  marginBottom: spacing.medium,
                  borderColor: allValid ? "transparent" : colors.paletteCovelo.primary,
                  backgroundColor: allValid && "#F1F3FF",
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
                  fontSize: 14,
                  textTransform: "uppercase",
                }}
                leftIcon={
                  <Icon name="hash" type="octicon" color={paletteCovelo.primary} size={18} />
                }
                rightIcon={
                  allValid && (
                    <Icon
                      name="check-circle-fill"
                      type="octicon"
                      color={paletteCovelo.primary}
                      size={18}
                    />
                  )
                }
                maxLength={6}
                autoCapitalize="characters"
                value={pin}
                onChangeText={(value) => {
                  setPin(removeEmojis(value).replace(/\s/g, ""))
                }}
              />
            </View>

            <View>
              <Text testID="login-email-label" tx="COMMONS.LABELS.EMAIL" style={$label} />
              <Input
                autoComplete="off"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={{
                  borderRadius: 10,
                  paddingHorizontal: 0,
                  height: 50,
                  marginBottom: spacing.medium,
                  borderColor: allValid ? "transparent" : colors.paletteCovelo.primary,
                  backgroundColor: allValid && "#F1F3FF",
                  borderWidth: 2,
                }}
                inputContainerStyle={{
                  borderRadius: 10,
                  borderBottomColor: "transparent",
                  paddingHorizontal: spacing.small,
                }}
                inputStyle={{
                  ...$text,
                  color: "#000",
                  fontSize: 14,
                }}
                leftIcon={
                  <Icon name="mail" type="octicon" color={paletteCovelo.primary} size={18} />
                }
                rightIcon={
                  allValid && (
                    <Icon
                      name="check-circle-fill"
                      type="octicon"
                      color={paletteCovelo.primary}
                      size={18}
                    />
                  )
                }
                value={email}
                onChangeText={(value) => setEmail(removeEmojis(value))}
              />
            </View>

            <View>
              <Text testID="login-password-label" tx="COMMONS.LABELS.PASSWORD" style={$label} />
              <Input
                autoComplete="off"
                secureTextEntry={!showPassword}
                containerStyle={{
                  borderRadius: 10,
                  paddingHorizontal: 0,
                  height: 50,
                  borderColor: allValid ? "transparent" : colors.paletteCovelo.primary,
                  backgroundColor: allValid && "#F1F3FF",
                  borderWidth: 2,
                }}
                inputContainerStyle={{
                  borderRadius: 10,
                  borderBottomColor: "transparent",
                  paddingHorizontal: spacing.small,
                }}
                inputStyle={{
                  ...$text,
                  color: "#000",
                  fontSize: 14,
                }}
                leftIcon={
                  <Icon name="lock" type="octicon" color={paletteCovelo.primary} size={18} />
                }
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <Icon name="eye" type="octicon" color={paletteCovelo.primary} size={18} />
                    ) : (
                      <Icon
                        name="eye-closed"
                        type="octicon"
                        color={paletteCovelo.primary}
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
              title={i18n.translate("COMMONS.LABELS.FORGOT_PASSWORD")}
              titleStyle={{ ...$text, color: "#000", opacity: 0.5 }}
              size="sm"
              type="clear"
              // onPress={changePassword}
              buttonStyle={{
                borderRadius: 10,
              }}
              containerStyle={{
                borderRadius: 10,
                marginVertical: spacing.medium,
              }}
              disabled={loading}
              disabledStyle={{ backgroundColor: paletteCovelo.secondary, opacity: 0.2 }}
              disabledTitleStyle={{ ...$text, color: "#000", opacity: 1 }}
            />

            <Button
              title={
                loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  i18n.translate("COMMONS.ACTIONS.LOG_IN")
                )
              }
              titleStyle={{ ...$text, color: "#fff" }}
              buttonStyle={{
                borderRadius: 10,
                backgroundColor: paletteCovelo.primary,
                paddingVertical: spacing.medium,
              }}
              containerStyle={{ borderRadius: 10 }}
              disabled={loading}
              disabledStyle={{ backgroundColor: paletteCovelo.primary }}
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
  fontFamily: "notoSansRegular",
}

const $bold: TextStyle = {
  fontFamily: notoSans.semiBold,
}

const $logo: ViewStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: spacing.massive,
}

const $label: TextStyle = {
  ...$text,
  fontSize: 14,
  marginBottom: spacing.extraSmall,
}

const $header: TextStyle = {
  fontSize: 24,
  fontFamily: "notoSansBold",
  color: colors.paletteCovelo.primary,
  marginBottom: spacing.medium,
}
