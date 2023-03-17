import Chip, {ChipProps} from "@/components/common/chip/Chip";
import React from "react";

interface tableDataT {
  columns: {
    name: string;
    sort: boolean;
  }[];
  rows: {
    hash: {
      text: string;
      icon: string;
    };
    ago: string;
    sender: string;
    target: string;
    fee: {
      value: string;
      gas: ChipProps;
    };
  }[];
}
 

function Table({ tableData }: { tableData: tableDataT }) {
  return (
    <div>
      <div className="mb-2">
        <table className="w-full text-md bg-white shadow-200">
          <thead>
            <tr>
              {[
                {name: "Hash", sort: true},
                {name: "Ago", sort: true},
                {name: "Sender", sort: false},
                {name: "Target", sort: false},
                {name: "Fee", sort: true},
              ].map(({name, sort}, key) => (
                <th key={key} className="py-3.5 px-4 border-b border-dark-100">
                  <SortingButton sort={sort} text={name} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            
            {tableData.rows.map(({ago, fee, sender, target, hash}, index) => (
              
              <tr
                key={index}
                className="[&_td]:border-b [&_td]:border-dark-100 [&_td]:py-3.5 [&_td]:px-4 odd:bg-dark-25 hover:bg-dark-25"
              >
                <td className="">
                  <Hash {...hash} />
                </td>
                <td className="">
                  <span className="tracking-normal">{ago}</span>
                </td>
                <td className="">
                  <Hash text={sender} />
                </td>
                <td className="">
                  <Hash text={target} />
                </td>
                <td className="">
                  <div className="flex items-center justify-end text-rgiht gap-2">
                    <span>{fee.value}</span>
                    <Chip variant="outlined" color={fee.gas.color}>
                      {fee.gas.children}
                    </Chip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center gap-6 text-sm">
        <div className="flex items-center gap-3">
          <p>Rows per page:</p>
          <div className="flex items-center">
            <span>20</span>
            <img src="/images/menu-down.svg" alt="" />
          </div>
        </div>
        <p>1–20 of 10000</p>
        <div className="flex items-center gap-1">
          {[
            "icon-container (18).svg",
            "icon-container (19).svg",
            "icon-container (20).svg",
            "icon-container (21).svg",
          ].map((icon, key) => (
            <button key={key} type="button">
              <img src={`/images/${icon}`} alt="" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Table;

function SortingButton({text, sort = true}: {text: string; sort?: boolean}) {
  return (
    <div role={sort ? "button" : undefined} className="flex items-center gap-2.5">
      <span>{text}</span>
      {sort && <img src="/images/span.svg" alt="" />}
    </div>
  );
}

export function Hash({icon, text, copyIcon}: {icon?: string; text: string; copyIcon?: string}) {
  return (
    <div className="flex items-center gap-2.5">
      {icon && <img src={icon} alt="" />}
      <span className="text-blue-200">{shortenString(text)}</span>
      <button type="button">
        <img src={copyIcon || "/images/Button.svg"} alt="" />
      </button>
    </div>
  );
}

function shortenString(str: string) {
  if (str == null) return '';
  if (str.length <= 10) {
    return str;
  }

  const firstChars = str.slice(0, 6);
  const lastChars = str.slice(-4);

  return `${firstChars}...${lastChars}`;
}
