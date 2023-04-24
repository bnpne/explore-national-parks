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

export const API_URL = "https://developer.nps.gov/api/v1/parks?parkCode="

export const PARK_CAROUSEL = [
  {
    title: "Acadia National Park",
    img: "https://www.nps.gov/common/uploads/structured_data/3C7B477B-1DD8-B71B-0BCB48E009241BAA.jpg",
    latLong: "lat:44.409286, long:-68.247501",
    state: "me",
    parkCode: "acad",
  },
  {
    title: "Glacier National Park",
    img: "https://www.nps.gov/common/uploads/structured_data/C1C49B92-9BE9-6A08-F2C851A2A4ACEC8D.jpg",
    latLong: "lat:48.68414678, long:-113.8009306",
    state: "mt",
    parkCode: "glac",
  },
  {
    title: "Grand Canyon National Park",
    img: "https://www.nps.gov/common/uploads/structured_data/3C7B15A4-1DD8-B71B-0BFADECB506765CC.jpg",
    latLong: "lat:36.0001165336, long:-112.121516363",
    state: "az",
    parkCode: "grca",
  },
  {
    title: "Grand Teton National Park",
    img: "https://www.nps.gov/common/uploads/structured_data/3C7FAD94-1DD8-B71B-0B3909D0F78F4B29.jpg",
    latLong: "lat:43.81853565, long:-110.7054666",
    state: "wy",
    parkCode: "grte",
  },

  {
    title: "Great Smokey Mountains National Park",
    img: "https://www.nps.gov/common/uploads/structured_data/3C80EC37-1DD8-B71B-0B87F63E8B030D15.jpg",
    latLong: "lat:35.60116374, long:-83.50818326",
    state: "tn",
    parkCode: "grsm",
  },
  {
    title: "Rocky Mountain National Park",
    img: "https://www.nps.gov/common/uploads/structured_data/42A89EB1-B108-AC7E-35F1E002CF33006A.jpeg",
    latLong: "lat:40.3556924, long:-105.6972879",
    state: "co",
    parkCode: "romo",
  },
  {
    title: "Yellowstone National Park",
    img: "https://www.nps.gov/common/uploads/structured_data/8A729E5B-B263-9C49-7AD4C4B8E70064E0.jpg",
    latLong: "lat:44.59824417, long:-110.5471695",
    state: "id",
    parkCode: "yell",
  },
  {
    title: "Yosemite National Park",
    img: "https://www.nps.gov/common/uploads/structured_data/3C84C97E-1DD8-B71B-0B5DD2112C58C175.jpg",
    latLong: "lat:37.84883288, long:-119.5571873",
    state: "ca",
    parkCode: "yose",
  },
  {
    title: "Zion National Park",
    img: "https://www.nps.gov/common/uploads/structured_data/68BFC1AC-BF96-629F-89D261D78F181C64.jpg",
    latLong: "lat:37.29839254, long:-113.0265138",
    state: "ut",
    parkCode: "zion",
  },
]

export function getParkApi(parkCode) {
  return fetch(API_URL + parkCode, {
    method: "get",
    headers: { "X-Api-Key": import.meta.env.VITE_API_KEY },
  })
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      return data.data[0]
    })
    .catch((err) => {
      console.error(err)
    })
}

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

/////////////////////// SANITY STUFF //////////////////////
// const PROJECT_ID = "r21elry8"
// const DATASET = "production"
// const GALLERY_QUERY = encodeURIComponent(
//   '*[_type == "gallery"]{"src": image.asset->url}'
// )
// const GALLERY_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${GALLERY_QUERY}`
// const SELECTED_QUERY = encodeURIComponent('*[_type == "selected"]')
// const SELECTED_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${SELECTED_QUERY}`
//
// export function getGallery() {
//   return fetch(GALLERY_URL)
//     .then((res) => {
//       return res.json()
//     })
//     .then((data) => {
//       return data.result
//     })
//     .catch((err) => console.error(err))
// }
//
// export function getSelected() {
//   return fetch(SELECTED_URL)
//     .then((res) => {
//       return res.json()
//     })
//     .then((data) => {
//       return data.result
//     })
//     .catch((err) => console.error(err))
// }
