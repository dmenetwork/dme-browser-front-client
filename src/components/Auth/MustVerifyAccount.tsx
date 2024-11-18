import { ROUTE_SIGN_IN } from "@/constants/routes"
import { Button, Stack, Typography } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { memo } from "react"

const MustVerifyAccount = () => {
  return (
    <>
      <Stack justifyContent="center" gap={3} sx={{ height: "100%" }}>
        <Stack alignItems="center" gap={1}>
          <Typography variant="h5" gutterBottom>
            Account not verified
          </Typography>
          <Typography variant="caption" color="textSecondary" align="center">
            We have forwarded a link to your email to verify the account
          </Typography>
          <Typography variant="caption" color="textSecondary" align="center">
            After verifying your account you can log in
          </Typography>
        </Stack>
        <Link href={ROUTE_SIGN_IN}>
          <Button
            variant="text"
            color="primary"
            fullWidth
            startIcon={<ArrowLeft size={20} />}
            sx={{
              mt: 1,
            }}
          >
            Go back
          </Button>
        </Link>
      </Stack>
    </>
  )
}

export default memo(MustVerifyAccount)
