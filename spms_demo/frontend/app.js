const app = document.getElementById("app");
const API = "";

let currentPage = "login";
let editingSlotId = null;

function api(path, options = {}) {
  return fetch(API + path, {
    headers: { "Content-Type": "application/json" },
    ...options
  }).then(async res => {
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Lỗi hệ thống" }));
      throw new Error(error.message);
    }
    return res.json();
  });
}

function brandBar() {
  return `
    <div class="brand-bar">
      <div class="brand-logo"></div>
      <div>
        <div class="brand-main">IoT - SPMS</div>
        <div class="brand-sub">Smart Parking System</div>
      </div>
    </div>
  `;
}

function sidebar(active) {
  const items = [
    ["dashboard", "Tổng quan hệ thống"],
    ["slots", "Quản lí chỗ đỗ xe"],
    ["fees", "Thiết lập phí"],
    ["reports", "Báo cáo tổng quan"],
    ["logout", "Đăng xuất"]
  ];
  return `
    <aside class="sidebar">
      ${brandBar()}
      <div class="menu">
        ${items.map(([id, label]) => `
          <button class="menu-btn ${active === id ? "active" : ""}" onclick="navigate('${id}')">${label}</button>
        `).join("")}
      </div>
    </aside>
  `;
}

function topbar() {
  return `
    <div class="topbar">
      <div class="avatar"></div>
      <div class="admin-text">Admin | HCMUT SPMS</div>
    </div>
  `;
}

function pageShell(title, active, content) {
  app.innerHTML = `
    <div class="frame">
      <div class="layout">
        ${sidebar(active)}
        <section class="content">
          ${topbar()}
          <div class="main-area">${content}</div>
        </section>
      </div>
    </div>
  `;
}

function navigate(page) {
  currentPage = page;
  if (page === "login") return renderLogin();
  if (page === "dashboard") return renderDashboard();
  if (page === "slots") return renderSlots();
  if (page === "fees") return renderFees();
  if (page === "reports") return renderReports();
  if (page === "logout") return renderLogout();
}

