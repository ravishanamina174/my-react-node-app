import { useState } from "react";
import ProductSearchForm from "./ProductSearchForm";

export default function TestComponent() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Search Test Component</h1>
      
      <button 
        onClick={() => setShowSearch(!showSearch)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showSearch ? 'Hide' : 'Show'} Search Form
      </button>
      
      {showSearch && (
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Product Search Form</h2>
          <ProductSearchForm />
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Click "Show Search Form" to display the search component</li>
          <li>Type at least 2 characters to trigger search</li>
          <li>Check browser console for debug information</li>
          <li>Verify that search results appear and are clickable</li>
        </ul>
      </div>
    </div>
  );
}