import Shipment from "../models/Shipment.js";
import Customer from "../models/Customer.js";

const createShipment = async (req, res) => {
  try {
    // Validating input
    const { sender, receiver, items, totalWeight } = req.body;
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

    const shipment = new Shipment({
      sender: senderDoc._id,
      receiver: receiverDoc._id,
      items: itemsWithNumbers,
      packagingWeight: packaging,
      totalWeight,
      username: "anonymous",
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

const getAllShipments = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10, customer } = req.query;
    const skip = (page - 1) * limit;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Build base query
    const query = {};
    if (startDate || endDate) query.createdAt = dateFilter;

    // If customer filter provided, find matching customers by name or phone
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
    res.status(500).json({ message: "Server error" });
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
export { createShipment, getAllShipments };
