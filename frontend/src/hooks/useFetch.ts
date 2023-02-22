import { useEffect, useState } from 'react';

const backendUrl = 'http://localhost:3001';

const useFetch = () => {
   const [data, setData] = useState<any>();
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState(null);

   useEffect(() => {
      setLoading(true);
      fetch(`${backendUrl}/transactions`)
         .then((response) => response.json())
         .then(
            (result) => {
               setData(result);
            },
            (error) => setError(error)
         )
         .finally(() => {
            setLoading(false);
         });
   }, []);

   return {
      data,
      loading,
      error,
   };
};

export default useFetch;
