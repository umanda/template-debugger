import { IScene, ILayer, IStaticText } from "@layerhub-pro/types"

export const loadVideoResource = (videoSrc: string): Promise<HTMLVideoElement> => {
  return new Promise(function (resolve, reject) {
    var video = document.createElement("video")
    video.src = videoSrc
    video.crossOrigin = "anonymous"
    video.addEventListener("loadedmetadata", function (event) {
      video.currentTime = 1
    })

    video.addEventListener("seeked", function () {
      resolve(video)
    })

    video.addEventListener("error", function (error) {
      reject(error)
    })
  })
}

export const captureFrame = (video: HTMLVideoElement) => {
  return new Promise(function (resolve) {
    var canvas = document.createElement("canvas") as HTMLCanvasElement
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height)
    URL.revokeObjectURL(video.src)

    const data = canvas.toDataURL()

    fetch(data)
      .then((res) => {
        return res.blob()
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        resolve(url)
      })
  })
}

export const captureDuration = (video: HTMLVideoElement) => {
  return new Promise((resolve) => {
    resolve(video.duration)
  })
}

const getFontsFromObjects = (objects: Partial<ILayer>[]) => {
  let fonts: any[] = []
  for (const object of objects) {
    if (object.type === "StaticText" || object.type === "DynamicText") {
      fonts.push({
        name: (object as Required<IStaticText>).fontFamily,
        url: (object as Required<IStaticText>).fontURL
      })
    }
    if (object.type === "Group") {
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
