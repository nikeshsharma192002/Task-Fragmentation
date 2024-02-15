import { useState, useEffect } from 'react';
import { ChainScanner } from './chainScanner'; // Replace with your chain scanner library

export function useBurnTransactions(chainId, tokenAddress) {
  const [burnTransactions, setBurnTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const results = await ChainScanner.fetchAllTxPromises(isChainTestnet(chainId));
        const filteredTransactions = ChainScanner.sortOnlyBurnTransactions(
          results.flat().map((tx) => ({ ...tx, chain: chainObjects[results.indexOf(tx)] }))
        );
        setBurnTransactions(filteredTransactions.sort((a, b) => b.timeStamp - a.timeStamp));
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (chainId && tokenAddress) {
      fetchTransactions();
    }
  }, [chainId, tokenAddress]);

  return { burnTransactions, isLoading, error };
}
