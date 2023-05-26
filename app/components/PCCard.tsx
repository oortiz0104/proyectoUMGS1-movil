import React, { useState } from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { palette } from "../theme"
import { Text } from "./Text"
import { Icon } from "@rneui/base"
import { PC } from "../utils/interfaces"
import { typography } from "../theme"
import { ModalNewPCActions } from "./Modals/ModalNewPCActions"
import { ModalUsedPCActions } from "./Modals/ModalUsedPCActions"

interface CardProps {
  card: PC
  willRefresh: boolean
  type: "new" | "used"
}

export const PCCard = (props: CardProps) => {
  const { card, willRefresh, type } = props

  const [isVisibleModal, setIsVisibleModal] = useState(false)

  const dataPills = [
    {
      icon: () => <Icon name="archive" type="octicon" key={0} color={"#000000AA"} size={16} />,
      iconType: "octicon",
      label: `Bodega ${card.ubication.cellarNumber}, estantería ${card.ubication.shelve}`,
    },
  ]

  if (type === "new") {
    dataPills.push({
      icon: () => <Icon name="checklist" type="octicon" key={1} color={"#000000AA"} size={16} />,
      iconType: "octicon",
      label: card.purchaseOrder,
    })
  }

  return (
    <>
      <TouchableOpacity
        style={$card}
        activeOpacity={0.5}
        onPress={() => {
          if (card.state === "Entrada") setIsVisibleModal(true)
        }}
      >
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
              backgroundColor: card.state === "Entrada" ? palette.secondary400 : palette.primary400,
            }}
          >
            <Icon
              name={card.state === "Entrada" ? "package-dependencies" : "package-dependents"}
              type="octicon"
              color="#FFF"
              size={16}
            />
            <Text text={card.state} style={$pillLabel} />
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
              text={`${card.brand} ${card.model}`}
              style={{ ...$text, ...$bold, fontSize: 18, lineHeight: 20 }}
            />

            <Text
              text={card.serialNumber}
              style={{ ...$text, fontSize: 14, lineHeight: 16, opacity: 0.5 }}
            />
          </View>
        </View>

        <View style={$divider} />

        <View style={$pillsContainer}>
          {dataPills.map((pill, index) => {
            return (
              <View
                key={index}
                style={{
                  ...$pill,
                  backgroundColor: palette.primary100,
                }}
              >
                {pill.icon()}
                <Text
                  text={pill.label.toString()}
                  style={{
                    ...$pillLabel,
                    color: "#000000AA",
                  }}
                />
              </View>
            )
          })}
        </View>
      </TouchableOpacity>

      {type === "new" && (
        <ModalNewPCActions
          isVisible={isVisibleModal}
          setIsVisible={setIsVisibleModal}
          pcData={card}
          willRefresh={willRefresh}
        />
      )}

      {type === "used" && (
        <ModalUsedPCActions
          isVisible={isVisibleModal}
          setIsVisible={setIsVisibleModal}
          pcData={card}
          willRefresh={willRefresh}
        />
      )}
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

const $pillsContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 10,
  flexWrap: "wrap",
  width: "100%",
}
