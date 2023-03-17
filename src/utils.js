import iconEthereum from '@/assets/icons/iconEthereum.png';
import iconPolygon from '@/assets/icons/iconPolygon.png';
import iconOptimism from '@/assets/icons/iconOptimism.png';

export function getIcon(bundle) {
    switch (bundle) {
        case 'ethereum':
            return iconEthereum;
        case 'goerli':
            return iconEthereum;
        case 'matic':
            return iconPolygon;
        case 'mumbai':
            return iconPolygon;
        case 'optimism-goerli':
            return iconOptimism;
        default:
            return iconEthereum;
    }
}

export function getSymbol(network) { 
    if (network == "goerli") return "ETH"
    else if (network == "mainnet") return "ETH"
    else if (network == "mumbai") return "MATIC"
    else if (network == "optimism-goerli") return "OPT"
    else if (network == "optimism-goerli") return "OPT"
    else if (network == "matic") return "MATIC"
    else return "ETH";
}

export function getReadableGasFee(gasFee, network) {
    console.log(gasFee, network)
    gasFee = parseInt(gasFee)
    console.log(gasFee)
    if (gasFee > 10**13) {
        return (gasFee/10**18).toFixed(5).toString() + " " + getSymbol(network)
    } else if (gasFee > 10**9) {
        return (gasFee/10**9).toFixed(5).toString() + " Gwei";
    } else {
        return (gasFee) + "wei";
    }
}
