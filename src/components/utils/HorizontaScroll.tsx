import React from "react"

const makeScroll = (element: HTMLDivElement, speed: number, distance: number, step: number) => {
  let scrollAmount = 0
  const slideTimer = setInterval(() => {
    element.scrollLeft += step
    scrollAmount += Math.abs(step)
    if (scrollAmount >= distance) {
      clearInterval(slideTimer)
    }
  }, speed)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, (distance / speed) * 10)
  })
}

interface HorizontalScrollConfig {
  speed: number
  distance: number
  step: number
}

interface HorizontalScrollProps {
  children: React.ReactNode
  config?: Partial<HorizontalScrollConfig>
}

const RightControl = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.91016 19.9201L15.4302 13.4001C16.2002 12.6301 16.2002 11.3701 15.4302 10.6001L8.91016 4.08008"
        stroke="#000000"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const LeftControl = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.0898 4.07992L8.56984 10.5999C7.79984 11.3699 7.79984 12.6299 8.56984 13.3999L15.0898 19.9199"
        stroke="#000000"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HorizontalScroll({ children, config }: HorizontalScrollProps) {
  const [state, setState] = React.useState({
    left: 0,
    requestScrollLeft: true,
    requestScrollRight: true,
    step: 10,
    distance: 150,
    speed: 10,
    baseWidth: 360
  })

  const contentWrapper = React.useRef<HTMLDivElement>(null)

  const handleScrollToLeft = async () => {
    await makeScroll(contentWrapper.current!, state.speed, state.distance, -state.step)
    updateScroll()
  }

  const updateScroll = () => {
    if (contentWrapper.current) {
      let requestScrollLeft = true
      let requestScrollRight = true
      if (contentWrapper.current.scrollLeft <= 0) {
        requestScrollLeft = false
      }
      if (contentWrapper.current.scrollLeft + state.baseWidth >= contentWrapper.current.scrollWidth) {
        requestScrollRight = false
      }
      setState({ ...state, requestScrollLeft, requestScrollRight })
    }
  }

  const handleScrollToRight = async () => {
    if (contentWrapper.current) {
      await makeScroll(contentWrapper.current!, state.speed, state.distance, state.step)
      updateScroll()
    }
  }

  React.useEffect(() => {
    if (contentWrapper.current) {
      setState({
        ...state,
        ...config,
        baseWidth: contentWrapper.current.clientWidth
      })
      updateScroll()
    }
  }, [contentWrapper, config, children])

  return (
    <div style={{ position: "relative", paddingBlock: "10px", paddingInline: "20px" }}>
      {state.requestScrollLeft && (
        <div
          onClick={handleScrollToLeft}
          style={{
            position: "absolute",
            top: "50%",
            left: "0px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            background: "linear-gradient(to left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.9) 100%)",
            height: "100%",
            width: "60px"
          }}
        >
          <LeftControl />
        </div>
      )}
      <div
        ref={contentWrapper}
        style={{
          display: "flex",
          overflow: "hidden",
          width: "100%",
          gap: "1rem"
        }}
      >
        {children}
      </div>
      {state.requestScrollRight && (
        <div
          onClick={handleScrollToRight}
          style={{
            position: "absolute",
            top: "50%",
            right: "0px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            background: "linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.9) 100%)",
            height: "100%",
            width: "60px"
          }}
        >
          <RightControl />
        </div>
      )}
    </div>
  )
}

export default HorizontalScroll
