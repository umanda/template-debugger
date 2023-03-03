import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea
} from "@chakra-ui/react"

export default function NoInternet({ isOpen, onClose }: { isOpen: boolean; onOpen: () => void; onClose: () => void }) {
  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalBody>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="NXLoadingHourglass"
            fill="#adaca9"
            width="80px"
            height="80px"
            fill-rule="evenodd"
            clip-rule="evenodd"
            image-rendering="optimizeQuality"
            shape-rendering="geometricPrecision"
            text-rendering="geometricPrecision"
            version="1.1"
            viewBox="0 0 200 200"
          >
            <g data-animator-group="true" data-animator-type="1">
              <g id="NXhourglass2" fill="inherit">
                <g data-animator-group="true" data-animator-type="2" opacity=".4">
                  <path id="NXhourglass4" d="M100 100l-34.38 32.08v31.14h68.76v-31.14z"></path>
                </g>
                <g data-animator-group="true" data-animator-type="2" opacity=".4">
                  <path id="NXhourglass6" d="M100 100L65.62 67.92V36.78h68.76v31.14z"></path>
                </g>
                <path d="M51.14 38.89h8.33v14.93c0 15.1 8.29 28.99 23.34 39.1 1.88 1.25 3.04 3.97 3.04 7.08s-1.16 5.83-3.04 7.09c-15.05 10.1-23.34 23.99-23.34 39.09v14.93h-8.33a4.859 4.859 0 1 0 0 9.72h97.72a4.859 4.859 0 1 0 0-9.72h-8.33v-14.93c0-15.1-8.29-28.99-23.34-39.09-1.88-1.26-3.04-3.98-3.04-7.09s1.16-5.83 3.04-7.08c15.05-10.11 23.34-24 23.34-39.1V38.89h8.33a4.859 4.859 0 1 0 0-9.72H51.14a4.859 4.859 0 1 0 0 9.72zm79.67 14.93c0 15.87-11.93 26.25-19.04 31.03-4.6 3.08-7.34 8.75-7.34 15.15 0 6.41 2.74 12.07 7.34 15.15 7.11 4.78 19.04 15.16 19.04 31.03v14.93H69.19v-14.93c0-15.87 11.93-26.25 19.04-31.02 4.6-3.09 7.34-8.75 7.34-15.16 0-6.4-2.74-12.07-7.34-15.15-7.11-4.78-19.04-15.16-19.04-31.03V38.89h61.62v14.93z"></path>
              </g>
            </g>
          </svg>
          Working hard to reconnect
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
