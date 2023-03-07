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
import ModalDownloadPNG from "~/assets/images/ModalDownloadPNG.png"
import ModalDownloadPDF from "~/assets/images/ModalDownloadPDF.png"
import ModalExport from "~/assets/images/ModalExport.png"
import ModalImport from "~/assets/images/ModalImport.png"
import ModalUpload from "~/assets/images/ModalUpload.png"

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
              <Image src={ModalDownloadPNG} />
            ) : type === "PDF" ? (
              <Image src={ModalDownloadPDF} />
            ) : type === "Upload" ? (
              <Image src={ModalUpload} />
            ) : type === "Import" ? (
              <Image src={ModalImport} />
            ) : type === "Export" ? (
              <Image src={ModalExport} />
            ) : type === "JPG" ? (
              <Image src={ModalDownloadPNG} />
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
