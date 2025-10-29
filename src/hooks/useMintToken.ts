import { ethers, getAddress  } from "ethers";

export function useMintToken() {
  const mintToken = async ({
      contractAddress,
      abi,
      amount,
      signer,
      setMintStep
    }: {
      contractAddress: string;
      abi: any;
      amount: any;
      signer: ethers.Signer;
      setMintStep: (step: 'idle' | 'minting' | 'success') => void;
    }) => {
        try {
            
            const contractAddressChecksum = getAddress(contractAddress) as `0x${string}`;

            setMintStep('minting')
            const contract = new ethers.Contract(contractAddressChecksum, abi, signer);
            const tx = await contract.mintToken(amount);
            const res = await tx.wait();
            console.log({res});
            setMintStep('success');
        } catch(err) {
            console.error('Error in minting token:', err);
            throw err;
        }

  };
  return { mintToken };
} 