function LayerBackward({ size }: { size: number }) {
  return (
    <svg height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 11.5C19 10.6716 18.3284 10 17.5 10H16H15H13.5H11.5C10.6716 10 10 10.6716 10 11.5V13.5V15V16V17.5C10 18.3252 10.6663 18.9948 11.4903 19H11.5H13.5H15.5H17.5C18.3284 19 19 18.3284 19 17.5V15.5V13.5V11.5ZM17.5 11C17.7761 11 18 11.2239 18 11.5V13.5V15.5V17.5C18 17.7761 17.7761 18 17.5 18H15.5H13.5H11.5C11.2239 18 11 17.7761 11 17.5V15.5V13.5V11.5C11 11.2239 11.2239 11 11.5 11H13.5H15.5H17.5Z"
        fill="currentColor"
      />
      <path
        d="M7.5 5C6.11929 5 5 6.11929 5 7.5V13.5C5 14.8807 6.11929 16 7.5 16H8.5H10V15V13.5V11.5C10 10.6716 10.6716 10 11.5 10H13.5H15H16V8.5V7.5C16 6.11929 14.8807 5 13.5 5H7.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default LayerBackward
