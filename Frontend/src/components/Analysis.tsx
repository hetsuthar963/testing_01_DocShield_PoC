// import React, { useState, useEffect } from 'react';

// interface AnalysisItem {
//     description: string;
//     confidence?: number;
//     interpretation?: string;
//   }
  
//   interface AnalysisSection {
//     title: string;
//     contents?: AnalysisItem[]; // Changed from string[] to AnalysisItem[]
//     score?: number;
//     interpretation?: string;
//   }

// const AnalysisReport = () => {
//   const [report, setReport] = useState<AnalysisSection | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchReport = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/api/extracted-data');
//         if (!response.ok) throw new Error('Failed to fetch report');
//         const data = await response.json();
        
//         // Match the API response structure
//         setReport({
//           title: data.analysisResult.title,
//           contents: data.analysisResult.contents
//         });
        
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Unknown error');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReport();
//   }, []);

//   if (loading) return <div className="text-center p-8">Loading analysis report...</div>;
//   if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
//   if (!report) return <div className="text-center p-8 text-red-500">No report available</div>;

//   return (
//     <div className="flex flex-col p-4 m-4 bg-white overflow-auto" style={{ height: "calc(100% - 1rem)" }}>
//       <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4">
//         {report.title}
//       </h1>

//       {report.contents?.map((section, sectionIndex) => (
//         <div key={sectionIndex}>
//           {/* Use includes() for more flexible matching */}
//           {section.title.includes('Authenticity Indicators') && (
//             <>
//               <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
//                 {section.title}
//               </h2>
//               <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
//                 {section.contents?.map((item, index) => (
//                   <li key={index} className="text-gray-700">
//                     {content}
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}

//           {section.title.includes('Potential Fraud Indicators') && (
//             <>
//               <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
//                 {section.title}
//               </h2>
//               <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
//                 {section.contents?.map((content, index) => (
//                   <li key={index} className="text-red-600">
//                     {content}
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}

//           {section.title.includes('Suspicious Elements') && (
//             <>
//               <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
//                 {section.title}
//               </h2>
//               <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
//                 {section.contents?.map((content, index) => (
//                   <li key={index} className="text-yellow-600">
//                     {content}
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}

//           {section.title.includes('Suggestions for Verification') && (
//             <>
//               <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
//                 {section.title}
//               </h2>
//               <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
//                 {section.contents?.map((content, index) => (
//                   // Removed priority as it's not in the data
//                   <li key={index} className="text-blue-600">
//                     {content}
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}

//           {section.title.includes('Forgery Likelihood Score') && (
//             <>
//               <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
//                 {section.title}
//               </h2>
//               <div className="flex justify-center mt-10 p-4 gap-4">
//                 <ColorMeterForAValue position={(section.score ?? 0) * 100} />
//               </div>
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-10">
//                 <div className="text-4xl font-bold text-red-600">
//                   {(section.score ?? 0).toFixed(2)}
//                   <span className="text-2xl ml-2 text-gray-600">/1.0</span>
//                 </div>
//                 <p className="mt-2 text-lg text-gray-700">
//                   {section.interpretation ?? 'No interpretation available'}
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// // ColorMeter component remains the same
// function ColorMeterForAValue({ position = 0 }: { position: number }) {
//   const safePosition = Math.min(position, 100);
//   return (
//     <>
//       <div className="relative w-80 ">
//         <div className="flex rounded-full overflow-hidden w-full h-8 text-center">
//           <div className="bg-green-500 w-1/5"></div>
//           <div className="bg-yellow-300 w-1/5"></div>
//           <div className="bg-amber-400 w-1/5"></div>
//           <div className="bg-orange-400 w-1/5"></div>
//           <div className="bg-red-500 w-1/5"></div>
//         </div>
        
//         <div
//           className="absolute top-[0.2rem] left-4 rotate-0 transition-all ease-in text-lg font-semibold"
//           style={{
//             left: `${
//               (safePosition !== 0 && safePosition !== 100 && `calc(${safePosition}% - 3%)`) ||
//               (safePosition === 0 && `calc(${safePosition}%)`) ||
//               (safePosition === 100 && `calc(${safePosition}% - 6%)`)
//             }`,
//           }}
//         >
//           <div className='mb-4 pb-4'>{position}%
//             <div className="w-0 h-0 border-l-8 border-r-8 border-b-[16px] border-l-transparent border-r-transparent border-b-black"></div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AnalysisReport;





