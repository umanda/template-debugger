function Background({ size }: { size: number }) {
  return (
    <svg height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 7H17C18.1046 7 19 7.89543 19 9V15C19 16.1046 18.1046 17 17 17H7C5.89543 17 5 16.1046 5 15V9C5 7.89543 5.89543 7 7 7ZM4 9C4 7.34315 5.34315 6 7 6H17C18.6569 6 20 7.34315 20 9V15C20 16.6569 18.6569 18 17 18H7C5.34315 18 4 16.6569 4 15V9ZM7 8C6.44772 8 6 8.44772 6 9V15C6 15.5523 6.44772 16 7 16H17C17.5523 16 18 15.5523 18 15V9C18 8.44772 17.5523 8 17 8H7Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default Background
