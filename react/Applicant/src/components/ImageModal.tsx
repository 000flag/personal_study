// src/components/ImageModal.tsx

import { Modal } from 'react-bootstrap';

export default function ImageModal({
  show,
  photo,
  onHide,
}: {
  show: boolean;
  photo: { externalPath: string; filename: string };
  onHide: () => void;
}) {
  return (
    <Modal show={show} onHide={onHide} centered size="xl" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{photo.filename}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0 text-center bg-dark">
        <img
          src={photo.externalPath}
          alt={photo.filename}
          style={{ maxWidth: '100%', maxHeight: '80vh' }}
        />
      </Modal.Body>
    </Modal>
  );
}
