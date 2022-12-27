import React, { useEffect, useState } from "react";

export default function DownloadScreen({ outputFile, onCancel }: { outputFile: File; onCancel: () => void }) {
  const [dataUrl, setDataUrl] = useState<string | undefined>();

  useEffect(() => {
    const fileReader = new FileReader();
    const onLoad = () => {
      setDataUrl(fileReader.result as string);
    };

    fileReader.addEventListener("load", onLoad);
    fileReader.readAsDataURL(outputFile);
    return () => fileReader.removeEventListener("load", onLoad);
  }, [outputFile]);

  return (
    <div className="container my-4">
      <h2 className="ld-subtitle">Householding complete</h2>
      <p className="ld-content">
        You can now save your householded file as an Excel document, or press go back to alter the settings and try
        again.
      </p>
      <div className="field is-horizontal">
        <div className="control">
          <a className={`button is-primary ${dataUrl ? "" : "is-loading"}`} href={dataUrl} download>
            Save file
          </a>
        </div>
        <div className="control">
          <button className="button is-white" onClick={onCancel}>
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
