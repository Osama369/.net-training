
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Data.Entity.Infrastructure;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using eMaestroD.Api.Common;
using eMaestroD.Api.Models;

namespace eMaestroD.Api.Data
{
    public class AMDbContext : IdentityDbContext<RegisterBindingModel>
    {
        public AMDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<ReportSettings> ReportSettings { get; set; }
        public DbSet<Dashboard> Dashboard { get; set; }
        public DbSet<Tenants> Tenants { get; set; }
        public DbSet<Locations> Locations { get; set; }
        public DbSet<Currency> Currency { get; set; }
        public DbSet<FiscalYear> FiscalYear { get; set; }
        public DbSet<Employees> Employees { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProdGroups> ProdGroups { get; set; }
        public DbSet<StockList> StockList { get; set; }
        public DbSet<DailyInvoice> DailyInvoice { get; set; }
        public DbSet<invoiceNo> invoiceNo { get; set; }
        public DbSet<Stock> Stock { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Companies> Companies { get; set; }
        public DbSet<Vendors> Vendors { get; set; }
        public DbSet<ProductBarCodes> ProductBarCodes { get; set; }
        public DbSet<GL> gl { get; set; }
        public DbSet<GLTxLinks> GLTxLinks { get; set; }
        public DbSet<COA> COA { get; set; }
        public DbSet<Screens> Screens { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<Authorizations> Authorizations { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<UserCompanies> UserCompanies { get; set; }
        public DbSet<SaleDelivery> SaleDelivery { get; set; }
        public DbSet<invoices> invoices { get; set; }
        public DbSet<journalVoucher> journalVoucher { get; set; }
        public DbSet<Taxes> Taxes { get; set; }
        public DbSet<Tax> Tax { get; set; }
        public DbSet<TaxSummary> TaxSummary { get; set; }
        public DbSet<StockSaleAndReturn> StockSaleAndReturn { get; set; }
        public DbSet<StockStatusCumulativeValuation> StockStatusCumulativeValuation { get; set; }
        public DbSet<ItemLedger> ItemLedger { get; set; }
        public DbSet<ItemWiseProfit> ItemWiseProfit { get; set; }
        public DbSet<AdvancedSearch> AdvancedSearch { get; set; }
        public DbSet<BankBook> BankBook { get; set; }
        public DbSet<CashBook> CashBook { get; set; }
        public DbSet<CashRegister> CashRegister { get; set; }
        public DbSet<PartyLedger> PartyLedger { get; set; }
        public DbSet<VendorLedger> VendorLedger { get; set; }
        public DbSet<GeneralLedger> GeneralLedger { get; set; }
        public DbSet<ProfitAndLoss> ProfitAndLoss { get; set; }
        public DbSet<TrialBalance> TrialBalance { get; set; }
        public DbSet<BalanceSheet> BalanceSheet { get; set; }
        public DbSet<SaleHistory> SaleHistory { get; set; }
        public DbSet<voucherDetail> voucherDetail { get; set; }
        public DbSet<generalJournal> generalJournal { get; set; }
        public DbSet<Settings> Settings { get; set; }
        public DbSet<EmailMessage> EmailMessage { get; set; }
        public DbSet<EmailTemplates> EmailTemplates { get; set; }
        public DbSet<NotificationAlert> NotificaitonAlert { get; set; }
        public DbSet<NotificationMessage> NotificationMessage { get; set; }
        public DbSet<AuditLogs> AuditLogs { get; set; }
        public DbSet<FiscalBalances> FiscalBalances { get; set; }
        public DbSet<AccountsReceivable> AccountsReceivable { get; set; }
        public DbSet<StockStatus> StockStatus { get; set; }
        public DbSet<Bank> Banks { get; set; }
        public DbSet<CreditCard> CreditCards { get; set; }
        public DbSet<InvoiceReportSettings> InvoiceReportSettings { get; set; }
        public DbSet<MonthlySales> MonthlySales { get; set; }
        public DbSet<TimeZones> TimeZone { get; set; }
        public DbSet<InvoiceWiseProfit> InvoiceWiseProfit { get; set; }
        public DbSet<DayBook> DayBook { get; set; }
        public DbSet<InvoiceView> InvoiceView { get; set; }
        public DbSet<SalesSummary> SalesSummary { get; set; }
        public DbSet<TenantUser> TenantUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<AdvancedSearch>().HasNoKey();
            modelBuilder.Entity<journalVoucher>().HasNoKey();
            modelBuilder.Entity<SaleDelivery>().HasNoKey();
            modelBuilder.Entity<invoices>().HasNoKey();
            modelBuilder.Entity<StockSaleAndReturn>().HasNoKey();
            modelBuilder.Entity<StockStatusCumulativeValuation>().HasNoKey();
            modelBuilder.Entity<ItemLedger>().HasNoKey();
            modelBuilder.Entity<BankBook>().HasNoKey();
            modelBuilder.Entity<CashBook>().HasNoKey();
            modelBuilder.Entity<CashRegister>().HasNoKey();
            modelBuilder.Entity<PartyLedger>().HasNoKey();
            modelBuilder.Entity<VendorLedger>().HasNoKey();
            modelBuilder.Entity<GeneralLedger>().HasNoKey();
            modelBuilder.Entity<ItemWiseProfit>().HasNoKey();
            modelBuilder.Entity<ProfitAndLoss>().HasNoKey();
            modelBuilder.Entity<SaleHistory>().HasNoKey();
            modelBuilder.Entity<DailyInvoice>().HasNoKey();
            modelBuilder.Entity<Tax>().HasNoKey();
            modelBuilder.Entity<TaxSummary>().HasNoKey();
            modelBuilder.Entity<Dashboard>().HasNoKey();
            modelBuilder.Entity<TrialBalance>().HasNoKey();
            modelBuilder.Entity<BalanceSheet>().HasNoKey();
            modelBuilder.Entity<voucherDetail>().HasNoKey();
            modelBuilder.Entity<generalJournal>().HasNoKey();
            modelBuilder.Entity<AccountsReceivable>().HasNoKey();
            modelBuilder.Entity<StockStatus>().HasNoKey();
            modelBuilder.Entity<MonthlySales>().HasNoKey();
            modelBuilder.Entity<InvoiceWiseProfit>().HasNoKey();
            modelBuilder.Entity<DayBook>().HasNoKey();
            modelBuilder.Entity<InvoiceView>().HasNoKey();
            modelBuilder.Entity<SalesSummary>().HasNoKey();
        }

    }
}
