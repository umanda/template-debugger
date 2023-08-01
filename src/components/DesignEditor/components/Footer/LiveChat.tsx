import React from "react"
import { Flex } from "@chakra-ui/react"

const LiveChat = React.forwardRef(({ children }: { children: React.ReactNode }, ref: any) => {
  const script = document.createElement("script")

  script.innerHTML = `
       window.__lc = window.__lc || {};
       window.__lc.license = 12657963;
       (function() {
         var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
         lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
         var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
       })();`

  document.head.appendChild(script)

  return (
    <Flex>
      <Flex
        className="show-n-open-livechat"
        //@ts-ignore
        onClick={() => window.LC_API.open_chat_window()}
      >
        {children}
      </Flex>
    </Flex>
  )
})

export default LiveChat
