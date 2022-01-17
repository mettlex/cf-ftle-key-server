import { getCurrentTimestampFromSolana } from "./solana";
import { getCurrentTimestampFromEthereum } from "./ethereum";

export const getCurrentTimestamp = async (): Promise<number | null> => {
  let timestamp: number | null = null;

  try {
    timestamp = await getCurrentTimestampFromSolana({
      url: "https://api.mainnet-beta.solana.com",
    });
  } catch (error) {
    console.error(error);

    try {
      timestamp = await getCurrentTimestampFromSolana({
        url: "https://solana-api.projectserum.com",
      });
    } catch (error) {
      console.error(error);
    }
  }

  if (!timestamp) {
    try {
      timestamp = await getCurrentTimestampFromEthereum({
        url: "https://cloudflare-eth.com",
      });
      // source = "ethereum";
    } catch (error) {
      console.error(error);
    }
  }

  if (!timestamp) {
    try {
      timestamp = await getCurrentTimestampFromEthereum({
        url: "https://polygon-rpc.com",
      });
      // source = "polygon";
    } catch (error) {
      console.error(error);
    }
  }

  if (!timestamp) {
    try {
      timestamp = await getCurrentTimestampFromEthereum({
        url: "https://bsc-dataseed.binance.org",
      });
      // source = "bsc";
    } catch (error) {
      console.error(error);
    }
  }

  if (!timestamp) {
    try {
      timestamp = await getCurrentTimestampFromEthereum({
        url: "https://rpc.xdaichain.com",
      });
      // source = "xdai";
    } catch (error) {
      console.error(error);
    }
  }

  if (!timestamp) {
    try {
      timestamp = await getCurrentTimestampFromEthereum({
        url: "https://api.avax.network/ext/bc/C/rpc",
      });
      // source = "avalanche";
    } catch (error) {
      console.error(error);
    }
  }

  if (!timestamp) {
    try {
      timestamp = await getCurrentTimestampFromEthereum({
        url: "https://rpc.ftm.tools",
      });
      // source = "fantom";
    } catch (error) {
      console.error(error);
    }
  }

  if (!timestamp) {
    try {
      timestamp = await getCurrentTimestampFromEthereum({
        url: "https://rpc-mainnet.kcc.network",
      });
      // source = "kucoin";
    } catch (error) {
      console.error(error);
    }
  }

  return timestamp;
};
