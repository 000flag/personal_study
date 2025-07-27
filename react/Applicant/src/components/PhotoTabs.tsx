import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import type { Photo } from '../types/types';
import ImageModal from './ImageModal';

interface Props {
  photos: Photo[];
}

const photoLabels = [
  '상반신 정면 사진',
  '상반신 45도 사진',
  '상반신 측면 사진',
  '셀카 사진',
  '얼굴 정면 사진',
  '얼굴 45도 사진',
  '얼굴 측면 사진',
];

const PhotoTabs: React.FC<Props> = ({ photos }) => {
  const [key, setKey] = useState<string>(photos[0]?.id.toString() || '');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <Tabs activeKey={key} onSelect={(k) => k && setKey(k)}>
        {photos.map((photo, idx) => (
          <Tab
            eventKey={photo.id.toString()}
            title={photoLabels[idx] || `사진 ${idx + 1}`}
            key={photo.id}
            tabClassName="custom-tab"
          >
            <img
              src={photo.externalPath}
              alt={photo.filename}
              style={{ maxWidth: '100%', cursor: 'pointer' }}
              onClick={() => setSelectedPhoto(photo)}
            />
          </Tab>
        ))}
      </Tabs>

      {selectedPhoto && (
        <ImageModal
          show={true}
          photo={selectedPhoto}
          onHide={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
};

export default PhotoTabs;
