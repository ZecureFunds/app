import { useMemo } from "react";
import { getZamaFundsContract } from "../utils/getZamaFundsContract";
import { useWalletClient } from "wagmi";

export function useZecureFundContract(signerOrProvider?: any) {
  const { data: walletClient } = useWalletClient();
  const effectiveSigner = signerOrProvider || walletClient;
  return useMemo(() => getZamaFundsContract(effectiveSigner), [effectiveSigner]);
} 