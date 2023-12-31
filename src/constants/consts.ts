import { nanoid } from "nanoid"
import { IFrame, IScene } from "@layerhub-pro/types"
import { IDesign } from "~/interfaces/editor"

export const FONT_SIZES = [
  { label: 8 },
  { label: 10 },
  { label: 12 },
  { label: 14 },
  { label: 16 },
  { label: 18 },
  { label: 20 },
  { label: 22 },
  { label: 24 },
  { label: 32 },
  { label: 36 },
  { label: 64 },
  { label: 128 }
]

export const TEXT_ALIGNS = ["left", "center", "right", "justify"]

export const generateEmptyDesign = ({ width, height }: { width: number; height: number }): Partial<IDesign> => {
  const scene = generateEmptyScene({ width, height })
  return {
    id: nanoid(),
    name: "Untitled project",
    frame: { width, height },
    scenes: [scene],
    colors: [],
    tags: [],
    imported: false,
    type: "GRAPHIC",
    previews: [],
    metadata: {}
  }
}

export const generateEmptyScene = ({ width, height }: { width: number; height: number }): IScene => {
  return {
    id: nanoid(),
    frame: { width, height },
    layers: [
      {
        id: "background",
        name: "Initial Frame",
        left: 0,
        top: 0,
        width: width,
        height: height,
        type: "Background",
        fill: "#ffffff",
        metadata: {}
      }
    ],
    metadata: {}
  }
}
export const getDefaultTemplate = ({ width, height }: IFrame): IScene => {
  return {
    id: nanoid(),
    frame: {
      width,
      height
    },
    layers: [
      {
        id: "background",
        name: "Initial Frame",
        left: 0,
        top: 0,
        width,
        height,
        type: "Background",
        fill: "#ffffff",
        metadata: {}
      }
    ],
    metadata: {}
  }
}

export const DEFAULT_COLORS = [
  "#000000",
  "#9ea6a8",
  "#d4d8dd",
  "#f1f1f1",
  "#ffffff",
  "#e6f5fb",
  "#fef9ea",
  "#c42204",
  "#f20000",
  "#f898c4",
  "#ee80b3",
  "#ac74b0",
  "#6b59d2",
  "#5e18eb",
  "#014aad",
  "#2f6af1",
  "#73c4e4",
  "#64f6fa",
  "#a7e18d",
  "#7dd957",
  "#3d7c11",
  "#ff5d12",
  "#ffb459",
  "#fff46a",
  "#fff8b0",
  "#db9e4a",
  "#96583b",
  "#61382d"
]

export const DEFAULT_ORDER = ["A - Z", "Most recent", "Most favorites", "Most downloads"]
