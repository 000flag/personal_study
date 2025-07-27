import React from 'react';
import { Modal } from 'react-bootstrap';
import { Photo } from '../types';

interface Props {
  photo: Photo;
  onHide: () => void;
}

const ImageModal: React.FC<Props> = ({ photo, onHide }) => (
  <Modal show onHide={onHide} centered size="lg">
    <Modal.Body className="p-0">
      <img src={photo.externalPath} alt={photo.filename} style={{ width: '100%' }} />
    </Modal.Body>
  </Modal>
);

export default ImageModal;