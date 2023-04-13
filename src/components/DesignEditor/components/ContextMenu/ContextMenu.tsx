import { useActiveObject, useActiveScene, useContextMenuRequest, useEditor } from "@layerhub-pro/react"
import { Box } from "@chakra-ui/react"
import Mail from "../../../Icons/Mail"
import { useAppDispatch } from "~/store/store"
import { createResourceComposite } from "~/store/resources/action"
import { generateId } from "../../../../utils/unique"
import Lock from "../../../Icons/Lock"
import LayerForward from "../../../Icons/LayerForward"
import LayerToFront from "../../../Icons/LayerToFront"
import LayerBackward from "../../../Icons/LayerBackward"
import LayerToBack from "../../../Icons/LayerToBack"
import Trash from "../../../Icons/Trash"
import Unlock from "../../../Icons/Unlock"
import Copy from "../../../Icons/Copy"
import Paste from "../../../Icons/Paste"
import SelectAll from "../../../Icons/SelectAll"
import Group from "../../../Icons/Group"
import UnGroup from "../../../Icons/UnGroup"

function ContextMenu() {
  const contextMenuRequest = useContextMenuRequest()
  const activeScene = useActiveScene()
  const editor = useEditor()
  const dispath = useAppDispatch()
  const activeObject: any = useActiveObject()

  const saveAsComponentHandler = async () => {
    if (activeScene) {
      const component: any = await activeScene.exportComponent()
      if (component) {
        dispath(
          createResourceComposite({
            id: generateId("", 10),
            name: "",
            category: "MIXED",
            types: component.metadata.types,
            component: component
          })
        )
      }
    }
  }

  if (!contextMenuRequest || !contextMenuRequest?.target) {
    return <></>
  }

  if (contextMenuRequest?.target?.type === "Background" || !activeObject?.type || activeObject?.type === "Frame") {
    return (
      <div // @ts-ignore
        onContextMenu={(e: Event) => e.preventDefault()}
        style={{
          position: "absolute",
          top: `${contextMenuRequest.top}px`,
          left: `${contextMenuRequest.left}px`,
          zIndex: 129,
          width: "240px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0.5px 2px 7px rgba(0, 0, 0, 0.1)",
          padding: "0.5rem 0"
        }}
      >
        <ContextMenuItem
          disabled={!activeScene.objects.paste}
          onClick={() => {
            activeScene.objects.paste()
            editor.cancelContextMenuRequest()
          }}
          icon="Paste"
          label="Paste"
        />
        <ContextMenuItem
          onClick={() => {
            activeScene.objects.remove("all")
            editor.cancelContextMenuRequest()
          }}
          icon="Trash"
          label="Delete All"
        />
        <ContextMenuItem
          onClick={() => {
            activeScene.objects.select()
            editor.cancelContextMenuRequest()
          }}
          icon="SelectAll"
          label="Select All"
        />
        <div style={{ margin: "0.5rem 0" }} />
        <div style={{ margin: "0.5rem 0" }} />
      </div>
    )
  }
  return (
    <>
      {!activeObject?.locked ? (
        <div // @ts-ignore
          onContextMenu={(e: Event) => e.preventDefault()}
          style={{
            position: "absolute",
            top: `${contextMenuRequest.top}px`,
            left: `${contextMenuRequest.left}px`,
            zIndex: 129,
            width: "240px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0.5px 2px 7px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem 0"
          }}
        >
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.copy()
              editor.cancelContextMenuRequest()
            }}
            icon="Copy"
            label="Copy"
            disabled={activeObject ? (activeObject?.type === "Frame" ? true : false) : false}
          />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.paste()
              editor.cancelContextMenuRequest()
            }}
            icon="Paste"
            label="Paste"
            disabled={activeObject ? false : true}
          />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.remove()
              activeScene.objects.remove()
              editor.cancelContextMenuRequest()
            }}
            icon="Trash"
            label="Delete"
            disabled={activeObject ? (activeObject?.type === "Frame" ? true : false) : false}
          />
          <div style={{ margin: "0.5rem 0" }} />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.bringToFront()
              editor.cancelContextMenuRequest()
            }}
            icon="BringToFront"
            label="Bring to front"
            disabled={activeObject ? (activeObject?.type === "Frame" ? true : false) : false}
          />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.bringForward()
              editor.cancelContextMenuRequest()
            }}
            icon="BringForward"
            label="Bring forward"
            disabled={activeObject ? (activeObject?.type === "Frame" ? true : false) : false}
          />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.sendToBack()
              editor.cancelContextMenuRequest()
            }}
            icon="SendToBack"
            label="Send back"
            disabled={activeObject ? (activeObject?.type === "Frame" ? true : false) : false}
          />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.sendBackwards()
              editor.cancelContextMenuRequest()
            }}
            icon="SendBackwards"
            label="Send backwards"
            disabled={activeObject ? (activeObject?.type === "Frame" ? true : false) : false}
          />
          <div style={{ margin: "0.5rem 0" }} />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.lock()
              editor.cancelContextMenuRequest()
            }}
            icon="Unlock"
            label="Lock"
            disabled={activeObject ? (activeObject?.type === "Frame" ? true : false) : false}
          />
          {activeObject?.type === "group" || activeObject?.type === "activeSelection" ? (
            <ContextMenuItem
              disabled={!activeScene.objects.paste}
              onClick={() => {
                activeObject?.type === "group" ? activeScene.objects.ungroup() : activeScene.objects.group()
                editor.cancelContextMenuRequest()
              }}
              icon={activeObject?.type === "group" ? "UnGroup" : "Group"}
              label={activeObject?.type === "group" ? "Un Group" : "Group"}
            />
          ) : null}
        </div>
      ) : (
        <div // @ts-ignore
          onContextMenu={(e: Event) => e.preventDefault()}
          style={{
            position: "absolute",
            top: `${contextMenuRequest.top}px`,
            left: `${contextMenuRequest.left}px`,
            zIndex: 129,
            width: "240px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0.5px 2px 7px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem 0"
          }}
        >
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.unlock()
              editor.cancelContextMenuRequest()
            }}
            icon="Lock"
            label="Unlock"
            disabled={activeObject ? false : true}
          />
        </div>
      )}
    </>
  )
}

function ContextMenuItem({
  icon,
  label,
  onClick,
  disabled = false
}: {
  icon: string
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  const Icon = () => {
    if (icon === "Lock") return <Lock size={24} />
    if (icon === "BringToFront") return <LayerToFront size={24} />
    if (icon === "SendBackwards") return <LayerBackward size={24} />
    if (icon === "SendToBack") return <LayerToBack size={24} />
    if (icon === "BringForward") return <LayerForward size={24} />
    if (icon === "Trash") return <Trash size={24} />
    if (icon === "Unlock") return <Unlock size={24} />
    if (icon === "Copy") return <Copy size={24} />
    if (icon === "SelectAll") return <SelectAll size={15} />
    if (icon === "Paste") return <Paste size={15} />
    if (icon === "Group") return <Group size={15} />
    if (icon === "UnGroup") return <UnGroup size={15} />
  }

  return (
    <Box
      onClick={onClick}
      _hover={{ backgroundColor: "rgba(0,0,0,0.075)" }}
      style={{
        display: "flex",
        height: "42px",
        alignItems: "center",
        padding: "0 1rem",
        gap: "1rem",
        cursor: "pointer",
        pointerEvents: disabled ? "none" : "auto",
        opacity: disabled ? 0.4 : 1
      }}
    >
      <Icon /> {label}
    </Box>
  )
}

export default ContextMenu
