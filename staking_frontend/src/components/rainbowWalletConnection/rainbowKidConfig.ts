import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { http } from "viem";

export const config: ReturnType<typeof getDefaultConfig> = getDefaultConfig({
  appName: "Wallet Integration",
  projectId: import.meta.env.VITE_walletConnectAppId,
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_Alchemy_Url),
  },
  chains: [sepolia],
});
