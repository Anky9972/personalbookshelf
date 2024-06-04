
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPage from './SearchPage';
import BookshelfPage from './BookshelfPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage/>} />
        <Route path="/bookshelf" element={<BookshelfPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
