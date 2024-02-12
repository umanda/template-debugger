// Import necessary components and hooks from React and Chakra UI
import React, { useState, useEffect } from "react"
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  Spinner,
  Image,
  VStack,
  Container,
  Heading,
  Flex,
  Divider,
  Grid
} from "@chakra-ui/react"
import Navigation from "~/home/Navigation"

const SmartSearch = () => {
  const api = {
    live: {
      key: "Pv27lnsS7I3Ko4aOnUvSW3i7FoOgKTFa1997gQ60",
      url: "https://snapsearch.meet-drift.ai/v1/drawify/live/prediction"
    },
    stg: {
      key: "D0EGVaJSpn7fgC5uQItDI8LfEztsuQ0Z5A6Niqq9",
      url: "https://snapsearch.meet-drift.ai/v1/drawify/stg/prediction"
    }
  }

  const [environment, setEnvironment] = useState("stg")
  const [query, setQuery] = useState("Apple")
  const [limit, setLimit] = useState("10")
  const [style, setStyle] = useState("Cartoon")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [timeTaken, setTimeTaken] = useState("")

  const styles = [
    { name: "Cartoon", drawifiers: [4, 6, 7, 10, 15, 16, 20, 30, 32, 34, 37, 44] },
    { name: "Clean", drawifiers: [2, 26] },
    { name: "Doodle", drawifiers: [19, 33, 40, 41, 42, 43] },
    { name: "Monoline", drawifiers: [22, 29, 39] },
    { name: "Realistic", drawifiers: [9, 18] },
    { name: "Sketchnote", drawifiers: [1, 8, 17, 24, 27, 28] }
  ]

  const handleSearch = async () => {
    setLoading(true)
    const startTime = performance.now()

    try {
      const response = await fetch(api[environment].url, {
        method: "POST",
        headers: {
          "x-api-key": api[environment].key,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, limit, page: 1 })
      })

      if (!response.ok) throw new Error("Network response was not ok")

      const data = await response.json()
      const styleDrawifiers = styles.find((s) => s.name === style).drawifiers

      const fResults = data.prediction.filter((item) => {
        const drawifier = parseInt(item.split("/")[0])
        return styleDrawifiers.includes(drawifier)
      })

      setFilteredResults(fResults)
      setResults(data.prediction)
      const endTime = performance.now()
      setTimeTaken(`Time taken: ${(endTime - startTime).toFixed(2)} ms`)
    } catch (error) {
      console.error("Error fetching data: ", error)
      setTimeTaken("")
    }

    setLoading(false)
  }

  return (
    <Container maxW={"full"}>
      <Navigation />

      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="30px auto"
        as="form"
      >
        <Heading w="100%" textAlign={"center"} fontSize="2xl" fontWeight="normal">
          Drawify Filtered Search
        </Heading>
        <Divider my="15px" />
        <Flex width="full">
          <FormControl mr="5%">
            <FormLabel htmlFor="first-name" fontWeight={"normal"}>
              Environment
            </FormLabel>
            <RadioGroup defaultValue="stg" onChange={setEnvironment}>
              <Stack direction="row">
                <Radio value="stg">Staging</Radio>
                <Radio value="live">Production</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl mr="5%">
            <FormLabel>Result Limit</FormLabel>
            <Input type="text" value={limit} onChange={(e) => setLimit(e.target.value)} width="150px" />
          </FormControl>
        </Flex>
        <Divider my="15px" />
        <Flex>
          <FormControl mr="5%">
            <FormLabel as="legend">Styles</FormLabel>
            <RadioGroup defaultValue="Cartoon" onChange={setStyle}>
              <Stack direction="row">
                {styles.map((style, index) => (
                  <Radio key={index} value={style.name}>
                    {style.name}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>
        </Flex>
        <Flex my="15px">
          <FormControl mr="5%" isRequired>
            <FormLabel>Prompt</FormLabel>
            <Textarea width="full" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter query" />
          </FormControl>
        </Flex>
        <Flex my="15px">
          <FormControl mr="5%" isRequired>
            <Button
              colorScheme="teal"
              variant="solid"
              w="7rem"
              mr="5%"
              onClick={handleSearch}
              isLoading={loading}
              loadingText="Searching"
            >
              Search
            </Button>
            <Text>{timeTaken}</Text>
          </FormControl>
        </Flex>
      </Box>

      <Grid m="30px auto" width="container.lg" display="flex">
        <Box backgroundColor="gray.50" p="30px" marginRight="30px" width="534px">
          <Text mb="15px" borderBottom="1px solid" borderBottomColor="gray.300">
            Unfiltered Original Result
          </Text>
          <Grid templateColumns="repeat(3, 1fr)" gap={3}>
            {results.map((result, index) => (
              <Box
                width="150px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="150px"
                key={index}
                border="1px"
                borderColor="gray.200"
                p="3px"
              >
                <Image
                  src={`https://project-drawify-v2.s3.eu-west-3.amazonaws.com/drawings/${result}.svg`}
                  objectFit="fill"
                  width="125px"
                  height="125px"
                />
              </Box>
            ))}
          </Grid>
        </Box>
        <Box backgroundColor="gray.50" p="30px" marginLeft="0 30px" width="534px">
          <Text mb="15px" borderBottom="1px solid" borderBottomColor="gray.300">
            Filtered Result by Style
          </Text>

          <Grid templateColumns="repeat(3, 1fr)" gap={3}>
            {filteredResults.map((result, index) => (
              <Box
                width="150px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="150px"
                key={index}
                border="1px"
                borderColor="gray.200"
                p="3px"
              >
                <Image
                  src={`https://project-drawify-v2.s3.eu-west-3.amazonaws.com/drawings/${result}.svg`}
                  objectFit="fill"
                  width="125px"
                  height="125px"
                />
              </Box>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Container>
  )
}

export default SmartSearch
