import { Button, Center, Flex, Text, Textarea, useDisclosure } from "@chakra-ui/react"
import { useCallback, useState } from "react"
import GenerateIADesign from "~/components/Modals/GenerateIADesign"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { useActiveScene, useEditor } from "~/layerhub"
import * as api from "~/services/api"

export default function () {
  const editor: any = useEditor()
  const { setInputActive } = useDesignEditorContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [dataText, setDataText] = useState<string>(null)
  const activeScene = useActiveScene()
  const [err, setErr] = useState<string>(null)

  const generateDesign = useCallback(async () => {
    try {
      onOpen()
      await editor.design.addScene()
      const resolve: any = await api.getDesignIA(dataText)
      await editor.design.scenes[editor.design.scenes.length - 1].setScene(resolve.project.scenes[0])
      onClose()
    } catch (err) {
      setErr("Please enter a valid text.")
      onClose()
    }
  }, [editor, dataText, activeScene])

  return (
    <Flex
      h="full"
      sx={{
        width: "320px",
        borderRight: "1px solid #ebebeb",
        padding: "1rem",
        gap: "1rem",
        flexDirection: "column"
      }}
    >
      <GenerateIADesign isOpen={isOpen} onClose={onClose} />
      <Text>Your Text</Text>
      <Textarea
        h="50%"
        onFocus={() => setInputActive(true)}
        onBlur={() => setInputActive(false)}
        onChange={(e) => setDataText(e.target.value)}
        placeholder="Describe what you would like to generate"
      />
      <Button marginBottom="20px" w="min" colorScheme={"brand"} onClick={() => generateDesign()}>
        Generate another
      </Button>
      <Center fontWeight={600} color="red">
        {err}
      </Center>
    </Flex>
  )
}
