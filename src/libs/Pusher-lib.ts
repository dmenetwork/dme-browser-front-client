import {
  CONFIG_API_AUTH,
  CONFIG_PUSHER_CLUSTER,
  CONFIG_PUSHER_KEY,
} from "@/config/config"
import { IAuthUser } from "@/types/auth"
import Pusher from "pusher-js"

// if (process?.env?.NODE_ENV !== "production") {
//   Pusher.log = (msg) => {
//     console.log(msg)
//   }
// }

export const pusherClient = (auth: IAuthUser) => {
  return new Pusher(CONFIG_PUSHER_KEY, {
    cluster: CONFIG_PUSHER_CLUSTER,
    authEndpoint: `${CONFIG_API_AUTH}/v1/pusher-auth/USER`,
    userAuthentication: {
      endpoint: `${CONFIG_API_AUTH}/v1/pusher-auth/USER`,
      transport: "ajax",
      headers: {},
      params: {
        auth,
      },
    },
    channelAuthorization: {
      transport: "ajax",
      endpoint: `${CONFIG_API_AUTH}/v1/pusher-auth/CHANNEL`,
      headers: {},
      params: {
        auth,
      },
    },
    auth: {
      headers: {},
      params: {
        auth,
      },
    },
  })
}
