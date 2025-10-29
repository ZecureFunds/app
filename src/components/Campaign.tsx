//@ts-nocheck
import { ethers, getAddress, hexlify } from "ethers";
import { useEffect, useState } from "react";
import ZecureFund from '../abi/ZecureFund.json';
import { usePledge } from "../hooks/usePledge";
import ERC7984Token from '../abi/ERC7984Token.json';
import { getFheInstance, initializeFheInstance } from "../utils/fheInstance";


export interface CampaignProps {
    id: any;
}


const Campaign: React.FC<CampaignProps> = ({id}) => {
    const [campaign, setCampaign] = useState({
       creator: '',
       goal: '',
       pledged: '',
       revealedPledged: '',
       startAt: '',
       endAt: '',
       claimed: ''
    });
    const [pledgeAmount, setPledgeAmount] = useState('');
    const [pledgeStep, setPledgeStep] = useState<'idle' | 'pledging' | 'success' | 'initializing' | 'ready'>("idle");
    const [revealedStep, setRevealedStep] = useState<'idle' | 'revealing' | 'success'>("idle");
    
     const [claimStep, setClaimStep] = useState<'idle' | 'claiming' | 'success'>("idle");
    const [revealedPledge, setRevealedPledge] = useState('0');
    const { pledge } = usePledge();

const formatDateTime = (dateTimeString: any) => {

    const date = new Date(Number(dateTimeString) * 1000); // Convert seconds to milliseconds
  
    // Format: YYYY-MM-DDTHH:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };


const handlePledge = async (campaignId: any) => {

     const provider = new ethers.BrowserProvider(window.ethereum);
     const signer = await provider.getSigner();
     
     const endTime = Math.floor(Date.now() / 1000) + 86400;

     const amount = ethers.parseUnits(String(pledgeAmount), 6);
     const contractAddressChecksum = getAddress(ZecureFund.address) as `0x${string}`

    // Initialize FHEVM if not already initialized
        let fhe = getFheInstance();
        if (!fhe) {
            setPledgeStep('initializing');
            fhe = await initializeFheInstance();
            setPledgeStep('ready');
        }
        if (!fhe) throw new Error('Failed to initialize FHE instance');

        const ciphertext = await fhe.createEncryptedInput(contractAddressChecksum, signer?.address);
        ciphertext.add64(BigInt(amount));
        const { handles, inputProof } = await ciphertext.encrypt();
        const encryptedHex = hexlify(handles[0]);
        const proofHex = hexlify(inputProof);


     try{
            await pledge({
                signer,
                address: signer?.address,
                contractAddressZecureFund: ZecureFund.address,
                contractAddressERC7984: ERC7984Token.address,
                abiZecureFund: ZecureFund.abi,
                abiERC7984: ERC7984Token.abi,
                id: campaignId,
                endTime,
                encryptedAmount: encryptedHex,
                proof: proofHex,
                setPledgeStep
            })
        } catch(err: any) {
            console.error('Minting failed:', err);
        }

  };


  const handleRevealPledge = async (campaignId: any) => {

     const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
        setRevealedStep('revealing')
        const ZecureFundContract = new ethers.Contract(ZecureFund.address, ZecureFund.abi, signer);
        const ZecureFundTx =  await ZecureFundContract.decryptPledged(campaignId);
        await ZecureFundTx.wait();
        const contract = new ethers.Contract(ZecureFund.address, ZecureFund.abi, provider);
        const revealedPledgeTx = await contract.campaigns(id);
        setRevealedPledge(ethers.formatUnits(String(revealedPledgeTx[3].toString()), 6))
        setRevealedStep('success')
        console.log({revealedPledge: revealedPledgeTx[3].toString()})
    } catch (err) {
        console.error('Error in revealing pledge:', err);
        throw err;
    }

  };

    
const handleClaim = async (campaignId: any) => {

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
        setClaimStep('claiming')
        const ZecureFundContract = new ethers.Contract(ZecureFund.address, ZecureFund.abi, signer);
        const ZecureFundTx =  await ZecureFundContract.claim(campaignId);
        await ZecureFundTx.wait();

        setClaimStep('success')
        console.log()
    } catch (err) {
        console.error('Error in revealing pledge:', err);
        throw err;
    }

  };



// use id and read from ethers/wagmi and dsiplay result
  const fetchCampaign = async() => {
     const provider = new ethers.BrowserProvider(window.ethereum);
     const contract = new ethers.Contract(ZecureFund.address, ZecureFund.abi, provider);
     const campaign = await contract.campaigns(id);
     setCampaign({
       creator: campaign[0],
       goal: campaign[1],
       pledged: campaign[2],
       revealedPledged: campaign[3],
       startAt: campaign[4],
       endAt: campaign[5],
       claimed: campaign[6]
     })

  }
  useEffect(() => {
    fetchCampaign()
  }, [])

  return (
    <div key={id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Campaign #{id}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-semibold">Goal:</span> {ethers.formatUnits(String(campaign.goal || "0"), 6)} ZMF</p>
                      <p><span className="font-semibold">Start:</span> {formatDateTime(campaign.startAt)}</p>
                      <p><span className="font-semibold">End:</span> {formatDateTime(campaign.endAt)}</p>
                      <p className="font-bold text-black text-xl">Pledged: <span className="text-[20px]">{revealedPledge}</span> ZMF</p>

                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Enter pledge amount"
                      value={pledgeAmount || ''}
                      onChange={(e) => setPledgeAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    
                    <button
                      onClick={() => handlePledge(id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      
                        {pledgeStep === 'initializing' && ' Initializing FHE...'}
                        {pledgeStep === 'ready' && ' FHE is ready'}
                        {pledgeStep === 'pledging' && 'Pledging...'}
                        {pledgeStep === 'success' && 'Pledging Successful ✅'}
                        {pledgeStep === 'idle' && ' Pledge'}
                    </button>
                    
                    <button
                      onClick={() => handleRevealPledge(id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      
                        {revealedStep === 'revealing' && 'Revealing...'}
                        {revealedStep === 'success' && 'Revealing Successful ✅'}
                        {revealedStep === 'idle' && ' Reveal Pledge'}
                    </button>

                    <button
                      onClick={() => handleClaim(id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >

                        {claimStep === 'claiming' && 'Claiming...'}
                        {claimStep === 'success' && 'Claiming Successful ✅'}
                        {claimStep === 'idle' && ' Claim Funds (Only campaign creator can claim)'}
                    </button>
                  </div>
                </div>
  );
};

export default Campaign; 