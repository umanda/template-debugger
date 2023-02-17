function CircleDown({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" id="arrow-circle-down" viewBox="0 0 24 24" height={size}>
      <path
        fill="currentColor"
        d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,16a2.993,2.993,0,0,1-1.987-.752c-.327-.291-.637-.574-.84-.777L6.3,11.647a1,1,0,0,1,1.4-1.426L10.58,13.05c.188.187.468.441.759.7a1,1,0,0,0,1.323,0c.29-.258.57-.512.752-.693L16.3,10.221a1,1,0,1,1,1.4,1.426l-2.879,2.829c-.2.2-.507.48-.833.769A2.99,2.99,0,0,1,12,16Z"
      />
    </svg>
  )
}

export default CircleDown
