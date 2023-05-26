import React, { createRef, useState } from "react"
import { View, TouchableOpacity, TextStyle, ViewStyle, Dimensions, ScrollView } from "react-native"
import Modal from "react-native-modal"
import { palette, spacing, typography } from "../../theme"
import { Text } from "../Text"

interface option {
  value: string | number
  label: string | number
}

interface ModalPickerProps {
  title?: string
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  options: option[]
  actualValue: { value: string | number; label: string | number }
  setActualValue: (actualValue: { value: string | number; label: string | number }) => void
}

export const ModalPicker = (props: ModalPickerProps) => {
  const { isVisible, setIsVisible, options, actualValue, setActualValue } = props
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
    >
      <View style={$centeredView}>
        <View style={$modalView}>
          <View style={$line} />

          {props.title && <Text style={$title} text={props.title} />}

          {props.title && <View style={$divider} />}

          <ScrollView
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%" }}
          >
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={$option}
                onPress={() => {
                  setActualValue(option)
                  closeModal()
                }}
              >
                <View
                  style={{
                    ...$radial,
                    backgroundColor: option.value === actualValue.value ? "#FFF" : "#C5C5C5",
                    borderColor:
                      option.value === actualValue.value ? palette.primary400 : "transparent",
                    borderWidth: 6,
                  }}
                />
                <Text style={$text}>{option.label}</Text>
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
  fontFamily: typography.fonts.spaceGrotesk.normal,
  lineHeight: 20,
}

const $bold: TextStyle = {
  fontFamily: typography.fonts.spaceGrotesk.semiBold,
}

const $centeredView: ViewStyle = {
  justifyContent: "flex-end",
}

const $title: TextStyle = {
  ...$text,
  ...$bold,
  fontSize: 18,
  marginBottom: 20,
  color: palette.primary400,
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

const $radial: ViewStyle = {
  width: 20,
  height: 20,
  borderRadius: 50,
  marginRight: spacing.medium,
}
