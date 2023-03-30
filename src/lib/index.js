import State from "./state"

export const IMG_COORD = [
  { col: 4, row: 1 },
  { col: 8, row: 1 },
  { col: 10, row: 1 },
  { col: 1, row: 2 },
  { col: 3, row: 2 },
  { col: 9, row: 2 },
  { col: 3, row: 3 },
  { col: 7, row: 3 },
  { col: 11, row: 3 },
]

export const loaderWords = [
  "triangle",
  "quadrilateral",
  "pentagon",
  "hexagon",
  "heptagon",
  "octogon",
  "nonagon",
  "decagon",
  "hendecagon",
  "dodecagon",
]

export const STATE = new State()

const PROJECT_ID = "r21elry8"
const DATASET = "production"
const GALLERY_QUERY = encodeURIComponent(
  '*[_type == "gallery"]{"src": image.asset->url}'
)
const GALLERY_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${GALLERY_QUERY}`
const SELECTED_QUERY = encodeURIComponent('*[_type == "selected"]')
const SELECTED_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${SELECTED_QUERY}`

export function getGallery() {
  return fetch(GALLERY_URL)
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      return data.result
    })
    .catch((err) => console.error(err))
}

export function getSelected() {
  return fetch(SELECTED_URL)
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      return data.result
    })
    .catch((err) => console.error(err))
}
