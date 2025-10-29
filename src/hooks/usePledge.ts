//@ts-nocheck
import { ethers, getAddress  } from "ethers";

export function usePledge() {
  const pledge = async ({
    signer,
    address,
    contractAddressZecureFund,
    contractAddressERC7984,
    abiZecureFund,
    abiERC7984,
    id,
    endTime,
    encryptedAmount,
    proof,
    setPledgeStep
    }: {
    signer: ethers.Signer;
    address: any;
    contractAddressZecureFund: any,
    contractAddressERC7984: any,
    abiZecureFund: any,
    abiERC7984: any,
    id: any;
    endTime: any;
    encryptedAmount: any;
    proof: any;
    setPledgeStep: (step: 'idle' | 'pledging' | 'success' | 'initializing' | 'ready') => void;
    }) => {

        try {

            
             const tokenContract = new ethers.Contract(contractAddressERC7984, abiERC7984, signer);
             const ZecureFundContract = new ethers.Contract(contractAddressZecureFund, abiZecureFund, signer);

            setPledgeStep('pledging')
            const tokenTx = await tokenContract.setOperator(contractAddressZecureFund, endTime);
            const tokenTxRes = await tokenTx.wait();

            const ZecureFundTx = await ZecureFundContract.pledge(id, encryptedAmount, proof);
            const ZecureFundTxRes = await ZecureFundTx.wait();

            console.log({tokenTxRes});
            console.log({ZecureFundTxRes});
            setPledgeStep('success');
        } catch(err) {
            console.error('Error in minting token:', err);
            throw err;
        }

  };
  return { pledge };
} 