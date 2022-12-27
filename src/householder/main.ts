import { DSVRowArray } from "d3-dsv";
import XlsxPopulate, { Workbook } from "xlsx-populate";

export const EXPECTED_COLUMNS = [
  "Voter File VANID",
  "LastName",
  "FirstName",
  "MiddleName",
  "Suffix",
  "Salutation  Informal",
  "mAddressLine1",
  "mAddressLine2",
  "mAddressLine3",
  "mCity",
  "mPostalCode",
  "DefaultWalkName",
  "PollingDistrictCode",
  "ElectorNumberWithSuffix",
] as const;

export type HouseholdingOptions = { encrypt?: string };
export type ExportedColumn = typeof EXPECTED_COLUMNS[number];

export default async function householder(
  inputFile: DSVRowArray<ExportedColumn>,
  options: HouseholdingOptions,
): Promise<Workbook> {
  const workbook = await XlsxPopulate.fromBlankAsync();

  // TODO: magic
  // set the headers
  // @ts-ignore — TypeScript doesn't know cell.value() supports this
  workbook.sheet(0).cell("A1").value([inputFile.columns]);

  return workbook;
}
