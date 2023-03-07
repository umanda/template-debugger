import React from "react"
import { Box } from "@chakra-ui/react"

const MenuOption = React.forwardRef(
  ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }, ref: any) => {
    return (
      <Box
        ref={ref}
        onClick={onClick}
        sx={{
          height: "30px",
          paddingLeft: "0.5rem",
          alignItems: "center",
          display: "flex",
          ":hover": {
            backgroundColor: "brand.50",
            cursor: "pointer",
            color: "brand.500"
          }
        }}
      >
        {children}
      </Box>
    )
  }
)

export default MenuOption
