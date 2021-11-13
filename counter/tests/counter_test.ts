import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

// the boilerplate test example
// Clarinet.test({
//     name: "Ensure that <...>",
//     async fn(chain: Chain, accounts: Map<string, Account>) {
//         let block = chain.mineBlock([
//             /* 
//              * Add transactions with: 
//              * Tx.contractCall(...)
//             */
//         ]);
//         assertEquals(block.receipts.length, 0);
//         assertEquals(block.height, 2);

//         block = chain.mineBlock([
//             /* 
//              * Add transactions with: 
//              * Tx.contractCall(...)
//             */
//         ]);
//         assertEquals(block.receipts.length, 0);
//         assertEquals(block.height, 3);
//     },
// });

Clarinet.test({
    name: "get-count returns u0 for principals that never called count-up before",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        // Get the contract deployer account
        let deployer = accounts.get('deployer')!;

        // Call the get-count read-only function.
        // Parameters:
        // 1: contract name
        // 2: function name
        // 3: function arguments as an array
        let count = chain.callReadOnlyFn('counter', 'get-count', [types.principal(deployer.address)], deployer.address)

        // Assert that count returned is u0.
        count.result.expectUint(0);
    },
});

Clarinet.test({
    name: "count-up increments the counter for the tx-sender",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        // Get the deployer account
        let deployer = accounts.get('deployer')!;

        // Mine a block with 1 transaction
        let block = chain.mineBlock([
            // Generate a contract call to the count-up from the deployer address
            Tx.contractCall('counter', 'count-up', [], deployer.address)
        ]);

        // Get the first and only transaction receipt.
        let [receipt] = block.receipts;

        // Assert that the returned result is boolean true.
        receipt.result.expectOk().expectBool(true);

        // Get the counter value
        let count = chain.callReadOnlyFn('counter', 'get-count', [types.principal(deployer.address)], deployer.address);

        // Assert that the return result is u1
        count.result.expectUint(1);
    }
});

Clarinet.test({
    name: "counters are specfic to the tx-sender",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        // Get some accounts
        let deployer = accounts.get('deployer')!;
        let wallet1 = accounts.get('wallet_1')!;
        let wallet2 = accounts.get('wallet_2')!;

        // Mine a few contract calls to count-up
        let block = chain.mineBlock([
            // deployer: call count-up 0 times

            // wallet_1: call count-up 1 times
            Tx.contractCall('counter', 'count-up', [], wallet1.address),

            // wallet_2 call count-up 2 times
            Tx.contractCall('counter', 'count-up', [], wallet2.address),
            Tx.contractCall('counter', 'count-up', [], wallet2.address)
        ]);

        // Get and assert the counter valur for deployer: u0
        let deployerCount = chain.callReadOnlyFn('counter', 'get-count', [types.principal(deployer.address)], deployer.address);
        deployerCount.result.expectUint(0);

        // Get and assert the counter value for wallet1: u1
        let wallet1Count = chain.callReadOnlyFn('counter', 'get-count', [types.principal(wallet1.address)], wallet1.address);
        wallet1Count.result.expectUint(1);

        // Get and assert the counter value for wallet2: u2
        let wallet2Count = chain.callReadOnlyFn('counter', 'get-count', [types.principal(wallet2.address)], wallet2.address);
    }
});
