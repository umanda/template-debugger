import { Box, Flex } from "@chakra-ui/react"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import ChevronDown from "../../../Icons/ChevronDown"
import Common from "./Common"
import Scenes from "./Scenes"

export default function Footer() {
  const { isScenesVisible, setIsScenesVisible } = useDesignEditorContext()
  return (
    <Box sx={{ position: "relative" }}>
      {isScenesVisible && (
        <Box
          onClick={() => setIsScenesVisible(false)}
          sx={{
            position: "absolute",
            height: "24px",
            width: "24px",
            borderRadius: "50%",
            backgroundColor: "white",
            left: "50%",
            transform: "translateX(-50%)",
            top: "-10px",
            boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.06)",
            zIndex: 10,
            display: "grid",
            placeContent: "center",
            cursor: "pointer",
            color: "#545465"
          }}
        >
          <ChevronDown size={24} />
        </Box>
      )}
      <Box
        sx={{
          height: isScenesVisible ? "110px" : "0px",
          overflow: "hidden",
          transition: "height 0.15s ease"
        }}
      >
        <Scenes />
      </Box>
      <Common />
    </Box>
  )
}
