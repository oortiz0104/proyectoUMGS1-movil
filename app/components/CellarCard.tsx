import React, { useState } from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { palette } from "../theme"
import { Text } from "./Text"
import { Icon } from "@rneui/base"
import { ubication } from "../utils/interfaces"
import { typography } from "../theme"
import { ModalNewPCActions } from "./Modals/ModalNewPCActions"
import { ModalUsedPCActions } from "./Modals/ModalUsedPCActions"
import { ModalCellarActions } from "./Modals/ModalCellarActions"

interface CardProps {
  card: ubication
  willRefresh: boolean
}

export const CellarCard = (props: CardProps) => {
  const { card, willRefresh } = props

  const [isVisibleModal, setIsVisibleModal] = useState(false)

  return (
    <>
      <TouchableOpacity style={$card} activeOpacity={0.5} onPress={() => setIsVisibleModal(true)}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              ...$pill,
              marginBottom: 0,
              backgroundColor: card.occupied === false ? palette.secondary400 : palette.primary400,
            }}
          >
            <Icon
              name={card.occupied === true ? "package-dependencies" : "package-dependents"}
              type="octicon"
              color="#FFF"
              size={16}
            />
            <Text text={card.occupied ? "Ocupado" : "Desocupado"} style={$pillLabel} />
          </View>
        </View>

        <View style={$divider} />

        <View style={$bodyCard}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              paddingRight: 8,
            }}
          >
            <Text
              text={`Bodega ${card.cellarNumber}, estantería ${card.shelve}`}
              style={{ ...$text, ...$bold, fontSize: 18, lineHeight: 20 }}
            />
          </View>
        </View>
      </TouchableOpacity>

      <ModalCellarActions
        isVisible={isVisibleModal}
        setIsVisible={setIsVisibleModal}
        cellarUbicationData={card}
        willRefresh={willRefresh}
      />
    </>
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
  display: "flex",
  backgroundColor: "#fff",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  width: "100%",
  borderRadius: 10,
  paddingVertical: 16,
  paddingHorizontal: 16,
  marginBottom: 16,

  shadowColor: "#001A5F",
  shadowOffset: {
    width: 20,
    height: 20,
  },
  shadowOpacity: 0.1,
  shadowRadius: 20,
  elevation: 20,
}

const $pill: ViewStyle = {
  borderRadius: 40,
  paddingVertical: 8,
  paddingHorizontal: 10,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
}

const $pillLabel: TextStyle = {
  ...$text,
  color: "#fff",
  fontSize: 12,
  lineHeight: 14,
  marginLeft: 6,
}

const $divider: ViewStyle = {
  width: "100%",
  height: 1,
  backgroundColor: "#000",
  opacity: 0.1,
  marginBottom: 16,
}

const $bodyCard: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  marginBottom: 16,
}
