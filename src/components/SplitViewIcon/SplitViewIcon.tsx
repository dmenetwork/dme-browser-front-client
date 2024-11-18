import { SvgIcon, SvgIconProps } from "@mui/material"
import React, { memo } from "react"

const SplitViewIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 145 145">
      <path
        d="M119.858 29.0909H24.1953C17.5912 29.0909 12.2375 34.4446 12.2375 41.0487V100.838C12.2375 107.442 17.5912 112.795 24.1953 112.795H119.858C126.462 112.795 131.815 107.442 131.815 100.838V41.0487C131.815 34.4446 126.462 29.0909 119.858 29.0909Z"
        stroke="currentColor"
        strokeWidth="11.9578"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect
        width="10.4995"
        height="83.9962"
        transform="translate(52.7786 28.6533)"
        fill="currentColor"
      />
      <path
        d="M94.7743 51.4021L100.722 63.4394L114.023 65.3815L104.399 74.746L106.67 87.9754L94.7743 81.7261L82.8783 87.9754L85.1497 74.746L75.5251 65.3815L88.8263 63.4394L94.7743 51.4021Z"
        stroke="currentColor"
        strokeWidth="5.53412"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}

export default memo(SplitViewIcon)
