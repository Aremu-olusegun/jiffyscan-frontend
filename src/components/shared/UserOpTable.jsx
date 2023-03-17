import Image from "next/image";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { TablePagination } from "@mui/material";

const UserOpTable = ({ columns, rows, pageDetails }) => {
    if (rows == [])
        return () => (
            <table classNme="shadow-xl border-collapse border-b-2 w-full">
                <CircularProgress />
            </table>
        );
    return (
        <div>
            <table className=" shadow-xl border-collapse border-b-2 w-full">
                <thead>
                    <tr>
                        {columns.map((col) => {
                            return (
                                <th className={`${col.width}`} key={col.id}>
                                    {col.name}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => {
                        return (
                            <tr key={idx} className="border-b-2">
                                {columns.map((col) => {
                                    if (col.id == "hash") {
                                        return (
                                            <td className="text-center" key={col.id}>
                                                <div className="flex flex-row px-4 space-x-4">
                                                    <Image src={row.icon} alt="icon" className="w-6 h-6" />
                                                    {row[col.id]}
                                                </div>
                                            </td>
                                        );
                                    }

                                    return (
                                        <td className="text-center" key={col.id}>
                                            {row[col.id]}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {pageDetails && (
                <TablePagination
                    component="div"
                    count={100}
                    page={pageDetails.pageNo}
                    rowsPerPageOptions={[10, 20, 30]}
                    onPageChange={pageDetails.handlePageChange}
                    rowsPerPage={pageDetails.pageSize}
                    onRowsPerPageChange={pageDetails.handlePageSizeChange}
                />
            )}
        </div>
    );
};

UserOpTable.displayName = "UserOpTable";

export default UserOpTable;
