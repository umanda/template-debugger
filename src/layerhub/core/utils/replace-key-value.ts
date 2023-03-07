import { IStaticText } from "@layerhub-pro/types"
const REGEX_VAR = new RegExp(/\`[\s*a-zA-Z0-9-_.@$!%,();:\/"|&']+?\`/g)

export function replaceParamWithValue(layer: IStaticText, props: Record<string, string> = {}) {
  let text = layer.text
  // @ts-ignore
  let textParams = layer.params as any[]
  function replaces() {
    const matches = text.matchAll(REGEX_VAR)
    let i = 0
    let pieces = ""
    for (const match of matches) {
      const startIndex = match["index"]
      const matchWord = match["0"]

      if (i === 0) {
        const initialSection = text.slice(0, startIndex)
        pieces = pieces + initialSection
      }

      let key = matchWord.substring(0, matchWord.length)

      const customParam = textParams.find((tp) => tp.key === key)

      let updatedValue = matchWord.substring(1, matchWord.length - 1)

      if (customParam) {
        const customProp = props[customParam.name]
        if (customProp) {
          updatedValue = customProp
        }
      }

      pieces = pieces + updatedValue
      const lastPiece = text.slice(startIndex! + matchWord.length, text.length)
      text = pieces + lastPiece
      replaces()
      return false
    }
    return text
  }
  replaces()
  return text
}
