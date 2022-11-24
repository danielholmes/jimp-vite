import { Image, loadImage, createCanvas } from "canvas";
import { Jimp } from "@jimp/core"
import CustomJimp from "./custom-jimp";

function createCanvasContext2d(
    width: number,
    height: number
  ): CanvasRenderingContext2D {
    const context2d = createCanvas(width, height).getContext("2d", {
      alpha: false,
    });
    if (!context2d) {
      throw new Error("No context 2d");
    }
    return context2d;
  }
  

async function drawImageToMaxSizedImageData(
  image: Image
): Promise<ImageData> {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const ctx = createCanvasContext2d(width, height);
  ctx.drawImage(image as any, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

async function imageDataToJimp(imageData: ImageData): Promise<Jimp> {
  const jimp = await CustomJimp.create(imageData.width, imageData.height);
  for (let x = 0; x < imageData.width; x++) {
    for (let y = 0; y < imageData.height; y++) {
      const baseI = (x + y * imageData.width) * 4;
      const r = imageData.data[baseI];
      const g = imageData.data[baseI + 1];
      const b = imageData.data[baseI + 2];
      const a = 0xff;
      /* eslint-disable-next-line no-bitwise */
      const colour = ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
      jimp.setPixelColour(colour, x, y);
    }
  }
  return jimp;
}

async function parseImageUrlToJimp(
  src: string
): Promise<Jimp> {
  try {
    const image = await loadImage(src.toString(), { crossOrigin: "Anonymous" });
    const imageData = await drawImageToMaxSizedImageData(image);
    return await imageDataToJimp(imageData);
  } catch (e) {
    console.error(e);
    throw new Error(`There was an error reading your image file`);
  }
}

async function readFile(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
        if (!event.target) {
            reject(new Error("No target"));
            return;
        }
      resolve(event.target.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsDataURL(file);
  });
}

// The simple way is FileReader -> ArrayBuffer -> Jimp.read
// This was using a lot of memory and giving an error for 5.7MB 5000x5000 image.
// Strategy here instead is to load in image then draw to canvas, then extract
// i.e. Using the browser's native jpeg parsing.
// Another advantage here is that it parses formats jimp can't handle (e.g. webp)
async function parseUploadedFileToJimp(
  file: File
): Promise<Jimp> {
  const contents = await readFile(file);
  if (typeof contents !== "string") {
    throw new Error("We weren't able to read this image file");
  }
  return parseImageUrlToJimp(contents);
}

export { parseImageUrlToJimp, parseUploadedFileToJimp };
