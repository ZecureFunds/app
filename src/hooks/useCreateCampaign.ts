import { ethers, getAddress  } from "ethers";

export function useCreateCampaign() {
  const createCampaign = async ({

    signer,
    contractAddress,
    abi,
    goal,
    startTimeInTimestamp,
    endTimeInTimestamp,
    setCreateCampaignStep
    }: {
    signer: ethers.Signer;
    contractAddress: string;
    abi: any;
    goal: any;
    startTimeInTimestamp: any;
    endTimeInTimestamp: any;
    setCreateCampaignStep: (step: 'idle' | 'creating' | 'success') => void;
    }) => {
        try {
            
            const contractAddressChecksum = getAddress(contractAddress) as `0x${string}`;

            setCreateCampaignStep('creating')
            const contract = new ethers.Contract(contractAddressChecksum, abi, signer);
            const tx = await contract.createCampaign(goal, startTimeInTimestamp, endTimeInTimestamp);
            const res = await tx.wait();
            console.log({res});
            setCreateCampaignStep('success');
        } catch(err) {
            console.error('Error in minting token:', err);
            throw err;
        }

  };
  return { createCampaign };
} 