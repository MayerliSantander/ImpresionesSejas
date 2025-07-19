import { createContext, useContext, useEffect, useState } from 'react';

const BagContext = createContext();

export const BagProvider = ({ children }) => {
  const [bag, setBag] = useState(() => {
    try {
      const saved = localStorage.getItem('bag');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showBag, setShowBag] = useState(false);
  const toggleBag = () => setShowBag(prev => !prev);

  useEffect(() => {
    localStorage.setItem('bag', JSON.stringify(bag));
  }, [bag]);

  const addToBag = (product) => {
    setBag((prev) => [...prev, product]);
  };

  const removeFromBag = (index) => {
    setBag((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const clearBag = () => setBag([]);

  return (
    <BagContext.Provider value={{
      bag,
      addToBag,
      removeFromBag,
      clearBag,
      showBag,
      toggleBag
    }}>
      {children}
    </BagContext.Provider>
  );
};

export const useBag = () => useContext(BagContext);
