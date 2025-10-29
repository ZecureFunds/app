//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { useMintToken } from '../hooks/useMintToken';
import { useCreateCampaign } from '../hooks/useCreateCampaign';
import ERC7984TokenABI from '../abi/ERC7984Token.json';
import ZecureFundABI from '../abi/ZecureFund.json';
import { ethers } from 'ethers';

import Campaign from './Campaign';

export default function Crowdfund() {
  const [currentPage, setCurrentPage] = useState('mint');
  const [campaignForm, setCampaignForm] = useState({
    goal: '',
    startTime: '',
    endTime: ''
  });
  const [campaignLength, setCampaignLength] = useState('0');

   const [mintStep, setMintStep] = useState<'idle' | 'minting' | 'success'>("idle");
   const [createCampaignStep, setCreateCampaignStep] = useState<'idle' | 'creating' | 'success'>("idle");
   
  const { mintToken } = useMintToken();
  const { createCampaign } = useCreateCampaign();

  const handleMint = async() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
    
            try{
                await mintToken({
                contractAddress: ERC7984TokenABI.address,
                abi: ERC7984TokenABI.abi,
                amount: ethers.parseUnits("100", 6),
                signer,
                setMintStep
            })
            } catch(err: any) {
                console.error('Minting failed:', err);
            }

  };

  const handleCreateCampaign = async() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    if (campaignForm.goal && campaignForm.startTime && campaignForm.endTime) {
        // convert datetimelocal to timestamp
        const startTime = new Date(campaignForm.startTime);
        const startTimeInTimestamp = Math.floor(startTime.getTime() / 1000);

        const endTime = new Date(campaignForm.endTime);
        const endTimeInTimestamp = Math.floor(endTime.getTime() / 1000);
        try {
             await createCampaign({
                signer,
                contractAddress: ZecureFundABI.address,
                abi: ZecureFundABI.abi,
                goal: ethers.parseUnits(String(campaignForm.goal), 6),
                startTimeInTimestamp,
                endTimeInTimestamp,
                setCreateCampaignStep
            })
        } catch(err: any) {
             console.error('Minting failed:', err);
        }
    }
  };


  const fetchCampaignLength = async() => {
     const provider = new ethers.BrowserProvider(window.ethereum);
     const contract = new ethers.Contract(ZecureFundABI.address, ZecureFundABI.abi, provider);
     const campaignLength = await contract.campaignCount();
     setCampaignLength(campaignLength.toString())

  }
  useEffect(() => {
    fetchCampaignLength()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentPage('mint')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === 'mint'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Mint Token
            </button>
            <button
              onClick={() => setCurrentPage('create')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === 'create'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Create Campaign
            </button>
            <button
              onClick={() => setCurrentPage('campaigns')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === 'campaigns'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Campaigns
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 mt-8">
        {/* Mint Token Page */}
        {currentPage === 'mint' && (
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Mint Token
              </h1>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="text"
                    value="100"
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                  />
                </div>
                
                <button
                  onClick={handleMint}
                  disabled={mintStep === 'minting'}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md disabled:transform-none disabled:cursor-not-allowed"
                >
                  {mintStep === 'minting' && 'Minting Token...'}
                  {mintStep === 'success' && 'Minting Token Successful ✅'}
                  {mintStep === 'idle' && 'Mint Token'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Campaign Page */}
        {currentPage === 'create' && (
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
              <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Create Campaign
              </h1>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Amount (ZMF TOKENS)
                  </label>
                  <input
                    type="number"
                    value={campaignForm.goal}
                    onChange={(e) => setCampaignForm({...campaignForm, goal: e.target.value})}
                    placeholder="Enter goal amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={campaignForm.startTime}
                    onChange={(e) => setCampaignForm({...campaignForm, startTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={campaignForm.endTime}
                    onChange={(e) => setCampaignForm({...campaignForm, endTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={handleCreateCampaign}
                  disabled={createCampaignStep === 'creating'}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md"
                >
                    {createCampaignStep === 'creating' && 'Creating Campaign...'}
                    {createCampaignStep === 'success' && 'Creating Campaign Successful ✅'}
                    {createCampaignStep === 'idle' && ' Create Campaign'}
                 
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Campaigns Page */}
        {currentPage === 'campaigns' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              All Campaigns
            </h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: campaignLength }, (_, i) => i + 1).map((id, index) => (
               <Campaign key={index} id={id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}