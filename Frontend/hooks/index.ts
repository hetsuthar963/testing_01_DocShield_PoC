// import { useEffect, useState } from "react";
// import axios from 'axios';

// interface Entity {
//   type: string;
//   text: string;
//   confidence: number;
//   normalizedValue: string;
// }

// export function useTable() {
//   const [loading, setLoading] = useState(true);
//   const [table, setTable] = useState<Entity[]>([]);
//   //const [text, setText] = useState<string>("");


//   useEffect(() => {
//     axios.get('http://localhost:3000/api/extracted-data', {
//       // headers
//     })
//     .then(response => {
//       if (response.data && Array.isArray(response.data)) {
//         setTable(response.data);
//         //setText(response.data.text);
//       } else {
//         console.error("Unexpected Data Structure:", response.data);
//       }
//       setLoading(false);
//     })
//     .catch(error => {
//       console.error("Error fetching Data:", error);
//       setLoading(false);
//     });
//   }, []);

//   return {
//     loading,
//     table
//   };
// }



import { useEffect, useState } from "react";
import axios from "axios";

interface Entity {
  type: string;
  text: string;
  confidence: number;
  normalizedValue: string;
}

export function useTable() {
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [table, setTable] = useState<Entity[]>([]); // Stores fetched table data

  useEffect(() => {
    // Fetch extracted data from the backend
    const fetchTableData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/extracted-data");

        // Check if the response has the correct structure
        if (response.data && Array.isArray(response.data.entities)) {
          setTable(response.data.entities); // Update state with entities array
        } else {
          console.error("Unexpected Data Structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchTableData();
  }, []);

  return {
    loading,
    table,
  };
}
