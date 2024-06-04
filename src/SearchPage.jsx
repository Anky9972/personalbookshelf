import React, { useState, useEffect } from "react";
import useDebounce from "./useDebounce";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { Oval } from "react-loader-spinner";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [bookshelf, setBookshelf] = useState(
    () => JSON.parse(localStorage.getItem("bookshelf")) || []
  );
  const debouncedQuery = useDebounce(query, 100);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);

  const handleResize = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setMenu(false);
    } else {
      setMenu(true);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const searchBooks = async () => {
      setLoading(true);
      if (debouncedQuery) {
        try {
          const response = await fetch(
            `https://openlibrary.org/search.json?q=${debouncedQuery}&limit=10&page=1`
          );
          const data = await response.json();
          setResults(data.docs);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setLoading(false);
      }
    };
    searchBooks();
  }, [debouncedQuery]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const addToBookshelf = (book) => {
    const updatedBookshelf = [...bookshelf, book];
    setBookshelf(updatedBookshelf);
    localStorage.setItem("bookshelf", JSON.stringify(updatedBookshelf));
    toast.success("Added to Bookshelf");
  };

  return (
    <div className="w-full h-full md:h-screen flex justify-end md:justify-center items-center">
      {!menu && (
        <div className="h-20 bg-black backdrop-blur-md bg-opacity-45 flex justify-center items-center gap-8 fixed top-0 right-0 left-0">
          <h1 className="text-2xl font-bold text-white">Search Books</h1>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            className="w-3/4 p-2 border border-gray-300 rounded"
            placeholder="Search for a book..."
          />
          <button
            className="p-2 bg-green-500 text-white rounded"
            onClick={() => (window.location.href = "/bookshelf")}
          >
            My Bookshelf
          </button>
        </div>
      )}

      {menu && (
        <div className="h-20 p-4 bg-black backdrop-blur-md bg-opacity-45 flex justify-between px-5 items-center gap-8 fixed top-0 right-0 left-0 border-b border-white">
          <div>
            <h1 className="text-2xl font-bold text-white">Search Books</h1>
          </div>
          <div>
            <GiHamburgerMenu
              onClick={() => setOpenMenu(!openMenu)}
              className="text-white"
            />
          </div>
        </div>
      )}

      {openMenu && (
        <div className="w-full h-1/5 absolute top-20 left-0 bg-black backdrop-blur-md bg-opacity-45 flex flex-col justify-center items-center gap-3">
          <div className="w-full flex justify-center">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              className="w-3/4 p-2 bg-blue-50 rounded outline-none border-none"
              placeholder="Search for a book..."
            />
          </div>
          <div className="w-full flex justify-center">
            <button
              className="p-2 w-3/4 bg-green-500 text-white rounded"
              onClick={() => (window.location.href = "/bookshelf")}
            >
              My Bookshelf
            </button>
          </div>
        </div>
      )}

      {results.length < 1 && !loading && (
        <div className="w-full h-2/3 flex justify-center items-center  absolute bottom-0">
          <div className="w-full  h-full flex justify-center items-center">
            Search for books to see results.
          </div>
        </div>
      )}

      <div className="mt-20 md:mt-52 min-h-72 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full md:h-full">
        {!loading ? (
          results.map((book) => (
            <div
              key={book.key}
              className="p-4 border rounded-xl shadow flex flex-col justify-center items-center"
            >
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-700 text-center">{book.author_name?.join(", ")}</p>
              <div>
                <p>Publish Year: {book.first_publish_year}</p>
                <p>Editon Count: {book.edition_count}</p>
              </div>
              <button
                onClick={() => addToBookshelf(book)}
                className="mt-5 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add to Bookshelf
              </button>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center w-full absolute h-full">
            <Oval className="text-xl" color="#00BFFF" height={80} width={80} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
