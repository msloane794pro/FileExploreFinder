import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileExploreFinder, FileSystemFolder } from "./FileExploreFinder";
import { authorizedFetch } from "../../../../../api/authorizedFetch";

function Repository() {
  const navigate = useNavigate();
  const [fileStructure, setFileStructure] = useState<FileSystemFolder | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchFileStructure = async () => {
      try {
        const response = await authorizedFetch("/api/repository_get_file_structure", { signal });
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const fileStructureData: FileSystemFolder = await response.json();
        console.log("File structure data received from API.");

        setFileStructure(fileStructureData);
      } catch (error) {
        if (signal.aborted) {
          console.log("Fetch aborted");
          return;
        }
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error("Fetch error:", errorMessage);
        navigate("/error", {
          state: {
            param: `Error from /api/repository_get_file_structure API: ${errorMessage}`,
          },
        });
      }
    };

    fetchFileStructure();

    return () => {
      controller.abort();
    };
  }, [navigate]);

  return (
    <div>
      <div className="title-banner">
        <h1>Repository</h1>
        <div>
          {fileStructure ? (
            <FileExploreFinder 
              data={fileStructure} 
              authorizedFetch={authorizedFetch}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Repository;