import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Card, CardDescription } from './components/ui/card';
import { Input } from './components/ui/input';
import { Skeleton } from './components/ui/skeleton';
import Upload from './components/ui/upload';
import { useParams } from 'react-router-dom';
import { useTable } from '../hooks';


// Types
interface Insight {
  value: string;
}

interface FraudData {
  id: number;
  signal: string;
  status: string;
}

interface Entity {
  type: string;
  text: string;
  confidence: number;
  normalizedValue: string;
}

function App() {
  //const { text } = useTable();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [fraudData, setFraudData] = useState<FraudData[]>([]);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(true);
  const [loadingFraudData, setLoadingFraudData] = useState<boolean>(true);
  const [position, setPosition] = useState<number>(40); // For color meter demo
  const [extractedData, setExtractedData] = useState<Entity[]>([]); // Initialize with an empty array
  const { loading, table } = useTable();

  const fetchInsights = useCallback(() => {
    if (insights.length > 0) return;
    setLoadingInsights(true);
    // Simulate API call
    setTimeout(() => {
      setInsights([
        { value: "Document format matches standard templates" },
        { value: "Digital signatures verified successfully" },
        { value: "Metadata analysis shows no tampering" }
      ]);
      setLoadingInsights(false);
    }, 2000);
  }, [insights]);

  const fetchFraudData = useCallback(() => {
    if (fraudData.length > 0) return;
    setLoadingFraudData(true);
    // Simulate API call
    setTimeout(() => {
      setFraudData([
        { id: 1, signal: "Font consistency check", status: "Passed" },
        { id: 2, signal: "Digital signature verification", status: "Passed" },
        { id: 3, signal: "Metadata analysis", status: "Warning" },
        { id: 4, signal: "Identity Document", status: "Warning" },
        { id: 5, signal: "Suspicious Word", status: "Passed" }
      ]);
      setLoadingFraudData(false);
    }, 2000);
  }, [fraudData]);

  // function for fetching data
  const fetchExtractedData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/extracted-data');
      console.log('Fetched data:', response.data); // Log the fetched data
      if (response.data && Array.isArray(response.data.extractedData)) {
        setExtractedData(response.data.extractedData);
        console.log("Updated extractedData state:", response.data.extractedData);
      
      } else {
        console.error("Unexpected response structure:", response.data);
      } 
    }
    catch (error) {
      console.error("Error fetching extracted data:", error);
    }
  }, []);

  useEffect(() => {
    console.log("Updated extractedData in state:", extractedData);
  }, [extractedData]);
  

  useEffect(() => {
    console.log("Updated table state:", table); // Log state changes
  }, [table]);
  

  useEffect(() => {
    fetchInsights();
    fetchFraudData();
    fetchExtractedData();

    // Fetch extracted data every 5 sec 
    const interval = setInterval(fetchExtractedData, 5000);

    // clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [fetchExtractedData, fetchInsights, fetchFraudData]);

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="w-full h-screen min-h-screen border-[2px] border-slate-400"
    >
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40} minSize={30}>
            <Upload />
          </ResizablePanel>
          <ResizableHandle className="bg-gray-300 hover:bg-gray-500" />
          <ResizablePanel
            defaultSize={60}
            minSize={50}
            className="overflow-auto"
          >
            <div className="p-4 h-full">
              <Tabs defaultValue="Table" className="h-full">
                <TabsList className="flex w-full">
                  <TabsTrigger
                    value="Table"
                    className="flex-1 bg-white text-black data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Tests
                  </TabsTrigger>
                  <TabsTrigger
                    value="OCR"
                    className="flex-1 bg-white text-black data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="Table"
                  style={{ height: "calc(100% - 1rem)" }}
                  className=""
                >
                  <div
                    style={{ height: "calc(100% - 1rem)" }}
                    className="h-full overflow-auto px-4 pb-3"
                  >
                    <Input
                      placeholder="Search fraud signals..."
                      className="mb-4"
                    />

                  
                    <div className="space-y-2">
                      {extractedData.length > 0 ? (
                        extractedData.map((entity, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm"
                          >
                            <span>{entity.type || "No Type"}</span>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              entity.normalizedValue === 'PASS' ? 'bg-green-100 text-green-800' :
                              entity.normalizedValue === 'UNKNOWN' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {entity.normalizedValue || "No Value"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p>No data available</p>
                      )}
                      {loadingFraudData && (
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-14 w-full" />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                  </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="OCR"
                  style={{ height: "calc(100% - 1rem)" }}
                >
                  <div className="space-y-4">
                    {/* {extractedText.map((text, index) => (
                      <Card className="p-4">
                        <CardDescription>{text}</CardDescription>
                      </Card>
                     ))} 
                     {loadingInsights && (
                      <div className="space-y-4">
                        {[1,2,3].map((i) => (
                          <Skeleton key={i} className="h-14 w-full" />
                        ))}
                      </div>
                    ) : ( */}
                      <p>No data available</p>
                    {/* )}  */}
                  </div>
                </TabsContent>

                <TabsContent
                  value="Extracted"
                  style={{ height: "calc(100% - 1rem)" }}
                >
                  
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle className="bg-gray-300 hover:bg-gray-500" />

      <ResizablePanel defaultSize={40} minSize={25}>
        <div className="p-6 space-y-6 h-full overflow-y-auto">
          
          <div> 

            <div
              style={{ height: "calc(100% - 1rem)" }}
              className="flex flex-col p-4 m-4 bg-white overflow-auto"
            >
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4">
                Fraud Analysis for the Given Document
              </h1>

              <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Authenticity Indicators:
              </h2>
              <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
                <li>Institution: SVIT, Vasad is real.</li>
                <li>Email: contact@svitvasad.ac.in, Website: svitvasad.ac.in.</li>
                <li>Student ID: 22BEITM069 is in a valid format.</li>
                <li>Branch: Information Technology, valid duration (2022–2026).</li>
              </ul>

              <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Potential Fraud Indicators:
              </h2>
              <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
                <li>OCR errors: "BARDAR" and "waren umfarer" seem suspicious.</li>
                <li>Missing standard features: No photo, signature, or hologram.</li>
              </ul>

              {/* <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
              Forgery Likelihood:
              </h2>
              <p className="leading-7 mt-4">
                Forgery Likelihood: <strong>0.4 (Moderate)</strong> - The document seems
                authentic but raises some suspicion due to OCR issues and missing
                standard features.
              </p> */}

              <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Suggestions for Verification:
              </h2>
              <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
                <li>Verify email and contact info on the SVIT website.</li>
                <li>Check the student ID number with SVIT's records.</li>
                <li>Confirm the details with the individual named on the document.</li>
              </ul>
            </div>
          </div>

          <div>
            <h1 className="mt-10 scroll-m-20 border-t pt-4 pb-4 text-3xl font-semibold tracking-tight flex flex-row justify-evenly">
              Forgery-Meter Score
              
              <div>
                
                <span className="text-xl flex gap-4">
                  Tweek to see changes :-
                  <Input
                    onChange={(e) => setPosition(+e.target.value)}
                    placeholder="position: number [0 - 100]"
                    className="w-fit"
                  />
                </span>
              </div>
            </h1>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              <strong>Forgery Likelihood: {position/100} (Moderate)</strong> - The document seems authentic but raises some suspicion due to OCR issues and missing standard features.
            </p>
          </div>
            <div className="flex justify-center mt-4 p-4 gap-4">
              <ColorMeterForAValue position={position} />
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default App;

function ColorMeterForAValue({ position = 0 }: { position: number }) {
  const safePosition = Math.min(position, 100);
  return (
    <>
      <div className="relative w-72 ">
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
            // prettier-ignore
            left: `${
              (safePosition !== 0 && safePosition !== 100 && `calc(${safePosition}% - 3%)`) ||
              (safePosition === 0 && `calc(${safePosition}%)`) ||
              (safePosition === 100 && `calc(${safePosition}% - 6%)`)
            }`,
          }}
        >
                   <div className='mb-4 pb-4'>{position}%
                    <div className="w-0 h-0 border-l-8 border-r-8 border-b-[16px] border-l-transparent border-r-transparent border-b-black"></div>
                   </div>

          
        </div>
      </div>
    </>
  );
}

