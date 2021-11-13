
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

// Unit Tests:
// - allows contract owner to lock an amount
// - does not allow anyone else to lock an amount
// - cannot be locked more than once
// - cannot set the unlock height to a value less than the current block height
// - allow the beneficiary to bestow the right to claim to someone else
// - does not allow anyone else to bestow the right to claim to someone else. (Not even the contract owner.)
// - allows the beneficiary to claim the balance when the block height is reached
// - does not allow the beneficiary to claim the balance before the block-height is reached
// - only beneficiary can claim when block height is reached

Clarinet.test({
    name: "allows contract owner to lock an amount",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const beneficiary = accounts.get('wallet_1')!;
        const targetBlockHeight = 10;
        const amount = 10;
        chain.mineBlock([
            Tx.contractCall('timelocked-wallet', 'lock', [types.principal(beneficiary.address), types.uint(targetBlockHeight), types.uint(amount)], deployer.address)
        ]);

        // Advance the chain until the unlock height
        chain.mineEmptyBlockUntil(targetBlockHeight);

        const block = chain.mineBlock([
            Tx.contractCall('timelocked-wallet', 'claim', [], beneficiary.address)
        ]);

        // Assert that the claim was successful and the STX were transferred.
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[0].events.expectSTXTransferEvent(amount, `${deployer.address}.timelocked-wallet`, beneficiary.address);
    }
});

Clarinet.test({
    name: "does not allow anyone else to lock an amount",
    async fn(chain: Chain, accounts: Map<string, Account>) {

    }
});

Clarinet.test({
    name: "cannot be locked more than once",
    async fn(chain: Chain, accounts: Map<string, Account>) {

    }
});

Clarinet.test({
    name: "cannot set the unlock height to a value less than the current block height",
    async fn(chain: Chain, accounts: Map<string, Account>) {

    }
});

Clarinet.test({
    name: "allow the beneficiary to bestow the right to claim to someone else",
    async fn(chain: Chain, accounts: Map<string, Account>) {

    }
});

Clarinet.test({
    name: "does not allow anyone else to bestow the right to claim to someone else. (Not even the contract owner.)",
    async fn(chain: Chain, accounts: Map<string, Account>) {

    }
});


Clarinet.test({
    name: "allows the beneficiary to claim the balance when the block height is reached",
    async fn(chain: Chain, accounts: Map<string, Account>) {

    }
});

Clarinet.test({
    name: "does not allow the beneficiary to claim the balance before the block-height is reached",
    async fn(chain: Chain, accounts: Map<string, Account>) {

    }
});

Clarinet.test({
    name: "only beneficiary can claim when block height is reached",
    async fn(chain: Chain, accounts: Map<string, Account>) {

    }
});

