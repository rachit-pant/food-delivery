import React from 'react';
import Location from './Location';
import SearchBox from './SearchBox';

const List = () => {
  return (
    <>
      <div className="-mr-2">
        <Location />
      </div>
      <div className="max-w-md w-2xl">
        <SearchBox />
      </div>
    </>
  );
};
export default List;
