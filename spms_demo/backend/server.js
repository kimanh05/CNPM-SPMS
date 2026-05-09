const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

let slots = [
  { id: "A-01", area: "Khu A", vehicle: "Xe máy", mac: "00:1A:C2:7B:11:01", status: "Khả dụng" },
  { id: "A-02", area: "Khu A", vehicle: "Xe máy", mac: "00:1A:C2:7B:11:02", status: "Đang sử dụng" },
  { id: "B-04", area: "Khu B", vehicle: "Ô tô", mac: "00:1A:C2:7B:22:04", status: "Bảo trì" },
  { id: "B-06", area: "Khu B", vehicle: "Ô tô", mac: "00:1A:C2:7B:22:06", status: "Khả dụng" },
  { id: "C-03", area: "Khu C", vehicle: "Xe máy", mac: "00:1A:C2:7B:31:03", status: "Khả dụng" },
  { id: "C-08", area: "Khu C", vehicle: "Xe máy", mac: "00:1A:C2:7B:31:08", status: "Đang sử dụng" },
  { id: "D-01", area: "Khu D", vehicle: "Ô tô", mac: "00:1A:C2:7B:41:01", status: "Bảo trì" },
  { id: "D-05", area: "Khu D", vehicle: "Ô tô", mac: "00:1A:C2:7B:41:05", status: "Khả dụng" }
];

const feePolicies = [
  { target: "Sinh viên", vehicle: "Xe máy", type: "Theo chu kỳ", price: "3.000đ/lượt", payment: "BKPay", status: "Đang áp dụng" },
  { target: "Sinh viên", vehicle: "Ô tô", type: "Theo chu kỳ", price: "10.000đ/lượt", payment: "BKPay", status: "Đang áp dụng" },
  { target: "Giảng viên", vehicle: "Xe máy", type: "Chính sách riêng", price: "Miễn phí", payment: "Tự động", status: "Đang áp dụng" },
  { target: "Cán bộ - NV", vehicle: "Ô tô", type: "Chính sách riêng", price: "Giảm 50%", payment: "Tự động trừ", status: "Đang áp dụng" },
  { target: "Khách vãng lai", vehicle: "Xe máy", type: "Theo phiên", price: "5.000đ/lượt", payment: "Tiền mặt / QR", status: "Đang áp dụng" },
  { target: "Khách vãng lai", vehicle: "Ô tô", type: "Theo phiên", price: "20.000đ/lượt", payment: "Tiền mặt / QR", status: "Đang áp dụng" }
];

const activities = [
  { time: "10:20", slot: "A-01", vehicle: "Xe máy", status: "Vào bãi" },
  { time: "10:35", slot: "B-04", vehicle: "Ô tô", status: "Rời bãi" },
  { time: "10:50", slot: "C-02", vehicle: "Xe máy", status: "Đang gửi" },
  { time: "11:05", slot: "D-03", vehicle: "Ô tô", status: "Vào bãi" }
];

const reportRows = [
  { area: "Khu A", rides: 420, revenue: "9.8M", bkpay: 210, occupancy: "88%", free: 18 },
  { area: "Khu B", rides: 355, revenue: "8.1M", bkpay: 185, occupancy: "74%", free: 41 },
  { area: "Khu C", rides: 290, revenue: "6.4M", bkpay: 146, occupancy: "61%", free: 62 },
  { area: "Khu D", rides: 183, revenue: "4.2M", bkpay: 101, occupancy: "39%", free: 97 },
  { area: "Toàn hệ thống", rides: "1.248", revenue: "28.5M", bkpay: 642, occupancy: "72%", free: 118 }
];

function slotStats() {
  return {
    total: 420,
    available: 138,
    occupied: 270,
    maintenance: 12,
    revenueToday: "4.2M"
  };
}

app.get("/api/dashboard", (req, res) => {
  res.json({
    stats: slotStats(),
    areaUsage: [
      { area: "Khu A", percent: 82 },
      { area: "Khu B", percent: 64 },
      { area: "Khu C", percent: 47 },
      { area: "Khu D", percent: 71 }
    ],
    ratio: { used: 67, free: 33 },
    activities
  });
});

app.get("/api/slots", (req, res) => res.json(slots));

app.post("/api/slots", (req, res) => {
  const slot = req.body;
  if (!slot.id || !slot.area || !slot.vehicle || !slot.mac) {
    return res.status(400).json({ message: "Thiếu thông tin chỗ đỗ" });
  }
  const exists = slots.some(s => s.id === slot.id);
  if (exists) return res.status(409).json({ message: "Mã chỗ đỗ đã tồn tại" });
  slots.push(slot);
  res.status(201).json(slot);
});

app.put("/api/slots/:id", (req, res) => {
  const index = slots.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Không tìm thấy chỗ đỗ" });
  slots[index] = { ...slots[index], ...req.body };
  res.json(slots[index]);
});

app.delete("/api/slots/:id", (req, res) => {
  slots = slots.filter(s => s.id !== req.params.id);
  res.json({ message: "Đã xóa chỗ đỗ" });
});

app.get("/api/fees", (req, res) => res.json(feePolicies));

app.get("/api/reports", (req, res) => {
  res.json({
    summary: {
      rides: "1.248",
      revenue: "28.5M",
      bkpay: 642,
      freeSlots: 118
    },
    ratio: { used: 72, free: 28 },
    rows: reportRows
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`SPMS demo is running at http://localhost:${PORT}`);
});
