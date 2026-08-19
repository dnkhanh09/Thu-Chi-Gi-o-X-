import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  generateDefaultParishEntities,
  initialCategories,
  initialCategoryGroups,
  initialFunds,
  initialParishes,
  initialParishZones,
  initialTransactions,
  initialUsers,
} from '../data/initialData';
import {
  Category,
  CategoryGroup,
  CategorySummary,
  FilterState,
  Fund,
  FundBalanceSummary,
  GroupSummary,
  MonthlyFinancialRecord,
  Parish,
  ParishInfo,
  ParishZone,
  Transaction,
  UserAccount,
  UserRole,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'gx_finance_users_v2',
  CURRENT_USER_ID: 'gx_finance_current_user_id_v2',
  PARISHES: 'gx_finance_parishes_v2',
  ACTIVE_PARISH_ID: 'gx_finance_active_parish_id_v2',
  TRANSACTIONS: 'gx_finance_transactions_v2',
  CATEGORIES: 'gx_finance_categories_v2',
  CATEGORY_GROUPS: 'gx_finance_category_groups_v2',
  FUNDS: 'gx_finance_funds_v2',
  ZONES: 'gx_finance_zones_v2',
};

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

export function useParishFinance() {
  // 1. Users state
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : initialUsers;
    } catch {
      return initialUsers;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return saved !== null ? saved : 'usr-01'; // Default logged in as Cha Chánh xứ for convenience
    } catch {
      return 'usr-01';
    }
  });

  // 2. Parishes state
  const [parishes, setParishes] = useState<Parish[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARISHES);
      return saved ? JSON.parse(saved) : initialParishes;
    } catch {
      return initialParishes;
    }
  });

  const [activeParishId, setActiveParishId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PARISH_ID);
      return saved || (initialParishes[0]?.id ?? 'parish-01');
    } catch {
      return 'parish-01';
    }
  });

  // 3. Raw Data Store (Across all Parishes)
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [allCategories, setAllCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  const [allCategoryGroups, setAllCategoryGroups] = useState<CategoryGroup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORY_GROUPS);
      return saved ? JSON.parse(saved) : initialCategoryGroups;
    } catch {
      return initialCategoryGroups;
    }
  });

  const [allFunds, setAllFunds] = useState<Fund[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FUNDS);
      return saved ? JSON.parse(saved) : initialFunds;
    } catch {
      return initialFunds;
    }
  });

  const [allParishZones, setAllParishZones] = useState<ParishZone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ZONES);
      return saved ? JSON.parse(saved) : initialParishZones;
    } catch {
      return initialParishZones;
    }
  });

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    timeMode: 'month',
    year: currentYear,
    month: currentMonth,
    quarter: Math.ceil(currentMonth / 3),
    startDate: `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`,
    endDate: `${currentYear}-${String(currentMonth).padStart(2, '0')}-31`,
    type: 'all',
    categoryGroupId: 'all',
    categoryId: 'all',
    fundId: 'all',
    parishZoneId: 'all',
    searchQuery: '',
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARISHES, JSON.stringify(parishes));
  }, [parishes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PARISH_ID, activeParishId);
  }, [activeParishId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(allTransactions));
  }, [allTransactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(allCategories));
  }, [allCategories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORY_GROUPS, JSON.stringify(allCategoryGroups));
  }, [allCategoryGroups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FUNDS, JSON.stringify(allFunds));
  }, [allFunds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(allParishZones));
  }, [allParishZones]);

  // Derived Current User & Current Parish
  const currentUser: UserAccount | null = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || null;
  }, [users, currentUserId]);

  const currentParish: Parish = useMemo(() => {
    const found = parishes.find((p) => p.id === activeParishId);
    return found || parishes[0] || initialParishes[0];
  }, [parishes, activeParishId]);

  // Convert currentParish to ParishInfo shape for legacy compatibility
  const parishInfo: ParishInfo = useMemo(() => {
    return {
      id: currentParish.id,
      dioceseName: currentParish.dioceseName,
      deaneryName: currentParish.deaneryName,
      parishName: currentParish.name,
      address: currentParish.address,
      pastorName: currentParish.pastorName,
      committeeLeaderName: currentParish.committeeLeaderName,
      accountantName: currentParish.accountantName,
      treasurerName: currentParish.treasurerName,
      phone: currentParish.phone,
      email: currentParish.email,
      establishedYear: currentParish.establishedYear,
    };
  }, [currentParish]);

  // Accessible Parishes for current user
  const userParishes = useMemo(() => {
    if (!currentUser) return parishes;
    if (currentUser.role === 'pastor') return parishes; // Pastors/Admins can see all
    return parishes.filter((p) => currentUser.parishIds.includes(p.id));
  }, [parishes, currentUser]);

  // Scoped Data for Active Parish
  const transactions = useMemo(() => {
    return allTransactions.filter(
      (t) => (t.parishId || 'parish-01') === currentParish.id
    );
  }, [allTransactions, currentParish.id]);

  const categories = useMemo(() => {
    const list = allCategories.filter((c) => (c.parishId || 'parish-01') === currentParish.id);
    return list.length > 0 ? list : allCategories.filter((c) => !c.parishId || c.parishId === 'parish-01');
  }, [allCategories, currentParish.id]);

  const categoryGroups = useMemo(() => {
    const list = allCategoryGroups.filter((g) => (g.parishId || 'parish-01') === currentParish.id);
    return list.length > 0 ? list : allCategoryGroups.filter((g) => !g.parishId || g.parishId === 'parish-01');
  }, [allCategoryGroups, currentParish.id]);

  const funds = useMemo(() => {
    const list = allFunds.filter((f) => (f.parishId || 'parish-01') === currentParish.id);
    return list.length > 0 ? list : allFunds.filter((f) => !f.parishId || f.parishId === 'parish-01');
  }, [allFunds, currentParish.id]);

  const parishZones = useMemo(() => {
    const list = allParishZones.filter((z) => (z.parishId || 'parish-01') === currentParish.id);
    return list.length > 0 ? list : allParishZones.filter((z) => !z.parishId || z.parishId === 'parish-01');
  }, [allParishZones, currentParish.id]);

  // Auth Operations
  const login = useCallback(
    (
      usernameOrEmail: string,
      password?: string,
      targetParishId?: string
    ): { success: boolean; message: string; user?: UserAccount } => {
      const trimmed = usernameOrEmail.trim().toLowerCase();
      const user = users.find(
        (u) =>
          u.username.toLowerCase() === trimmed ||
          u.email.toLowerCase() === trimmed ||
          (trimmed === 'dnkhanh' && u.username === 'admin')
      );

      if (!user) {
        return { success: false, message: 'Tên đăng nhập hoặc email không tồn tại trong hệ thống!' };
      }

      if (password && user.password && user.password !== password) {
        return { success: false, message: 'Mật khẩu không chính xác! Vui lòng thử lại.' };
      }

      // Check Parish Access
      const isAdminOrPastor = user.role === 'admin' || user.role === 'pastor';
      let selectedParish = targetParishId;

      if (targetParishId && targetParishId !== 'all') {
        if (!isAdminOrPastor && !user.parishIds.includes(targetParishId)) {
          return {
            success: false,
            message: `Tài khoản "${user.fullName}" không có quyền truy cập vào Giáo xứ này! Vui lòng chọn đúng Giáo xứ của bạn.`,
          };
        }
        selectedParish = targetParishId;
      } else {
        selectedParish = user.defaultParishId || user.parishIds[0] || 'parish-01';
      }

      setCurrentUserId(user.id);
      if (selectedParish && parishes.some((p) => p.id === selectedParish)) {
        setActiveParishId(selectedParish);
      }

      return {
        success: true,
        message: `Chào mừng ${user.fullName} (${user.role === 'admin' ? 'Quản Trị Viên' : 'Ban Tài Chính'}) đăng nhập thành công!`,
        user,
      };
    },
    [users, parishes]
  );

  const quickLogin = useCallback(
    (userId: string, targetParishId?: string) => {
      const user = users.find((u) => u.id === userId);
      if (user) {
        setCurrentUserId(user.id);
        const pId = targetParishId || user.defaultParishId || user.parishIds[0] || 'parish-01';
        if (pId && parishes.some((p) => p.id === pId)) {
          setActiveParishId(pId);
        }
      }
    },
    [users, parishes]
  );

  const logout = useCallback(() => {
    setCurrentUserId(null);
  }, []);

  // Parish Switching
  const switchParish = useCallback(
    (parishId: string) => {
      if (parishes.some((p) => p.id === parishId)) {
        setActiveParishId(parishId);
      }
    },
    [parishes]
  );

  // Register New User
  const registerUser = useCallback(
    (data: {
      username: string;
      fullName: string;
      saintName?: string;
      email: string;
      phone?: string;
      password?: string;
      role: UserRole;
      parishId?: string;
      newParishData?: Partial<Parish>;
    }) => {
      let assignedParishId = data.parishId || activeParishId;

      // Check if creating a new Parish alongside user registration
      if (data.newParishData && data.newParishData.name) {
        const newParishId = 'parish-' + Date.now();
        const newParish: Parish = {
          id: newParishId,
          code: data.newParishData.code || 'GX-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          name: data.newParishData.name,
          dioceseName: data.newParishData.dioceseName || 'GIÁO PHẬN MỚI',
          deaneryName: data.newParishData.deaneryName || 'Giáo Hạt Mới',
          address: data.newParishData.address || '',
          pastorName: data.newParishData.pastorName || data.fullName,
          committeeLeaderName: data.newParishData.committeeLeaderName || '',
          accountantName: data.newParishData.accountantName || '',
          treasurerName: data.newParishData.treasurerName || '',
          phone: data.newParishData.phone || data.phone || '',
          email: data.newParishData.email || data.email || '',
          establishedYear: data.newParishData.establishedYear || `${new Date().getFullYear()}`,
          description: data.newParishData.description || `Giáo xứ ${data.newParishData.name}`,
          createdAt: new Date().toISOString(),
        };

        const { funds: defFunds, zones: defZones, categoryGroups: defGroups, categories: defCats } =
          generateDefaultParishEntities(newParishId, newParish.name);

        setParishes((prev) => [...prev, newParish]);
        setAllFunds((prev) => [...prev, ...defFunds]);
        setAllParishZones((prev) => [...prev, ...defZones]);
        setAllCategoryGroups((prev) => [...prev, ...defGroups]);
        setAllCategories((prev) => [...prev, ...defCats]);

        assignedParishId = newParishId;
      }

      // Check if username already exists
      if (users.some((u) => u.username.toLowerCase() === data.username.toLowerCase().trim())) {
        return { success: false, message: 'Tên đăng nhập này đã được sử dụng! Vui lòng chọn tên khác.' };
      }

      const newUser: UserAccount = {
        id: 'usr-' + Date.now(),
        username: data.username.trim(),
        fullName: data.fullName.trim(),
        saintName: data.saintName?.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim(),
        password: data.password || '123456',
        role: data.role,
        parishIds: [assignedParishId],
        defaultParishId: assignedParishId,
        createdAt: new Date().toISOString(),
      };

      setUsers((prev) => [...prev, newUser]);
      setCurrentUserId(newUser.id);
      setActiveParishId(assignedParishId);

      return { success: true, message: `Đã tạo tài khoản "${newUser.fullName}" thành công!`, user: newUser };
    },
    [users, activeParishId]
  );

  // Add / Create a new Parish to the system
  const createParish = useCallback(
    (parishData: Omit<Parish, 'id' | 'createdAt'>) => {
      const newParishId = 'parish-' + Date.now();
      const newParish: Parish = {
        ...parishData,
        id: newParishId,
        createdAt: new Date().toISOString(),
      };

      const { funds: defFunds, zones: defZones, categoryGroups: defGroups, categories: defCats } =
        generateDefaultParishEntities(newParishId, newParish.name);

      setParishes((prev) => [...prev, newParish]);
      setAllFunds((prev) => [...prev, ...defFunds]);
      setAllParishZones((prev) => [...prev, ...defZones]);
      setAllCategoryGroups((prev) => [...prev, ...defGroups]);
      setAllCategories((prev) => [...prev, ...defCats]);

      // If current user exists, grant access
      if (currentUserId) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === currentUserId && !u.parishIds.includes(newParishId)
              ? { ...u, parishIds: [...u.parishIds, newParishId] }
              : u
          )
        );
      }

      setActiveParishId(newParishId);
      return newParish;
    },
    [currentUserId]
  );

  // Update Parish Information
  const updateParish = useCallback(
    (parishId: string, info: Partial<Parish>) => {
      setParishes((prev) =>
        prev.map((p) => (p.id === parishId ? { ...p, ...info } : p))
      );
    },
    []
  );

  const setParishInfoWrapper = useCallback(
    (info: ParishInfo) => {
      updateParish(currentParish.id, {
        name: info.parishName,
        dioceseName: info.dioceseName,
        deaneryName: info.deaneryName,
        address: info.address,
        pastorName: info.pastorName,
        committeeLeaderName: info.committeeLeaderName,
        accountantName: info.accountantName,
        treasurerName: info.treasurerName,
        phone: info.phone,
        email: info.email,
        establishedYear: info.establishedYear,
      });
    },
    [currentParish.id, updateParish]
  );

  // Delete / Remove Parish
  const deleteParish = useCallback(
    (parishId: string) => {
      if (parishes.length <= 1) {
        alert('Hệ thống phải có ít nhất 1 Giáo xứ hoạt động!');
        return;
      }
      setParishes((prev) => prev.filter((p) => p.id !== parishId));
      if (activeParishId === parishId) {
        const remaining = parishes.filter((p) => p.id !== parishId);
        setActiveParishId(remaining[0]?.id || 'parish-01');
      }
    },
    [parishes, activeParishId]
  );

  // CRUD for Transactions (Scoped to active parish)
  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
      const newTx: Transaction = {
        ...tx,
        id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        parishId: currentParish.id,
        creator: tx.creator || currentUser?.fullName || parishInfo.accountantName,
        createdAt: new Date().toISOString(),
      };
      setAllTransactions((prev) => [newTx, ...prev]);
      return newTx;
    },
    [currentParish.id, currentUser, parishInfo.accountantName]
  );

  const updateTransaction = useCallback((id: string, updated: Partial<Transaction>) => {
    setAllTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated, updatedAt: new Date().toISOString() } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setAllTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const batchDeleteTransactions = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setAllTransactions((prev) => prev.filter((t) => !idSet.has(t.id)));
  }, []);

  // CRUD for Categories
  const addCategory = useCallback(
    (category: Omit<Category, 'id'>) => {
      const newCat: Category = {
        ...category,
        id: 'cat-' + Date.now(),
        parishId: currentParish.id,
      };
      setAllCategories((prev) => [...prev, newCat]);
      return newCat;
    },
    [currentParish.id]
  );

  const updateCategory = useCallback((id: string, category: Partial<Category>) => {
    setAllCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...category } : c)));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setAllCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // CRUD for Funds
  const addFund = useCallback(
    (fund: Omit<Fund, 'id'>) => {
      const newFund: Fund = {
        ...fund,
        id: 'fund-' + Date.now(),
        parishId: currentParish.id,
      };
      setAllFunds((prev) => [...prev, newFund]);
      return newFund;
    },
    [currentParish.id]
  );

  const updateFund = useCallback((id: string, fund: Partial<Fund>) => {
    setAllFunds((prev) => prev.map((f) => (f.id === id ? { ...f, ...fund } : f)));
  }, []);

  const deleteFund = useCallback((id: string) => {
    setAllFunds((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // CRUD for Zones
  const addParishZone = useCallback(
    (zone: Omit<ParishZone, 'id'>) => {
      const newZone: ParishZone = {
        ...zone,
        id: 'zone-' + Date.now(),
        parishId: currentParish.id,
      };
      setAllParishZones((prev) => [...prev, newZone]);
      return newZone;
    },
    [currentParish.id]
  );

  const updateParishZone = useCallback((id: string, zone: Partial<ParishZone>) => {
    setAllParishZones((prev) => prev.map((z) => (z.id === id ? { ...z, ...zone } : z)));
  }, []);

  const deleteParishZone = useCallback((id: string) => {
    setAllParishZones((prev) => prev.filter((z) => z.id !== id));
  }, []);

  // Reset Data to sample
  const resetToDefaultData = useCallback(() => {
    setUsers(initialUsers);
    setCurrentUserId('usr-01');
    setParishes(initialParishes);
    setActiveParishId('parish-01');
    setAllTransactions(initialTransactions);
    setAllCategories(initialCategories);
    setAllCategoryGroups(initialCategoryGroups);
    setAllFunds(initialFunds);
    setAllParishZones(initialParishZones);
  }, []);

  // Backup & Restore
  const exportBackupJson = useCallback(() => {
    const backupData = {
      version: '2.0',
      system: 'Catholic Parish Multi-Tenant Finance System',
      exportedAt: new Date().toISOString(),
      activeParishId,
      parishInfo,
      parishes,
      users,
      transactions: allTransactions,
      categories: allCategories,
      categoryGroups: allCategoryGroups,
      funds: allFunds,
      parishZones: allParishZones,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sao_Luu_Thu_Chi_${currentParish.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [
    activeParishId,
    parishInfo,
    currentParish.name,
    parishes,
    users,
    allTransactions,
    allCategories,
    allCategoryGroups,
    allFunds,
    allParishZones,
  ]);

  const importBackupJson = useCallback((jsonContent: string) => {
    try {
      const data = JSON.parse(jsonContent);
      if (data.parishes && Array.isArray(data.parishes)) {
        setParishes(data.parishes);
      }
      if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      }
      if (data.transactions && Array.isArray(data.transactions)) {
        setAllTransactions(data.transactions);
      }
      if (data.categories && Array.isArray(data.categories)) {
        setAllCategories(data.categories);
      }
      if (data.categoryGroups && Array.isArray(data.categoryGroups)) {
        setAllCategoryGroups(data.categoryGroups);
      }
      if (data.funds && Array.isArray(data.funds)) {
        setAllFunds(data.funds);
      }
      if (data.parishZones && Array.isArray(data.parishZones)) {
        setAllParishZones(data.parishZones);
      }
      return { success: true, message: 'Nhập dữ liệu sao lưu thành công!' };
    } catch {
      return { success: false, message: 'Tệp tin sao lưu không hợp lệ. Vui lòng kiểm tra lại.' };
    }
  }, []);

  // Compute Time Title (Báo cáo tháng X, Năm Y, vv)
  const timeRangeTitle = useMemo(() => {
    if (filters.timeMode === 'month') {
      return `Tháng ${String(filters.month).padStart(2, '0')}/${filters.year}`;
    }
    if (filters.timeMode === 'quarter') {
      return `Quý ${filters.quarter}/${filters.year}`;
    }
    if (filters.timeMode === 'year') {
      return `Năm ${filters.year}`;
    }
    if (filters.timeMode === 'custom') {
      return `Từ ${filters.startDate || '...'} đến ${filters.endDate || '...'}`;
    }
    return 'Toàn Bộ Thời Gian';
  }, [filters]);

  // Filtered transactions for active parish
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // 1. Time Filter
      if (filters.timeMode === 'month') {
        const [y, m] = t.date.split('-').map(Number);
        if (y !== filters.year || m !== filters.month) return false;
      } else if (filters.timeMode === 'quarter') {
        const [y, m] = t.date.split('-').map(Number);
        const q = Math.ceil(m / 3);
        if (y !== filters.year || q !== filters.quarter) return false;
      } else if (filters.timeMode === 'year') {
        const [y] = t.date.split('-').map(Number);
        if (y !== filters.year) return false;
      } else if (filters.timeMode === 'custom') {
        if (filters.startDate && t.date < filters.startDate) return false;
        if (filters.endDate && t.date > filters.endDate) return false;
      }

      // 2. Type Filter
      if (filters.type !== 'all' && t.type !== filters.type) return false;

      // 3. Category Group
      if (filters.categoryGroupId !== 'all' && t.categoryGroup !== filters.categoryGroupId) {
        return false;
      }

      // 4. Category
      if (filters.categoryId !== 'all' && t.categoryId !== filters.categoryId) {
        return false;
      }

      // 5. Fund
      if (filters.fundId !== 'all' && t.fundId !== filters.fundId) {
        return false;
      }

      // 6. Parish Zone
      if (filters.parishZoneId !== 'all' && t.parishZoneId !== filters.parishZoneId) {
        return false;
      }

      // 7. Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matches =
          t.voucherNumber?.toLowerCase().includes(query) ||
          t.categoryCode?.toLowerCase().includes(query) ||
          t.categoryName?.toLowerCase().includes(query) ||
          t.categoryGroup?.toLowerCase().includes(query) ||
          t.payerReceiver?.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.fundName?.toLowerCase().includes(query) ||
          (t.parishZoneName && t.parishZoneName.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // 8. Amount Range
      if (filters.minAmount !== undefined && t.amount < filters.minAmount) return false;
      if (filters.maxAmount !== undefined && t.amount > filters.maxAmount) return false;

      return true;
    });
  }, [transactions, filters]);

  // Key Totals for Active Parish
  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const netBalance = totalIncome - totalExpense;

  // Monthly breakdown for Chart
  const monthlyChartData: MonthlyFinancialRecord[] = useMemo(() => {
    const year = filters.year;
    const records: MonthlyFinancialRecord[] = [];

    for (let m = 1; m <= 12; m++) {
      const monthPrefix = `${year}-${String(m).padStart(2, '0')}`;
      const monthTxs = transactions.filter((t) => t.date.startsWith(monthPrefix));

      const income = monthTxs
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTxs
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      records.push({
        month: m,
        monthLabel: `T${m}`,
        income,
        expense,
        net: income - expense,
        balance: 0,
      });
    }

    return records;
  }, [transactions, filters.year]);

  // Group & Category Summaries for Income
  const incomeGroupsSummary: GroupSummary[] = useMemo(() => {
    const incomeTxs = filteredTransactions.filter((t) => t.type === 'income');
    const groupMap = new Map<string, { total: number; count: number; catMap: Map<string, CategorySummary> }>();

    incomeTxs.forEach((t) => {
      const groupName = t.categoryGroup || 'Thu Khác';
      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, { total: 0, count: 0, catMap: new Map() });
      }
      const grp = groupMap.get(groupName)!;
      grp.total += t.amount;
      grp.count += 1;

      if (!grp.catMap.has(t.categoryId)) {
        grp.catMap.set(t.categoryId, {
          categoryId: t.categoryId,
          categoryCode: t.categoryCode,
          categoryName: t.categoryName,
          group: groupName,
          type: 'income',
          totalAmount: 0,
          count: 0,
          percentage: 0,
        });
      }
      const cat = grp.catMap.get(t.categoryId)!;
      cat.totalAmount += t.amount;
      cat.count += 1;
    });

    const result: GroupSummary[] = [];
    groupMap.forEach((val, groupName) => {
      const categoriesList = Array.from(val.catMap.values()).map((c) => ({
        ...c,
        percentage: totalIncome > 0 ? (c.totalAmount / totalIncome) * 100 : 0,
      }));

      result.push({
        groupName,
        type: 'income',
        totalAmount: val.total,
        count: val.count,
        categories: categoriesList.sort((a, b) => b.totalAmount - a.totalAmount),
      });
    });

    return result.sort((a, b) => b.totalAmount - a.totalAmount);
  }, [filteredTransactions, totalIncome]);

  // Group & Category Summaries for Expense
  const expenseGroupsSummary: GroupSummary[] = useMemo(() => {
    const expenseTxs = filteredTransactions.filter((t) => t.type === 'expense');
    const groupMap = new Map<string, { total: number; count: number; catMap: Map<string, CategorySummary> }>();

    expenseTxs.forEach((t) => {
      const groupName = t.categoryGroup || 'Chi Khác';
      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, { total: 0, count: 0, catMap: new Map() });
      }
      const grp = groupMap.get(groupName)!;
      grp.total += t.amount;
      grp.count += 1;

      if (!grp.catMap.has(t.categoryId)) {
        grp.catMap.set(t.categoryId, {
          categoryId: t.categoryId,
          categoryCode: t.categoryCode,
          categoryName: t.categoryName,
          group: groupName,
          type: 'expense',
          totalAmount: 0,
          count: 0,
          percentage: 0,
        });
      }
      const cat = grp.catMap.get(t.categoryId)!;
      cat.totalAmount += t.amount;
      cat.count += 1;
    });

    const result: GroupSummary[] = [];
    groupMap.forEach((val, groupName) => {
      const categoriesList = Array.from(val.catMap.values()).map((c) => ({
        ...c,
        percentage: totalExpense > 0 ? (c.totalAmount / totalExpense) * 100 : 0,
      }));

      result.push({
        groupName,
        type: 'expense',
        totalAmount: val.total,
        count: val.count,
        categories: categoriesList.sort((a, b) => b.totalAmount - a.totalAmount),
      });
    });

    return result.sort((a, b) => b.totalAmount - a.totalAmount);
  }, [filteredTransactions, totalExpense]);

  // Fund Balances for active parish
  const fundSummaries: FundBalanceSummary[] = useMemo(() => {
    return funds.map((f) => {
      const allTxForFund = transactions.filter((t) => t.fundId === f.id);
      const inc = allTxForFund.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const exp = allTxForFund.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return {
        fundId: f.id,
        fundName: f.name,
        fundCode: f.code,
        initialBalance: f.initialBalance,
        totalIncome: inc,
        totalExpense: exp,
        currentBalance: f.initialBalance + inc - exp,
      };
    });
  }, [funds, transactions]);

  // Overall Parish total cash in hand
  const totalParishBalance = useMemo(() => {
    return fundSummaries.reduce((sum, f) => sum + f.currentBalance, 0);
  }, [fundSummaries]);

  return {
    // Multi-tenant & Auth
    users,
    currentUser,
    currentUserId,
    parishes,
    currentParish,
    activeParishId,
    userParishes,
    login,
    quickLogin,
    logout,
    registerUser,
    switchParish,
    createParish,
    updateParish,
    deleteParish,

    // Scoped Data
    transactions,
    filteredTransactions,
    categories,
    categoryGroups,
    funds,
    parishZones,
    parishInfo,
    filters,
    setFilters,
    timeRangeTitle,
    totalIncome,
    totalExpense,
    netBalance,
    monthlyChartData,
    incomeGroupsSummary,
    expenseGroupsSummary,
    fundSummaries,
    totalParishBalance,

    // Actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    batchDeleteTransactions,
    addCategory,
    updateCategory,
    deleteCategory,
    addFund,
    updateFund,
    deleteFund,
    addParishZone,
    updateParishZone,
    deleteParishZone,
    setParishInfo: setParishInfoWrapper,
    resetToDefaultData,
    exportBackupJson,
    importBackupJson,
  };
}
