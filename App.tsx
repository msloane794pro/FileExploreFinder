import { FileExploreFinder } from "./FileExploreFinder";
import { testData } from "./testData";

function App() {
  const handleDownload = (downloadPath: string, fileName: string) => {
    console.log(`Downloading ${fileName} from ${downloadPath}`);
    // You can implement actual download logic here later
    alert(`Download requested: ${fileName}`);
  };

  return (
    <div className="App">
      <FileExploreFinder data={testData} onDownload={handleDownload} />
    </div>
  );
}

export default App;
