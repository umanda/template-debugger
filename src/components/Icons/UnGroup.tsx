function UnGroup({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" height={size}>
      <path
        fill="currentColor"
        d="M7,0A1,1,0,0,0,6,1V3A3,3,0,0,1,3,6H1A1,1,0,0,0,1,8H3A5.006,5.006,0,0,0,8,3V1A1,1,0,0,0,7,0Z"
      />
      <path fill="currentColor" d="M23,16H21a5.006,5.006,0,0,0-5,5v2a1,1,0,0,0,2,0V21a3,3,0,0,1,3-3h2a1,1,0,0,0,0-2Z" />
      <path fill="currentColor" d="M21,8h2a1,1,0,0,0,0-2H21a3,3,0,0,1-3-3V1a1,1,0,0,0-2,0V3A5.006,5.006,0,0,0,21,8Z" />
      <path fill="currentColor" d="M3,16H1a1,1,0,0,0,0,2H3a3,3,0,0,1,3,3v2a1,1,0,0,0,2,0V21A5.006,5.006,0,0,0,3,16Z" />
    </svg>
  )
}

export default UnGroup
