import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons"
import { useSelector } from "react-redux"
import { selectUser } from "~/store/user/selector"
import { useAppDispatch } from "~/store/store"
import { signOut } from "~/store/user/action"

export default function Navigation() {
  const { isOpen, onToggle } = useDisclosure()

 // const { currentUser, r2efreshCurrentUser } = useUser();

 const dispatch = useAppDispatch()
 const user = useSelector(selectUser);
 

  const handleLogOut = async () => {
    const resolve = await dispatch(signOut())
    if (resolve) {
      window.location.href = '/auth/sign-in'
    } else {
      
    }
  }

  const handleOpenDebugger = () => {
    window.location.href = '/composer/'
  }

  const handleOpenSmartSearch = () => {
    window.location.href = '/smart-search'
  }

  return (
    <Box position={"relative"} zIndex={1000}>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex flex={{ base: 1, md: "auto" }} ml={{ base: -2 }} display={{ base: "flex", md: "none" }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            as={"a"}
            href="/"
            fontSize={"xl"}
            fontWeight={600}
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
          >
            Hadgrid
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack flex={{ base: 1, md: 0 }} justify={"flex-end"} direction={"row"} spacing={6}>
          {user === null ? (
            <>
              <Button as={"a"} color={"black"} fontSize={"lg"} fontWeight={600} variant={"link"} href={"/auth/sign-in"}>
                Sign In
              </Button>
            </>
          ) : (
            <>
            <Button
              onClick={handleOpenSmartSearch}
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"md"}
              px={6}
              py={6}
              minWidth={'150px'}
              fontWeight={600}
              bgGradient="linear(to-r, blue.600,blue.400)"
              color={"white"}
              _hover={{
                bgGradient: "linear(to-r, blue.400,blue.600)",
                boxShadow: "md"
              }}
            >
              Test Smart Search
            </Button>
            <Button
              onClick={handleOpenDebugger}
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"md"}
              px={6}
              py={6}
              width={'150px'}
              fontWeight={600}
              bgGradient="linear(to-r, green.600,green.400)"
              color={"white"}
              _hover={{
                bgGradient: "linear(to-r, green.400,green.600)",
                boxShadow: "md"
              }}
            >
              Open Debugger
            </Button>
            <Button

              onClick={handleLogOut}
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"md"}
              px={6}
              py={6}
              width={'150px'}
              fontWeight={600}
              bgGradient="linear(to-r, primary.500,secondary.300)"
              color={"white"}
              _hover={{
                bgGradient: "linear(to-r, secondary.300,primary.500)",
                boxShadow: "md"
              }}
            >
              Sign Out
            </Button>
            </>            
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  )
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200")
  const linkHoverColor = useColorModeValue("gray.800", "white")
  const popoverContentBgColor = useColorModeValue("white", "gray.800")

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Box
                as="a"
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"lg"}
                fontWeight={600}
                color={linkColor}
                target={navItem.target ?? "_self"}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor
                }}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent border={0} boxShadow={"xl"} bg={popoverContentBgColor} p={4} rounded={"xl"} minW={"sm"}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  )
}

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      as="a"
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text transition={"all .3s ease"} _groupHover={{ color: "pink.400" }} fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  )
}

const MobileNav = () => {
  return (
    <Stack bg={useColorModeValue("white", "gray.800")} p={4} display={{ md: "none" }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? "#"}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: "none"
        }}
      >
        <Text fontWeight={600} color={useColorModeValue("gray.600", "gray.200")}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Box as="a" key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
  target?: string
}

const NAV_ITEMS: Array<NavItem> = [
  /* {
    label: 'Inspiration',
    children: [
      {
        label: 'Explore Design Work',
        subLabel: 'Trending Design to inspire you',
        href: '#',
      },
      {
        label: 'New & Noteworthy',
        subLabel: 'Up-and-coming Designers',
        href: '#',
      },
    ],
  }, */
  /* {
    label: 'Find Work',
    children: [
      {
        label: 'Job Board',
        subLabel: 'Find your dream design job',
        href: '#',
      },
      {
        label: 'Freelance Projects',
        subLabel: 'An exclusive list for contract work',
        href: '#',
      },
    ],
  }, */
  /* {
    label: "About MAIA",
    href: "#"
  },
  {
    label: "Drawify.com",
    href: "https://drawify.com/",
    target : "_blank"
  } */
]
