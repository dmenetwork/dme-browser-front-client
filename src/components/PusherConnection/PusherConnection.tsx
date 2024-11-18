/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import {
  PUHSER_EVENT_BROADCAST,
  PUSHER_DEFAULT_CHANNEL,
  PUSHER_EVENT_ERROR,
  PUSHER_EVENT_MEMBER_ADDED,
  PUSHER_EVENT_MEMBER_REMOVED,
  PUSHER_EVENT_SUBSCRIPTION_SUCCEEDED,
} from "@/constants/pusher"
import { pusherClient } from "@/libs/Pusher-lib"
import { IRedux } from "@/types"
import { IAuth } from "@/types/auth"
import Pusher, { PresenceChannel } from "pusher-js"
import { memo, useEffect, useState } from "react"
import { useSelector } from "react-redux"

// KNOWN ERRORS CODES
const KNOWN_ERRORS_CODES = [4200, 1006, 4009]

const PusherConnection = () => {
  const { auth } = useSelector<IRedux, IAuth>((state) => state?.auth)
  const [pusherConnect, setPusherConnect] = useState<Pusher | null>(null)

  useEffect(() => {
    if (auth?.sub && !pusherConnect) {
      connect(true)
    }
  }, [auth])

  useEffect(() => {
    if (pusherConnect) {
      const channel = pusherConnect.subscribe(
        PUSHER_DEFAULT_CHANNEL
      ) as PresenceChannel

      pusherConnect.connection.bind(PUSHER_EVENT_ERROR, (err: any) => {
        console.log("PUSHER ERROR DETECTED: ", err)
        if (KNOWN_ERRORS_CODES.includes(err?.data?.code)) {
          disconnect()
          connect(false)
        }
      })

      // DETECT WHEN A NEW USER CONNECTS
      channel
        .unbind(PUSHER_EVENT_MEMBER_ADDED)
        .bind(PUSHER_EVENT_MEMBER_ADDED, (data: any) => {
          console.log("PUSHER_EVENT_MEMBER_ADDED: ", data)
          // setConnectedUsers((prev) => [...prev, member.info.name])
        })

      // DETECT WHEN A USER LEAVES
      channel
        .unbind(PUSHER_EVENT_MEMBER_REMOVED)
        .bind(PUSHER_EVENT_MEMBER_REMOVED, (data: any) => {
          console.log("PUSHER_EVENT_MEMBER_REMOVED: ", data)
          // setConnectedUsers((prev) => prev.filter((user) => user !== member.info.name))
        })

      // DETECT WHEN THE CURRERNT USER IS SUBSCRIBEd TO THE CHANNEL
      channel
        .unbind(PUSHER_EVENT_SUBSCRIPTION_SUCCEEDED)
        .bind(PUSHER_EVENT_SUBSCRIPTION_SUCCEEDED, (data: any) => {
          console.log("PUSHER_EVENT_SUBSCRIPTION_SUCCEEDED: ", data)

          const members = data?.members
            ? Object.values(data.members).map((member: any) => member.info.name)
            : []

          console.log("members: ", members)
          // setConnectedUsers(members)
        })

      // GETTIN BROADCAST MESSAGE
      channel
        .unbind(PUHSER_EVENT_BROADCAST)
        .bind(PUHSER_EVENT_BROADCAST, (data: any) => {
          console.log("PUHSER_EVENT_BROADCAST: ", data)
        })
    }
  }, [pusherConnect])

  const connect = (firstConnect: boolean) => {
    if (auth) {
      if (firstConnect) {
        setPusherConnect(pusherClient(auth))
      } else {
        try {
          pusherConnect?.connect()
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  const disconnect = () => {
    try {
      pusherConnect?.disconnect()
    } catch (err) {
      console.error(err)
    }
  }

  return <></>
}

export default memo(PusherConnection)
