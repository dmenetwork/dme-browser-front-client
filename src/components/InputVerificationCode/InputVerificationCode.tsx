/* eslint-disable react-hooks/exhaustive-deps */
import { Box, FilledInput, Grid2, Input, OutlinedInput } from "@mui/material"
import { memo, useEffect, useRef, useState } from "react"

const InputVerificationCode = ({
  variant = "standard",
  codeSize = 6,
  setCode,
}: {
  variant?: "standard" | "outlined" | "filled"
  codeSize?: number
  setCode?: (value: string) => void
}) => {
  const onFocus = useRef<(HTMLInputElement | null)[]>([])
  const [verificationCode, setVerificationCode] = useState<string[]>([])
  const ONLY_NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

  useEffect(() => {
    changeCode()
  }, [verificationCode])

  const changeCode = () => {
    if (verificationCode.length > 0 && setCode) {
      setCode(verificationCode.join(""))
    }
  }

  const handleVerificationCode = (str: string, pos: number) => {
    const lastChar = str.length > 1 ? str[str.length - 1] : str
    const regex = /^[0-9\b]+$/
    let newchar = ""
    if (lastChar === "" || lastChar === "0") {
      newchar = "0"
    } else if (regex.test(lastChar)) {
      newchar = lastChar
    }

    if (newchar) {
      if (verificationCode[pos]) {
        const updatedCode = [...verificationCode]
        updatedCode[pos] = newchar
        setVerificationCode(updatedCode)
      } else {
        const newCode = [...verificationCode, newchar]
        setVerificationCode(newCode)
      }

      if (pos + 1 < codeSize && onFocus.current[pos + 1] !== null) {
        onFocus.current[pos + 1]?.focus()
      } else if (onFocus.current[pos] !== null) {
        onFocus.current[pos]?.blur()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const pastedText = e.clipboardData.getData("text").substring(0, codeSize)

    if (pastedText) {
      const resultArray = pastedText.split("").slice(0, codeSize)
      setVerificationCode(resultArray)
    }
  }

  return (
    <>
      <Grid2
        container
        spacing={1}
        sx={{
          display: "flex",
          alignItems: "end",
        }}
      >
        <Grid2 size={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {variant === "standard" &&
              Array(codeSize)
                .fill("")
                .map((e, i) => {
                  return (
                    <Input
                      key={i}
                      size="small"
                      fullWidth
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center" },
                      }}
                      value={verificationCode[i] ? verificationCode[i] : ""}
                      inputRef={(ref: HTMLInputElement | null) => {
                        onFocus.current[i] = ref
                      }}
                      onPaste={handlePaste}
                      onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                        e.target.select()
                      }
                      onKeyDown={(e) => {
                        if (ONLY_NUMBERS.includes(e.key)) {
                          e.preventDefault()
                          handleVerificationCode(e?.key, i)
                        }
                      }}
                      sx={{
                        p: 1,
                        m: 1,
                        borderRadius: 1,
                        color: ({ palette }) => palette?.text?.secondary,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black",
                        },
                      }}
                    />
                  )
                })}

            {variant === "outlined" &&
              Array(codeSize)
                .fill("")
                .map((e, i) => {
                  return (
                    <OutlinedInput
                      key={i}
                      size="small"
                      fullWidth
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center" },
                      }}
                      value={verificationCode[i] ? verificationCode[i] : ""}
                      inputRef={(ref: HTMLInputElement | null) => {
                        onFocus.current[i] = ref
                      }}
                      onPaste={handlePaste}
                      onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                        e.target.select()
                      }
                      onKeyDown={(e) => {
                        if (ONLY_NUMBERS.includes(e.key)) {
                          e.preventDefault()
                          handleVerificationCode(e?.key, i)
                        }
                      }}
                      sx={{
                        paddingY: 1,
                        m: 1,
                        borderRadius: 1,
                        color: ({ palette }) => palette?.text?.secondary,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black",
                        },
                      }}
                    />
                  )
                })}

            {variant === "filled" &&
              Array(codeSize)
                .fill("")
                .map((e, i) => {
                  return (
                    <FilledInput
                      key={i}
                      size="small"
                      fullWidth
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center" },
                      }}
                      value={verificationCode[i] ? verificationCode[i] : ""}
                      inputRef={(ref: HTMLInputElement | null) => {
                        onFocus.current[i] = ref
                      }}
                      onPaste={handlePaste}
                      onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                        e.target.select()
                      }
                      onKeyDown={(e) => {
                        if (ONLY_NUMBERS.includes(e.key)) {
                          e.preventDefault()
                          handleVerificationCode(e?.key, i)
                        }
                      }}
                      sx={{
                        p: 1,
                        m: 1,
                        borderRadius: 1,
                        color: ({ palette }) => palette?.text?.secondary,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black",
                        },
                      }}
                    />
                  )
                })}
          </Box>
        </Grid2>
      </Grid2>
    </>
  )
}

export default memo(InputVerificationCode)
