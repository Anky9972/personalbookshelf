import React, { useState } from 'react';

const BookshelfPage = () => {
  const [bookshelf, setBookshelf] = useState(() => JSON.parse(localStorage.getItem('bookshelf')) || []);

  const removeFromBookshelf = (book) => {
    const updatedBookshelf = bookshelf.filter(item => item.key !== book.key);
    setBookshelf(updatedBookshelf);
    localStorage.setItem('bookshelf', JSON.stringify(updatedBookshelf));
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold w-full h-16 flex justify-center items-center text-white bg-black backdrop-blur-md bg-opacity-45">My Bookshelf</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  p-4 ">
        {bookshelf.map((book) => (
          <div key={book.key} className="p-4 border border-gray-300 rounded shadow">
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-700">{book.author_name?.join(', ')}</p>
            <button
              onClick={() => removeFromBookshelf(book)}
              className="mt-5 px-4 py-2 bg-red-500 text-white rounded"
            >
              Remove from Bookshelf
            </button>
          </div>
        ))}
      </div>
      <button
        className="  mb-20 w-3/4 md:w-36 px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => window.location.href = '/'}
      >
        Back to Search
      </button>
    </div>
  );
};

export default BookshelfPage;
