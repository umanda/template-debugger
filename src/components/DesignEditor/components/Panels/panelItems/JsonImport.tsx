import { Box, Button, Center, Flex, Image, Text, Textarea, useDisclosure, useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import useResourcesContext from "~/hooks/useResourcesContext"
import { useActiveScene, useDesign, useEditor, useZoomRatio } from "~/layerhub"
import { useAppDispatch } from "~/store/store"
import { selectUser } from "~/store/user/selector"
import { loadGraphicTemplate } from "~/utils/fonts"
const redirectPayments = import.meta.env.VITE_PAYMENTS

export default function () {

  const editor: any = useEditor()
  const { setInputActive } = useDesignEditorContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [dataText, setDataText] = useState<any>("")
  const activeScene = useActiveScene()
  const user = useSelector(selectUser)
  const userPromt = localStorage.getItem("user_prompt")
  const toast = useToast()
  const dispatch = useAppDispatch()
  const design = useDesign()
  const { setLoadCanva, setDimensionZoom, loadCanva } = useResourcesContext()

  const zoomRatio = useZoomRatio() as number;

  const importDesign = useCallback(async () => {
    try {
      
      const jsonData = JSON.parse(dataText)
      console.log(jsonData);
      await loadGraphicTemplate(jsonData)
      await design.setDesign(jsonData)
      
      setLoadCanva(true)
    } catch (err) {
      console.log(err);
      toast({
        title: "SOMETING WENT WRONG, PLEASE TRY AGAIN.",
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
      {user?.plan === "HERO" || user?.count_free_requests !== undefined ? (
        <>
        
          <Text>Please paste your JSON</Text>
          <Textarea
            h="50%"
            value={dataText}
            onFocus={() => setInputActive(true)}
            onBlur={() => setInputActive(false)}
            onChange={(e) => setDataText(e.target.value)}
            placeholder="Paste your project or template JSON here"
          />
          
          <Button
            isDisabled={user?.count_free_requests === 0 ? true : false}
            marginBottom="20px"
            w="min"
            colorScheme={"brand"}
            onClick={() => importDesign()}
          >
            Import your JSON
          </Button>
          {user?.count_free_requests >= 0 && (
            <Flex justify="center" flexDir="column" gap="15px">
              <Flex
                color={
                  user?.count_free_requests <= 5 ? "#911956" : user?.count_free_requests <= 10 ? "#FF8B55" : "#545465"
                }
                gap="5px"
              >
                <Information size={24} />
                {user?.count_free_requests === 0
                  ? "No auto-generations left"
                  : `${user?.count_free_requests} auto-generations left`}
              </Flex>
              <Button
                onClick={() => window.open(redirectPayments)}
                size="xs"
                color="#5456F5"
                variant="solid"
                bg="#EEFCFD"
                leftIcon={<MagicLink size={20} />}
              >
                Unlock infinite auto-generations! Upgrade now
              </Button>
            </Flex>
          )}
        </>
      ) : (
        <Center h="full" flexDir="column">
          <Image src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/magic-search.png" />
          <Text w="100%" textAlign="center" marginBottom="20px">
            Spark your imagination!
          </Text>
          <Text w="100%" textAlign="center">
            Unleash the magic of AI-generated visual stories by upgrading your subscription.
          </Text>
          <Button
            onClick={() => window.open(redirectPayments, `_blank`)}
            borderRadius="10px"
            borderColor="#5456F5"
            color="#5456F5"
            variant="outline"
            marginTop="20px"
          >
            Upgrade to unlock
          </Button>
        </Center>
      )}
    </Flex>
  )
}
