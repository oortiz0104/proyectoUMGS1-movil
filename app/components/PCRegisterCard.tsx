import React, { useState } from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { palette } from "../theme"
import { Text } from "./Text"
import { Icon } from "@rneui/base"
import { PC, PCRegister } from "../utils/interfaces"
import { typography } from "../theme"
import moment from "moment"

interface CardProps {
  card: PCRegister
  type: "new" | "used"
}

export const PCRegisterCard = (props: CardProps) => {
  const { card, type } = props

  const dataPills = [
    {
      icon: () => <Icon name="archive" type="octicon" key={0} color={"#000000AA"} size={16} />,
      iconType: "octicon",
      label: `Bodega ${card.pc.ubication.cellarNumber}, estantería ${card.pc.ubication.shelve}`,
    },
  ]

  if (type === "new") {
    dataPills.push({
      icon: () => <Icon name="checklist" type="octicon" key={1} color={"#000000AA"} size={16} />,
      iconType: "octicon",
      label: card.pc.purchaseOrder,
    })
  }

  return (
    <>
      <View style={$card}>
        <Text
          text={`Hora de entrada: ${moment(card.check_in).format(
            "D [de] MMMM [de] YYYY, hh:mm:ss A",
          )}`}
          style={{ ...$text, fontSize: 14, lineHeight: 16, opacity: 0.5, marginBottom: 10 }}
        />

        {card.check_out && (
          <Text
            text={`Hora de salida: ${moment(card.check_out)
              .utcOffset(-6)
              .format("D [de] MMMM [de] YYYY, hh:mm:ss A")}`}
            style={{ ...$text, fontSize: 14, lineHeight: 16, opacity: 0.5, marginBottom: 16 }}
          />
        )}

        <View style={$divider} />

        <Text
          text={`Ingresado por: ${card.user?.name} ${card.user?.surname}`}
          style={{ ...$text, fontSize: 14, lineHeight: 16, opacity: 0.5, marginBottom: 10 }}
        />

        <Text
          text={`- Teléfono: ${card.user.phone}`}
          style={{
            ...$text,
            fontSize: 14,
            lineHeight: 16,
            opacity: 0.5,
            marginBottom: 10,
          }}
        />

        <Text
          text={`- Correo: ${card.user.email}`}
          style={{
            ...$text,
            fontSize: 14,
            lineHeight: 16,
            opacity: 0.5,
            marginBottom: 16,
          }}
        />

        <View style={$divider} />

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              ...$pill,
              marginBottom: 0,
              backgroundColor:
                card.pc.state === "Entrada"
                  ? palette.secondary400
                  : card.pc.state === "Salida"
                  ? palette.primary400
                  : palette.angry500,
            }}
          >
            <Icon
              name={
                card.pc.state === "Entrada"
                  ? "package-dependencies"
                  : card.pc.state === "Salida"
                  ? "package-dependents"
                  : "x"
              }
              type="octicon"
              color="#FFF"
              size={16}
            />
            <Text text={card.pc.state} style={$pillLabel} />
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
              text={`${card.pc.brand} ${card.pc.model}`}
              style={{ ...$text, ...$bold, fontSize: 18, lineHeight: 20 }}
            />

            <Text
              text={card.pc.serialNumber}
              style={{ ...$text, fontSize: 14, lineHeight: 16, opacity: 0.5 }}
            />
          </View>
        </View>

        <View style={$divider} />

        <View style={$pillsContainer}>
          {dataPills.map((pill, index) => {
            if (pill.label !== "") {
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
            }
          })}
        </View>
      </View>
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
