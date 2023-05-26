import { Dimensions, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { useState } from "react"
import { palette, spaceGrotesk, spacing } from "../theme"
import { Text } from "./Text"
import { Icon } from "@rneui/base"
import { normalizeString } from "../utils/miscellaneous"
import { User } from "app/utils/interfaces"
import { ModalUserActions } from "./Modals/ModalUserActions"

const { width, height } = Dimensions.get("window")

interface CardProps {
  card: User
  willRefresh: boolean
}

export const UserCard = (props: CardProps) => {
  const [isVisibleModal, setIsVisibleModal] = useState(false)
  const { card, willRefresh } = props

  return (
    <>
      <TouchableOpacity style={$card} activeOpacity={0.5} onPress={() => setIsVisibleModal(true)}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View>
            <Text text={`${card.name} ${card.surname}`} style={$textNameCard} numberOfLines={1} />
          </View>

          <View style={$verticalDivider} />

          <View>
            <Text text={card.email} style={$textInfoCard} />
            <Text text={card.phone} style={$textInfoCard} />
            <Text text={card.username} style={$textInfoCard} />
          </View>
        </View>
      </TouchableOpacity>

      <ModalUserActions
        isVisible={isVisibleModal}
        setIsVisible={setIsVisibleModal}
        userData={card}
        willRefresh={willRefresh}
      />
    </>
  )
}

const $text: TextStyle = {
  color: "#000",
  fontFamily: spaceGrotesk.normal,
}

const $bold: TextStyle = {
  fontFamily: spaceGrotesk.semiBold,
}

const $card: ViewStyle = {
  display: "flex",
  backgroundColor: "#fff",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  borderRadius: 10,
  paddingVertical: 14,
  paddingHorizontal: spacing.medium,
  marginBottom: spacing.medium,

  shadowColor: palette.neutral700,
  shadowOffset: {
    width: 20,
    height: 20,
  },
  shadowOpacity: 0.1,
  shadowRadius: 20,
  elevation: 20,
}

const $textNameCard: TextStyle = {
  ...$text,
  ...$bold,
  fontSize: 16,
  lineHeight: 20,
}

const $textInfoCard: TextStyle = {
  ...$text,
  fontSize: 14,
  opacity: 0.6,
  lineHeight: 16,
}

const $verticalDivider: ViewStyle = {
  width: 2,
  height: 20,
  backgroundColor: palette.accent500,
  opacity: 1,
  marginHorizontal: 10,
}
