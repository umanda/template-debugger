import { Flex } from "@chakra-ui/react"
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
  scrolls?: boolean
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

function HorizontalScroll({ children, config, scrolls }: HorizontalScrollProps) {
  const [stateScroll, setStateScroll] = React.useState<boolean>(false)
  const [state, setState] = React.useState({
    left: 0,
    requestScrollLeft: false,
    requestScrollRight: false,
    step: 10,
    distance: 150,
    speed: 10,
    baseWidth: 360
  })
  const contentFlex = React.useRef<HTMLDivElement>(null)
  const contentWrapper = React.useRef<HTMLDivElement>(null)

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
      if (scrolls) {
        requestScrollLeft = false
        requestScrollRight = false
      }  
      setState({ ...state, requestScrollLeft, requestScrollRight })
    }
  }

  const handleScrollToLeft = async () => {
    if (contentWrapper.current) {
      await makeScroll(contentWrapper.current!, state.speed, state.distance, -state.step)
      updateScroll()
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
  }, [contentWrapper, config, children, stateScroll])

  return (
    <Flex
      ref={contentFlex}
      style={{
        position: "relative",
        paddingBlock: "10px",
        paddingInline: "20px"
      }}
    >
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
            height: "100%"
          }}
        >
          <LeftControl />
        </div>
      )}
      <Flex
        w="full"
        id="scrolling"
        gap="1rem"
        ref={contentWrapper}
        overflow={scrolls ? "auto" : "hidden"}
        onScroll={() => setStateScroll(!stateScroll)}
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
            height: "4px"
          },
          "&::-webkit-scrollbar-track": {
            width: "6px"
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "24px"
          }

        }}
      >
        {children}
      </Flex>
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
            height: "100%"
          }}
        >
          <RightControl />
        </div>
      )}
    </Flex>
  )
}

export default HorizontalScroll
