import { DSVRowArray, tsvParse } from "d3-dsv";
import XlsxPopulate from "xlsx-populate";

import householder, { EXPECTED_COLUMNS, ExportedColumn, HouseholdingOptions } from "./main";

type LoadFileMessage = { type: "LOAD_FILE"; file: File };
type RunHouseholdingMessage = { type: "HOUSEHOLD"; options: HouseholdingOptions };
export type WorkerMessage = LoadFileMessage | RunHouseholdingMessage;

type ErrorResponse = { type: "ERROR"; message: string };
type FileLoadErrorResponse = { type: "FILE_LOAD_ERROR"; message: string };
type FileLoadedResponse = { type: "FILE_LOADED"; voters: number };
type HouseholdCompleteResponse = { type: "HOUSEHOLD_COMPLETE"; file: File };
export type WorkerResponse = ErrorResponse | FileLoadErrorResponse | FileLoadedResponse | HouseholdCompleteResponse;

let originalFile: DSVRowArray<ExportedColumn> | null = null;

/* eslint-disable no-restricted-globals */

self.onmessage = (ev: MessageEvent) => {
  const data = ev.data as WorkerMessage;
  switch (data.type) {
    case "LOAD_FILE": {
      const fileReader = new FileReaderSync();
      const parsedFile = tsvParse(fileReader.readAsText(data.file));
      if (parsedFile.length === 0) {
        self.postMessage({
          type: "FILE_LOAD_ERROR",
          message: "There were no valid voters in that export",
        } as WorkerResponse);
        return;
      }

      if (!EXPECTED_COLUMNS.every((column) => column in parsedFile[0])) {
        self.postMessage({
          type: "FILE_LOAD_ERROR",
          message:
            "The export was missing the correct columns. Did you customise the export correctly, and pick the .xls file?",
        } as WorkerResponse);
        return;
      }

      originalFile = parsedFile as DSVRowArray<ExportedColumn>;
      self.postMessage({
        type: "FILE_LOADED",
        voters: originalFile.length,
      } as WorkerResponse);

      return;
    }

    case "HOUSEHOLD": {
      if (!originalFile) {
        self.postMessage({ type: "ERROR", message: "Householding without a file selected" } as WorkerResponse);
        return;
      }

      householder(originalFile, data.options)
        .then(async (workbook) => {
          const file = new File(
            [await workbook.outputAsync({ password: data.options.encrypt })],
            `Householder-${new Date().toISOString().replaceAll(":", "-")}.xlsx`,
            {
              type: XlsxPopulate.MIME_TYPE,
            },
          );
          self.postMessage({ type: "HOUSEHOLD_COMPLETE", file } as WorkerResponse);
        })
        .catch((err: unknown) => {
          self.postMessage({
            type: "ERROR",
            message: err instanceof Error ? err.message : "An unknown error occurred",
          } as WorkerResponse);
        });
      return;
    }

    default:
      self.postMessage({ type: "ERROR", message: "Unrecognised request received" } as WorkerResponse);
      return;
  }
};
