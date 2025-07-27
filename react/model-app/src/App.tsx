import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import ApplicantList from './components/ApplicantList';
import ApplicantDetail from './components/ApplicantDetail';
import { Model } from './types';

const App: React.FC = () => {
  const [selected, setSelected] = useState<Model | null>(null);

  return (
    <Container className="mt-4">
      {selected ? (
        <ApplicantDetail model={selected} onBack={() => setSelected(null)} />
      ) : (
        <ApplicantList onSelect={setSelected} />
      )}
    </Container>
  );
};

export default App;