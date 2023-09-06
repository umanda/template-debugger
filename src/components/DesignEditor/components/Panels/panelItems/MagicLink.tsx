import { Box, Button, Center, Flex, Image, Text, Textarea, useDisclosure, useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Information from "~/components/Icons/Information"
import MagicLink from "~/components/Icons/MagicLink"
import GenerateIADesign from "~/components/Modals/GenerateIADesign"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { useActiveScene, useEditor } from "~/layerhub"
import * as api from "~/services/api"
import { useAppDispatch } from "~/store/store"
import { reduceFreeRequest } from "~/store/user/action"
import { selectUser } from "~/store/user/selector"
import { loadGraphicTemplate } from "~/utils/fonts"

const redirectPayments = import.meta.env.VITE_PAYMENTS

export default function () {
  const editor: any = useEditor()
  const { setInputActive } = useDesignEditorContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [dataText, setDataText] = useState<string>("")
  const activeScene = useActiveScene()
  const user = useSelector(selectUser)
  const userPromt = localStorage.getItem("user_prompt")
  const toast = useToast()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (userPromt !== null) {
      setDataText(userPromt)
      localStorage.removeItem("user_prompt")
    }
  }, [])

  const generateDesign = useCallback(async () => {
    try {
      onOpen()
      const resolve: any = await api.getDesignIA(dataText)
      activeScene.json.objects.length > 2 && (await editor.design.addScene())
      await loadGraphicTemplate(resolve.project)
      await editor.design.scenes[editor.design.scenes.length - 1].setScene(resolve.project.scenes[0])
      onClose()
      dispatch(reduceFreeRequest(user.count_free_requests - 1))
    } catch (err) {
      toast({
        title: err?.response?.data?.message ? err?.response?.data?.message : "NETWORK ERROR, PLEASE TRY AGAIN.",
        status: "error",
        position: "top-right",
        duration: 4000,
        isClosable: true
      })
      onClose()
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
          <GenerateIADesign isOpen={isOpen} onClose={onClose} />
          <Text>Your Text</Text>
          <Textarea
            h="50%"
            maxLength={13000}
            value={dataText}
            onFocus={() => setInputActive(true)}
            onBlur={() => setInputActive(false)}
            onChange={(e) => setDataText(e.target.value)}
            placeholder="Describe what you would like to generate"
          />
          <Text fontSize="12px" color="#7D8590" textAlign="right">
            {dataText?.length ? dataText?.length : 0} / 13000
          </Text>
          <Button
            isDisabled={user?.count_free_requests === 0 ? true : false}
            marginBottom="20px"
            w="min"
            colorScheme={"brand"}
            onClick={() => generateDesign()}
          >
            Generate
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
                onClick={() => (window.location.href = redirectPayments)}
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
