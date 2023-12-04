import { Box, Button, Center, Flex, Image, Text, Textarea, useDisclosure, useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { useActiveScene, useDesign, useEditor } from "~/layerhub"
import { useAppDispatch } from "~/store/store"
import { selectUser } from "~/store/user/selector"


export default function () {
  const editor: any = useEditor()
  const { setInputActive } = useDesignEditorContext()
  const [dataText, setDataText] = useState<any>("")
  const activeScene = useActiveScene()
  const user = useSelector(selectUser)
  const toast = useToast()
  const design = useDesign();

  useEffect(() => {
    
  }, [])

  const exportDesign = useCallback(async () => {
    try {
      let designData = design.toJSON();
      setDataText(JSON.stringify(designData));
    } catch (err) {
      toast({
        title: "Someting went wrong",
        status: "error",
        position: "top-right",
        duration: 4000,
        isClosable: true
      })
    }
  }, [editor, dataText, activeScene, user])

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
      <>   
          <Text>Choose Export Json button to export your project as a Json</Text>
          <Button
            isDisabled={user?.count_free_requests === 0 ? true : false}
            marginBottom="20px"
            w="min"
            colorScheme={"brand"}
            onClick={() => exportDesign()}
          >
            Export JSON
          </Button>
          <Textarea
            h="50%"
            value={dataText}
            onFocus={() => setInputActive(true)}
            onBlur={() => setInputActive(false)}
            onChange={(e) => setDataText(e.target.value)}
            placeholder="Describe what you would like to generate"
          />
          
        </>
    </Flex>
  )
}