import { useState, useEffect } from 'react';

interface AnalysisReport {
  title: string;
  contents: Array<{
    title: string;
    contents: Array<{
      description: string;
      confidence?: number;
      interpretation?: string;
    }>;
    score?: number;
    interpretation?: string;
  }>;
}

const AnalysisReport = () => {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/extracted-data');
        if (!response.ok) throw new Error('Failed to fetch report');
        const data = await response.json();
        const validatedReport = validateReport(data);
        if (!validatedReport) throw new Error('Invalid report data');
        setReport(validatedReport);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const validateReport = (data: any): AnalysisReport | null => {
    if (!data || !data.analysisResult || !data.analysisResult.title || !data.analysisResult.contents) {
      return null;
    }
    return {
      title: data.analysisResult.title,
      contents: data.analysisResult.contents.map((section: any) => ({
        title: section.title,
        contents: section.contents?.map((item: any) => ({
          description: item.description,
          confidence: item.confidence,
          interpretation: item.interpretation,
        })),
        score: section.score,
        interpretation: section.interpretation,
      })),
    };
  };

  if (loading) return <div className="text-center p-8">Loading analysis report...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!report) return <div className="text-center p-8 text-red-500">No report available</div>;

  return (
    <div className="flex flex-col p-4 m-4 bg-white overflow-auto" style={{ height: "calc(100% - 1rem)" }}>
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4">
        {report.title}
      </h1>

      {report.contents?.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {section.title.includes('Forgery Likelihood Score') ? (
            <>
              <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <div className="flex justify-center mt-10 p-4 gap-4">
                <ColorMeterForAValue position={(section.score ?? 0) * 100} />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-10">
                <div className="text-4xl font-bold text-red-600">
                  {(section.score ?? 0).toFixed(2)}
                  <span className="text-2xl ml-2 text-gray-600">/1.0</span>
                </div>
                <p className="mt-2 text-lg text-gray-700">
                  {section.interpretation ?? 'No interpretation available'}
                </p>
              </div>
            </>
          ) : (
            <SectionRenderer section={section} />
          )}
        </div>
      ))}
    </div>
  );
};

const SectionRenderer = ({ section }: { section: AnalysisReport['contents'][0] }) => {
  const sectionStyles: Record<string, { color: string; confidenceColor: string }> = {
    'Authenticity Indicators': { color: 'text-gray-700', confidenceColor: 'text-green-600' },
    'Potential Fraud Indicators': { color: 'text-red-600', confidenceColor: 'text-red-400' },
    'Suspicious Elements': { color: 'text-yellow-600', confidenceColor: 'text-yellow-600' },
    'Suggestions for Verification': { color: 'text-blue-600', confidenceColor: 'text-blue-600' },
  };

  const styles = sectionStyles[section.title] || { color: 'text-gray-700', confidenceColor: 'text-gray-600' };

  return (
    <>
      <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        {section.title}
      </h2>
      <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
        {section.contents?.map((item, index) => (
          <li key={index} className={styles.color}>
            {item.description}
            {item.confidence && (
              <span className={`ml-2 text-sm ${styles.confidenceColor}`}>
                (Confidence: {(item.confidence * 100).toFixed(0)}%)
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

const ColorMeterForAValue = ({ position = 0 }: { position: number }) => {
  const safePosition = Math.min(position, 100);
  return (
    <div className="relative w-80">
      <div className="flex rounded-full overflow-hidden w-full h-8 text-center">
        <div className="bg-green-500 w-1/5"></div>
        <div className="bg-yellow-300 w-1/5"></div>
        <div className="bg-amber-400 w-1/5"></div>
        <div className="bg-orange-400 w-1/5"></div>
        <div className="bg-red-500 w-1/5"></div>
      </div>
      <div
        className="absolute top-[0.2rem] left-4 rotate-0 transition-all ease-in text-lg font-semibold"
        style={{
          left: `${
            (safePosition !== 0 && safePosition !== 100 && `calc(${safePosition}% - 3%)`) ||
            (safePosition === 0 && `calc(${safePosition}%)`) ||
            (safePosition === 100 && `calc(${safePosition}% - 6%)`)
          }`,
        }}
      >
        <div className="mb-4 pb-4">
          {position}%
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-[16px] border-l-transparent border-r-transparent border-b-black"></div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;