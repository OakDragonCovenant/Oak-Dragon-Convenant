// Modules/assistantRegistry.js
PropertyScout: require('./propertyScoutAssistant'),
module.exports = {
  // 🧪 Research & Analysis
  DeepResearch: require('./deepResearchAssistant'),
  CompsScan: require('./compsResearchAssistant'),
  EconomicTrend: require('./economicTrendAssistant'),
  IncomeProjection: require('./incomeProjectionAssistant'),
  Refinance: require('./refinanceAssistant'),
  AppreciationForecast: require('./appreciationForecastAssistant'),
  CapRate: require('./capRateAssistant'),
  MarketSignal: require('./marketSignalAssistant'),

  // 📑 Documentation & Structuring
  LegalParse: require('./legalAssistant'),
  LeaseDesign: require('./leaseDesignAssistant'),
  EntityDesign: require('./legacyStructuringAssistant'),
  Reporting: require('./reportingAssistant'),
  OwnershipTrace: require('./ownershipTraceAssistant'),
  TransferHandler: require('./transferHandlerAssistant'),

  // 🔨 Renovation & Build
  RenovationCost: require('./renovationCostAssistant'),
  ContractorFinder: require('./contractorFinderAssistant'),
  DesignPalette: require('./designPaletteAssistant'),
  DealAudit: require('./dealAuditAssistant'),

  // 💸 Leasing & Cash Flow
  LeaseBuilder: require('./leaseBuilderAssistant'),
  TenantScreen: require('./tenantScreenAssistant'),
  RentMatrix: require('./rentMatrixAssistant'),
  CashFlowProjection: require('./cashFlowProjectionAssistant'),

  // 🔁 Refinance & Scaling
  EquityExtract: require('./equityExtractAssistant'),
  LenderComparison: require('./lenderComparisonAssistant'),
  ScalingLoop: require('./scalingLoopAssistant'),
  RiskMatrix: require('./riskMatrixAssistant'),

  // 🏢 Exit & Commercial Strategy
  ExitStrategy: require('./exitStrategyAssistant'),
  BuyerPool: require('./buyerPoolAssistant'),
  CommercialLease: require('./commercialLeaseAssistant'),
  ValuationTrend: require('./valuationTrendAssistant'),

  // 💰 Creative Financing
  SellerFinance: require('./sellerFinanceAssistant'),
  SubjectTo: require('./subjectToAssistant'),
  LeaseOption: require('./leaseOptionAssistant'),
  PrivateLender: require('./privateLenderAssistant'),
  HardMoney: require('./hardMoneyAssistant'),
  OwnerCarry: require('./ownerCarryAssistant'),

  // 🛒 Ecommerce Operations
  StoreBuilder: require('./storeBuilderAssistant'),
  ProductResearch: require('./productResearchAssistant'),
  InventoryLogic: require('./inventoryLogicAssistant'),
  CheckoutFlow: require('./checkoutFlowAssistant'),
  AdStrategy: require('./adStrategyAssistant'),
  CustomerSupport: require('./customerSupportAssistant'),

  // 🏦 Self-Banking & Financial Structure
  IBCDesign: require('./IBCDesignAssistant'),
  EquityVelocity: require('./equityVelocityAssistant'),
  CashReservePlanner: require('./cashReservePlannerAssistant'),
  PolicyAnalysis: require('./policyAnalysisAssistant'),
  BankStructure: require('./bankStructureAssistant'),

  // 🛡️ Private Insurance Systems
  AssetProtection: require('./assetProtectionAssistant'),
  PolicyLayering: require('./policyLayeringAssistant'),
  ClaimScenario: require('./claimScenarioAssistant'),
  RiskUnderwriting: require('./riskUnderwritingAssistant'),

  // ⚖️ Legal Department
  ContractDrafting: require('./contractDraftingAssistant'),
  EntityCompliance: require('./entityComplianceAssistant'),
  RegulatoryAudit: require('./regulatoryAuditAssistant'),
  DisputeResolution: require('./disputeResolutionAssistant'),

  // 🛡️ Security Department
  DigitalVault: require('./digitalVaultAssistant'),
  NetworkShield: require('./networkShieldAssistant'),
  PhysicalAssetGuard: require('./physicalAssetGuardAssistant'),
  AccessControl: require('./accessControlAssistant'),
  SurveillanceReview: require('./surveillanceReviewAssistant')
};