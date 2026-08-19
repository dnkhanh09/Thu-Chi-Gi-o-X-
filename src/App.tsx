/**
 * Hệ thống Quản Lý Thu Chi Giáo Xứ (Đa Giáo Xứ & Phân Quyền Tài Khoản)
 * Phát triển & Sáng lập bởi: DN Khánh ( www.Khang.Top )
 */

import React, { useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { AuthView } from './components/AuthView';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { DashboardStats } from './components/DashboardStats';
import { FilterBar } from './components/FilterBar';
import { FinancialCharts } from './components/FinancialCharts';
import { FundManagerView } from './components/FundManagerView';
import { Header } from './components/Header';
import { ParishionerManagerView } from './components/ParishionerManagerView';
import { ParishManagerModal } from './components/ParishManagerModal';
import { ParishSettingsModal } from './components/ParishSettingsModal';
import { ReceiptPrintModal } from './components/ReceiptPrintModal';
import { ReportView } from './components/ReportView';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { useParishFinance } from './hooks/useParishFinance';
import { Transaction, TransactionType } from './types';
import { exportTransactionsToExcel } from './utils/excelExport';

export default function App() {
  const {
    // Multi-tenant & Auth
    users,
    currentUser,
    parishes,
    currentParish,
    activeParishId,
    login,
    quickLogin,
    logout,
    registerUser,
    switchParish,
    createParish,
    updateParish,
    deleteParish,

    // Data Scoped to Active Parish
    transactions,
    filteredTransactions,
    categories,
    categoryGroups,
    funds,
    parishZones,
    parishioners,
    parishFamilies,
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
    addParishioner,
    updateParishioner,
    deleteParishioner,
    batchDeleteParishioners,
    addParishFamily,
    updateParishFamily,
    deleteParishFamily,
    setParishInfo,
    resetToDefaultData,
    exportBackupJson,
    importBackupJson,
  } = useParishFinance();

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'journal' | 'reports' | 'charts' | 'funds' | 'parishioners'>('journal');

  // Modal States
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionModalType, setTransactionModalType] = useState<TransactionType>('income');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isParishManagerOpen, setIsParishManagerOpen] = useState(false);

  // If user is not logged in, REQUIRE authentication to view any parish data
  if (!currentUser) {
    return (
      <AuthView
        parishes={parishes}
        onLogin={login}
        onQuickLogin={quickLogin}
        onRegisterUser={registerUser}
      />
    );
  }

  // Handlers
  const handleOpenNewTransaction = (type: TransactionType) => {
    setEditingTransaction(null);
    setTransactionModalType(type);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setTransactionModalType(tx.type);
    setIsTransactionModalOpen(true);
  };

  const handlePrintReceipt = (tx: Transaction) => {
    setSelectedReceiptTx(tx);
    setIsReceiptModalOpen(true);
  };

  const handleExportExcel = () => {
    exportTransactionsToExcel(filteredTransactions, parishInfo, timeRangeTitle);
  };

  const handlePrintReport = () => {
    setActiveTab('reports');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header with Multi-Parish Switcher & Auth */}
      <Header
        parishInfo={parishInfo}
        parishes={parishes}
        activeParishId={activeParishId}
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTransaction={handleOpenNewTransaction}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportExcel={handleExportExcel}
        onPrintReport={handlePrintReport}
        onSwitchParish={switchParish}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenParishManager={() => setIsParishManagerOpen(true)}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Dashboard Stats Bar (For Financial Tabs) */}
        {activeTab !== 'parishioners' && (
          <DashboardStats
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            netBalance={netBalance}
            totalParishBalance={totalParishBalance}
            fundSummaries={fundSummaries}
            timeRangeTitle={timeRangeTitle}
            filteredTransactions={filteredTransactions}
          />
        )}

        {/* Global Multi-Filter Toolbar (Visible for Journal, Reports, Charts) */}
        {activeTab !== 'funds' && activeTab !== 'parishioners' && (
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            categoryGroups={categoryGroups}
            categories={categories}
            funds={funds}
            parishZones={parishZones}
            totalResults={filteredTransactions.length}
          />
        )}

        {/* TAB 1: Sổ Nhật Ký Thu Chi */}
        {activeTab === 'journal' && (
          <TransactionList
            transactions={filteredTransactions}
            onEdit={handleEditTransaction}
            onDelete={deleteTransaction}
            onBatchDelete={batchDeleteTransactions}
            onPrintReceipt={handlePrintReceipt}
            onOpenNewTransaction={handleOpenNewTransaction}
            timeRangeTitle={timeRangeTitle}
          />
        )}

        {/* TAB 2: Báo Cáo Tổng Hợp Theo Nhóm Mục */}
        {activeTab === 'reports' && (
          <ReportView
            transactions={filteredTransactions}
            incomeGroups={incomeGroupsSummary}
            expenseGroups={expenseGroupsSummary}
            fundSummaries={fundSummaries}
            parishZones={parishZones}
            parishInfo={parishInfo}
            timeRangeTitle={timeRangeTitle}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            netBalance={netBalance}
            totalParishBalance={totalParishBalance}
          />
        )}

        {/* TAB 3: Biểu Đồ & Thống Kê */}
        {activeTab === 'charts' && (
          <FinancialCharts
            monthlyData={monthlyChartData}
            incomeGroups={incomeGroupsSummary}
            expenseGroups={expenseGroupsSummary}
            year={filters.year}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            timeRangeTitle={timeRangeTitle}
          />
        )}

        {/* TAB 4: Quỹ & Sổ Quỹ Tiền Mặt */}
        {activeTab === 'funds' && (
          <FundManagerView
            funds={fundSummaries}
            transactions={transactions}
            onOpenNewTransaction={handleOpenNewTransaction}
            onPrintReceipt={handlePrintReceipt}
          />
        )}

        {/* TAB 5: Hệ Thống Quản Lý Giáo Dân & Sổ Gia Đình Công Giáo */}
        {activeTab === 'parishioners' && (
          <ParishionerManagerView
            parishioners={parishioners}
            parishFamilies={parishFamilies}
            parishZones={parishZones}
            parishInfo={parishInfo}
            onAddParishioner={addParishioner}
            onUpdateParishioner={updateParishioner}
            onDeleteParishioner={deleteParishioner}
            onBatchDeleteParishioners={batchDeleteParishioners}
            onAddParishFamily={addParishFamily}
            onUpdateParishFamily={updateParishFamily}
            onDeleteParishFamily={deleteParishFamily}
          />
        )}
      </main>

      {/* Footer with Software Creator Credit */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-12 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            <strong>{parishInfo.parishName}</strong> • {parishInfo.dioceseName}
          </div>
          <div className="flex items-center gap-1">
            <span>Phần mềm được phát triển bởi</span>
            <a
              href="https://www.Khang.Top"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2"
            >
              DN Khánh ( www.Khang.Top )
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Transaction Create / Edit Modal (With 1-character smart autocomplete) */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={addTransaction}
        onUpdate={updateTransaction}
        editingTransaction={editingTransaction}
        initialType={transactionModalType}
        categories={categories}
        categoryGroups={categoryGroups}
        funds={funds}
        parishZones={parishZones}
        parishInfo={parishInfo}
        allTransactions={transactions}
      />

      {/* 2. Receipt Print Voucher Modal */}
      <ReceiptPrintModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setSelectedReceiptTx(null);
        }}
        transaction={selectedReceiptTx}
        parishInfo={parishInfo}
      />

      {/* 3. Category & Codes Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        categoryGroups={categoryGroups}
        funds={funds}
        parishZones={parishZones}
        onAddCategory={addCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
        onAddFund={addFund}
        onUpdateFund={updateFund}
        onDeleteFund={deleteFund}
        onAddParishZone={addParishZone}
        onUpdateParishZone={updateParishZone}
        onDeleteParishZone={deleteParishZone}
      />

      {/* 4. Parish Settings & Backup Modal */}
      <ParishSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        parishInfo={parishInfo}
        onSaveInfo={setParishInfo}
        onExportBackup={exportBackupJson}
        onImportBackup={importBackupJson}
        onResetSampleData={resetToDefaultData}
      />

      {/* 5. User Authentication & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        parishes={parishes}
        onLogin={login}
        onQuickLogin={quickLogin}
        onLogout={logout}
        onRegisterUser={registerUser}
        onOpenParishManager={() => {
          setIsAuthModalOpen(false);
          setIsParishManagerOpen(true);
        }}
      />

      {/* 6. Multi-Parish Manager Modal (Admin Full Control & View all) */}
      <ParishManagerModal
        isOpen={isParishManagerOpen}
        onClose={() => setIsParishManagerOpen(false)}
        parishes={parishes}
        activeParishId={activeParishId}
        currentUser={currentUser}
        onSwitchParish={switchParish}
        onCreateParish={createParish}
        onUpdateParish={updateParish}
        onDeleteParish={deleteParish}
      />
    </div>
  );
}
