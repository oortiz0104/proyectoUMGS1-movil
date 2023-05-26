import { Dimensions, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import React from "react"
import { colors, spacing, typography } from "../theme"
import { Text } from "./Text"
import { Icon } from "@rneui/base"

const { width, height } = Dimensions.get("window")

export interface CardProps {
  index: number
  card: {
    icon: string
    title: string
    text: string
    onPress: () => void
  }
}

export const HomeCard = (props: CardProps) => {
  const { index, card } = props

  return (
    <TouchableOpacity style={$card} key={index} activeOpacity={0.5} onPress={card.onPress}>
      <View
        style={{
          ...$iconCard,
          backgroundColor:
            index === 0 || index === 3 || index === 4
              ? `${colors.palette.primary400}26`
              : `${colors.palette.secondary400}26`,
        }}
      >
        <Icon name={card.icon} type="octicon" size={20} />
      </View>

      <View>
        <Text testID="title_card_1" text={card.title} style={$titleCard} />

        <Text testID="text_card_1" text={card.text} style={$textCard} />
      </View>
    </TouchableOpacity>
  )
}

const $text: TextStyle = {
  color: "#000",
  fontFamily: typography.fonts.spaceGrotesk.normal,
}

const $bold: TextStyle = {
  fontFamily: typography.fonts.spaceGrotesk.semiBold,
}

const $card: ViewStyle = {
  width: width * 0.417,
  minHeight: height * 0.21625,
  backgroundColor: "#fff",
  borderRadius: 20,
  paddingVertical: spacing.large + spacing.micro,
  paddingHorizontal: spacing.medium,
  marginBottom: spacing.medium + spacing.tiny,

  shadowColor: "#001A5F",
  shadowOffset: {
    width: 20,
    height: 20,
  },
  shadowOpacity: 0.1,
  shadowRadius: 20,
  elevation: 20,
}

const $iconCard: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: spacing.extraSmall,
}

const $titleCard: TextStyle = {
  ...$text,
  ...$bold,
  fontSize: 16,
  marginBottom: spacing.extraSmall,
}

const $textCard: TextStyle = {
  ...$text,
  fontSize: 16,
}
