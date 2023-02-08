import { useActiveScene, useContextMenuRequest, useEditor } from "@layerhub-pro/react"
import { Box } from "@chakra-ui/react"
import Mail from "../../../Icons/Mail"
import { useAppDispatch } from "../../../store/store"
import { createResourceComposite } from "../../../store/resources/action"
import { generateId } from "../../../utils/unique"
import Lock from "../../../Icons/Lock"
import LayerForward from "../../../Icons/LayerForward"
import LayerToFront from "../../../Icons/LayerToFront"
import LayerBackward from "../../../Icons/LayerBackward"
import LayerToBack from "../../../Icons/LayerToBack"
import Trash from "../../../Icons/Trash"
import Unlock from "../../../Icons/Unlock"
import Copy from "../../../Icons/Copy"
import Paste from "../../../Icons/Paste"

function ContextMenu() {
  const contextMenuRequest = useContextMenuRequest()
  const activeScene = useActiveScene()
  const editor = useEditor()
  const dispath = useAppDispatch()

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

  if (!contextMenuRequest || !contextMenuRequest.target) {
    return <></>
  }

  if (contextMenuRequest.target.type === "Background") {
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
          onClick={() => {
            activeScene.objects.copy()
            editor.cancelContextMenuRequest()
          }}
          icon="FileIco"
          label="Copy"
          disabled={true}
        />
        <ContextMenuItem
          disabled={!activeScene.objects.paste}
          onClick={() => {
            activeScene.objects.paste()
            editor.cancelContextMenuRequest()
          }}
          icon="FileIco"
          label="Paste"
        />
        <ContextMenuItem
          disabled={true}
          onClick={() => {
            activeScene.objects.remove()
            activeScene.objects.remove()
            editor.cancelContextMenuRequest()
          }}
          icon="Trash"
          label="Delete"
        />
        <div style={{ margin: "0.5rem 0" }} />
        <ContextMenuItem
          disabled={true}
          onClick={() => {
            activeScene.objects.bringToFront()
            editor.cancelContextMenuRequest()
          }}
          icon="BringToFront"
          label="Bring to front"
        />
        <ContextMenuItem
          disabled={true}
          onClick={() => {
            activeScene.objects.bringForward()
            editor.cancelContextMenuRequest()
          }}
          icon="BringForward"
          label="Bring forward"
        />
        <ContextMenuItem
          disabled={true}
          onClick={() => {
            activeScene.objects.sendToBack()
            editor.cancelContextMenuRequest()
          }}
          icon="SendToBack"
          label="Send back"
        />
        <ContextMenuItem
          disabled={true}
          onClick={() => {
            activeScene.objects.sendBackwards()
            editor.cancelContextMenuRequest()
          }}
          icon="SendBackwards"
          label="Send backward"
        />
        <div style={{ margin: "0.5rem 0" }} />
        <ContextMenuItem
          disabled={true}
          onClick={() => {
            activeScene.objects.lock()
            editor.cancelContextMenuRequest()
          }}
          icon="Unlock"
          label="Lock"
        />
        {/* <ContextMenuItem
          disabled={true}
          onClick={() => {
            saveAsComponentHandler()
            editor.cancelContextMenuRequest()
          }}
          icon="FileIco"
          label="Save as component"
        /> */}
      </div>
    )
  }
  return (
    <>
      {!contextMenuRequest.target.locked ? (
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
          />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.paste()
              editor.cancelContextMenuRequest()
            }}
            icon="Paste"
            label="Paste"
          />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.remove()
              activeScene.objects.remove()
              editor.cancelContextMenuRequest()
            }}
            icon="Trash"
            label="Delete"
          />
          <div style={{ margin: "0.5rem 0" }} />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.bringToFront()
              editor.cancelContextMenuRequest()
            }}
            icon="BringToFront"
            label="Bring to front"
          />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.bringForward()
              editor.cancelContextMenuRequest()
            }}
            icon="BringForward"
            label="Bring forward"
          />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.sendToBack()
              editor.cancelContextMenuRequest()
            }}
            icon="SendToBack"
            label="Send back"
          />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.sendBackwards()
              editor.cancelContextMenuRequest()
            }}
            icon="SendBackwards"
            label="Send backward"
          />
          <div style={{ margin: "0.5rem 0" }} />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.lock()
              editor.cancelContextMenuRequest()
            }}
            icon="Unlock"
            label="Lock"
          />
          {/* <ContextMenuItem
            onClick={() => {
              saveAsComponentHandler()
              editor.cancelContextMenuRequest()
            }}
            icon="FileIco"
            label="Save as component"
          /> */}
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
    else if (icon === "BringToFront") return <LayerToFront size={24} />
    else if (icon === "SendBackwards") return <LayerBackward size={24} />
    else if (icon === "SendToBack") return <LayerToBack size={24} />
    else if (icon === "BringForward") return <LayerForward size={24} />
    else if (icon === "Trash") return <Trash size={24} />
    else if (icon === "Unlock") return <Unlock size={24} />
    else if (icon === "Copy") return <Copy size={24} />
    else if (icon === "Paste") return <Paste size={15} />
    else return <Mail size={24} />
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
