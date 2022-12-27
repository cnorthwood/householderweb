import { DSVRowArray } from "d3-dsv";

import householder, { EXPECTED_COLUMNS, ExportedColumn } from "./main";

function createInput(records: { [Field in ExportedColumn]: string }[]): DSVRowArray<ExportedColumn> {
  (records as DSVRowArray<ExportedColumn>).columns = EXPECTED_COLUMNS.slice();
  return records as DSVRowArray<ExportedColumn>;
}

describe("householder", () => {
  it("successfully transforms an empty file", async () => {
    const workbook = await householder(createInput([]), {});

    expect(workbook.sheet(0).usedRange()!.value()).toEqual([EXPECTED_COLUMNS]);
  });
});
