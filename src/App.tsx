import { ChangeEvent, useState } from 'react'
import Jimp from 'jimp';
import { parseUploadedFileToJimp } from './nativeBrowserImageParsing';

function App() {
  const [image, setImage] = useState<Jimp | undefined>();

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;
    if (files && files.length >= 1) {
      const file = files[0];
      const image = await parseUploadedFileToJimp(file);
      setImage(image);
    }
  };


  return (
    <div>
      <h2>Upload a file to parse with JIMP</h2>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={onFileChange}
      />
      {image ? <div>Got jimp parsed image {image.bitmap.width}x{image.bitmap.height}</div> : <div>No image</div>}
    </div>
  )
}

export default App
