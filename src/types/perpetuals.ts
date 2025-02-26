import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export type PricingParams = {
    tradeImpactFeeScalar: number;
    maxLeverage: number;
    maxGlobalLongSizes: BN;
    maxGlobalShortSizes: BN;
};

export type Assets = {
    feesReserves: BN;
    owned: BN;
    locked: BN;
    guaranteedUsd: BN;
    globalShortSizes: BN;
    globalShortAveragePrices: BN;
};

export type FundingRateState = {
    cumulativeInterestRate: BN;
    lastUpdate: BN;
    hourlyFundingDbps: number;
};

export interface CustodyAccount {
    pool: PublicKey;
    mint: PublicKey;
    tokenAccount: PublicKey;
    decimals: number;
    isStable: boolean;
    oracle: PublicKey;
    pricing: PricingParams;
    permissions: BN;
    targetRatioBps: BN;
    assets: Assets;
    fundingRateState: FundingRateState;
} 