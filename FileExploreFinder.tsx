import React, { useState, useMemo, useEffect } from "react";
import {
  Folder,
  File,
  Download,
  Search,
  ChevronUp,
  ChevronRight,
  XSquare,
  Loader2,
} from "lucide-react";
import "./FileExploreFinder.css";

// Type definitions
export interface FileSystemFile {
  id: string;
  name: string;
  rel_path: string;
  download_path: string;
  type: "file";
  size: number;
  created: string;
  modified: string;
}

export interface FileSystemFolder {
  id: string;
  name: string;
  rel_path: string;
  download_path: string;
  type: "folder";
  created: string;
  modified: string;
  children: FileSystemItem[];
}

export type FileSystemItem = FileSystemFile | FileSystemFolder;

type SortColumn = "name" | "size" | "created" | "modified";
type SortOrder = "asc" | "desc";

export interface FileExploreFinderProps {
  data: FileSystemFolder;
  onDownload?: (downloadPath: string, fileName: string) => void;
  authorizedFetch?: (url: string, options?: RequestInit) => Promise<Response>;
}

export const FileExploreFinder: React.FC<FileExploreFinderProps> = ({
  data,
  onDownload,
  authorizedFetch,
}) => {
  const [currentPath, setCurrentPath] = useState<FileSystemFolder[]>([data]);
  const [selectedFile, setSelectedFile] = useState<FileSystemFile | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pathBeforeSearch, setPathBeforeSearch] = useState<
    FileSystemFolder[] | null
  >(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Log the data prop
  // useEffect(() => {
  //   console.log("FileExploreFinder data:", data);
  // }, [data]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        setDebouncedSearchQuery(searchQuery);
        // Save current path before starting search
        if (!pathBeforeSearch) {
          setPathBeforeSearch([...currentPath]);
        }
      } else {
        setDebouncedSearchQuery("");
        // Restore path when search is cleared
        if (pathBeforeSearch && searchQuery.length === 0) {
          setCurrentPath(pathBeforeSearch);
          setPathBeforeSearch(null);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Recursive function to search all files in the tree
  const searchFiles = (
    folder: FileSystemFolder,
    query: string
  ): FileSystemFile[] => {
    const results: FileSystemFile[] = [];
    const lowerQuery = query.toLowerCase();

    for (const item of folder.children) {
      if (item.type === "file") {
        if (item.name.toLowerCase().includes(lowerQuery)) {
          results.push(item);
        }
      } else {
        // Recursively search subfolders
        results.push(...searchFiles(item, query));
      }
    }

    return results;
  };

  // Format visual path from rel_path
  const formatVisualPath = (relPath: string): string => {
    // Remove leading "/" if present
    let path = relPath.startsWith("/") ? relPath.substring(1) : relPath;
    // Replace all "/" with " > "
    return path.replace(/\//g, " > ");
  };

  // Get current directory or search results
  const currentDirectory = currentPath[currentPath.length - 1];

  // Get items to display (either current directory or search results)
  const displayItems = useMemo(() => {
    if (debouncedSearchQuery.length >= 2) {
      // Return search results
      return searchFiles(data, debouncedSearchQuery);
    }
    // Return current directory children
    return currentDirectory.children;
  }, [debouncedSearchQuery, currentDirectory.children, data]);

  // Sort items
  const sortedItems = useMemo(() => {
    const items = [...displayItems];

    items.sort((a, b) => {
      let compareResult = 0;

      switch (sortColumn) {
        case "name":
          compareResult = a.name.localeCompare(b.name);
          break;
        case "size":
          const aSize = a.type === "file" ? a.size : 0;
          const bSize = b.type === "file" ? b.size : 0;
          compareResult = aSize - bSize;
          break;
        case "created":
          compareResult =
            new Date(a.created).getTime() - new Date(b.created).getTime();
          break;
        case "modified":
          compareResult =
            new Date(a.modified).getTime() - new Date(b.modified).getTime();
          break;
      }

      return sortOrder === "asc" ? compareResult : -compareResult;
    });

    // Only show folders first when not searching
    if (debouncedSearchQuery.length < 2) {
      return items.sort((a, b) => {
        if (a.type === "folder" && b.type === "file") return -1;
        if (a.type === "file" && b.type === "folder") return 1;
        return 0;
      });
    }

    return items;
  }, [displayItems, sortColumn, sortOrder, debouncedSearchQuery]);

  // Handle column header click
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Handle directory navigation
  const navigateToDirectory = (item: FileSystemItem) => {
    if (item.type === "folder") {
      setCurrentPath([...currentPath, item]);
      setSelectedFile(null);
    }
  };

  // Handle go up
  const goUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedFile(null);
    }
  };

  // Handle breadcrumb navigation
  const navigateToBreadcrumb = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
    setSelectedFile(null);
  };

  // Handle item click
  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === "folder") {
      navigateToDirectory(item);
    } else {
      setSelectedFile(item);
    }
  };

  // Handle download
  const handleDownload = async () => {
    if (!selectedFile) return;

    // If custom onDownload handler is provided, use it
    if (onDownload) {
      onDownload(selectedFile.download_path, selectedFile.name);
      return;
    }

    // If authorizedFetch is provided, use built-in download logic
    if (authorizedFetch) {
      setIsDownloading(true);
      const downloadPath = selectedFile.download_path;
      const fileName = selectedFile.name;

      console.log(`Initiating Download requested for: ${fileName} at ${downloadPath}`);

      try {
        const res = await authorizedFetch(`/api/download_file?file_name=${downloadPath}`);
        
        if (!res.ok) {
          console.log(`Download API NOT successful for: ${downloadPath}`);
          console.log(`Response: ${res.status} - ${res.statusText}`);
          throw new Error(`${res.status} ${res.statusText}`);
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        // Extracting the filename from the path
        const baseName = fileName.split("/").pop();
        link.setAttribute("download", baseName || fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log(`File download successfully: ${downloadPath}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`Error: Download failed for "${downloadPath}"\n${errorMessage}`);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format file size
  const formatSize = (item: FileSystemItem) => {
    if (item.type === "folder") return "";
    const bytes = item.size;
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const isSearchActive = debouncedSearchQuery.length >= 2;

  return (
    <div className="w-full h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg h-full flex flex-col">
        {/* Header Section */}
        <div className="px-4 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-sm">
              {!isSearchActive ? (
                currentPath.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <button
                      onClick={() => navigateToBreadcrumb(index)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      {item.name === "root" ? "Top" : item.name}
                    </button>
                  </React.Fragment>
                ))
              ) : (
                <span className="text-gray-600 font-medium">
                  Search Results ({sortedItems.length})
                </span>
              )}
            </div>

            {/* Search Box and Download Button Group */}
            <div className="flex items-center space-x-2">
              {/* Search Box */}
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <button
                  onClick={handleClearSearch}
                  disabled={searchQuery.length < 2}
                  className={`flex items-center justify-center px-3 py-2 transition-colors ${
                    searchQuery.length >= 2
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                  title="Clear search"
                >
                  <XSquare
                    className={`w-5 h-5 ${
                      searchQuery.length >= 2
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={!selectedFile || isDownloading}
                className={`flex items-center space-x-2 px-4 py-2 rounded ${
                  selectedFile && !isDownloading
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="text-left px-6 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    {sortColumn === "name" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("size")}
                  className="text-left px-6 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex items-center space-x-1">
                    <span>Size</span>
                    {sortColumn === "size" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("created")}
                  className="text-left px-6 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex items-center space-x-1">
                    <span>Created</span>
                    {sortColumn === "created" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("modified")}
                  className="text-left px-6 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex items-center space-x-1">
                    <span>Modified</span>
                    {sortColumn === "modified" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Go Up Button - only show when not searching */}
              {!isSearchActive && currentPath.length > 1 && (
                <tr
                  onClick={goUp}
                  className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center space-x-3">
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        ..
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3"></td>
                </tr>
              )}

              {/* Items */}
              {sortedItems.length > 0 ? (
                sortedItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`border-b border-gray-200 hover:bg-blue-50 cursor-pointer ${
                      selectedFile?.id === item.id ? "bg-blue-100" : ""
                    }`}
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center space-x-3">
                        {item.type === "folder" ? (
                          <Folder className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <File className="w-5 h-5 text-blue-500" />
                        )}
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium text-gray-700">
                            {item.name}
                          </span>
                          {isSearchActive && (
                            <span className="text-sm text-gray-600">
                              {formatVisualPath(item.rel_path)}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {formatSize(item)}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {formatDate(item.created)}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {formatDate(item.modified)}
                    </td>
                  </tr>
                ))
              ) : isSearchActive ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No files found matching "{debouncedSearchQuery}"
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};