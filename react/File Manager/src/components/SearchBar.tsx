import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

interface Props {
  onSearch: (q: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  return (
    <Form
      className="my-2 d-flex"
      onSubmit={e => {
        e.preventDefault();
        onSearch(query);
      }}
    >
      <Form.Control
        type="text"
        placeholder="검색어를 입력하세요"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {/* <Button type="submit" variant="primary" className="ms-2">
        Search
      </Button> */}
    </Form>
  );
};

export default SearchBar;
