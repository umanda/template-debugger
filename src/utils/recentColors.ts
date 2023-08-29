export const stateRecentColors = (color: string, currentColors: string[]) => {
  if (currentColors === null) {
    localStorage.setItem("recentColors", JSON.stringify([color]))
  } else if (color) {
    if (currentColors.find((c) => c === color)) {
      const newColors = currentColors.filter((c) => c !== color)
      localStorage.setItem("recentColors", JSON.stringify([color].concat(newColors)))
    } else {
      if (currentColors.length <= 13) {
        localStorage.setItem("recentColors", JSON.stringify([color].concat(currentColors)))
      } else {
        localStorage.setItem("recentColors", JSON.stringify([color].concat(currentColors.filter((c, i) => i <= 12))))
      }
    }
  }
}
