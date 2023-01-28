import img1 from "../../assets/gantas-vaiciulenas-0f-cj2E49IQ-unsplash.jpg"
import img2 from "../../assets/gantas-vaiciulenas-GY9s45DLCDk-unsplash.jpg"
import img3 from "../../assets/gantas-vaiciulenas-KYW2sGJNsFU-unsplash.jpg"
import img4 from "../../assets/gantas-vaiciulenas-XH8P08TXX9o-unsplash.jpg"
import img5 from "../../assets/gantas-vaiciulenas-cJjjWbXwUBs-unsplash.jpg"
import img6 from "../../assets/gantas-vaiciulenas-nKMbaKwUHRY-unsplash.jpg"
import img7 from "../../assets/gantas-vaiciulenas-s5tmgOi1ZEY-unsplash.jpg"
import img8 from "../../assets/gantas-vaiciulenas-wZWZGkIY_Nc-unsplash.jpg"

export const IMG_COORD = [
  { img: img1, col: 1, row: 1 },
  { img: img2, col: 2, row: 1 },
  { img: img3, col: 3, row: 1 },
  { img: img4, col: 5, row: 1 },
  { img: img5, col: 1, row: 2 },
  { img: img6, col: 4, row: 2 },
  { img: img7, col: 6, row: 2 },
  { img: img8, col: 2, row: 3 },
  { img: img1, col: 2, row: 3 },
  { img: img2, col: 3, row: 3 },
  { img: img3, col: 6, row: 3 },
  { img: img4, col: 1, row: 4 },
  { img: img5, col: 2, row: 4 },
  { img: img6, col: 4, row: 4 },
  { img: img7, col: 5, row: 4 },
  { img: img8, col: 3, row: 5 },
  { img: img1, col: 4, row: 5 },
  { img: img2, col: 5, row: 5 },
  { img: img3, col: 6, row: 5 },
]

export const DOM = [
  { text: "SW_001", imgs: [img1, img2, img3, img4] },
  { text: "SW_002", imgs: [img5] },
  { text: "SW_003", imgs: [img6, img7, img8, img4, img6] },
  { text: "SW_004", imgs: [img1, img2] },
  { text: "SW_005", imgs: [img3, img4, img7] },
  { text: "SW_006", imgs: [img1, img2, img3, img4] },
]

export const IMG_ARRAY = () => {
  let t = new Array()
  DOM.forEach((el) => (t = t.concat(el.imgs)))

  return t
}
