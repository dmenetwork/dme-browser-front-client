import { SvgIcon, SvgIconProps } from "@mui/material"
import React, { memo } from "react"

const SecuredWorkspacesIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 145 145">
      <svg
        width="28"
        height="27"
        viewBox="0 0 28 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.25 14.625C23.25 20.25 19.3125 23.0625 14.6325 24.6938C14.3874 24.7768 14.1212 24.7728 13.8787 24.6825C9.1875 23.0625 5.25 20.25 5.25 14.625V6.75002C5.25 6.45165 5.36853 6.1655 5.57951 5.95452C5.79048 5.74354 6.07663 5.62502 6.375 5.62502C8.625 5.62502 11.4375 4.27502 13.395 2.56502C13.6333 2.36139 13.9365 2.24951 14.25 2.24951C14.5635 2.24951 14.8667 2.36139 15.105 2.56502C17.0738 4.28627 19.875 5.62502 22.125 5.62502C22.4234 5.62502 22.7095 5.74354 22.9205 5.95452C23.1315 6.1655 23.25 6.45165 23.25 6.75002V14.625Z"
          stroke="white"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g clipPath="url(#clip0_758_2734)">
          <path
            d="M14.249 15.4284C14.462 15.4284 14.6347 15.2557 14.6347 15.0427C14.6347 14.8297 14.462 14.657 14.249 14.657C14.036 14.657 13.8633 14.8297 13.8633 15.0427C13.8633 15.2557 14.036 15.4284 14.249 15.4284Z"
            stroke="white"
            strokeWidth="1.15714"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.9497 12.7285H11.5497C11.1237 12.7285 10.7783 13.0739 10.7783 13.4999V16.5857C10.7783 17.0117 11.1237 17.3571 11.5497 17.3571H16.9497C17.3758 17.3571 17.7212 17.0117 17.7212 16.5857V13.4999C17.7212 13.0739 17.3758 12.7285 16.9497 12.7285Z"
            stroke="white"
            strokeWidth="1.15714"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.3203 12.7283V11.5711C12.3203 11.0597 12.5235 10.5691 12.8852 10.2074C13.2469 9.84577 13.7374 9.64258 14.2489 9.64258C14.7604 9.64258 15.2509 9.84577 15.6126 10.2074C15.9743 10.5691 16.1775 11.0597 16.1775 11.5711V12.7283"
            stroke="white"
            strokeWidth="1.15714"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_758_2734">
            <rect
              width="9.25714"
              height="9.25714"
              fill="white"
              transform="translate(9.62109 8.87134)"
            />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  )
}

export default memo(SecuredWorkspacesIcon)
