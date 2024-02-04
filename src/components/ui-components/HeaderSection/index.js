// const HeaderSection = ({ heading, subHeading, rightItem = () => {} }) => {
//   return (
//     <header style={{ 
//       margin: "20px",
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between' 
//     }}>
//       <div>
//         <h1 style={{ fontSize: "30px" }}>{heading}</h1>
//         <p>{subHeading}</p>
//       </div>
//       {rightItem()}
//     </header>
//   );
// };

// export default HeaderSection;
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const HeaderSection = ({ heading, subHeading, rightItem = () => {} }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleSearchIconClick = () => {
    setIsSearchVisible((prev) => !prev);
  };

  return (
    <header
      style={{
        margin: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <h1 style={{ fontSize: '30px' }}>{heading}</h1>
        <p>{subHeading}</p>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {isSearchVisible ? (
          // Show animated search input when isSearchVisible is true
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: '5px',
              overflow: 'hidden',
              width: '200px', // Set a fixed width for the input container
            }}
          >
            <input
              type="text"
              placeholder="Search..."
              style={{
                padding: '5px',
                border: 'none',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSearchIconClick}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <FaSearch />
            </button>
          </div>
        ) : (
          // Show search icon when isSearchVisible is false
          <button
            onClick={handleSearchIconClick}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <FaSearch size={20} />
          </button>
        )}

        {rightItem()}
      </div>
    </header>
  );
};

export default HeaderSection;
