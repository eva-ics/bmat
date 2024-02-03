import { DashTableFilter, DashTableColData } from "./DashTable.tsx";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export interface ColumnRichInfo {
  id: string;
  name: string;
  enabled: boolean;
  filterInputSize?: number;
  filterFieldKind?: DashTableFilterFieldKind;
  filterActionKind?: DashTableFilterActionKind;
}

export enum DashTableFilterFieldKind {
  String = "string",
  Integer = "integer"
}

export enum DashTableFilterActionKind {
  Equal = "=",
  Like = "~"
}

const formatValue = (value: string, kind: DashTableFilterFieldKind): any => {
  switch (kind) {
    case DashTableFilterFieldKind.String:
      return value || null;
      break;
    case DashTableFilterFieldKind.Integer:
      let n: string | number | null = value === "" ? null : parseInt(value);
      if (n !== null && isNaN(n)) {
        n = null;
      }
      return n;
      break;
  }
};

/**
 * Creates rich dash table filter
 *
 * @param {ColumnRichInfo[]} cols - columns
 * @param {(cols: ColumnRichInfo[]) => void} cols - column setter
 * @param { [key: string]: any } params - filter parameters
   @param {(o: { [key: string]: any }) => void} setParams - setter for parameters
   @param {string} [className] - a custom label class name
 *
 * @returns {Coords}
 */
export const createRichFilter = ({
  cols,
  setCols,
  params,
  setParams,
  className
}: {
  cols: ColumnRichInfo[];
  setCols: (cols: ColumnRichInfo[]) => void;
  params: { [key: string]: any };
  setParams: (o: { [key: string]: any }) => void;
  className?: string;
}): DashTableFilter =>
  cols.map((col) => {
    let labelClassName = "bmat-dashtable-filter-label";
    labelClassName +=
      (col?.enabled === true ? " " : " bmat-dashtable-filter-label-off ") +
      (className || "");
    const label = (
      <div className="bmat-dashtable-filter-label-container">
        <span
          title={`toggle ${col.name} column display`}
          className={labelClassName}
          onClick={() => {
            col.enabled = !col.enabled;
            const nc: ColumnRichInfo[] = [...cols];
            setCols(nc);
          }}
        >
          {col.name}
        </span>{" "}
        {col.filterActionKind || "="}
      </div>
    );
    const input = (
      <>
        <input
          size={col.filterInputSize || 10}
          value={params[col.id] === null ? "" : params[col.id]}
          onChange={(e) =>
            setParams({
              [col.id]: formatValue(
                e.target.value,
                col.filterFieldKind || DashTableFilterFieldKind.String
              )
            })
          }
        />
        <div
          title={`clear ${col.name} filter`}
          className="bmat-dashtable-filter-button-remove"
          onClick={() => setParams({ [col.id]: null })}
        >
          {params[col.id] !== null ? (
            <>
              <RemoveCircleOutlineIcon fontSize="inherit" />
            </>
          ) : (
            <div className="bmat-dashtable-filter-spacer"></div>
          )}
        </div>
      </>
    );
    return [label, input];
  });

/**
 * Pushes rich column data into DashTableColData if the column is enabled
 *
 * @param {DashTableColData[]} colsData - column data
 * @param {string} id - column id
 * @param {any} value - column value
   @param {(o: { [key: string]: any }) => void} [setParams] - setter for the filter parameters
   @param {any} [sort_value] - column sort value
   @param {string} [className] - a custom column class name
 */
export const pushRichColData = ({
  colsData,
  id,
  value,
  setParams,
  sort_value,
  className,
  cols
}: {
  colsData: DashTableColData[];
  id: string;
  value: any;
  cols: ColumnRichInfo[];
  setParams?: (o: { [key: string]: any }) => void;
  sort_value?: any;
  className?: string;
}) => {
  const column = cols.find((column) => column.id === id);
  if (!column?.enabled) {
    return;
  }
  const data = {
    value: (
      <>
        {value}
        {value === null || value === "" || setParams === undefined ? (
          ""
        ) : (
          <div
            title={`use the value as ${column.name} filter`}
            className="bmat-dashtable-filter-button-add"
            onClick={() => setParams({ [id]: value })}
          >
            <AddCircleOutlineIcon fontSize="inherit" />
          </div>
        )}
      </>
    ),
    sort_value: sort_value === undefined ? value : sort_value,
    className: className
  };
  colsData.push(data);
};
