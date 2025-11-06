import type { FileSystemFolder } from "./FileExploreFinder";

export const testData: FileSystemFolder = {
  id: "root",
  name: "root",
  rel_path: "/",
  download_path: "/",
  type: "folder",
  created: "2024-01-15T10:00:00Z",
  modified: "2024-10-28T14:30:00Z",
  children: [
    // Directory 1: Documents
    {
      id: "dir-documents",
      name: "Documents",
      rel_path: "/Documents",
      download_path: "/Documents",
      type: "folder",
      created: "2024-02-10T09:15:00Z",
      modified: "2024-10-25T16:45:00Z",
      children: [
        // File 1 in Documents
        {
          id: "file-doc-1",
          name: "Project_Proposal.pdf",
          rel_path: "/Documents/Project_Proposal.pdf",
          download_path: "/Documents/Project_Proposal.pdf",
          type: "file",
          size: 2457600,
          created: "2024-03-12T11:20:00Z",
          modified: "2024-10-20T09:30:00Z",
        },
        // File 2 in Documents
        {
          id: "file-doc-2",
          name: "Meeting_Notes.docx",
          rel_path: "/Documents/Meeting_Notes.docx",
          download_path: "/Documents/Meeting_Notes.docx",
          type: "file",
          size: 524288,
          created: "2024-04-05T14:00:00Z",
          modified: "2024-10-24T13:15:00Z",
        },
        // Subdirectory 1-1: Reports
        {
          id: "dir-reports",
          name: "Reports",
          rel_path: "/Documents/Reports",
          download_path: "/Documents/Reports",
          type: "folder",
          created: "2024-03-20T10:30:00Z",
          modified: "2024-10-22T11:00:00Z",
          children: [
            {
              id: "file-report-1",
              name: "Q3_Financial_Report.xlsx",
              rel_path: "/Documents/Reports/Q3_Financial_Report.xlsx",
              download_path: "/Documents/Reports/Q3_Financial_Report.xlsx",
              type: "file",
              size: 1048576,
              created: "2024-07-15T08:45:00Z",
              modified: "2024-10-15T10:20:00Z",
            },
            {
              id: "file-report-2",
              name: "Annual_Summary_2024.pdf",
              rel_path: "/Documents/Reports/Annual_Summary_2024.pdf",
              download_path: "/Documents/Reports/Annual_Summary_2024.pdf",
              type: "file",
              size: 3145728,
              created: "2024-09-01T12:00:00Z",
              modified: "2024-10-18T15:30:00Z",
            },
          ],
        },
        // Subdirectory 1-2: Contracts
        {
          id: "dir-contracts",
          name: "Contracts",
          rel_path: "/Documents/Contracts",
          download_path: "/Documents/Contracts",
          type: "folder",
          created: "2024-05-10T09:00:00Z",
          modified: "2024-10-26T14:00:00Z",
          children: [
            {
              id: "file-contract-1",
              name: "Vendor_Agreement_2024.pdf",
              rel_path: "/Documents/Contracts/Vendor_Agreement_2024.pdf",
              download_path: "/Documents/Contracts/Vendor_Agreement_2024.pdf",
              type: "file",
              size: 1572864,
              created: "2024-06-01T10:15:00Z",
              modified: "2024-10-10T11:45:00Z",
            },
            {
              id: "file-contract-2",
              name: "Service_Level_Agreement.docx",
              rel_path: "/Documents/Contracts/Service_Level_Agreement.docx",
              download_path:
                "/Documents/Contracts/Service_Level_Agreement.docx",
              type: "file",
              size: 786432,
              created: "2024-08-15T13:30:00Z",
              modified: "2024-10-25T09:00:00Z",
            },
          ],
        },
      ],
    },
    // Directory 2: Media
    {
      id: "dir-media",
      name: "Media",
      rel_path: "/Media",
      download_path: "/Media",
      type: "folder",
      created: "2024-01-20T11:00:00Z",
      modified: "2024-10-27T16:20:00Z",
      children: [
        // File 1 in Media
        {
          id: "file-media-1",
          name: "Company_Logo.png",
          rel_path: "/Media/Company_Logo.png",
          download_path: "/Media/Company_Logo.png",
          type: "file",
          size: 204800,
          created: "2024-02-15T10:00:00Z",
          modified: "2024-08-30T12:15:00Z",
        },
        // File 2 in Media
        {
          id: "file-media-2",
          name: "Promotional_Video.mp4",
          rel_path: "/Media/Promotional_Video.mp4",
          download_path: "/Media/Promotional_Video.mp4",
          type: "file",
          size: 52428800,
          created: "2024-03-22T14:30:00Z",
          modified: "2024-09-15T16:45:00Z",
        },
        // Subdirectory 2-1: Images
        {
          id: "dir-images",
          name: "Images",
          rel_path: "/Media/Images",
          download_path: "/Media/Images",
          type: "folder",
          created: "2024-04-01T09:30:00Z",
          modified: "2024-10-20T13:00:00Z",
          children: [
            {
              id: "file-image-1",
              name: "Product_Photo_A.jpg",
              rel_path: "/Media/Images/Product_Photo_A.jpg",
              download_path: "/Media/Images/Product_Photo_A.jpg",
              type: "file",
              size: 2621440,
              created: "2024-05-15T11:00:00Z",
              modified: "2024-09-20T10:30:00Z",
            },
            {
              id: "file-image-2",
              name: "Team_Photo_2024.jpg",
              rel_path: "/Media/Images/Team_Photo_2024.jpg",
              download_path: "/Media/Images/Team_Photo_2024.jpg",
              type: "file",
              size: 3670016,
              created: "2024-06-10T15:45:00Z",
              modified: "2024-10-05T14:20:00Z",
            },
          ],
        },
        // Subdirectory 2-2: Videos
        {
          id: "dir-videos",
          name: "Videos",
          rel_path: "/Media/Videos",
          download_path: "/Media/Videos",
          type: "folder",
          created: "2024-05-01T10:00:00Z",
          modified: "2024-10-23T12:30:00Z",
          children: [
            {
              id: "file-video-1",
              name: "Product_Demo.mp4",
              rel_path: "/Media/Videos/Product_Demo.mp4",
              download_path: "/Media/Videos/Product_Demo.mp4",
              type: "file",
              size: 104857600,
              created: "2024-07-01T09:00:00Z",
              modified: "2024-09-28T11:15:00Z",
            },
            {
              id: "file-video-2",
              name: "Training_Session_Recording.mp4",
              rel_path: "/Media/Videos/Training_Session_Recording.mp4",
              download_path: "/Media/Videos/Training_Session_Recording.mp4",
              type: "file",
              size: 157286400,
              created: "2024-08-20T13:30:00Z",
              modified: "2024-10-12T15:00:00Z",
            },
          ],
        },
      ],
    },
  ],
};

// Example usage:
// import { FileExploreFinder } from './FileExploreFinder';
// import { testData } from './testData';
//
// function App() {
//   const handleDownload = (downloadPath: string, fileName: string) => {
//     console.log(`Downloading ${fileName} from ${downloadPath}`);
//   };
//
//   return (
//     <FileExploreFinder
//       data={testData}
//       onDownload={handleDownload}
//     />
//   );
// }
