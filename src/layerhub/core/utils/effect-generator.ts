import tinycolor from "tinycolor2"

const REF_TARGET = {
  NONE: "fill",
  NEON: "stroke",
  HOLLOW: "stroke",
  LIFT: "fill",
  SHADOW: "fill",
}

const EFFECT_MAP = {
  NONE: "none",
  SHADOW: "shadow",
  HOLLOW: "hollow",
  NEON: "neon",
  LIFT: "lift",
}

export interface EffectGeneratorOptions {
  effect: any
  stroke: any
  strokeWidth: any
  shadow: any
  fill: any
  light: any
}

export class EffectGeneratorNext {
  constructor(public current: EffectGeneratorOptions, public next: EffectGeneratorOptions) {}

  public generate() {
    const nextEffect = this.getNextEffect()
    // @ts-ignore
    return this[EFFECT_MAP[nextEffect]]()
  }

  private none() {
    const refColor = this.getRefColor()
    return {
      effect: "NONE",
      fill: refColor,
      strokeWidth: 0,
      shadow: null,
      stroke: this.current.stroke,
    }
  }

  private shadow() {
    let refColor = this.getRefColor()
    let tc = tinycolor(refColor)
    let opacity = 0.5
    let offsetX = 10
    let offsetY = 10
    let blur = 2
    if (this.current.effect === "SHADOW") {
      const ttc = tinycolor(this.getPrevShadowColor())
      opacity = ttc.getAlpha()
      offsetX = this.current.shadow.offsetX
      offsetY = this.current.shadow.offsetY
      blur = this.current.shadow.blur
    }
    let color = tc.setAlpha(opacity).toRgbString()

    return {
      effect: "SHADOW",
      fill: refColor,
      strokeWidth: 0,
      shadow: {
        blur: blur,
        color: color,
        offsetX,
        offsetY,
      },
    }
  }

  private hollow() {
    const refColor = this.getRefColor()
    return {
      effect: "HOLLOW",
      fill: null,
      stroke: refColor,
      strokeWidth: 2,
      shadow: null,
    }
  }

  private neon() {
    const refColor = this.getRefColor()

    const tc = tinycolor(refColor)
    let light = 10
    if (this.next.light) {
      light = this.next.light
    }
    const lighted = tc.lighten(light).toString()
    return {
      effect: "NEON",
      stroke: refColor,
      strokeWidth: 2,
      fill: lighted,
      light,
      shadow: {
        blur: 40,
        color: refColor,
        offsetX: 0,
        offsetY: 0,
      },
    }
  }

  private lift() {
    const refColor = this.getRefColor()
    return {
      effect: "LIFT",
      fill: refColor,
      shadow: {
        blur: 40,
        color: "rgba(51,51,51,0.5)",
        offsetX: 0,
        offsetY: 0,
      },
    }
  }

  private getRefColor() {
    if (this.next.fill) {
      return this.next.fill
    }
    const prevEffect = this.current.effect ? this.current.effect : "NONE"
    const nextEffect = this.next.effect ? this.next.effect : "NONE"
    if (prevEffect === "NONE") {
      return this.current.fill ? this.current.fill : this.current.stroke ? this.current.stroke : "#333333"
    }

    // @ts-ignore
    const refKey = REF_TARGET[prevEffect]
    // @ts-ignore
    return this.current[refKey]
  }

  private getPrevRefColor() {
    const prevEffect = this.current.effect ? this.current.effect : "NONE"
    // @ts-ignore
    const refKey = REF_TARGET[prevEffect]
    // @ts-ignore
    return this.current[refKey]
  }

  private getPrevShadowColor() {
    // const prevEffect = this.current.effect ? this.current.effect : "NONE"
    // // @ts-ignore
    // const refKey = REF_TARGET[prevEffect]
    // @ts-ignore
    return this.current.shadow.color
  }

  private getNextEffect() {
    return this.next.effect ? this.next.effect : "NONE"
  }

  private getCurrentEffect() {
    return this.current.effect ? this.current.effect : "NONE"
  }
}

// export class EffectGenerator {
//   constructor(
//     private name: string,
//     public fill: string | null,
//     public stroke: string | null,
//     public prevEffect?: string
//   ) {}

//   public generate() {
//     // @ts-ignore
//     return this[EFFECT_MAP[this.name]]()
//   }

//   private none() {
//     const refColor = this.getRefColor()
//     return {
//       effect: "NONE",
//       fill: refColor,
//       strokeWidth: 0,
//       shadow: null,
//       stroke: this.stroke,
//     }
//   }
//   private shadow() {
//     const refColor = this.getRefColor()
//     const tc = tinycolor(refColor)
//     const tcOpacity = tc.setAlpha(0.5).toRgbString()
//     return {
//       effect: "SHADOW",
//       fill: this.fill,
//       shadow: {
//         blur: 2,
//         color: tcOpacity,
//         offsetX: 10,
//         offsetY: 10,
//       },
//     }
//   }

//   private lift() {
//     const refColor = this.getRefColor()
//     return {
//       effect: "LIFT",
//       fill: refColor,
//       shadow: {
//         blur: 40,
//         color: "rgba(51,51,51,0.5)",
//         offsetX: 0,
//         offsetY: 0,
//       },
//     }
//   }

//   private neon() {
//     const refColor = this.getRefColor()
//     const tc = tinycolor(refColor)
//     const lighted = tc.lighten(10).toString()
//     return {
//       effect: "NEON",
//       stroke: refColor,
//       strokeWidth: 2,
//       fill: lighted,
//       shadow: {
//         blur: 40,
//         color: refColor,
//         offsetX: 0,
//         offsetY: 0,
//       },
//     }
//   }
//   private hollow() {
//     const refColor = this.getRefColor()
//     return {
//       effect: "HOLLOW",
//       fill: null,
//       stroke: refColor,
//       strokeWidth: 2,
//       shadow: null,
//     }
//   }

//   private getRefColor() {
//     const prev = this.prevEffect ? this.prevEffect : "NONE"
//     // @ts-ignore
//     const refKey = REF_TARGET[prev]
//     // @ts-ignore
//     return this[refKey]
//   }
// }
