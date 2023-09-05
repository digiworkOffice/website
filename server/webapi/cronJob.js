const cron = require("node-cron");
const Contract = require("./models/contract");
const Wallet = require("./models/wallet");
const Transaction = require("./models/transaction");

async function checkAndCommitTransactionAmount(contract, currentTime) {
  const durationPassed = (currentTime - contract.start_from) / 1000;
  const expectedPaidUpAmount =
    durationPassed * contract.transaction_amount_per_transfer +
    contract.collateral;

  if (contract.paid_up_amount < expectedPaidUpAmount) {
    // calculate the amount to be transferred to level the amount
    const amountToTransfer = expectedPaidUpAmount - contract.paid_up_amount;

    const transaction = new Transaction({
      contract: contract._id,
      amount: amountToTransfer,
      type: "internal",
      internal_transaction: {
        contract_id: contract._id,
      },
    });

    const newTransaction = await transaction.save();
    const employerWallet = await Wallet.findById(contract.employer_wallet);
    const employeeWallet = await Wallet.findById(contract.employee_wallet);

    employerWallet.balance -= newTransaction.amount;
    employeeWallet.balance += newTransaction.amount;

    await employerWallet.save();
    await employeeWallet.save();

    contract.paid_up_amount += newTransaction.amount;
    await contract.save();
  }
}

async function checkAndUpdateContractActivity(contract, currentTime) {
  if (
    !contract.has_ended &&
    !contract.is_active &&
    currentTime > contract.start_from
  ) {
    contract.is_active = true;
    await contract.save();
  }
}

async function createTransactionForContract(contract) {
  const transaction = new Transaction({
    contract: contract._id,
    amount: contract.transaction_amount_per_transfer,
    type: "internal",
    internal_transaction: {
      contract_id: contract._id,
    },
  });

  const newTransaction = await transaction.save();
  const employerWallet = await Wallet.findById(contract.employer_wallet);
  const employeeWallet = await Wallet.findById(contract.employee_wallet);

  employerWallet.balance -= newTransaction.amount;
  employeeWallet.balance += newTransaction.amount;

  await employerWallet.save();
  await employeeWallet.save();

  contract.paid_up_amount += newTransaction.amount;
  await contract.save();

  return newTransaction;
}

async function checkContractExpiry(contract, currentTime) {
  const contractEndTime = new Date(
    contract.start_from.getTime() + contract.duration * 1000
  );

  if (contractEndTime <= currentTime) {
    contract.is_active = false;
    contract.has_ended = true;
    await contract.save();
  }
}
cron.schedule(
  "*/1 * * * *",
  async () => {
    // Run cron job every minute for testing
    try {
      console.log("Running a job every minute for testing");

      const now = new Date();

      const contracts = await Contract.find({});
      for (let contract of contracts) {
        await checkAndUpdateContractActivity(contract, now);
      }

      const activeContracts = await Contract.find({
        start_from: { $lte: now },
        is_active: true,
        has_ended: false,
        status: "active",
      });
      // console.log("activeContracts", activeContracts); // Log the active contracts

      for (let contract of activeContracts) {
        console.log(`Creating transaction for contract: ${contract._id}`); // Log the contract id for which transaction is being created
        await createTransactionForContract(contract);

        await checkContractExpiry(contract, now);
      }
    } catch (error) {
      console.error("Error running cron job: ", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kathmandu",
  }
);
