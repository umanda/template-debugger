import {
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react"

const redirectPayments = import.meta.env.VITE_PAYMENTS

export default function ModalUpgradePlan({
  type,
  isOpen,
  onClose
}: {
  type: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}) {
  return (
    <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>UPGRADE</ModalHeader>
        <ModalBody>
          <Flex flexDir="column">
            {type === "PNG"
              ? "Upgrade to download your creation as a PNG file, with no watermark."
              : type === "PDF"
              ? "Upgrade to download your creation as a PDF file, with no watermark."
              : type === "Upload"
              ? "Upgrade to upload and use your own images as part of your Drawify creations."
              : type === "Import"
              ? "Upgrade to import Drawify project files."
              : type === "Export"
              ? "Upgrade to export your project as a Drawify file."
              : "Please upgrade your plan to use this template."}
            {type === "PNG" ? (
              <Image src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/downloadPng.png" />
            ) : type === "PDF" ? (
              <Image src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/downloadPdf.png" />
            ) : type === "Upload" ? (
              <Image src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/upload.png" />
            ) : type === "Import" ? (
              <Image src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/import.png" />
            ) : type === "Export" ? (
              <Image src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/export.png" />
            ) : type === "JPG" ? (
              <Image src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/downloadPng.png" />
            ) : null}
          </Flex>
        </ModalBody>
        <ModalFooter gap="10px">
          <Button colorScheme="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme={"brand"} onClick={() => (window.location.href = redirectPayments)}>
            Upgrade
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
