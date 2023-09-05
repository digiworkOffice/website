const Contract = require("../models/contract");

exports.createContract = async (req, res) => {
  try {
    const { employer_wallet, employee_wallet, duration, total_amount } =
      req.body;

    const newContract = new Contract({
      employer_wallet,
      employee_wallet,
      duration,
      total_amount,
    });

    const savedContract = await newContract.save();

    res
      .status(201)
      .json({
        message: "Contract created successfully",
        contract: savedContract,
      });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findById(id);

    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
      res.status(200).json({ contract });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { employer_signed, employee_signed, is_active, has_ended } = req.body;
    const updatedContract = await Contract.findByIdAndUpdate(
      id,
      { employer_signed, employee_signed, is_active, has_ended },
      { new: true }
    );

    if (!updatedContract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    res
      .status(200)
      .json({
        message: "Contract updated successfully",
        contract: updatedContract,
      });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
