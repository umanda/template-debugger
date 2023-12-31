import { IScene, ILayer, IStaticText, IDesign } from "@layerhub-pro/types"

export const loadFonts = (fonts: { name: string; url: string }[]) => {
  const promisesList = fonts.map((font) => {
    return new FontFace(font.name!, `url(${font.url})`).load().catch((err) => err)
  })
  return new Promise((resolve, reject) => {
    Promise.all(promisesList)
      .then((res) => {
        res.forEach((uniqueFont) => {
          if (uniqueFont && uniqueFont.family) {
            document.fonts.add(uniqueFont)
            resolve(true)
          }
        })
      })
      .catch((err) => reject(err))
  })
}

const getFontsFromObjects = (objects: any) => {
  let fonts: any[] = []
  for (const object of objects) {
    if (object.type === "StaticText" || object.type === "DynamicText") {
      fonts.push({
        name: (object as Required<IStaticText>).fontFamily,
        url: (object as Required<IStaticText>).fontURL
      })
      if(object.styles){
        object.styles.map((s)=>fonts.push({name:s.style.fontFamily,url:s.style.fontURL}))
      }
    }
    if (object.type === "Group" || object.type === "group") {
      // @ts-ignore
      let groupFonts = getFontsFromObjects(object.objects)

      fonts = fonts.concat(groupFonts)
    }
  }
  return fonts
}

export const loadTemplateFonts = async (design: IScene) => {
  const fonts = getFontsFromObjects(design.layers)
  if (fonts.length > 0) {
    await loadFonts(fonts)
  }
}

export const loadGraphicTemplate = async (payload: IDesign): Promise<void> => {
  const { scenes } = payload
  for (const scn of scenes) {
    const scene: IScene = {
      name: scn.name,
      frame: payload.frame,
      id: scn.id,
      layers: scn.layers,
      metadata: {}
    }
    await loadTemplateFonts(scene)
  }
}
