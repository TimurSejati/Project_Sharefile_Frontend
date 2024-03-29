import DropZoneComponent from "@components/DropZoneComponent";
import RenderFile from "@components/RenderFile";
import { useState } from "react";
import axios from 'axios';
import DownloadFile from "@components/DownloadFile";
import EmailForm from "@components/EmailForm";


export default function Home() {
  const [file, setFile] = useState(null);
  const [id, setId] = useState(null);
  const [downloadPageLink, setDownloadPageLink] = useState(null);
  const [uploadState, setUploadState] = useState<"Uploading" | "Upload Failed" | "Uploaded" | "Upload">("Upload");

  const handleUpload = async () => {
    if (uploadState === "Uploading") return;
    setUploadState("Uploading");

    const formData = new FormData();
    formData.append("myFile", file)

    try {
      const { data } = await axios({
        method: "post",
        data: formData,
        url: "api/files/upload",
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setDownloadPageLink(data.downloadPageLink);
      setId(data.id);
    } catch (error) {
      console.log(error);
      setUploadState("Upload Failed");
    }
  }

  const resetComponent = () => {
    setFile(null);
    setDownloadPageLink(null);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="my-4 text-3xl font-medium">Go to File? Share It Like Fake News</h1>
      <div className="flex flex-col items-center justify-center bg-gray-800 shadow-xl w-96 rounded-xl">
        {
          !downloadPageLink && <DropZoneComponent setFile={setFile} />
        }
        {
          file &&
          <>
            <RenderFile file={{
              format: file?.type.split("/")[1],
              name: file?.name,
              sizeInBytes: file?.size
            }} />

            {!downloadPageLink &&
              <button className="buttonDownload" onClick={handleUpload}>{uploadState}</button>
            }
          </>
        }

        {
          downloadPageLink &&
          <div className="p-2 text-center">
            <DownloadFile downloadPageLink={downloadPageLink} />
            <EmailForm id={id} />
            <button onClick={resetComponent} className="p-2 my-5 bg-gray-900 rounded-md w-44 focus:outline-none">Upload New File</button>
          </div>
        }
      </div>
    </div>
  );
}
