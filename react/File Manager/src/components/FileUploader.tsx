import React, { useState, DragEvent } from 'react';
import { Button, ProgressBar, Card } from 'react-bootstrap';
import { uploadFile } from '../api/api';

interface Props { selectedDir: string; }

const FileUploader: React.FC<Props> = ({ selectedDir }) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    setFile(f);
  };

  return (
    <Card className="upload-card">
      <Card.Body
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        style={{ textAlign: 'center', border: '2px dashed #ced4da', borderRadius: '.5rem' }}
      >
        {file
          ? <p>{file.name}</p>
          : <p className="text-muted">Drag & Drop files here, or click to select</p>
        }
        <input
          type="file"
          style={{ display: 'none' }}
          id="file-input"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
        <label htmlFor="file-input">
          <Button variant="outline-primary" size="sm">Choose File</Button>
        </label>
        <Button
          variant="primary"
          size="sm"
          disabled={!file}
          onClick={() => file && uploadFile(selectedDir, file).then(() => setProgress(100))}
          className="ms-2"
        >
          Upload
        </Button>
        {progress > 0 && <ProgressBar now={progress} className="mt-2" />}
      </Card.Body>
    </Card>
  );
};

export default FileUploader;
