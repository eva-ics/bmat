import { DashTableFilter, DashTableColData } from "./DashTable.tsx";
import { Timestamp } from "../time";

export interface ColumnRichInfo {
  id: string;
  name: string;
  enabled: boolean;
  columnType?: DashTableColType;
  filterInputSize?: number;
  filterActionKind?: DashTableFilterActionKind;
  filterFieldInput?: DashTableFilterFieldInput;
  filterFieldSelectValues?: any[];
}

export enum DashTableColType {
  String = "string",
  Integer = "integer",
  JSON = "json"
}

export enum DashTableFilterFieldInput {
  Text = "text",
  Select = "select",
  SelectWithEmpty = "select_with_empty"
}

const getfilterActionKindHelp = (kind?: DashTableFilterActionKind): string => {
  switch (kind) {
    case DashTableFilterActionKind.Like:
      return "value must contain a substring";
    case DashTableFilterActionKind.GreaterEqual:
      return "value must be greater or equal";
    case DashTableFilterActionKind.LessEqual:
      return "value must be less or equal";
    case DashTableFilterActionKind.Greater:
      return "value must be greater";
    case DashTableFilterActionKind.Less:
      return "value must be less";
    case DashTableFilterActionKind.Regex:
      return "value must match a regex";
    default:
      return "value must be equal";
  }
};

export enum DashTableFilterActionKind {
  Equal = "=",
  Like = "~",
  GreaterEqual = "≥",
  LessEqual = "≤",
  Greater = ">",
  Less = "<",
  Regex = "(.*)"
}

const formatValue = (value: string, type?: DashTableColType): any => {
  switch (type) {
    case DashTableColType.Integer:
      let n: string | number | null = value === "" ? null : parseInt(value);
      if (n !== null && isNaN(n)) {
        n = null;
      }
      return n;
      break;
    default:
      return value || null;
      break;
  }
};

