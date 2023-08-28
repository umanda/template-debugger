import { Box, Button, Center, Flex, Image, Text, Textarea, useDisclosure, useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import GenerateIADesign from "~/components/Modals/GenerateIADesign"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { useActiveScene, useEditor } from "~/layerhub"
import * as api from "~/services/api"
import { selectUser } from "~/store/user/selector"
import { loadGraphicTemplate } from "~/utils/fonts"

const redirectPayments = import.meta.env.VITE_PAYMENTS

export default function () {
  const editor: any = useEditor()
  const { setInputActive } = useDesignEditorContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [dataText, setDataText] = useState<string>("")
  const activeScene = useActiveScene()
  const [err, setErr] = useState<string>(null)
  const user = useSelector(selectUser)
  const userPromt = localStorage.getItem("user_prompt")
  const toast = useToast()

  useEffect(() => {
    if (userPromt !== undefined || userPromt !== null || userPromt !== "") {
      setDataText(userPromt)
      localStorage.removeItem("user_prompt")
    }
  }, [])

  const generateDesign = useCallback(async () => {
    try {
      onOpen()
      const resolve: any = await api.getDesignIA(dataText)
      await editor.design.addScene()
      await loadGraphicTemplate(resolve.project)
      await editor.design.scenes[editor.design.scenes.length - 1].setScene(resolve.project.scenes[0])
      setErr(null)
      onClose()
    } catch (err) {
      if (err?.response?.data?.message) {
        setErr(err?.response?.data?.message)
      } else {
        toast({
          title: "NETWORK ERROR, PLEASE TRY AGAIN.",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true
        })
      }
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
      {user.plan === "HERO" ? (
        <>
          <GenerateIADesign isOpen={isOpen} onClose={onClose} />
          <Text>Your Text</Text>
          <Textarea
            h="50%"
            value={dataText}
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
