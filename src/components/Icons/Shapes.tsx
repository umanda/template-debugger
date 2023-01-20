function Shapes({ size }: { size: number }) {
  return (
    <svg height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 9C9 6.23858 11.2386 4 14 4C16.7614 4 19 6.23858 19 9C19 11.7614 16.7614 14 14 14C11.2386 14 9 11.7614 9 9ZM14 3C10.6863 3 8 5.68629 8 9C8 12.3137 10.6863 15 14 15C17.3137 15 20 12.3137 20 9C20 5.68629 17.3137 3 14 3ZM4 10C4 8.89543 4.89543 8 6 8H6.5C6.77614 8 7 7.77614 7 7.5C7 7.22386 6.77614 7 6.5 7H6C4.34315 7 3 8.34315 3 10V17C3 18.6569 4.34315 20 6 20H13C14.6569 20 16 18.6569 16 17V16.5C16 16.2239 15.7761 16 15.5 16C15.2239 16 15 16.2239 15 16.5V17C15 18.1046 14.1046 19 13 19H6C4.89543 19 4 18.1046 4 17V10Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default Shapes
