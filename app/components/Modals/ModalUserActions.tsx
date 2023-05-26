import { Icon } from "@rneui/base"
import React, { createRef, useState } from "react"
import {
  View,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
  Dimensions,
  ScrollView,
  Vibration,
} from "react-native"
import Modal from "react-native-modal"
import { palette, spaceGrotesk } from "../../theme"
import { User } from "../../utils/interfaces"
import { Text } from "../Text"
import { navigate } from "app/navigators"
import { api } from "app/services/api"
import apiRoutes from "app/services/api/apiRoutes"
import { Notifier, NotifierComponents } from "react-native-notifier"

interface ModalUserActionsProps {
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  userData: User
  willRefresh: boolean
}

export const ModalUserActions = (props: ModalUserActionsProps) => {
  const { isVisible, setIsVisible, userData, willRefresh } = props

  const customerOptionsList = [
    {
      iconName: "pencil",
      iconType: "octicon",
      title: "Editar información",
      onPress: () => {
        Vibration.vibrate(1000)
        closeModal()
        navigate({
          name: "EditUser",
          params: {
            willRefresh: willRefresh,
            userData,
          },
        })
      },
    },
    {
      iconName: "trash",
      iconType: "octicon",
      title: "Eliminar",
      onPress: async () => {
        Vibration.vibrate(1000)
        let response = await api.delete(`${apiRoutes.user.delete_OnlyAdmin}/${userData._id}`)

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

          closeModal()
          navigate({
            name: "UserInquiry",
            params: {
              willRefresh: !willRefresh,
            },
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
      },
    },
  ]

  const [scrollOffset, setScrollOffset] = useState(null)
  const scrollViewRef = createRef<ScrollView>()

  const closeModal = () => {
    setIsVisible(false)
  }

  const handleOnScroll = (event: any) => {
    setScrollOffset(event.nativeEvent.contentOffset.y)
  }

  const handleScrollTo = (p: any) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p)
    }
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      animationIn="slideInUp"
      style={{
        justifyContent: "flex-end",
        margin: 0,
      }}
      swipeDirection={["down"]}
      onSwipeComplete={closeModal}
      useNativeDriverForBackdrop
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={Dimensions.get("window").height * 0.8}
      propagateSwipe={true}
      backdropOpacity={0.2}
    >
      <View style={$centeredView}>
        <View style={$modalView}>
          <View style={$line} />

          <View style={$headerContainer}>
            <Text style={$header} text={`${userData.name} ${userData.surname}`} />
          </View>

          <View style={$divider} />

          <ScrollView
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%" }}
          >
            {customerOptionsList.map(({ title, iconType, iconName, onPress }, index) => (
              <TouchableOpacity
                key={index}
                style={$option}
                onLongPress={onPress}
                delayLongPress={750}
                onPress={() => {
                  Vibration.vibrate(200)

                  Notifier.showNotification({
                    title: "Por favor, mantenga presionado el botón para realizar esta acción.",
                    duration: 2000,
                    showAnimationDuration: 800,
                    Component: NotifierComponents.Alert,
                    componentProps: {
                      alertType: "error",
                    },
                  })
                }}
              >
                <Icon
                  name={iconName}
                  type={iconType}
                  color={palette.primary400}
                  size={25}
                  style={{
                    width: 25,
                  }}
                />
                <Text style={{ ...$text, marginLeft: 20 }}>{title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const $text: TextStyle = {
  color: "#000",
  fontFamily: spaceGrotesk.normal,
  lineHeight: 20,
}

const $bold: TextStyle = {
  fontFamily: spaceGrotesk.semiBold,
}

const $centeredView: ViewStyle = {
  justifyContent: "flex-end",
}

const $modalView: ViewStyle = {
  backgroundColor: "#FFF",
  alignItems: "center",
  borderRadius: 20,
  paddingBottom: 30,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  paddingHorizontal: 20,
  maxHeight: Dimensions.get("window").height * 0.8,
}

const $line: ViewStyle = {
  width: "20%",
  height: 5,
  backgroundColor: palette.primary400,
  marginVertical: 20,
  borderRadius: 10,
}

const $divider: ViewStyle = {
  width: "100%",
  height: 2,
  backgroundColor: "#000",
  opacity: 0.05,
  borderRadius: 20,
  marginBottom: 20,
}

const $option: ViewStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  marginBottom: 5,
  paddingVertical: 10,
}

const $headerContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
}

const $header: TextStyle = {
  ...$bold,
  fontSize: 18,
  color: "#000",
}
