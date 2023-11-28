import { useState, useEffect } from "react";
import {
  useQueryParams,
  encoderInt,
  decoderInt,
  encoderBoolean,
  decoderBoolean
} from "../hooks/useQueryParams.tsx";

/**
 * Generates DashTable sorting defaults
 *
 * @returns {DashTableColSorting}
 */
export const defaultDashTableColSorting = (): DashTableColSorting => {
  return {
    col: null,
    asc: true
  };
};

export type DashTableFilter = Array<[string, JSX.Element]>;
export type DashTableData = Array<DashTableRow>;

export interface DashTableRow {
  data: Array<DashTableColData>;
  className?: string;
}
export interface DashTableColData {
  value: any;
  sort_value?: any;
  className?: string;
}

export interface DashTableColSorting {
  col: null | number;
  asc: boolean;
}

/**
 * React sortable table component
 *
 * @component
 *
 * @param {Object} props - the component props
 * @param {Array<string>} props.cols - table column names
 * @param {string} [props.id] - the unique identifier for the table
 * @param {string} [props.title] - table title
 * @param {any} [props.header] - additional content
 * @param {DashTableFilter} [props.filter] - filter elements
 * @param {DashTableData} [props.data] - table data
 * @param {string} [props.className] - additional container class name
 * @param {string} [props.innerClassName] - additional inner container class name
 * @param {(sorting: DashTableColSorting) => void} [props.setColSorting] - sorting callback
 * @param {number} [props.defaultSortCol] - default sorting column
 * @param {boolean} [props.defaultSortAsc] - default ascending sorting (default: true)
 * @param {boolean} [props.rememberQs] - remember table sorting in the query string
 *
 * @returns {JSX.Element} DashTable element
 */
export const DashTable = ({
  cols,
  id,
  title,
  header,
  filter,
  data,
  className,
  innerClassName,
  setColSorting,
  defaultSortCol,
  defaultSortAsc,
  rememberQs
}: {
  cols: Array<string>;
  id?: any;
  title?: string;
  header?: any;
  filter?: DashTableFilter;
  data?: DashTableData;
  className?: string;
  innerClassName?: string;
  setColSorting?: (sorting: DashTableColSorting) => void;
  defaultSortCol?: null | number;
  defaultSortAsc?: boolean;
  rememberQs?: boolean;
}) => {
  const [sort_col, setSortCol] = useState<null | number>(
    defaultSortCol || null
  );
  const [sort_asc, setSortAsc] = useState<boolean>(
    defaultSortAsc === undefined ? true : defaultSortAsc
  );

  useEffect(() => {
    setSortCol(defaultSortCol || null);
    setSortAsc(defaultSortAsc === undefined ? true : defaultSortAsc);
    if (setColSorting) {
      setColSorting(defaultDashTableColSorting());
    }
  }, [id, defaultSortCol, defaultSortAsc]);

  const loaded = useQueryParams(
    rememberQs
      ? [
          {
            name: "DT_" + (id ? id : title) + "_sc",
            value: sort_col,
            setter: setSortCol,
            encoder: encoderInt,
            decoder: decoderInt
          },
          {
            name: "DT_" + (id ? id : title) + "_sa",
            value: sort_asc,
            setter: setSortAsc,
            encoder: encoderBoolean,
            decoder: decoderBoolean
          }
        ]
      : [],
    [id, sort_col, sort_asc]
  );

  if (!loaded && rememberQs) {
    return <></>;
  }

  if (sort_col !== null && data) {
    data.sort((x, y) => {
      let result;
      const xc = x.data[sort_col];
      const yc = y.data[sort_col];
      const xval = xc.sort_value === undefined ? xc.value : xc.sort_value;
      const yval = yc.sort_value === undefined ? yc.value : yc.sort_value;
      if (xval < yval) {
        result = 1;
      } else if (xval > yval) {
        result = -1;
      } else {
        result = 0;
      }
      if (sort_asc) {
        result *= -1;
      }
      return result;
    });
  }

  const handleColClick = (cn: number) => {
    if (sort_col === cn) {
      setSortAsc(!sort_asc);
    } else {
      setSortAsc(true);
      setSortCol(cn);
    }
    if (setColSorting) {
      setColSorting({ col: sort_col, asc: sort_asc });
    }
  };

  return (
    <div className={`bmat-dashtable-container ${className}`}>
      {title ? <div className="bmat-dashtable-title">{title}</div> : null}
      <div className={`bmat-dashtable-container-inner ${innerClassName}`}>
        {header}
        {filter ? (
          <div className="bmat-dashtable-filter">
            {filter.map(([n, f], index) => {
              return (
                <div key={index}>
                  <label>
                    {n}
                    {f}
                  </label>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bmat-dashtable-filter-empty"></div>
        )}
        <div className="bmat-dashtable-table-container">
          <table className="bmat-dashtable">
            <thead>
              <tr>
                {cols.map((col, index) => {
                  let col_arrow;
                  if (index == sort_col) {
                    col_arrow = sort_asc ? "⬇" : "⬆";
                  }
                  return (
                    <th
                      className="bmat-dashtable-header"
                      onClick={() => handleColClick(index)}
                      key={`h${index}`}
                    >
                      {col}
                      {col_arrow}
                    </th>
                  );
                })}
              </tr>
            </thead>
            {data ? (
              <tbody>
                {data.map((row: DashTableRow, index: number) => {
                  return (
                    <tr
                      key={index}
                      className={
                        "bmat-dashtable-row " +
                        (index % 2 === 0
                          ? "bmat-dashtable-row-even "
                          : "bmat-dashtable-row-odd ") +
                        row.className
                      }
                    >
                      {row.data.map((col, index) => {
                        return (
                          <td
                            key={`c${index}`}
                            className={"bmat-dashtable-col " + col?.className}
                          >
                            {col.value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            ) : null}
          </table>
        </div>
      </div>
    </div>
  );
};