const escapeCSV = (s: any, columnType?: DashTableColType): string | number => {
  if (columnType === DashTableColType.JSON) {
    return escapeCSV(JSON.stringify(s));
  }
  if (s === null || s === undefined) return "";
  if (typeof s === "number") return s;
  let escapedStr = s.replace(/"/g, '""');
  return `"${escapedStr}"`;
};

/**
 * Generates CSV from data and rich columns
 *
 * @param {any[]} data - array of data
 * @param {ColumnRichInfo[]} cols - columns
 * @param {string} [timeCol] - time column id
 *
 * @returns {DashTableFilter}
 */
export const generateDashTableRichCSV = ({
  data,
  cols,
  timeCol
}: {
  data: any[];
  cols: ColumnRichInfo[];
  timeCol?: string;
}): string => {
  const enabledCols = cols.filter((col) => col.enabled);
  const colIds = enabledCols.map((col) => col.id);
  const colMap = cols.reduce((acc, item) => {
    acc.set(item.id, item);
    return acc;
  }, new Map<string, ColumnRichInfo>());
  let csvContent = timeCol ? "time" : "";
  if (colIds.length > 0) {
    csvContent += (timeCol ? "," : "") + colIds.join(",") + "\n";
  }
  data.forEach((row: any) => {
    let rt: any[] = [];
    if (timeCol) {
      let t = row[timeCol];
      if (t !== undefined) {
        if (typeof t === "number") {
          rt.push(escapeCSV(new Timestamp(row.t).toRFC3339(true)));
        } else {
          rt.push(escapeCSV(t.toString()));
        }
      }
    }
    const rowArray = rt.concat(
      colIds.map((key) => {
        const cellValue = row[key];
        return escapeCSV(cellValue, colMap.get(key)?.columnType);
      })
    );
    csvContent += rowArray.join(",") + "\n";
  });
  return csvContent;
};

/**
 * Creates rich dash table filter
 *
 * @param {ColumnRichInfo[]} cols - columns
 * @param {(cols: ColumnRichInfo[]) => void} cols - column setter
 * @param { [key: string]: any } params - filter parameters
 * @param {(o: { [key: string]: any }) => void} setParams - setter for parameters
 * @param {string} [className] - a custom label class name
 * @param {string|JSX.Element} [removeButton] - remove button icon/symbol/element, required for setter
 *
 * @returns {DashTableFilter}
 */
export const createRichFilter = ({
  cols,
  setCols,
  params,
  setParams,
  removeButton,
  className
}: {
  cols: ColumnRichInfo[];
  setCols: (cols: ColumnRichInfo[]) => void;
  params: { [key: string]: any };
  setParams: (o: { [key: string]: any }) => void;
  removeButton?: string | JSX.Element;
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
          onClick={(e) => {
            e.preventDefault();
            col.enabled = !col.enabled;
            const nc: ColumnRichInfo[] = [...cols];
            setCols(nc);
          }}
        >
          {col.name}
        </span>{" "}
        <span title={getfilterActionKindHelp(col.filterActionKind)}>
          {col.filterActionKind || "="}
        </span>
      </div>
    );
    let input;
    switch (col.filterFieldInput) {
      case DashTableFilterFieldInput.Select:
      case DashTableFilterFieldInput.SelectWithEmpty:
        input = (
          <select
            onChange={(e) =>
              setParams({
                [col.id]: formatValue(e.target.value, col.columnType)
              })
            }
            value={params[col.id] === null ? "" : params[col.id]}
          >
            {col.filterFieldInput ===
            DashTableFilterFieldInput.SelectWithEmpty ? (
              <option value=""></option>
            ) : (
              ""
            )}
            {col.filterFieldSelectValues?.map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>
        );
        break;
      default:
        input = (
          <input
            size={col.filterInputSize || 10}
            value={params[col.id] === null ? "" : params[col.id]}
            onChange={(e) =>
              setParams({
                [col.id]: formatValue(e.target.value, col.columnType)
              })
            }
          />
        );
    }
    const inputBlock = (
      <>
        {input}
        {removeButton === undefined ||
        col.filterFieldInput === DashTableFilterFieldInput.Select ? (
          ""
        ) : (
          <div
            title={`clear ${col.name} filter`}
            className="bmat-dashtable-filter-button-remove"
            onClick={(e) => {
              e.preventDefault();
              setParams({ [col.id]: null });
            }}
          >
            {params[col.id] !== null ? (
              <>{removeButton}</>
            ) : (
              <div className="bmat-dashtable-filter-spacer"></div>
            )}
          </div>
        )}
      </>
    );
    return [label, inputBlock];
  });

/**
 * Pushes rich column data into DashTableColData if the column is enabled
 *
 * @param {DashTableColData[]} colsData - column data
 * @param {string} id - column id
 * @param {any} value - column value
 * @param {(o: { [key: string]: any }) => void} [setParams] - setter for the filter parameters
 * @param {any} [sort_value] - column sort value
 * @param {string} [className] - a custom column class name
 * @param {string|JSX.Element} [addButton] - add button icon/symbol/element, required for setter
 *
 * @returns {void}
 */
export const pushRichColData = ({
  colsData,
  id,
  value,
  setParams,
  sort_value,
  className,
  cols,
  addButton
}: {
  colsData: DashTableColData[];
  id: string;
  value: any;
  cols: ColumnRichInfo[];
  setParams?: (o: { [key: string]: any }) => void;
  sort_value?: any;
  className?: string;
  addButton?: string | JSX.Element;
}) => {
  const column = cols.find((column) => column.id === id);
  if (!column?.enabled) {
    return;
  }
  const data = {
    value: (
      <>
        {value}
        {value === null ||
        value === "" ||
        setParams === undefined ||
        addButton === undefined ? (
          ""
        ) : (
          <div
            title={`use the value as ${column.name} filter`}
            className="bmat-dashtable-filter-button-add"
            onClick={() => setParams({ [id]: value })}
          >
            {addButton}
          </div>
        )}
      </>
    ),
    sort_value: sort_value === undefined ? value : sort_value,
    className: className
  };
  colsData.push(data);
};
