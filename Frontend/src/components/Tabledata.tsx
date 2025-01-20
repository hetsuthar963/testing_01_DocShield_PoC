import Spinner from './Spinner';
//import { useTable } from '../../hooks';
import { useParams } from 'react-router-dom';
import React, { useState, useCallback, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';

interface Entity {
    type: string;
    text: string;
    confidence: number;
    normalizedValue: string;
    //status: string;
}
  

export default function tableData(){
    const [extractedData, setExtractedData] = useState<Entity[]>([]); // state for extracted JSON info.
    const [loadingFraudData, setLoadingFraudData] = useState<boolean>(true);
    // const { id } = useParams();
    // const {loading, table} = useTable();
  
    // useEffect(() => {
    //     if (table) {
    //         setExtractedData(table);
    //         setLoadingFraudData(false);
    //     }
    // }, [])

    // if(loading || !table) {
    //     return (
    //       <div>
    //         <div className="h-screen flex flex-col justify-center">
    //           <div className="flex justify-center">
    //             <Spinner />
    //           </div>  
    //         </div>
    //       </div>  
    //     )
    // }
  
  
    return (
      <div className="space-y-2">
                        {extractedData.map((entity, index) => (
                          <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                            <span>{entity.type}</span>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              entity.normalizedValue === 'PASS' ? 'bg-green-100 text-green-800' :
                              entity.normalizedValue === 'UNKNOWN' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {entity.normalizedValue}
                            </span>
                          </div>
                        ))}
                        {loadingFraudData && (
                          <div className="space-y-2">
                            {[1,2,3].map((i) => (
                              <Skeleton key={i} className="h-14 w-full" />
                            ))}
                          </div>
                        )}
                      </div>
  
    )
  }