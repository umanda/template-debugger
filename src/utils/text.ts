import { IStaticText } from "@layerhub-pro/types"
import { groupBy } from "lodash"

export const getTextProperties = (object: Required<IStaticText>, fonts: any[]) => {
  const color = object.fill
  const family = object.fontFamily
  const selectedFont = fonts.find((sampleFont) => sampleFont.post_script_name === family)
  const groupedFonts = groupBy(fonts, "family")
  const selectedFamily = groupedFonts[selectedFont!?.family]
  const hasBold = selectedFamily?.find((font) => font.post_script_name.includes("-Bold"))
  const hasItalic = selectedFamily?.find((font) => font.post_script_name.includes("-Italic"))
  const styleOptions = {
    hasBold: !!hasBold,
    hasItalic: !!hasItalic,
    options: selectedFamily
  }
  if (selectedFamily) {
    return {
      color,
      family: selectedFamily[0]?.family,
      bold: family.includes("Bold"),
      italic: family.includes("Italic"),
      underline: object.underline,
      styleOptions
    }
  } else {
    return null
  }
}
