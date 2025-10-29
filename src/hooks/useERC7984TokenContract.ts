import { useMemo } from "react";
import { getERC7984TokenContract } from "../utils/getERC7984TokenContract";
import { useWalletClient } from "wagmi";

export function useERC7984TokenContract(signerOrProvider?: any) {
  const { data: walletClient } = useWalletClient();
  const effectiveSigner = signerOrProvider || walletClient;
  return useMemo(() => getERC7984TokenContract(effectiveSigner), [effectiveSigner]);
} 