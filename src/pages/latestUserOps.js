import React, {useState} from "react";
import Head from 'next/head';
import { Inter } from 'next/font/google';
import Header from '@/components/shared/Header';
import SearchBar from '@/components/homepage/SearchBar';
import LatestUserOpsComponent from '@/components/userOps/LatestUserOpsComponent';
import Layout from '@/components/shared/Layout';
import RecentMetrics from '@/components/homepage/RecentMetrics';
import ViewAllBundlesButton from '@/components/homepage/ViewAllBundlesButton';
import ViewAllUserOpsButton from '@/components/homepage/ViewAllUserOpsButton';
import LatestBundles from '@/components/homepage/LatestBundles';
import NetworkFilter from '@/components/homepage/NetworkFilter';
import { SUPPORTED_NETWORKS } from "@/utils/constants";

const inter = Inter({ subsets: ['latin'] });

export default function LatestUserOps() {
    const [network, setNetwork] = useState(SUPPORTED_NETWORKS[0].id);

    const handleNetworkChange = (newNetwork) => {
            setNetwork(newNetwork);
    };

    return (
        <>
            <Layout>
                <div className="flex flex-col w-[343px] lg:w-full py-6 mx-auto">
                    <h1 className="text-xl font-semibold pb-4">
                        The User Operations Explorer
                    </h1>
                    <span className="w-2/3">
                        <SearchBar />
                    </span>
                </div>

                <div className="flex flex-col pb-6 overflow-auto lg:w-full lg:overflow-visible">
                    <RecentMetrics network={network} handleNetworkChange={handleNetworkChange}/>
                </div>

                    <LatestUserOpsComponent network={network}/>
            </Layout>
        </>
    );
}
