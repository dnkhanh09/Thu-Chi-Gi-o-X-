export type TransactionType = 'income' | 'expense';

export type UserRole = 'admin' | 'pastor' | 'accountant' | 'treasurer' | 'council_leader' | 'viewer';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  saintName?: string; // Tên Thánh (e.g., Giuse, Maria, Phêrô)
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  parishIds: string[]; // Danh sách ID các giáo xứ người dùng có quyền truy cập
  defaultParishId: string;
  avatar?: string;
  createdAt: string;
}

export interface Parish {
  id: string;
  code: string; // e.g. 'GX-THANHTAM', 'GX-TANDINH'
  name: string; // e.g. 'Giáo Xứ Thánh Tâm'
  dioceseName: string; // Tên Giáo phận
  deaneryName: string; // Tên Giáo hạt
  address: string;
  pastorName: string; // Cha Chánh xứ (Quản xứ)
  committeeLeaderName: string; // Trưởng Ban Hành Giáo
  accountantName: string; // Kế toán Ban Tài Chính
  treasurerName: string; // Thủ quỹ Ban Tài Chính
  phone: string;
  email: string;
  establishedYear?: string;
  description?: string;
  createdAt: string;
  isDefault?: boolean;
}

export interface CategoryGroup {
  id: string;
  parishId?: string;
  name: string;
  type: TransactionType;
  description?: string;
  color?: string;
}

export interface Category {
  id: string;
  parishId?: string;
  code: string; // e.g. 'THU-LE01', 'CHI-PL01'
  name: string;
  type: TransactionType;
  group: string; // Nhóm mục e.g. 'Phụng vụ & Thánh lễ', 'Xây dựng & Tu sửa', 'Quỹ Caritas Bác ái'
  description?: string;
  color?: string;
  isDefault?: boolean;
}

export interface Fund {
  id: string;
  parishId?: string;
  code: string; // e.g. 'QUY-CHUNG', 'QUY-XAYDUNG', 'QUY-BACAI'
  name: string;
  initialBalance: number;
  description?: string;
  color?: string;
}

export interface ParishZone {
  id: string;
  parishId?: string;
  name: string;
  leader?: string;
  contact?: string;
}

export interface Transaction {
  id: string;
  parishId?: string;
  voucherNumber: string; // Số chứng từ / Số phiếu (e.g., PT-202608-001, PC-202608-002)
  type: TransactionType;
  categoryId: string;
  categoryCode: string;
  categoryName: string;
  categoryGroup: string;
  fundId: string;
  fundName: string;
  amount: number;
  date: string; // YYYY-MM-DD
  payerReceiver: string; // Họ tên người nộp / người nhận / ân nhân
  parishZoneId?: string; // Thuộc Giáo họ / Giáo khu nào
  parishZoneName?: string;
  description: string; // Diễn giải nội dung thu/chi
  creator: string; // Người lập phiếu (Kế toán / Thủ quỹ)
  approver?: string; // Người duyệt (Cha xứ / Trưởng ban)
  note?: string; // Ghi chú bổ sung
  createdAt: string;
  updatedAt?: string;
}

export interface ParishInfo {
  id?: string;
  dioceseName: string; // Tên Giáo phận
  deaneryName: string; // Tên Giáo hạt
  parishName: string; // Tên Giáo xứ
  address: string;
  pastorName: string; // Cha Chánh xứ (Quản xứ)
  committeeLeaderName: string; // Trưởng Ban Hành Giáo
  accountantName: string; // Kế toán Ban Tài Chính
  treasurerName: string; // Thủ quỹ Ban Tài Chính
  phone: string;
  email: string;
  establishedYear?: string;
}

export type TimeFilterMode = 'month' | 'quarter' | 'year' | 'custom' | 'all';

export interface FilterState {
  timeMode: TimeFilterMode;
  year: number;
  month: number; // 1-12
  quarter: number; // 1-4
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  type: 'all' | 'income' | 'expense';
  categoryGroupId: string; // 'all' or specific group
  categoryId: string; // 'all' or specific category
  fundId: string; // 'all' or specific fund
  parishZoneId: string; // 'all' or specific zone
  searchQuery: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryCode: string;
  categoryName: string;
  group: string;
  type: TransactionType;
  totalAmount: number;
  count: number;
  percentage: number;
}

export interface GroupSummary {
  groupName: string;
  type: TransactionType;
  totalAmount: number;
  count: number;
  categories: CategorySummary[];
}

export interface FundBalanceSummary {
  fundId: string;
  fundName: string;
  fundCode: string;
  initialBalance: number;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
}

export interface MonthlyFinancialRecord {
  month: number;
  monthLabel: string;
  income: number;
  expense: number;
  net: number;
  balance: number;
}
