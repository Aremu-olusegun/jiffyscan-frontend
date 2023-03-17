import Chip from "@/components/common/chip/Chip";
import IconButton from "@/components/common/icon_button/IconButton";
import InfoButton from "@/components/common/InfoButton";
import Footer from "@/components/globals/footer/Footer";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Table from "./Table";
import { ChipProps } from "@/components/common/chip/Chip";
import * as moment from "moment";
import { Chart } from "./Chart";

type UserOp = {
  id: string
  transactionHash: string
  userOpHash: string
  sender: string
  paymaster: string
  nonce: number
  actualGasCost: number
  actualGasPrice: number
  actualGasUsed: number
  success: Boolean
  revertReason: string
  blockTime: number
  blockNumber: number
  network: String
  input: string
  target: string
  callData: string
  beneficiary: string
  factory: string
  value: number
}

type UserOps = UserOp[]

type rows =  {
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

type columns = {
  name: string;
  sort: boolean;
}[];

type dailyMetrics = dailyMetric[]

type dailyMetric = {
  userOpCounter:  number
  totalFeeCollected: number
  daySinceEpoch: number
  bundleCounter: number
  walletsCreated: number
}

const pages = [
  {
    id: 3487,
    name: "Home",
    url: "/",
  },
  {
    id: 4567,
    name: "Blockchain",
    url: "/blockchain",
    dropdown: [],
  },
  {
    id: 3456,
    name: "Developers",
    url: "/bevelopers",
    dropdown: [],
  },
  {
    id: 5647,
    name: "More",
    url: "/more",
    dropdown: [],
  },
];

const recentMetrics = [
  {
    id: 1,
    title: "Total number of UserOps",
    value: "760.34k",
    status: "20.5",
  },
  {
    id: 2,
    title: "Total Daily Gas Fee Paid",
    value: "760.34k",
    status: "20.5",
  },
  {
    id: 3,
    title: "Unique Transacting Wallets",
    value: "760.34k",
    status: "20.5",
  },
  {
    id: 4,
    title: "New Wallets Created",
    value: "760.34k",
    status: "20.5",
  },
];

const columns: columns =  [
  {name: "Hash", sort: true},
  {name: "Age", sort: true},
  {name: "Sender", sort: false},
  {name: "Target", sort: false},
  {name: "Fee", sort: true},
]

const createRowsObject = (userOps: UserOps): any[] => {
  let rows: rows = [];
  if (userOps === undefined) return rows;
  for (let idx in userOps) {
    let userOp: UserOp = userOps[idx];
    let timePassedInEpoch = new Date().getTime() - userOp.blockTime * 1000;
    let timePassedMoment = moment.duration(timePassedInEpoch);
    let timePassed = timePassedMoment.humanize().replace('minutes', 'min') + ' ago';
    rows.push({
        hash: 
        {
              text: userOp.userOpHash,
              icon: "/images/icon-container (10).svg",
            },
        ago: timePassed,
        sender: userOp.sender,
        target: userOp.target,
        fee: {
              value: userOp.actualGasCost.toString(),
              gas: {
                children: "ETH",
                color: "info",
              },
            }
    });
  }
  return rows;
}



function Home() {
  const { pathname } = useRouter();
  const [rows, setRows] = useState<rows>([]);
  const [network, setNetwork] = useState('mainnet');
  const [dailyMetrics, setDailyMetrics] = useState([] as dailyMetric[]);
  const [userOpMetric, setUserOpMetric] = useState([] as number[]);
  const [walletsCreatedMetric, setWalletsCreatedMetric] = useState([] as number[]);
  const [bundleMetric, setBundleMetric] = useState([] as number[]);
  const [totalFeeCollectedMetric, setTotalFeeCollectedMetric] = useState([] as number[]);

  const getChart = (id:number) => {
    console.log(id,userOpMetric, totalFeeCollectedMetric, walletsCreatedMetric, bundleMetric)
    if (id === 1) {
      return <Chart chartValues={userOpMetric}/>
    } else if (id === 2) {
      return <Chart chartValues={totalFeeCollectedMetric}/>
    } else if (id === 3) {
      return <Chart chartValues={walletsCreatedMetric}/>
    } else if (id === 4) {
      return <Chart chartValues={bundleMetric}/>
    }
  }

  useEffect(() => {
    fetchUserOps(0, 10);
    fetchDailyMetrics();
  }, [network]);

  useEffect(() => {
    let userOpMetric = []
    let walletsCreatedMetric = []
    let bundleMetric = []
    let totalFeeCollectedMetric = []
    for (let i in dailyMetrics) {
      userOpMetric.push(dailyMetrics[i].userOpCounter)
      walletsCreatedMetric.push(dailyMetrics[i].walletsCreated)
      bundleMetric.push(dailyMetrics[i].bundleCounter)
      totalFeeCollectedMetric.push(dailyMetrics[i].totalFeeCollected)
    }
    setUserOpMetric(userOpMetric)
    setWalletsCreatedMetric(walletsCreatedMetric)
    setBundleMetric(bundleMetric)
    setTotalFeeCollectedMetric(totalFeeCollectedMetric)
  },[dailyMetrics])

  const fetchUserOps = async (pageNo: number, pageSize: number) => {
    const response = await fetch(
      'https://api.jiffyscan.xyz/v0/getLatestUserOps?network=' + network + '&first=' + pageSize + '&skip=' + pageNo * pageSize
    );
    const userOpsFromResponse = await response.json();
    if ('userOps' in userOpsFromResponse) {
      const rows = createRowsObject(
        userOpsFromResponse.userOps
      );
      console.log(rows.length)
      setRows(rows);
    }
  }

  const fetchDailyMetrics = async () => {
    const response = await fetch(
      'https://api.jiffyscan.xyz/v0/GetDailyMetrics?network=' + network + '&noOfDays=4'
    );
    const dailyMetricsResponse = await response.json();
    if ('metrics' in dailyMetricsResponse) {
      setDailyMetrics(dailyMetricsResponse.metrics);
    }
  }

  return (
    <div className="">
      <nav className="py-3">
        <div className="container justify-between flex items-center gap-8">
          <div className="">
            <Link href="/" className="flex items-end gap-2 text-dark-600 hover:no-underline">
              <img src="/images/Frame 19.svg" alt="" />
              <span className="font-semibold text-xl leading-[1.4]">jiffyscan.xyz</span>
              <span className="text-sm">v0.5</span>
            </Link>
          </div>
          <div className="w-[1px] h-[40px] bg-black/[12%]" />
          <div className="flex items-center gap-6">
            {pages.map(({ id, name, url, dropdown }) => {
              const current = url === pathname;
              return (
                <Link
                  href={url}
                  key={id}
                  className={`flex items-center gap-1 text-md tracking-[0.25px] underline-offset-[10px] decoration-2 ${current ? "underline" : "hover:no-underline"
                    }`}
                >
                  <span>{name}</span>
                  {dropdown && <img src="/images/icon-container.svg" alt="" />}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3 flex-grow justify-end">
            <div className="shadow-300 bg-white rounded border-dark-200 flex-grow max-w-[400px]">
              <label className="flex justify-center">
                <span className="p-2.5 border-r border-dark-200" role="button">
                  <img src="/images/search.svg" alt="" />
                </span>
                <div className="flex items-center gap-2.5 pr-3 flex-grow">
                  <input
                    type="text"
                    className="text-base placeholder:text-dark-500 text-dark-600 px-3 py-2 flex-grow"
                    placeholder="Search..."
                  />
                  <span className="bg-dark-400 px-3 h-5 flex justify-center items-center rounded-full">
                    <img className="" src="/images/span (1).svg" alt="" />
                  </span>
                </div>
              </label>
            </div>
            <div className="flex items-center gap-1">
              <IconButton icon="/images/icon-container (1).svg" />
              <IconButton icon="/images/icon-container (2).svg" />
            </div>
          </div>
        </div>
      </nav>
      <section className="py-10">
        <div className="container">
          <h1 className="font-bold text-3xl">User Operations</h1>
        </div>
      </section>
      <main className="mb-10">
        <div className="container">
          <div className="flex justify-between items-center gap-10 py-2 mb-4">
            <div className="flex items-center gap-2 flex-grow">
              <img src="/images/cube-unfolded.svg" alt="" />
              <b className="font-bold text-lg">Recent Metrics</b>
              <InfoButton />
            </div>
            <div className="flex items-center gap-1">
              <Chip startIcon="/images/icon-container (4).svg">Goerli</Chip>
              <Chip color="white" startIcon="/images/icon-container (5).svg">
                Mumbai
              </Chip>
              <Chip color="white" startIcon="/images/icon-container (6).svg">
                Optimism Goerli
              </Chip>
              <Chip color="white" endIcon="/images/icon-container (7).svg">
                More
              </Chip>
            </div>
          </div>
          <div className="">
            <div className="grid grid-cols-4 gap-2">
              {recentMetrics.map(({ id, status, title, value }) => (
                <div className="p-4 rounded border border-dark-200 bg-white shadow-200" key={id}>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{title}</span>
                    <InfoButton />
                  </div>
                  <div className="flex items-center gap-1">
                    <img src="/images/icon-container (8).svg" alt="" />
                    <span className="font-bold">{value}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-sm text-dark-500">{status}%</span>
                    <img src="/images/icon-container (9).svg" alt="" />
                  </div>
                  <div>
                    {/* <img className="w-full" src="/images/graphs.svg" alt="" /> */}
                    {getChart(id)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <section className="mb-10">
        <div className="container">
          <div>
            <div className="flex items-center gap-2 py-2 mb-2">
              <img src="/images/cube.svg" alt="" />
              <span className="font-bold text-lg">More than &gt; 1,892,547,662 transactions found</span>
              <InfoButton />
            </div>
            <div>
              <Table tableData={{rows, columns}}/>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
