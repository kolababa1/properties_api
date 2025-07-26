import Shipment from "../models/Shipment.js";
import Customer from "../models/Customer.js";

// Create A Shipment
const createShipment = async (req, res) => {
  try {
    // Validating input
    const { sender, receiver, items, totalWeight, rate } = req.body;
    if (!sender)
      return res.status(400).json({ message: "Please provide Sender details" });
    if (!receiver)
      return res
        .status(400)
        .json({ message: "Please provide Receiver details" });
    if (!items || !items.length)
      return res.status(400).json({ message: "Please provide Items details" });
    if (!totalWeight)
      return res.status(400).json({ message: "Please provide Total Weight" });
    if (!rate) return res.status(400).json({ message: "Please provide Rate" });

    // Find or create customers
    const senderDoc = await findOrCreateCustomer(sender);
    const receiverDoc = await findOrCreateCustomer(receiver);

    // Calculate total item weight
    const itemsWithNumbers = items.map((i) => ({
      itemName: i.itemName,
      weight: Number(i.weight),
      quantity: Number(i.quantity),
    }));
    const totalItemWeight = itemsWithNumbers.reduce(
      (sum, i) => sum + i.weight,
      0
    );

    if (totalItemWeight > totalWeight)
      return res.status(401).json({
        message: `Total weight (${totalWeight}) must be greater than sum of all the items weight (${totalItemWeight})`,
      });
    const packaging = Number(totalWeight - totalItemWeight).toFixed(2) || 0;
    const totalAmount = (rate * totalWeight).toFixed(2);
    const shipment = new Shipment({
      sender: senderDoc._id,
      receiver: receiverDoc._id,
      items: itemsWithNumbers,
      packagingWeight: packaging,
      totalWeight,
      rate,
      totalAmount,
      username: req.user.username,
    });

    await shipment.save();
    res
      .status(201)
      .json({ message: "Shipment record saved successfully", data: shipment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Soft Delete Multiple Shipments
const softDeleteMultipleShipments = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide an array of Ids to soft delete.",
      });
    }
    const result = await Shipment.updateMany(
      {
        _id: { $in: ids },
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: req.user.username,
        },
      }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No active shipments found with the provided Ids.",
      });
    }

    res.status(200).json({
      status: "success",
      messsage: `${result.modifiedCount} shipment(s) soft-deleted successfully.`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error soft-deleted multiple shipments:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while soft-deleting shipments",
      error: error.message,
    });
  }
};

// Get All Shipments
const getAllShipments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [shipments, total] = await Promise.all([
      Shipment.find().skip(skip).limit(limit).sort({ name: 1 }),
      Shipment.countDocuments(),
    ]);
    res.json({
      data: shipments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error occurred while fecthing shipments` });
  }
};

// Soft Delete A Shipment
const softDeleteShipmentsById = async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          dele: new Date(),
          deletedBy: req.user.username,
        },
      },
      { new: true }
    );
    if (!shipment) {
      return res
        .status(404)
        .json({ message: "Shipment not found or already deleted." });
    }
    res.status(200).json({
      status: "success",
      message: `Shipment soft-deleted successfully.`,
      data: shipment,
    });
  } catch (error) {
    console.error();
    res.status(500).json({
      status: "error",
      message: "An error occurred while soft-deleting shipment.",
      error: error.message,
    });
  }
};

// Get unndeleted Shipments
const getShipments = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10, customer } = req.query;
    const skip = (page - 1) * limit;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Build base query
    const query = { isDeleted: false };
    if (startDate || endDate) query.createdAt = dateFilter;

    // If a 'customer' search term is provided, find matching customers and add their IDs to the query
    if (customer) {
      const customers = await Customer.find({
        $or: [
          { name: new RegExp(customer, "i") },
          { phone: new RegExp(customer, "i") },
        ],
      }).select("_id");
      const customerIds = customers.map((c) => c._id);
      query.$or = [
        { sender: { $in: customerIds } },
        { receiver: { $in: customerIds } },
      ];
    }

    const [shipments, total] = await Promise.all([
      Shipment.find(query)
        .populate("sender")
        .populate("receiver")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Shipment.countDocuments(query),
    ]);

    res.json({
      data: shipments,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      data: err,
      message: "Server error",
    });
  }
};

// Get A Shipment
const getAShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate("sender")
      .populate("receiver");
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });
    res.json(shipment);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const updateShipments = async (req, res) => {
  try {
    const { ids, updates } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "No shipment IDs provided for bulk update." });
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No update fields provided." });
    }

    // Use updateMany for efficient bulk update
    const result = await Shipment.updateMany(
      { _id: { $in: ids } },
      { $set: updates, updatedBy: req.user.username }
    );

    res.status(200).json({
      message: `Successfully updated ${result.modifiedCount} shipments.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("ERROR in PUT /api/shipments:", error);
    res.status(500).json({
      message: "Server error during bulk update",
      details: error.message,
    });
  }
};

// Helper to create/get customer by phone or create new
async function findOrCreateCustomer(data) {
  if (!data.phone) throw new Error("Please provide customer's phone number");
  if (!data.name) throw new Error("Please provide customer's name");

  let customer = await Customer.findOne({ phone: data.phone });
  if (!customer) {
    customer = new Customer(data);
    await customer.save();
  } else {
    // Optional: update name/address if changed
    if (data.name !== customer.name || data.address !== customer.address) {
      customer.name = data.name;
      customer.address = data.address;
      await customer.save();
    }
  }
  return customer;
}

export {
  createShipment,
  getShipments,
  getAllShipments,
  getAShipment,
  softDeleteShipmentsById,
  softDeleteMultipleShipments,
  updateShipments,
};
