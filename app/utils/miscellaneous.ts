import i18n from "i18n-js"
import { MaskService } from "react-native-masked-text"

export const normalizeString = (string: string): string => {
  // Pasar todo a minúsculas y separar en palabras
  const words = string.toLowerCase().split(" ")

  // Normalizar cada palabra
  const normalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1))

  // Unir las palabras normalizadas y devolver la cadena resultante
  return normalizedWords.join(" ")
}

export const coinToNumber = (coin: string, currency: string): number => {
  return parseFloat(coin.replace(`${currency}`, "").replace(",", ""))
}

export const maskCoinToNumber = (coin: string, currency: string): number | string => {
  return MaskService.toRawValue("money", coin, {
    unit: `${currency}`,
    separator: ".",
    delimiter: ",",
  })
}

export const numberToCoin = (number: number, currency: string): string => {
  return MaskService.toMask("money", (number * 100).toString(), {
    unit: `${currency}`,
    separator: ".",
    delimiter: ",",
  })
}

export const numberToCoinNoMultiplication = (number: number, currency: string): string => {
  return MaskService.toMask("money", (number * 1).toString(), {
    unit: `${currency}`,
    separator: ".",
    delimiter: ",",
  })
}

export const maskNumberToCoin = (number: number, currency: string): string => {
  return MaskService.toMask("money", number, {
    unit: `${currency}`,
    separator: ".",
    delimiter: ",",
  })
}

export const stringToCoin = (string: string, currency: string): string => {
  return numberToCoin(parseFloat(string), currency)
}

export const removeEmojis = (text: string): string => {
  return text.replace(
    /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{1F900}-\u{1F9FF}|\u{1F1E0}-\u{1F1FF}|\u{1F191}-\u{1F251}|\u{1F004}|\u{1F0CF}|\u{1F170}-\u{1F171}|\u{1F17E}-\u{1F17F}|\u{1F18E}|\u{3030}|\u{2B50}|\u{2B55}|\u{2934}-\u{2935}|\u{2B05}-\u{2B07}|\u{2B1B}-\u{2B1C}|\u{3297}|\u{3299}|\u{303D}|\u{00A9}|\u{00AE}|\u{2122}|\u{23F3}|\u{24C2}|\u{25B6}|\u{23F8}-\u{23FA}]/gu,
    "",
  )
}

export const alertRequiredFields = async (fieldsObject: Object): Promise<string> => {
  let keys = Object.keys(fieldsObject),
    msg = ""

  for (let key of keys) {
    if (fieldsObject[key] !== null && fieldsObject[key] !== undefined && fieldsObject[key] !== "")
      continue

    const translatedKey = i18n.translate(`COMMONS.LABELS.${key.toUpperCase()}`)
    msg += `${i18n.translate("ALERTS.COMMONS.FIELD_REQUIRED_TITLE", {
      field: translatedKey,
    })}\n`
  }

  return msg
}

export const alertRequiredFieldsNoTranslate = async (fieldsObject: Object): Promise<string> => {
  let keys = Object.keys(fieldsObject),
    msg = ""

  for (let key of keys) {
    if (fieldsObject[key] !== null && fieldsObject[key] !== undefined && fieldsObject[key] !== "")
      continue

    const keyName = key.toUpperCase()
    msg += `El campo "${keyName}" es obligatorio\n`
  }

  return msg
}

export const generateRandomString = (length: number): string => {
  let result = "",
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    charactersLength = characters.length

  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength))

  return result
}
