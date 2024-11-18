import React from "react"
import {
  BellRing,
  CircleAlert,
  CalendarDays,
  Mails,
  Ban,
  Info,
  CircleCheckBig,
} from "lucide-react"

export const NotificationsIcons: { [key: string]: JSX.Element } = {
  bell: <BellRing size={32} />,
  alert: <CircleAlert size={32} />,
  calendar: <CalendarDays size={32} />,
  mail: <Mails size={32} />,
  error: <Ban size={32} />,
  info: <Info size={32} />,
  success: <CircleCheckBig size={32} />,
}
