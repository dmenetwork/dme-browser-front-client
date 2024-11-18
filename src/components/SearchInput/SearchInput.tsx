import { ITabsBrowserTab } from "@/types/tabsBrowser"
import {
  Autocomplete,
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  Popover,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import Button from "@mui/material/Button"
import { ShieldCheck, Star, X, Search } from "lucide-react"
import React from "react"
import CustomImage from "@/components/CustomImage/CustomImage"
import useSearchInput from "@/hooks/useSearchInput"
import { COLOR_COMMON_BLACK } from "@/constants/colors"

interface SearchInputProps {
  isFocusable?: boolean
  tab: ITabsBrowserTab
  isFromNewTab?: boolean
  newPageIdFocused?: string
}

const SearchInput: React.FC<SearchInputProps> = ({
  isFocusable = false,
  tab,
  isFromNewTab = false,
  newPageIdFocused = "",
}) => {
  const height: number = isFromNewTab ? 41 : 30
  const iconSize: number = 20
  const { palette } = useTheme()

  const {
    searchInputRef,
    historyToInputOptions,
    id,
    open,
    bookmarkInputValue,
    anchorEl,
    inputValue,
    isBookmarked,
    openOptionsBox,
    handleClick,
    handleBookmarkInput,
    handleUrlChange,
    handleSelectOption,
    handleClose,
    closeFavorite,
    setInputValue,
    setOpenOptionsBox,
  } = useSearchInput({
    tab,
    isFocusable,
    newPageIdFocused,
  })

  return (
    <>
      <FormControl size="small" fullWidth sx={{ justifyContent: "center" }}>
        <Stack
          direction="row"
          gap={0}
          sx={{
            height,
            bgcolor: ({ palette }) => palette?.background?.default,
            borderRadius: 50,
          }}
        >
          <Autocomplete
            fullWidth
            options={historyToInputOptions}
            inputValue={inputValue}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.url
            }
            filterOptions={(options, params) => {
              const inputVal = params.inputValue
              if (inputVal === "") return []
              const optionsToShow = options.filter((option) => {
                if (option.url.includes(inputVal)) {
                  return option
                }
              })
              return optionsToShow
            }}
            open={openOptionsBox}
            disableClearable={true}
            autoComplete={true}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 1,
                  }}
                  {...optionProps}
                >
                  <CustomImage
                    src={option?.icon || ""}
                    sx={{
                      height: 18,
                      width: "auto",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Typography fontWeight={"bold"} color="textSecondary">
                      {option.title}{" "}
                      <Typography component={"span"} color="textSecondary">
                        -{" "}
                        {option.url.length > 50
                          ? `${option.url.substring(0, 50)}...`
                          : option.url}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              )
            }}
            onInputChange={(_, val, reason) => {
              if (reason === "selectOption") {
                setInputValue(val)
                handleSelectOption(val)
                setOpenOptionsBox(false)
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  e.target.value.length > 0
                    ? setOpenOptionsBox(true)
                    : setOpenOptionsBox(false)
                }}
                placeholder={
                  isFromNewTab ? "Search..." : "Search or enter website URL"
                }
                onKeyDown={handleUrlChange}
                inputRef={searchInputRef}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        {isFromNewTab ? (
                          <IconButton
                            disabled={!tab.URL}
                            sx={{
                              height,
                              borderRadius: 1.5,
                              "& svg": {
                                transition: "color 1.5s ease-out",
                                color: ({ palette }) => palette?.grey?.[500],
                              },
                              "&:hover": {
                                borderRadius: 50,
                                "& svg": {
                                  transition: "color 1.5s ease-out",
                                  color: ({ palette }) =>
                                    palette?.primary?.main,
                                },
                              },
                            }}
                          >
                            <Search size={iconSize} />
                          </IconButton>
                        ) : (
                          <IconButton
                            disabled={!tab.URL}
                            sx={{
                              height,
                              borderRadius: 1.5,
                              "& svg": {
                                transition: "color 1.5s ease-out",
                                color: ({ palette }) => palette?.grey?.[500],
                              },
                              "&:hover": {
                                borderRadius: 50,
                                "& svg": {
                                  transition: "color 1.5s ease-out",
                                  color: ({ palette }) =>
                                    palette?.primary?.main,
                                },
                              },
                            }}
                          >
                            <ShieldCheck
                              size={iconSize}
                              color={
                                tab.Protocol === "https:" ? "green" : "gray"
                              }
                            />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {isFocusable && (
                          <IconButton
                            onClick={handleClick}
                            disabled={!tab.URL}
                            sx={{
                              height,
                              borderRadius: 1.5,
                              "& svg": {
                                transition: "color 1.5s ease-out",
                                color: ({ palette }) =>
                                  isBookmarked
                                    ? palette?.primary?.main
                                    : palette?.grey?.[500],
                              },
                              "&:hover": {
                                borderRadius: 50,
                                "& svg": {
                                  transition: "color 1.5s ease-out",
                                  color: ({ palette }) =>
                                    palette?.primary?.main,
                                },
                              },
                            }}
                          >
                            {isBookmarked ? (
                              <Star
                                size={iconSize}
                                fill={palette?.primary?.main}
                              />
                            ) : (
                              <Star size={iconSize} />
                            )}
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
                autoFocus={isFocusable}
                sx={{
                  "& .MuiInputBase-input::placeholder": {
                    color: isFromNewTab
                      ? palette?.common?.black
                      : palette?.text?.secondary,
                  },
                }}
              />
            )}
            freeSolo
            value={inputValue}
            id="url_input"
            sx={{
              "& .MuiAutocomplete-inputRoot": {
                height,
              },
              height,
              "& .css-k1evrs-MuiInputBase-input-MuiOutlinedInput-input": {
                color: ({ palette }) => palette?.text?.secondary,
              },
              "& .MuiAutocomplete-input": {
                color: ({ palette }) =>
                  isFromNewTab ? COLOR_COMMON_BLACK : palette?.text?.secondary,
              },
              borderRadius: 50,
              "& .MuiOutlinedInput-root": {
                borderRadius: 50,
                "& fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "2px solid",
                  borderColor: ({ palette }) => palette?.primary?.main,
                },
              },
              "&.Mui-focused": {
                boxShadow: "0 0 8px rgba(0, 123, 255, 0.5)",
              },
              backgroundColor: isFromNewTab
                ? ({ palette }) => palette?.text?.primary
                : ({ palette }) => palette?.background?.default,
            }}
          />
        </Stack>
      </FormControl>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            p: 1,
            bgcolor: ({ palette }) => palette?.background?.default,
            minHeight: 100,
            minWidth: 200,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 1,
              color: ({ palette }) => palette?.text?.secondary,
            }}
          >
            Add to favorites
            <IconButton onClick={() => closeFavorite()}>
              <X size={iconSize} />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              color: ({ palette }) => palette?.text?.secondary,
            }}
          >
            Name
            <TextField
              id="outlined-basic"
              variant="outlined"
              value={bookmarkInputValue}
              size="small"
              onChange={handleBookmarkInput}
              sx={{
                ".css-gmf0x2-MuiInputBase-input-MuiOutlinedInput-input": {
                  color: ({ palette }) => palette?.text?.secondary,
                },
              }}
            />
          </Stack>
          <Stack direction="row-reverse" spacing={2} sx={{ marginTop: 2 }}>
            <Button variant="contained" onClick={() => closeFavorite("OK")}>
              Ok
            </Button>
            <Button variant="outlined" onClick={() => closeFavorite("DELETE")}>
              Delete
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}

export default SearchInput
