import { nanoid } from "nanoid"
import { IFrame, IScene } from "@layerhub-pro/types"
import { IDesign } from "../interfaces/editor"

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
  "#9EA6A8",
  "#D4D8DD",
  "#DD728E",
  "#2D75B2",
  "#73C4E4",
  "#47C2BC",
  "#47AB84",
  "#92D078",
  "#FFB459",
  "#FFF46A",
  "#FF8E40",
  "#AC74B0",
  "#EE80B3",
  "#96583B",
  "#DB9E4A",
  "#844D3D",
  "#B1956C",
  "#FFECB0",
  "#FAFAFA",
  "#252525",
  "#A7E18D"
]

export const DEFAULT_ORDER = ["A - Z", "Most recent", "Most favorites", "Most downloads"]

export const DEFAULT_SHAPES = [
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_A_1.svg", type: "outfilled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_A_2.svg", type: "outfilled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_A_3.svg", type: "outfilled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_A_4.svg", type: "outfilled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_A_5.svg", type: "outfilled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_A_6.svg", type: "outfilled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_A_7.svg", type: "outfilled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_A_8.svg", type: "outfilled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_A_9.svg", type: "outfilled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_A_10.svg", type: "outfilled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_A_11.svg", type: "outfilled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_A_12.svg", type: "outfilled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_B_1.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_B_2.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_B_3.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_B_4.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_B_5.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_B_6.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_B_7.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_B_8.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_B_9.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_B_10.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_B_11.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_B_12.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_C_1.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_C_2.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_C_3.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_C_4.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_C_5.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_C_6.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_C_7.svg", type: "filled" },
  { image: "https://ik.imagekit.io/jwzv5rwz9/frames/Frame_C_8.svg", type: "filled" }
]
