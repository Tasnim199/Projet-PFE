import React, { createContext, useState } from 'react';


// On crée le sac magique
export const SearchContext = createContext();

// On fait une boîte qui contient ce sac
export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
