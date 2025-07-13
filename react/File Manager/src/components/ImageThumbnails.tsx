import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { fetchFilesInDirectory } from '../api/api';

interface Props {
  selectedDir: string;
}

const ImageThumbnails: React.FC<Props> = ({ selectedDir }) => {
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    fetchFilesInDirectory(selectedDir).then(data => {
      const imgs = data
        .filter((f: any) => /\.(jpe?g|png|gif)$/i.test(f.name))
        .map((f: any) => ({ name: f.name, url: f.url! }));
      setImages(imgs);
    });
  }, [selectedDir]);

  return (
    <div className="d-flex flex-wrap">
      {images.map(img => (
        <Image
          key={img.name}
          src={img.url}
          thumbnail
          width={100}
          className="m-1"
        />
      ))}
    </div>
  );

}

export default ImageThumbnails;
