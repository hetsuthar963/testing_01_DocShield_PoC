import React from 'react';
import Card from './Card'; // Adjust the import based on your actual component
import CardDescription from './CardDescription'; // Adjust the import based on your actual component
import Skeleton from './Skeleton'; // Adjust the import based on your actual component

const YourComponent = ({ extractedText, loadingInsights }) => {
  console.log('Extracted Text:', extractedText); // Log the extractedText to verify its structure

  return (
    <div className="space-y-4">
      {extractedText && extractedText.length > 0 ? (
        extractedText.map((item, index) => (
          <Card key={index} className="p-4">
            <CardDescription>{item.text}</CardDescription>
          </Card>
        ))
      ) : (
        <p>No data available</p>
      )}
      {loadingInsights && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      )}
    </div>
  );
};

export default YourComponent;
