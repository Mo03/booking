// src/hooks/useApiLoader.js
import { useState } from "react";

const useApiLoader = () => {
  const [loading, setLoading] = useState(false);

  const withLoader = async (apiCall) => {
    setLoading(true);
    try {
      await apiCall();
    } finally {
      setLoading(false);
    }
  };

  return { loading, withLoader };
};

export default useApiLoader;
