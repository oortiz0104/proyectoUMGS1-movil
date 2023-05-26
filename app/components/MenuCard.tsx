import { Dimensions, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import React from "react"
import { spaceGrotesk, spacing } from "../theme"
import { Text } from "./Text"
import { Icon } from "@rneui/base"
import { StackNavigationProp } from "@react-navigation/stack"
import { AppStackParamList } from "../navigators"

const { width, height } = Dimensions.get("window")

interface CardProps {
  card: {
    icon: string
    title: string
    text: string
    onPress: () => void
    type: "shortcut" | "profile"
    navigation: StackNavigationProp<AppStackParamList, "Menu">
  }
}

export const MenuCard = (props: CardProps) => {
  const { card } = props

  return (
    <TouchableOpacity
      style={$card}
      activeOpacity={0.5}
      onPress={() => {
        card.navigation.navigate("Home")
        card.onPress()
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={$iconCard}>
          <Icon name={card.icon} type="octicon" color={"#FFF"} size={26} />
        </View>

        <View>
          <Text testID="title_card_1" text={card.title} style={$titleCard} />

          {card.type === "profile" && (
            <Text testID="text_card_1" text={card.text} style={$textCard} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const $text: TextStyle = {
  color: "#FFF",
  fontFamily: spaceGrotesk.normal,
}

const $bold: TextStyle = {
  fontFamily: spaceGrotesk.semiBold,
}

const $card: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  minHeight: 67,
  backgroundColor: "#FFFFFF1A",
  borderRadius: 10,
  paddingVertical: spacing.medium,
  paddingHorizontal: spacing.medium,
  marginBottom: spacing.medium,
}

const $iconCard: ViewStyle = {
  width: 40,
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
}

const $titleCard: TextStyle = {
  ...$text,
  ...$bold,
  fontSize: 16,
}

const $textCard: TextStyle = {
  ...$text,
  fontSize: 16,
}