function renderLogin() {
  app.innerHTML = `
    <div class="frame">
      <div class="login-shell">
        <div class="login-topbar">
          <div class="brand-logo"></div>
          <div>
            <div class="brand-main">IoT - SPMS</div>
            <div class="brand-sub">Smart Parking System</div>
          </div>
        </div>
        <div class="login-content">
          <div>
            <div class="login-card">
              <div class="logo-box">BK</div>
              <h2 class="login-title">IoT - SPMS</h2>
              <div class="login-sub">Smart Parking System</div>
              <div class="login-note">Chỉ dành cho cán bộ quản lý hệ thống</div>
              <button class="login-button" onclick="navigate('dashboard')">Đăng nhập qua HCMUT_SSO</button>
              <div class="login-footer">Sử dụng tài khoản HCMUT để truy cập hệ thống quản trị.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function renderDashboard() {
  const data = await api("/api/dashboard");
  const s = data.stats;
  pageShell("Admin - Tổng quan hệ thống", "dashboard", `
    <h2 class="section-title">Tổng quan hệ thống</h2>
    <div class="section-subtitle">Cập nhật lúc: 10:45 - 18/04/2026</div>

    <div class="summary-row">
      ${card("Tổng số chỗ đỗ", s.total, "Toàn bộ khu vực trong hệ thống")}
      ${card("Chỗ còn trống", s.available, "Sẵn sàng cho xe vào bãi")}
      ${card("Chỗ đang sử dụng", s.occupied, "Đã có phương tiện đang gửi")}
      ${card("Doanh thu hôm nay", s.revenueToday, "Tính đến thời điểm hiện tại")}
    </div>

    <div class="chart-row">
      <div class="panel chart-panel">
        <div class="panel-title">Tình hình bãi xe theo khu vực</div>
        ${data.areaUsage.map(x => bar(x.area, x.percent, `${x.percent}%`)).join("")}
      </div>
      <div class="panel chart-panel">
        <div class="panel-title">Tỷ lệ chỗ đỗ</div>
        ${donut(data.ratio.used, [`Đang sử dụng: ${data.ratio.used}%`, `Còn trống: ${data.ratio.free}%`])}
      </div>
    </div>

    <div class="panel" style="height:260px;display:flex;flex-direction:column;">
      <div class="panel-title">Hoạt động gần đây</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Thời gian</th><th>Vị trí</th><th>Loại xe</th><th>Trạng thái</th></tr></thead>
          <tbody>
            ${data.activities.map(a => `
              <tr>
                <td>${a.time}</td><td>${a.slot}</td><td>${a.vehicle}</td>
                <td><span class="status ${a.status === "Rời bãi" ? "out" : a.status === "Đang gửi" ? "occupied" : "in"}">${a.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `);
}

function card(label, value, note) {
  return `
    <div class="summary-card">
      <div class="summary-label">${label}</div>
      <div class="summary-value">${value}</div>
      <div class="summary-note">${note}</div>
    </div>
  `;
}

function bar(label, width, value) {
  return `
    <div class="bar-group">
      <div class="bar-label">${label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${width}%;"></div></div>
      <div class="bar-value">${value}</div>
    </div>
  `;
}

function donut(used, labels) {
  return `
    <div class="donut-wrap">
      <div class="donut" style="--used:${used}%;" data-label="${used}%"></div>
      <div class="legend">
        <div class="legend-item"><span class="dot used"></span><span>${labels[0]}</span></div>
        <div class="legend-item"><span class="dot free"></span><span>${labels[1]}</span></div>
      </div>
    </div>
  `;
}

function statusClass(status) {
  if (status === "Khả dụng") return "available";
  if (status === "Đang sử dụng") return "occupied";
  return "maintenance";
}

async function renderSlots() {
  const slots = await api("/api/slots");
  const rows = slots.slice(0, 8).map(slot => `
    <tr>
      <td>${slot.id}</td>
      <td>${slot.area}</td>
      <td>${slot.vehicle}</td>
      <td>${slot.mac}</td>
      <td><span class="status ${statusClass(slot.status)}">${slot.status}</span></td>
      <td>
        <div class="action-group">
          <button class="btn btn-light" onclick="renderSlotForm('edit','${slot.id}')">Chỉnh sửa</button>
          <button class="btn btn-danger" onclick="deleteSlot('${slot.id}')">Xóa</button>
        </div>
      </td>
    </tr>
  `).join("");

  pageShell("Admin - Quản lí chỗ đỗ xe", "slots", `
    <h2 class="section-title">Quản lý chỗ đỗ xe</h2>
    <div class="section-subtitle">Theo dõi, tìm kiếm và cập nhật thông tin chỗ đỗ xe trong hệ thống</div>

    <div class="summary-row">
      ${card("Tổng số chỗ đỗ", "420", "Tất cả khu vực")}
      ${card("Khả dụng", "138", "Sẵn sàng sử dụng")}
      ${card("Đang sử dụng", "270", "Đã có xe")}
      ${card("Bảo trì", "12", "Tạm khóa")}
    </div>

    <div class="panel" style="height:690px;display:flex;flex-direction:column;">
      <div class="panel-title">Danh sách chỗ đỗ xe</div>
      <div class="toolbar">
        <input class="search-box" placeholder="Tìm theo mã chỗ đỗ..." oninput="filterSlotRows(this.value)" />
        <select class="filter-box"><option>Tất cả khu vực</option><option>Khu A</option><option>Khu B</option><option>Khu C</option></select>
        <select class="filter-box"><option>Tất cả loại xe</option><option>Xe máy</option><option>Ô tô</option></select>
        <select class="filter-box"><option>Tất cả trạng thái</option><option>Khả dụng</option><option>Đang sử dụng</option><option>Bảo trì</option></select>
        <button class="btn btn-primary" onclick="renderSlotForm('add')">+ Thêm chỗ đỗ</button>
      </div>
      <div class="table-wrap">
        <table id="slotTable">
          <thead><tr><th>Mã chỗ đỗ</th><th>Khu vực</th><th>Loại xe</th><th>MAC cảm biến</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `);
}

function filterSlotRows(keyword) {
  keyword = keyword.trim().toLowerCase();
  document.querySelectorAll("#slotTable tbody tr").forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(keyword) ? "" : "none";
  });
}

