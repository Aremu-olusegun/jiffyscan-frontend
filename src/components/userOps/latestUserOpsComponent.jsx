import React, { useState, useEffect } from 'react';
import ViewAllUserOpsButton from '@/components/homepage/ViewAllUserOpsButton';
import UserOpTable from '../shared/UserOpTable';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getIcon, getReadableGasFee } from '@/utils';

const CopyButtonDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
}));

const DEFAULT_PAGE_SIZE = "20"

const cols = [
    {
        name: 'Hash',
        id: 'hash',
        width: 'w-1/5',
    },
    {
        name: 'Age',
        id: 'age',
        width: 'w-1/5',
    },
    {
        name: 'Sender',
        id: 'sender',
        width: 'w-1/5',
    },
    {
        name: 'Target',
        id: 'target',
        width: 'w-1/5',
    },
    {
        name: 'Fee',
        id: 'fee',
        width: 'w-1/5',
    }
];

const getRowsFromUserOpResponse = (userOps) => {
    let rows = [];
    if (userOps === undefined) return rows;
    let sortedUserOps = userOps.sort((p1, p2) =>
        p1.blockTime < p2.blockTime ? 1 : p1.blockTime > p2.blockTime ? -1 : 0
    );
    sortedUserOps = sortedUserOps.slice(0, 5);

    for (let idx in sortedUserOps) {
        let userOp = sortedUserOps[idx];
        let timePassedInEpoch = new Date().getTime() - userOp.blockTime * 1000;
        let timePassed = moment.duration(timePassedInEpoch);
        rows.push({
            hash: (
                <CopyButtonDiv>
                    <a href={'https://www.google.com'}>
                        {userOp.userOpHash.slice(0, 5) + '...' + userOp.userOpHash.slice(-3)}
                    </a>
                    <IconButton onClick={() => handleCopy(userOp.userOpHash)}>
                        <ContentCopyIcon size="small" />
                    </IconButton>
                </CopyButtonDiv>
            ),
            age: timePassed.humanize() + ' ago',
            sender: (
                <CopyButtonDiv>
                    
                        {userOp.sender.slice(0, 5) + '...' + userOp.sender.slice(-3)}
                    
                    <IconButton onClick={() => handleCopy(userOp.sender)}>
                        <ContentCopyIcon size="small" />
                    </IconButton>
                </CopyButtonDiv>
            ),
            target: (
                <CopyButtonDiv>
                    <a href={'https://www.google.com'}>
                    {userOp.target != null && userOp.target.slice(0, 5) + '...' + userOp.target.slice(-3)}
                    </a>
                    <IconButton onClick={() => handleCopy(userOp.target || '')}>
                        <ContentCopyIcon size="small" />
                    </IconButton>
                </CopyButtonDiv>
            ),
            icon: getIcon(userOp.network),
            fee: getReadableGasFee(userOp.actualGasCost, userOp.network),
        });
    }
    return rows;
};

export default function LatestUserOpsComponent({network}) {
    const [rows, setRows] = useState([]);
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    useEffect(() => {
        fetchUserOps(0, pageSize);
    }, [network]);

    useEffect(() => {
        fetchUserOps(pageNo, pageSize);
    }, [pageNo, pageSize]);

    const fetchUserOps = async (pageNo, pageSize) => {
        const response = await fetch(
            'https://api.jiffyscan.xyz/v0/getLatestUserOps?network=' + network + '&first='+ pageSize + '&skip=' + pageNo * pageSize
        );
        const userOpsFromResponse = await response.json();
        if ('userOps' in userOpsFromResponse) {
            const rows = getRowsFromUserOpResponse(
                userOpsFromResponse.userOps
            );
            console.log(rows.size())
            setRows(rows);
        }
    }

    const handlePageChange = async (event, pageNo) => {
        setPageNo(pageNo);
    }

    const handlePageSizeChange = async (event) => {
        setPageSize(event.target.value);
    }


    return (
        <div className="flex flex-col ">
            <h1 className="text-xl font-semibold pb-4">
                Latest User Operations
            </h1>
            <div className="overflow-scroll border-1 shadow-lg rounded">
                <UserOpTable columns={cols} rows={rows} pageDetails={{
                    pageSize: pageSize,
                    handlePageChange: handlePageChange,
                    handlePageSizeChange: handlePageSizeChange,
                    pageNo: pageNo
                }}/>
            </div>
            <div className="py-4">
                <ViewAllUserOpsButton />
            </div>
        </div>
    );
}
