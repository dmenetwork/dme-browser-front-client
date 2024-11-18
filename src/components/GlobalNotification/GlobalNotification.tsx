import { IRedux } from "@/types"
import { ICommon, ICommonNotification } from "@/types/common"
import { setCloseGlobalNotification } from "@/redux/reducers/common"
import { Alert, Snackbar } from "@mui/material"
import { memo } from "react"
import { useDispatch, useSelector } from "react-redux"

const GlobalNotification = () => {
  const { globalNotification } = useSelector<IRedux, ICommon>(
    (state) => state?.common
  )
  const dispatch = useDispatch()

  const closeNotification = async (pos: number) => {
    await dispatch(
      setCloseGlobalNotification({
        position: pos,
      })
    )
  }

  return (
    <>
      {globalNotification?.map((e: ICommonNotification, i: number) => (
        <Snackbar
          key={i}
          sx={{
            zIndex: (theme) => theme?.zIndex?.modal + 1,
            top: {
              xl:
                i > 0
                  ? `${i === 1 ? `11` : i * 8 + 3}% !important`
                  : "3% !important",
              lg:
                i > 0
                  ? `${i === 1 ? `10` : i * 7 + 3}% !important`
                  : "3% !important",
              md:
                i > 0
                  ? `${i === 1 ? `10` : i * 7 + 3}% !important`
                  : "3% !important",
              sm:
                i > 0
                  ? `${i === 1 ? `9` : i * 6 + 3}% !important`
                  : "3% !important",
              xs:
                i > 0
                  ? `${i === 1 ? `11` : i * 8 + 3}% !important`
                  : "3% !important",
            },
          }}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={e?.isOpen}
          // onClose={() => closeNotification(i)}
          autoHideDuration={3000}
        >
          <Alert
            variant={e?.variant}
            severity={e?.severity}
            onClose={() => closeNotification(i)}
          >
            {e?.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}

export default memo(GlobalNotification)
