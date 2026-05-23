import { useState } from "react";

const Test = () => {
  const [scanned, setScanned] = useState("");
  const [result, setResult] = useState("");

  const handleScan = (value: string) => {
    console.log("Scanned:", value);
    setResult(value);
  };
  
  return (
    <div>
      <input
        autoFocus
        value={scanned}
        onChange={(e) => setScanned(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleScan(scanned);
            setScanned("");
          }
        }}
      />
      {result && <p>Last scanned: {result}</p>}
    </div>
  );
};

export default Test;