async function renderSlotForm(mode, id = "") {
  let slot = { id: "", area: "Khu A", vehicle: "Xe máy", mac: "", status: "Khả dụng" };
  if (mode === "edit") {
    const slots = await api("/api/slots");
    slot = slots.find(s => s.id === id) || slot;
  }

  const isEdit = mode === "edit";
  pageShell(`Admin - Quản lí chỗ đỗ xe - ${isEdit ? "Chỉnh sửa" : "Thêm"}`, "slots", `
    <div class="back-link" onclick="renderSlots()">← Quay lại danh sách chỗ đỗ xe</div>
    <h2 class="section-title">${isEdit ? "Chỉnh sửa chỗ đỗ xe" : "Thêm chỗ đỗ xe"}</h2>
    <div class="section-subtitle">${isEdit ? "Cập nhật thông tin của chỗ đỗ xe đã tồn tại" : "Nhập thông tin để tạo mới một chỗ đỗ xe trong hệ thống"}</div>

    <div class="form-card">
      <div class="form-grid">
        <div class="form-group">
          <label>Mã chỗ đỗ</label>
          <input id="slotId" value="${slot.id}" placeholder="Ví dụ: A-12" ${isEdit ? "disabled" : ""}/>
        </div>
        <div class="form-group">
          <label>Khu vực</label>
          <select id="slotArea">${optionList(["Khu A","Khu B","Khu C","Khu D"], slot.area)}</select>
        </div>
        <div class="form-group">
          <label>Loại xe</label>
          <select id="slotVehicle">${optionList(["Xe máy","Ô tô"], slot.vehicle)}</select>
        </div>
        <div class="form-group">
          <label>Trạng thái ban đầu</label>
          <select id="slotStatus">${optionList(["Khả dụng","Đang sử dụng","Bảo trì"], slot.status)}</select>
        </div>
        <div class="form-group full">
          <label>Địa chỉ MAC cảm biến</label>
          <input id="slotMac" value="${slot.mac}" placeholder="00:1A:C2:7B:11:12"/>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-light" onclick="renderSlots()">Hủy</button>
        <button class="btn btn-primary" onclick="saveSlot('${mode}', '${id}')">${isEdit ? "Cập nhật" : "Lưu chỗ đỗ"}</button>
      </div>
    </div>
  `);
}

function optionList(options, selected) {
  return options.map(x => `<option ${x === selected ? "selected" : ""}>${x}</option>`).join("");
}

async function saveSlot(mode, oldId) {
  const slot = {
    id: document.getElementById("slotId").value.trim(),
    area: document.getElementById("slotArea").value,
    vehicle: document.getElementById("slotVehicle").value,
    status: document.getElementById("slotStatus").value,
    mac: document.getElementById("slotMac").value.trim()
  };
  try {
    if (mode === "add") {
      await api("/api/slots", { method: "POST", body: JSON.stringify(slot) });
    } else {
      await api(`/api/slots/${oldId}`, { method: "PUT", body: JSON.stringify(slot) });
    }
    renderSlots();
  } catch (err) {
    alert(err.message);
  }
}

async function deleteSlot(id) {
  if (!confirm(`Bạn có chắc muốn xóa chỗ đỗ ${id}?`)) return;
  await api(`/api/slots/${id}`, { method: "DELETE" });
  renderSlots();
}

