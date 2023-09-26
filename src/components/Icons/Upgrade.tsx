function Upgrade({ size }: { size: number }) {
  return (
    <svg
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="15" height="15" fill="url(#pattern0)" />
      <defs>
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_1574_2632" transform="scale(0.025)" />
        </pattern>
        <image
          id="image0_1574_2632"
          width="40"
          height="40"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  )
}

export default Upgrade
