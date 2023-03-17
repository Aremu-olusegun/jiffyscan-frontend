import React from "react";
import Image from "next/image";
import pngLogo from '../../assets/icons/Vectorlogo.png';

function Logo() {
    return (
        <a href="\">
            <div className="flex flex-row">
                <Image src={pngLogo} alt="logo" width={30} height={30} />
                <p className="text-2xl font-bold">JiffyScan</p>
                <p className="text-xs">v0.5</p>
            </div>
        </a>
    );
}

export default Logo;
