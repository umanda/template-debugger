import React, { useCallback, useRef } from "react"
import {
  Flex,
  Button,
  Center,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure
} from "@chakra-ui/react"
import { Canvas, fabric, useActiveObject, useActiveScene, useEditor, useZoomRatio } from "@layerhub-pro/react"
import ContextMenu from "../ContextMenu"
import { useSelector } from "react-redux"
import * as api from "../../../services/api"
import { selectUser } from "../../../store/user/selector"
import useResourcesContext from "../../../hooks/useResourcesContext"
import Plus from "../../../Icons/Plus"
import MobileModal from "../../../Modals/MobileModal"
import { selectProject } from "../../../store/project/selector"
const watermarkURL = import.meta.env.VITE_APP_WATERMARK

export default function Canva() {
  const editor = useEditor()
  const activeScene = useActiveScene()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const user = useSelector(selectUser)
  const projectSelect = useSelector(selectProject)
  const flexRef = React.useRef<any>()
  const activeObject: any = useActiveObject()

  React.useEffect(() => {
    fabric.Object.prototype.setControlsVisibility({
      tl: true,
      mt: activeObject?.type !== "StaticText" ? true : false,
      tr: true,
      ml: true,
      mr: true,
      bl: true,
      mb: activeObject?.type !== "StaticText" ? true : false,
      br: true
    })
  }, [activeObject])

  React.useEffect(() => {
    const deleteIcon =
      "data:image/png;base64,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"

    const rotateIcon =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAZMSURBVHgB7VldTFRHFJ57d2FZtoDgLsbEIiq1iWuBQHjozwOmjYmx9Un3UUwb06pp9KEPbUyDxkRiwoOt2iZNNLVtSNX4UhBjxOqD1ESBogVTGtIsAiEsP/JP+Nmdnm+YWRbYvXeX3SV98Etm5/7tOd+cOXPOuXMZe4XkQmMJBOdcyNM00fEQ+ZwlCPESxv95yHEogoRpIMFrcjCrhs5ih7as12HZU6dOaYqYPBbnaKdPn9ZAlHpd/k89m9AZXgE55VpoL8mCiAWtvLzcSr31wIEDFlxHj0Gpc/UfJYMlk7QkJpRdv35dEOzo6HDOzs5+PD8/fzUQCLTSvZd8ES9xDffomU9aWlpccmBBS7NkEVaWRA9rjYyMbCMi3y4jaAqQ7+/v38akK4VYOqFQgnVYye/3f8PjBGQ0NTU5JWldyo8PiiQsi9bd3f0GXfPyBIHcxYuZUjriJs1DFhT5YEkiyS4jXSoXqy71rY4sl/7q8/kKIJgnCZCN2WMLCzIYHsNBi0QWsRPH+/btW19cXPyE4uhmlkSQzq7W1taykpKSYToNsAjZMZz5NZWNHjx4oBcVFX2dbLJS6WboItcIJpxwsC6/gAclYf3y5ctbdF3/nK0RoIt0XvB4PP+63W7hLsTFtA4RkYFaCoWeq3yNQYv7QmlpaYqMGmHJBbEwoAXz3rlzx7l79+5+FgWmpqbYrVv3yIX+YD7fkLjmdm9n5eXviBYLiMPoo0ePtp88eXKYXNLPlvmyFmYAaJaxsbFDGRkZPzATPHnyJ7t48ao43rXrbeZyOcVxe3sH3Wul8/VU9Hwh+mhBBjjscDgg1B/RLfhi6tUxJTQ1P5lNn883yPfvP8zPnbvEJycnw94/cuRL0cLdj4SZmZmfd+zYkYqQyg2SiYp/1oKCAhv571MzwYqM2aAOHjzOr137jUcL6N6zZ48ttLoLy1hmGUGYgvmIkdC2tr+FddGb4cqVX3lFxXEeLaA7Pz8/DVyIkzWUcGgc1iorKxm5g0YVFdZeFjOA19sjerf7zYjPPH7cyg4dOsEcDjubnJxiz5//wyoqTrCurh4j0QirWV6vV6yn9vb2Jf4bjMN8Mf6yTZs2mRYhIGC2kBAp0tPtFEF+F+eVldXiPy5XDjPDxo0btezsbO3GjRtLFt2KTEcWVgMYNRKYm+tkAwNDIqRFgsORLiKEQnr6wjl6I0C3xWLhubm5AXm+0iXUm25zc7M4IMd/YSS0rKxI9HV194weExb1eD4Uxx7PR1GFN6Wbii5Ub4LXCsIhEDdpVE8NZArrlZUVs/r6e8LSRti79wN26VIV9e+zaECL7llPTw+z2+2R3siD0FCXIkoMDw9/araaJyYmg6Ht/v1GnigMDAx8RlwQJVLY4vufwBILY+G5XC7e2dnJbt68ecvMj5WP5ue/Thb8kR09+pWhT0eL+vr6WkocATKeGkPEZ0VapgyTSqs0nbLTd9FaBfG4rq6Bx4vp6elfNmzY4CAeqeBiRFbVoCI1U2izNzY27uRrjIcPH7qJQxpSM4vybVptitjIPV6LxcrxArpIL6ybhn0PHsa6YaMEuQT6gM1m81NBfZZW7QuWZEBHTU3NWZrZAM2wnxIGi3ofjsuXT7bgR467d+++hdjIkwSS3UX1907MqKwhDKu0iKThyxAAQW1tbe9SjZFw0iBLL5/vkcoMigpp0CmNFTPE/hmcHwswJycn8/bt24WJtDTINjQ0FIIsNeTr1NWSDVpZCrBRs0Pw+fPn88bHx7/ncQIyqqurNyuySFZIWjze3R+1ZSrDDEg7YO3a2toiShI1sZAki46CKP5LcrKcTucSy/JE7K8x+Z4HgfAvOrYhqUDZOkJVVVV+b2/vMZCfm5t7Flr4gyC9av01MTFR09fXd+zMmTNbMFhJ1AE5sCyK9FVvUZmRpj4FSqi3IyNBOS3MdVlZWdmZmZk5GEReXl423c/GNTQCfoRFQVJGAshIUXvOsRCJCcoSNK2W0dFRneoODQU/VVeWwsJCvEDqQ0ML1dvg4KCoTWiDRDTUuPQc4mxg69atAWyWkDxkh4R9tFkCvvhdImhxLBTlKtTSpPXsarpxTd5PCQlZwl8T5bPREF/yjUKSsKoeTZK0qm8eTO5MsmR/14gCyz9taRHa/xPJnub/AJ3CcjiqTivKAAAAAElFTkSuQmCC"

    const cloneIcon =
      "data:image/png;base64,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"
    const deleteImg = document.createElement("img")
    deleteImg.src = deleteIcon

    const cloneImg = document.createElement("img")
    cloneImg.src = cloneIcon

    const rotateImg = document.createElement("img")
    rotateImg.src = rotateIcon

    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerColor = "#5456F5"
    fabric.Object.prototype.cornerSize = 12
    fabric.Object.prototype.cornerStyle = "circle"
    fabric.Object.prototype.borderColor = "#5456F5"
    fabric.Object.prototype.borderScaleFactor = 2.25
    fabric.Object.prototype.borderOpacityWhenMoving = 1
    fabric.Object.prototype.borderOpacity = 1

    function renderIcon(icon: any) {
      // @ts-ignore
      return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        // @ts-ignore
        const size = this.cornerSize
        ctx.save()
        ctx.translate(left, top)
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
        ctx.drawImage(icon, -size / 2, -size / 2, size, size)
        ctx.restore()
      }
    }

    function deleteObject() {
      activeScene.objects.remove()
    }

    function cloneObject() {
      activeScene.objects.clone()
    }

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: -0.5,
      y: 0,
      offsetY: 0,
      offsetX: -24,
      cursorStyle: "pointer",
      mouseUpHandler: deleteObject,
      render: renderIcon(deleteImg),
      cornerSize: 36,
      touchSizeX: 36,
      touchSizeY: 36,
      sizeX: 36,
      sizeY: 36
    })
    fabric.Object.prototype.controls.clone = new fabric.Control({
      x: 0.5,
      y: 0,
      offsetY: 0,
      offsetX: 24,
      cursorStyle: "pointer",
      mouseUpHandler: cloneObject,
      render: renderIcon(cloneImg),
      cornerSize: 36,
      touchSizeX: 36,
      touchSizeY: 36,
      sizeX: 36,
      sizeY: 36
    })

    fabric.Object.prototype.controls.mtr = new fabric.Control({
      x: 0,
      y: 0.5,
      offsetY: 30,
      actionHandler: fabric.controlsUtils.rotationWithSnapping,
      cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
      actionName: "rotate",
      render: renderIcon(rotateImg),
      withConnection: false,
      cornerSize: 36,
      touchSizeX: 36,
      touchSizeY: 36,
      sizeX: 36,
      sizeY: 36
    })
    fabric.Textbox.prototype.controls.deleteControl = fabric.Object.prototype.controls.deleteControl
    fabric.Textbox.prototype.controls.clone = fabric.Object.prototype.controls.clone
    fabric.Textbox.prototype.controls.mtr = fabric.Object.prototype.controls.mtr
  }, [editor, activeScene])

  try {
    const app: any = document.getElementById("app")
    app?.addEventListener(
      "contextmenu",
      (e: any) => {
        e.preventDefault()
      },
      false
    )
    // app?.addEventListener
  } catch {}

  return (
    <Flex ref={flexRef} flex={1} position="relative" id="app">
      <ContextMenu />
      <Flex flex={1}>
        <Canvas
          config={{
            margin: 140,
            outsideVisible: true,
            guidelines: {
              enabled: true,
              color: ""
            },
            shortcuts: false
          }}
        />
      </Flex>
      <Center
        onClick={() => onOpen()}
        display={["flex", "flex", "none", "none"]}
        borderRadius="50%"
        position="absolute"
        bottom="30px"
        left="20px"
        sx={{
          height: "50px",
          width: "50px",
          bg: "brand.600",
          boxShadow: "0.5px 2px 7px rgba(0, 0, 0, 0.1)",
          color: "white"
        }}
      >
        <Plus size={40} />
      </Center>
      <Drawer onClose={onClose} isOpen={isOpen} size={"sm"} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <MobileModal />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}
