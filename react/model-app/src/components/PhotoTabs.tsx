import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Photo } from '../types';
import ImageModal from './ImageModal';

interface Props {
  photos: Photo[];
}

const PhotoTabs: React.FC<Props> = ({ photos }) => {
  const [key, setKey] = useState<string>(photos[0]?.id.toString() || '');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <Tabs activeKey={key} onSelect={k => k && setKey(k)}>
        {photos.map(photo => (
          <Tab eventKey={photo.id.toString()} title={`Photo ${photo.id}`} key={photo.id}>
            <img
              src={photo.externalPath}
              alt={photo.filename}
              style={{ maxWidth: '100%', cursor: 'pointer' }}
              onClick={() => setSelectedPhoto(photo)}
            />
          </Tab>
        ))}
      </Tabs>
      {selectedPhoto && <ImageModal photo={selectedPhoto} onHide={() => setSelectedPhoto(null)} />}
    </>
  );
};

export default PhotoTabs;