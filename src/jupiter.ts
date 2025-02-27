import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Perpetuals } from "./types/perpetuals";
import idl from "./idl/perpetuals.json";

// Program ID from the documentation
const PERPETUALS_PROGRAM_ID = new PublicKey("PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu");

// Reference to custody assets from jupiter-perpetuals-accounts.md
export const CUSTODY_PDA = {
    SOL: new PublicKey("7xS2gz2bTp3fwCC7knJvUWTEU9Tycczu6VhJYKgi1wdz"),
    ETH: new PublicKey("AQCGyheWPLeo6Qp9WpYS9m3Qj479t7R636N9ey1rEjEn"),
    BTC: new PublicKey("5Pv3gM9JrFFH883SWAhvJC9RPYmo8UNxuFtv5bMMALkm"),
};

export async function get_custody_account(connection: Connection, custody_pda: PublicKey) {
    
    const program = new Program<Perpetuals>(
        idl as Perpetuals, 
        PERPETUALS_PROGRAM_ID, 
        new AnchorProvider(
            connection, 
            new Wallet(Keypair.generate()),
            AnchorProvider.defaultOptions(),
        ),
    );

    return await program.account.custody.fetch(custody_pda);
}