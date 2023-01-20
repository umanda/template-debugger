import React, { useEffect, useRef, useState } from "react"
import { Box, Button, FormControl, Input, InputGroup, InputRightElement, FormLabel, Flex, Text } from "@chakra-ui/react"
import { AuthType } from "./AuthModal"
import { SignupDto } from "../interfaces/user"
import { useAppDispatch } from "../store/store"
import { signup } from "../store/user/action"

interface Props {
  setAuthtype: React.Dispatch<React.SetStateAction<AuthType>>
  onClose: () => void
}

function Signup({ setAuthtype, onClose }: Props) {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  const [error, setError] = React.useState<string>("")
  const [options, setOptions] = React.useState<SignupDto>({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  })
  const inputName = useRef<any>("")
  const inputLastName = useRef<any>("")
  const [disableButton, setDisableButton] = React.useState<boolean>(true)

  const dispatch = useAppDispatch()

  const handleSignup = async () => {
    const response = await dispatch(signup(options))
    if (response.payload) {
      onClose()
    } else {
      setError("Something went wrong")
    }
  }

  const validateInputText = (input: any, patron: any, type: string) => {
    var text = input.current.value
    var letters = text.split("")
    for (var x in letters) {
      var character = letters[x]
      if (!new RegExp(patron, "i").test(character)) {
        letters[x] = ""
      }
    }
    input.current.value = letters.join("")
    type === "name"
      ? setOptions({ ...options, first_name: input.current.value })
      : setOptions({ ...options, last_name: input.current.value })
  }

  let [password, setPassword] = useState("")
  password = options.password
  const [checks, setChecks] = useState({
    capsLetterCheck: false,
    numberCheck: false,
    pwdLengthCheck: false,
    specialCharCheck: false
  })

  const handleOnChange = (e: any) => {
    setPassword(e.target.value)
  }

  const handleOnKeyUp = (e: any) => {
    const { value } = e.target
    const capsLetterCheck = /[A-Z]/.test(value)
    const numberCheck = /[0-9]/.test(value)
    const pwdLengthCheck = value.length >= 8
    const specialCharCheck = /[!@#$%^&*]/.test(value)
    setChecks({
      capsLetterCheck,
      numberCheck,
      pwdLengthCheck,
      specialCharCheck
    })
  }

  useEffect(() => {
    if (checks.capsLetterCheck && checks.numberCheck && checks.pwdLengthCheck && checks.specialCharCheck) {
      setDisableButton(false)
    } else {
      setDisableButton(true)
    }
  }, [checks])

  return (
    <Box marginInline="20px" marginTop="20px">
      Draw your story like a pro!
      <FormControl paddingTop={"10px"} isRequired>
        <FormLabel>First Name</FormLabel>
        <Input
          maxLength={30}
          ref={inputName}
          placeholder="First Name"
          value={options.first_name}
          onChange={(e) => {
            validateInputText(inputName, "[a-z ]", "name")
          }}
        />
      </FormControl>
      <FormControl mt={4} isRequired>
        <FormLabel>Last Name</FormLabel>
        <Input
          maxLength={30}
          ref={inputLastName}
          placeholder="Last Name"
          value={options.last_name}
          onChange={(e) => {
            validateInputText(inputLastName, "[a-z ]", "lastName")
          }}
        />
      </FormControl>
      <FormControl mt={4} isRequired>
        <FormLabel>E-mail</FormLabel>
        <Input
          placeholder="example@example.us"
          type="email"
          value={options.email}
          onChange={(e) => setOptions({ ...options, email: e.target.value })}
        />
      </FormControl>
      <FormControl paddingBottom={"10px"} mt={4} isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            onChange={(e) => {
              handleOnChange
              setOptions({ ...options, password: e.target.value })
            }}
            value={options.password}
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onKeyUp={handleOnKeyUp}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Flex flexDir="column">
        <Text color={checks.pwdLengthCheck ? "green" : "red"}>
          {checks.pwdLengthCheck ? "✓" : "x"} Minimum characters 8.
        </Text>
        <Text color={checks.numberCheck ? "green" : "red"}>{checks.numberCheck ? "✓" : "x"} Numeros minimos 1.</Text>
        <Text color={checks.capsLetterCheck ? "green" : "red"}>
          {checks.capsLetterCheck ? "✓" : "x"} Minimum capital letters 1.
        </Text>
        <Text color={checks.specialCharCheck ? "green" : "red"}>
          {checks.specialCharCheck ? "✓" : "x"} Special symbols minimum 1.
        </Text>
      </Flex>
      <Flex alignItems={"center"} marginTop="10px" flexDirection={"column"}>
        <Button
          fontSize="18px"
          fontWeight="600"
          h="40px"
          background="#5456F5"
          color="white"
          w="full"
          disabled={disableButton}
          onClick={handleSignup}
          _hover={{ cursor: "pointer" }}
        >
          Join Drawify
        </Button>
        <Box marginTop={"10px"}>
          Already a member?
          <Button paddingLeft="5px" color="#5456F5" variant={"link"} onClick={() => setAuthtype("signin")}>
            Sign In
          </Button>
          {error && <Text color="red">{error}</Text>}
        </Box>
      </Flex>
    </Box>
  )
}

export default Signup
