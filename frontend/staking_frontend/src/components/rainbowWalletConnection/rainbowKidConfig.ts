import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config: ReturnType<typeof getDefaultConfig> = getDefaultConfig({
  appName: "Wallet Integration",
  projectId: import.meta.env.VITE_walletConnectAppId,
  chains: [sepolia],
});
