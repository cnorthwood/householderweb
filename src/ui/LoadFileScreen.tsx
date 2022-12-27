import { Upload } from "iconoir-react";
import React, { ChangeEvent, useCallback, useState, FormEvent } from "react";

export default function LoadFileScreen({
  onSelectFile,
  error,
}: {
  onSelectFile: (file: File) => void;
  error?: string;
}) {
  const [fileName, setFileName] = useState<string | null>(null);

  const changeFileName = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setFileName(ev.currentTarget.files![0].name);
  }, []);

  const submitForm = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      if (ev.currentTarget.reportValidity()) {
        onSelectFile((ev.currentTarget.elements.namedItem("file") as HTMLInputElement).files![0]);
      }
    },
    [onSelectFile],
  );

  return (
    <div className="container my-4">
      {error ? (
        <div className="message is-danger my-4">
          <div className="message-header">Unable to load that file</div>
          <div className="message-body">{error}</div>
        </div>
      ) : null}
      <p className="ld-intro">TODO: insert instructions on how to export from Connect</p>

      <form onSubmit={submitForm}>
        <div className="field">
          <div className="control">
            <div className="file is-boxed">
              <label className="file-label">
                <input className="file-input" type="file" name="file" onChange={changeFileName} required />
                <span className="file-cta">
                  <span className="file-icon">
                    <Upload />
                  </span>
                  <span className="file-label">Choose a file…</span>
                </span>
                <span className="file-name">{fileName ?? <i>No file selected</i>}</span>
              </label>
            </div>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-primary">Load file</button>
          </div>
        </div>
      </form>
    </div>
  );
}
