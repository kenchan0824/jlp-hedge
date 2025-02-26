import { Program, AnchorProvider, Idl, BN } from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { CustodyAccount } from "./types/perpetuals";
import perpetualsIdl from "./idl/perpetuals.json";

// Program ID from the documentation
const PERPETUALS_PROGRAM_ID = new PublicKey("PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu");

// Example custody account (SOL custody)
const SOL_CUSTODY_ADDRESS = new PublicKey("7xS2gz2bTp3fwCC7knJvUWTEU9Tycczu6VhJYKgi1wdz");

async function main() {
    // Connect to Solana mainnet
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    
    // Create a dummy wallet since we're only reading data
    const dummyWallet = {
        publicKey: Keypair.generate().publicKey,
        signTransaction: async () => { throw new Error("Not implemented"); },
        signAllTransactions: async () => { throw new Error("Not implemented"); }
    };

    // Create provider
    const provider = new AnchorProvider(connection, dummyWallet, {
        commitment: "confirmed",
        skipPreflight: true
    });

    try {
        // Create program instance with local IDL
        const program = new Program(perpetualsIdl as Idl, PERPETUALS_PROGRAM_ID, provider);

        // Fetch the custody account
        const rawAccount = await program.account.custody.fetch(SOL_CUSTODY_ADDRESS);
        const custodyAccount = rawAccount as unknown as CustodyAccount;

        console.log("Custody Account Data:");
        console.log("--------------------");
        console.log(`Pool: ${custodyAccount.pool.toString()}`);
        console.log(`Mint: ${custodyAccount.mint.toString()}`);
        console.log(`Token Account: ${custodyAccount.tokenAccount.toString()}`);
        console.log(`Decimals: ${custodyAccount.decimals}`);
        console.log(`Is Stable: ${custodyAccount.isStable}`);
        
        // Print pricing information
        console.log("\nPricing Information:");
        console.log(`Max Leverage: ${custodyAccount.pricing.maxLeverage}x`);
        console.log(`Max Global Long Size: ${custodyAccount.pricing.maxGlobalLongSizes.toString()} SOL`);
        console.log(`Max Global Short Size: ${custodyAccount.pricing.maxGlobalShortSizes.toString()} SOL`);
        
        // Print assets information
        console.log("\nAssets Information:");
        console.log(`Owned Tokens: ${custodyAccount.assets.owned.toString()} SOL`);
        console.log(`Locked Tokens: ${custodyAccount.assets.locked.toString()} SOL`);
        console.log(`Guaranteed USD: $${custodyAccount.assets.guaranteedUsd.toString()}`);
        console.log(`Global Short Sizes: ${custodyAccount.assets.globalShortSizes.toString()} SOL`);
        
        // Print funding rate information
        console.log("\nFunding Rate Information:");
        console.log(`Cumulative Interest Rate: ${custodyAccount.fundingRateState.cumulativeInterestRate.toString()}`);
        console.log(`Last Updated: ${custodyAccount.fundingRateState.lastUpdated?.toString() || 'N/A'}`);
        console.log(`Hourly Funding Rate (bps): ${custodyAccount.fundingRateState.hourlyFundingDbps}`);

    } catch (error) {
        console.error("Error fetching custody account:", error);
        if (error instanceof Error) {
            console.error("Error details:", error.message);
            console.error("Stack trace:", error.stack);
        }
    }
}

main().catch(console.error); 