async function renderFees() {
  const fees = await api("/api/fees");
  pageShell("Admin - Thiết lập phí", "fees", `
    <h2 class="section-title">Thiết lập phí</h2>
    <div class="section-subtitle">Cấu hình chính sách phí theo đối tượng và hình thức thanh toán</div>

    <div class="summary-row">
      ${card("Tổng chính sách", "6", "Đang cấu hình")}
      ${card("Qua BKPay", "2", "Theo chu kỳ")}
      ${card("Chính sách riêng", "2", "Miễn / giảm / tự động trừ")}
      ${card("Theo phiên", "2", "Khách vãng lai")}
    </div>

    <div class="panel" style="height:620px;display:flex;flex-direction:column;">
      <div class="panel-title">Danh sách chính sách phí</div>
      <div class="toolbar">
        <select class="filter-box"><option>Tất cả đối tượng</option><option>Sinh viên</option><option>Giảng viên</option><option>Cán bộ - NV</option><option>Khách vãng lai</option></select>
        <select class="filter-box"><option>Tất cả loại xe</option><option>Xe máy</option><option>Ô tô</option></select>
        <select class="filter-box"><option>Tất cả hình thức</option><option>Theo chu kỳ</option><option>Chính sách riêng</option><option>Theo phiên</option></select>
        <button class="btn btn-primary">+ Thêm chính sách</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Đối tượng</th><th>Loại xe</th><th>Hình thức</th><th>Mức phí</th><th>Thanh toán</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            ${fees.map(f => `
              <tr>
                <td><span class="badge">${f.target}</span></td>
                <td>${f.vehicle}</td>
                <td>${f.type}</td>
                <td>${f.price}</td>
                <td><b style="color:#23437d">${f.payment}</b></td>
                <td><span class="status available">${f.status}</span></td>
                <td><button class="btn btn-light">Chỉnh sửa</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `);
}

async function renderReports() {
  const data = await api("/api/reports");
  const s = data.summary;
  pageShell("Admin - Báo cáo tổng quan", "reports", `
    <h2 class="section-title">Báo cáo tổng quan</h2>
    <div class="section-subtitle">Theo dõi hoạt động bãi xe, doanh thu và thanh toán</div>

    <div class="summary-row">
      ${card("Tổng lượt gửi xe", s.rides, "30 ngày gần nhất")}
      ${card("Doanh thu", s.revenue, "Tổng thu trong kỳ")}
      ${card("Giao dịch BKPay", s.bkpay, "Thanh toán theo chu kỳ")}
      ${card("Chỗ trống hiện tại", s.freeSlots, "Cập nhật hiện tại")}
    </div>

    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-title">Bộ lọc báo cáo</div>
      <div class="toolbar">
        <input class="filter-box" type="date" />
        <input class="filter-box" type="date" />
        <select class="filter-box"><option>Tất cả khu vực</option><option>Khu A</option><option>Khu B</option><option>Khu C</option></select>
        <select class="filter-box"><option>Tất cả loại xe</option><option>Xe máy</option><option>Ô tô</option></select>
        <button class="btn btn-light">Xem báo cáo</button>
        <button class="btn btn-primary" onclick="alert('Demo: xuất báo cáo PDF/Excel')">Xuất báo cáo</button>
      </div>
    </div>

    <div class="chart-row">
      <div class="panel chart-panel">
        <div class="panel-title">Lượt gửi xe theo khu</div>
        ${data.rows.filter(r => r.area !== "Toàn hệ thống").map(r => {
          const percent = typeof r.rides === "number" ? Math.round(r.rides / 420 * 88) : 72;
          return bar(r.area, percent, r.rides);
        }).join("")}
      </div>
      <div class="panel chart-panel">
        <div class="panel-title">Tỷ lệ sử dụng</div>
        ${donut(72, ["Đã sử dụng: 72%", "Còn trống: 28%"])}
      </div>
    </div>

    <div class="panel" style="height:330px;display:flex;flex-direction:column;">
      <div class="panel-title">Số liệu tóm tắt</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Khu vực</th><th>Lượt xe</th><th>Doanh thu</th><th>BKPay</th><th>Lấp đầy</th><th>Chỗ trống</th></tr></thead>
          <tbody>
            ${data.rows.map(r => `
              <tr>
                <td>${r.area}</td>
                <td>${r.rides}</td>
                <td>${r.revenue}</td>
                <td>${r.bkpay}</td>
                <td>${r.occupancy}</td>
                <td>${r.free}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `);
}

function renderLogout() {
  app.innerHTML = `
    <div class="frame">
      <div class="login-shell">
        <div class="login-topbar">
          <div class="brand-logo"></div>
          <div>
            <div class="brand-main">IoT - SPMS</div>
            <div class="brand-sub">Smart Parking System</div>
          </div>
          <div style="margin-left:auto;display:flex;align-items:center;gap:10px;">
            <div class="avatar"></div>
            <div class="admin-text">Admin | HCMUT SPMS</div>
          </div>
        </div>
        <div class="logout-content">
          <div class="logout-box">
            <div class="logout-icon">⎋</div>
            <div class="logout-title">Xác nhận đăng xuất</div>
            <div class="logout-text">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống SPMS?</div>
            <div class="logout-actions">
              <button class="btn btn-light" onclick="navigate('dashboard')">Hủy</button>
              <button class="btn btn-primary" onclick="navigate('login')">Đăng xuất</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

renderLogin();
