import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { CUSTODY_PDA, get_custody_account } from '../src/jupiter';
import expect from 'expect';

describe('Jupiter Perpetuals Tests', () => {
    let connection: Connection;
    let sol_custody_account : any = null;
    let eth_custody_account : any = null;
    let btc_custody_account : any = null;

    before(() => {
        // Initialize the connection before tests
        connection = new Connection('https://api.mainnet-beta.solana.com');
    });

    it('should fetch sol, eth, and btc custody accounts successfully', async () => {
        try {
            sol_custody_account = await get_custody_account(connection, CUSTODY_PDA.SOL)
            expect(sol_custody_account).not.toBeNull();

            eth_custody_account = await get_custody_account(connection, CUSTODY_PDA.ETH)
            expect(eth_custody_account).not.toBeNull();

            btc_custody_account = await get_custody_account(connection, CUSTODY_PDA.BTC)
            expect(btc_custody_account).not.toBeNull();
        } catch (error) {
            console.error('Error fetching custody accounts:', error);
            throw error; // Re-throw to fail the test
        }
    });

    it('utilization rate should between 5% and 60%', async () => {
        const sol_rate = utilRate(
            sol_custody_account.assets.owned, 
            sol_custody_account.assets.locked
        );
        console.log(`sol util: ${sol_rate}`);
        expect(sol_rate).toBeGreaterThan(5);
        expect(sol_rate).toBeLessThan(60);

        const eth_rate = utilRate(
            eth_custody_account.assets.owned, 
            eth_custody_account.assets.locked
        );
        console.log(`eth util: ${eth_rate}`);
        expect(eth_rate).toBeGreaterThan(5);
        expect(eth_rate).toBeLessThan(60);

        const btc_rate = utilRate(
            btc_custody_account.assets.owned, 
            btc_custody_account.assets.locked
        );
        console.log(`btc util: ${btc_rate}`);
        expect(btc_rate).toBeGreaterThan(5);
        expect(btc_rate).toBeLessThan(60);
    });

});

function utilRate(owned_tokens: BN, locked_tokens: BN) : number {
    return (locked_tokens.toNumber() / owned_tokens.toNumber()) * 100;
}