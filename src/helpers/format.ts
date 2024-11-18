import { COMMON_ENCRYPT_KEY } from "@/constants/common"
import CryptoJS from "crypto-js"
import moment from "moment-timezone"
import "moment/locale/es"

const getCurrencyType = (type: string) => {
  switch (type.toUpperCase()) {
    case "CLP":
      return "es-CL"
    case "USD":
      return "en-US"
    case "PEN":
      return "es-CL"
    case "COP": {
      return "es-CO"
    }
    default:
      return type
  }
}

export const formatNumber = ({
  num,
  currency = "CLP",
  decimal = 0,
}: {
  num: number
  currency?: string
  decimal?: number
}) => {
  const formattedNumber = new Intl.NumberFormat(getCurrencyType(currency), {
    style: "currency",
    currency,
    maximumFractionDigits: decimal,
  }).format(num)
  return formattedNumber
}

export const formatDate = ({
  date,
  format,
  tz = "America/Santiago",
}: {
  date: Date | string | null
  format: "FULL" | "DATETIME" | "DATEONLY" | "TIMEONLY" | "DATETEXT" | "TIME"
  tz?: string | null
}) => {
  const timezone = tz ? tz : "America/Santiago"
  let text = ""
  switch (format) {
    case "FULL":
      if (moment(date).tz(timezone).isBefore(moment(), "years")) {
        text = `${moment(date).tz(timezone).format("dddd DD")} de ${moment(date)
          .tz(timezone)
          .format("MMMM")} de ${moment(date)
          .tz(timezone)
          .format("YYYY")} a las ${moment(date).tz(timezone).format("HH:mm")}`
      } else {
        text = `${moment(date).tz(timezone).format("dddd DD")} de ${moment(date)
          .tz(timezone)
          .format("MMMM")} a las ${moment(date).tz(timezone).format("HH:mm")}`
      }
      break
    case "DATETIME":
      text = `${moment(date).tz(timezone).format("DD-MM-YYYY HH:mm")}`
      break
    case "DATEONLY":
      text = `${moment(date).tz(timezone).format("DD-MM-YYYY")}`
      break
    case "TIMEONLY":
      text = `${moment(date).tz(timezone).format("HH:mm")}`
      break
    case "DATETEXT":
      if (moment(date).tz(timezone).isBefore(moment(), "years")) {
        text = `${moment(date).tz(timezone).format("dddd DD")} de ${moment(date)
          .tz(timezone)
          .format("MMMM")} de ${moment(date).tz(timezone).format("YYYY")}`
      } else {
        text = `${moment(date).tz(timezone).format("dddd DD")} de ${moment(date)
          .tz(timezone)
          .format("MMMM")}`
      }
      break
    default:
      text = date as string
      break
  }

  return text
}

export const encryptString = (str: string) => {
  const encryptPassword = CryptoJS.AES.encrypt(
    str,
    COMMON_ENCRYPT_KEY
  ).toString()
  return encryptPassword
}

export const decryptString = (str: string): string => {
  const decryptBytes = CryptoJS.AES.decrypt(str, COMMON_ENCRYPT_KEY)
  const decryptPassword = decryptBytes.toString(CryptoJS?.enc?.Utf8)
  return decryptPassword
}
