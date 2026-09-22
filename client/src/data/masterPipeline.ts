import { Scenario } from '../types';

export interface MasterDomainOption {
  id: 'flowshop-tr' | 'flowshop-de' | 'all';
  name: string;
  domain: string;
  flag: string;
  badge: string;
  baseUrl: string;
}

export const MASTER_DOMAINS: MasterDomainOption[] = [
  {
    id: 'flowshop-tr',
    name: 'FlowShop TR (Mock Store)',
    domain: 'flowshop-tr.mock',
    flag: '🇹🇷',
    badge: 'TRY (₺) • Mock Store',
    baseUrl: 'https://flowshop-tr.mock'
  },
  {
    id: 'flowshop-de',
    name: 'FlowShop DE (Mock Store)',
    domain: 'flowshop-de.mock',
    flag: '🇩🇪',
    badge: 'EUR (€) • Mock Store',
    baseUrl: 'https://flowshop-de.mock'
  },
  {
    id: 'all',
    name: 'FlowShop Global (Multi-Store Mock)',
    domain: 'Global E2E (TR & DE Mock)',
    flag: '🌐',
    badge: 'Multi-Store Comparison',
    baseUrl: 'https://flowshop-tr.mock / https://flowshop-de.mock'
  }
];

// 1. FlowShop TR Master Pipeline (Spacious layout, Turkey-specific flows & real TR screenshots)
export const MASTER_PIPELINE_FLOWSHOP_TR: Scenario = {
  id: 'master-pipeline-flowshop-tr',
  title: 'FlowShop TR (flowshop-tr.mock) - Master Pipeline',
  category: 'Bütünleşik Master Mimari',
  categories: ['Temel Dönüşüm (Checkout)', 'Ödeme & Güvenlik', 'Lojistik & Kargo', 'Siber Güvenlik & PCI-DSS'],
  description: 'FlowShop Türkiye mock storefront end-to-end testing cycle from catalog exploration, sound profile filter, cart promo discount, to checkout and delivery assertions.',
  criticality: 'Critical',
  componentsCount: 12,
  lastRunDuration: '24.2s',
  status: 'passed',
  targetUrl: 'https://flowshop-tr.mock',
  nodes: [
    {
      id: 'node-mp-tr-init',
      type: 'terminatorNode',
      position: { x: 520, y: 40 },
      data: {
        label: 'FlowShop TR Test Initializer',
        subtext: 'Playwright E2E Runner (flowshop-tr.mock)',
        status: 'passed',
        isStart: true
      }
    },
    {
      id: 'node-mp-tr-storefront',
      type: 'flowStepNode',
      position: { x: 520, y: 240 },
      data: {
        stepIndex: 1,
        name: 'Storefront & KVKK Çerez İzni',
        subtext: 'OneTrust KVKK Aydınlatma Metni, TRY (₺) & TLS 1.3 Güvenlik',
        components: 12,
        metricTime: '1.1s',
        metricPassed: 38,
        metricAutomated: 38,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/flowshop_home_live.png'
      }
    },
    // Branch 1: Search
    {
      id: 'node-mp-tr-search',
      type: 'flowStepNode',
      position: { x: 140, y: 650 },
      data: {
        stepIndex: 2,
        name: 'FlowShop Akıllı Arama & Fuzzy Search',
        subtext: 'Studio Wireless, ANC Pro, Active Sound ve sıfır sonuç önleme',
        components: 9,
        metricTime: '0.8s',
        metricPassed: 27,
        metricAutomated: 27,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/flowshop_de_search_live.png'
      }
    },
    // Branch 2: Category PLP
    {
      id: 'node-mp-tr-plp',
      type: 'flowStepNode',
      position: { x: 900, y: 650 },
      data: {
        stepIndex: 3,
        name: 'Ses ve Kulaklık Ekipmanları Kataloğu (PLP)',
        subtext: 'ANC Kulaklık, Hi-Fi, Fiyat aralığı ve sıralama motoru',
        components: 14,
        metricTime: '1.0s',
        metricPassed: 32,
        metricAutomated: 32,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/flowshop_category.png'
      }
    },
    // Convergence: PDP & Configurator
    {
      id: 'node-mp-tr-config',
      type: 'flowStepNode',
      position: { x: 520, y: 970 },
      data: {
        stepIndex: 4,
        name: 'FlowShop Studio Wireless HD Konfigüratörü',
        subtext: 'Midnight Black, Aktif Gürültü Engelleme, Canlı Stok Kontrolü',
        components: 16,
        metricTime: '1.3s',
        metricPassed: 44,
        metricAutomated: 44,
        isAutomated: true,
        status: 'passed',
        previewType: 'pdp',
        screenshot: '/screenshots/flowshop_pdp.png'
      }
    },
    // Cart & Promotion
    {
      id: 'node-mp-tr-cart',
      type: 'flowStepNode',
      position: { x: 520, y: 1390 },
      data: {
        stepIndex: 5,
        name: 'FlowShop Sepet & Kupon İndirim Matrisi',
        subtext: 'SAVE20 kupon kodu, ₺500 üzeri Ücretsiz Kargo Barı & Çapraz Satış',
        components: 11,
        metricTime: '0.9s',
        metricPassed: 30,
        metricAutomated: 30,
        isAutomated: true,
        status: 'passed',
        previewType: 'cart',
        screenshot: '/screenshots/flowshop_cart_live.png'
      }
    },
    // Checkout: User Auth or Guest
    {
      id: 'node-mp-tr-auth',
      type: 'flowStepNode',
      position: { x: 140, y: 1810 },
      data: {
        stepIndex: 6,
        name: 'FlowShop Üye Girişi & Adres Kasası',
        subtext: 'Kayıtlı teslimat adresi veya şifresiz hızlı misafir alışverişi',
        components: 8,
        metricTime: '0.8s',
        metricPassed: 24,
        metricAutomated: 24,
        isAutomated: true,
        status: 'passed',
        previewType: 'checkout'
      }
    },
    // Tax & Corporate Invoice
    {
      id: 'node-mp-tr-invoice',
      type: 'flowStepNode',
      position: { x: 900, y: 1810 },
      data: {
        stepIndex: 7,
        name: 'Kurumsal E-Fatura, VKN & Vergi Dairesi',
        subtext: '%20 KDV matrahı, 10 haneli VKN algoritması ve e-fatura sorgusu',
        components: 10,
        metricTime: '1.0s',
        metricPassed: 28,
        metricAutomated: 28,
        isAutomated: true,
        status: 'passed',
        previewType: 'checkout'
      }
    },
    // Payment Gateway & Security
    {
      id: 'node-mp-tr-pay',
      type: 'flowStepNode',
      position: { x: 520, y: 2130 },
      data: {
        stepIndex: 8,
        name: '3D Secure 2.0 & Peşin Fiyatına Taksit',
        subtext: 'BKM Express, Garanti/İş Bankası 6 taksit & PCI-DSS siber koruma',
        components: 20,
        metricTime: '1.9s',
        metricPassed: 56,
        metricAutomated: 56,
        isAutomated: true,
        status: 'passed',
        previewType: 'payment',
        screenshot: '/screenshots/flowshop_checkout_live.png'
      }
    },
    // Logistics & Fulfillment
    {
      id: 'node-mp-tr-logistics',
      type: 'flowStepNode',
      position: { x: 140, y: 2550 },
      data: {
        stepIndex: 9,
        name: 'Yurtiçi Kargo & Kolay Gelsin Entegrasyonu',
        subtext: 'Takip barkodu üretimi, randevulu teslimat ve SMS bilgilendirme',
        components: 7,
        metricTime: '0.9s',
        metricPassed: 21,
        metricAutomated: 21,
        isAutomated: true,
        status: 'passed',
        previewType: 'checkout'
      }
    },
    // Post-Purchase & Returns
    {
      id: 'node-mp-tr-postpurchase',
      type: 'flowStepNode',
      position: { x: 900, y: 2550 },
      data: {
        stepIndex: 10,
        name: 'Sipariş Onayı, E-Arşiv Fatura & 14 Gün Kolay İade',
        subtext: 'PDF E-Arşiv fatura, SMS onay kodu & MNG/Yurtiçi RMA iade kodu',
        components: 9,
        metricTime: '1.1s',
        metricPassed: 26,
        metricAutomated: 26,
        isAutomated: true,
        status: 'passed',
        previewType: 'confirmation'
      }
    },
    // Finalization Terminator
    {
      id: 'node-mp-tr-end',
      type: 'terminatorNode',
      position: { x: 520, y: 2870 },
      data: {
        label: 'FlowShop TR Master Pipeline Tamamlandı',
        subtext: 'Tüm Türkiye Otomasyon Fazları Doğrulandı (%100 Başarılı)',
        status: 'passed',
        isEnd: true
      }
    }
  ],
  edges: [
    { id: 'e-tr-1', source: 'node-mp-tr-init', target: 'node-mp-tr-storefront', label: 'Storefront Handshake', animated: true },
    { id: 'e-tr-2a', source: 'node-mp-tr-storefront', target: 'node-mp-tr-search', label: 'Query Search Pipeline', animated: true },
    { id: 'e-tr-2b', source: 'node-mp-tr-storefront', target: 'node-mp-tr-plp', label: 'Browse Category Catalog', animated: true },
    { id: 'e-tr-3a', source: 'node-mp-tr-search', target: 'node-mp-tr-config', label: 'Select Audio PDP', animated: true },
    { id: 'e-tr-3b', source: 'node-mp-tr-plp', target: 'node-mp-tr-config', label: 'Select Configured Model', animated: true },
    { id: 'e-tr-4', source: 'node-mp-tr-config', target: 'node-mp-tr-cart', label: 'Add Custom Build to Cart', animated: true },
    { id: 'e-tr-5a', source: 'node-mp-tr-cart', target: 'node-mp-tr-auth', label: 'Proceed as Member / Guest', animated: true },
    { id: 'e-tr-5b', source: 'node-mp-tr-cart', target: 'node-mp-tr-invoice', label: 'Corporate / VAT Invoicing', animated: true },
    { id: 'e-tr-6a', source: 'node-mp-tr-auth', target: 'node-mp-tr-pay', label: 'Address Validated', animated: true },
    { id: 'e-tr-6b', source: 'node-mp-tr-invoice', target: 'node-mp-tr-pay', label: 'Tax Calculations Locked', animated: true },
    { id: 'e-tr-7a', source: 'node-mp-tr-pay', target: 'node-mp-tr-logistics', label: 'Payment Captured & Verified', animated: true },
    { id: 'e-tr-7b', source: 'node-mp-tr-pay', target: 'node-mp-tr-postpurchase', label: 'Dispatch Order Confirmation', animated: true },
    { id: 'e-tr-8a', source: 'node-mp-tr-logistics', target: 'node-mp-tr-end', label: 'Waybill & Delivery Confirmed', animated: true },
    { id: 'e-tr-8b', source: 'node-mp-tr-postpurchase', target: 'node-mp-tr-end', label: 'Post-Sale Lifecycle Ready', animated: true }
  ]
};

// 2. FlowShop DE Master Pipeline (Spacious layout, Germany/EU-specific flows & authentic DE live screenshots)
export const MASTER_PIPELINE_FLOWSHOP_DE: Scenario = {
  id: 'master-pipeline-flowshop-de',
  title: 'FlowShop DE (flowshop-de.mock) - Master Pipeline',
  category: 'Bütünleşik Master Mimari',
  categories: ['Temel Dönüşüm (Checkout)', 'Ödeme & Güvenlik', 'Lojistik & Kargo', 'Siber Güvenlik & PCI-DSS'],
  description: 'FlowShop Almanya ve Avrupa Birliği mock e-ticaret platformunda Cookiebot/DSGVO çerez izninden Almanca ses ekipmanları araması, Hi-Fi ANC kulaklıklar, SAVE20 kuponu, €100 kostenlose Lieferung, Klarna/PayPal ve DHL Packstation teslimatına kadar Avrupa odaklı otomasyon döngüsü.',
  criticality: 'Critical',
  componentsCount: 12,
  lastRunDuration: '26.8s',
  status: 'passed',
  targetUrl: 'https://flowshop-de.mock',
  nodes: [
    {
      id: 'node-tde-init',
      type: 'terminatorNode',
      position: { x: 520, y: 40 },
      data: {
        label: 'FlowShop DE DACH/EU Test Initializer',
        subtext: 'Playwright Browser Session (flowshop-de.mock)',
        status: 'passed',
        isStart: true
      }
    },
    {
      id: 'node-tde-storefront',
      type: 'flowStepNode',
      position: { x: 520, y: 240 },
      data: {
        stepIndex: 1,
        name: 'Storefront, GeoIP & Cookiebot (DSGVO)',
        subtext: 'Cookiebot Consent Akzeptieren, EUR (€) & TLS 1.3 Handshake',
        components: 12,
        metricTime: '1.2s',
        metricPassed: 38,
        metricAutomated: 38,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/flowshop_de_home_live.png'
      }
    },
    // Branch 1: Search
    {
      id: 'node-tde-search',
      type: 'flowStepNode',
      position: { x: 140, y: 650 },
      data: {
        stepIndex: 2,
        name: 'FlowShop Suche & Autocomplete Engine',
        subtext: "Almanca 'FlowShop Kopfhörer' arama sorgusu, ANC önerileri",
        components: 9,
        metricTime: '0.8s',
        metricPassed: 27,
        metricAutomated: 27,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/flowshop_de_search_live.png'
      }
    },
    // Branch 2: Category PLP
    {
      id: 'node-tde-plp',
      type: 'flowStepNode',
      position: { x: 900, y: 650 },
      data: {
        stepIndex: 3,
        name: 'Audio & Kopfhörer PLP & Filter Drawer',
        subtext: 'Studio Wireless, ANC Pro, Sortieren: FlowShop Empfehlung & Auf Lager',
        components: 14,
        metricTime: '1.1s',
        metricPassed: 32,
        metricAutomated: 32,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/flowshop_de_plp_live.png'
      }
    },
    // Convergence: PDP & Configurator
    {
      id: 'node-tde-pdp',
      type: 'flowStepNode',
      position: { x: 520, y: 970 },
      data: {
        stepIndex: 4,
        name: 'FlowShop Studio Wireless Kopfhörer PDP',
        subtext: '149,00 € (inkl. MwSt.), 20,00 € Rabatt, Bluetooth 5.3 & ANC',
        components: 16,
        metricTime: '1.4s',
        metricPassed: 44,
        metricAutomated: 44,
        isAutomated: true,
        status: 'passed',
        previewType: 'pdp',
        screenshot: '/screenshots/flowshop_de_pdp_live.png'
      }
    },
    // Cart & Promotion
    {
      id: 'node-tde-cart',
      type: 'flowStepNode',
      position: { x: 520, y: 1390 },
      data: {
        stepIndex: 5,
        name: 'FlowShop Warenkorb & Gutschein-Matrix',
        subtext: 'Warenkorb Validierung, SAVE20 Gutschein & Versandkostenfrei ab €100',
        components: 11,
        metricTime: '0.9s',
        metricPassed: 30,
        metricAutomated: 30,
        isAutomated: true,
        status: 'passed',
        previewType: 'cart',
        screenshot: '/screenshots/flowshop_de_cart_live.png'
      }
    },
    // Checkout: User Auth or Guest
    {
      id: 'node-tde-auth',
      type: 'flowStepNode',
      position: { x: 140, y: 1810 },
      data: {
        stepIndex: 6,
        name: 'FlowShop DACH Kundenkonto & Gast-Checkout',
        subtext: 'Kunden-Login mit 2FA oder Express-Kauf ohne Registrierung',
        components: 8,
        metricTime: '0.8s',
        metricPassed: 24,
        metricAutomated: 24,
        isAutomated: true,
        status: 'passed',
        previewType: 'checkout',
        screenshot: '/screenshots/flowshop_de_auth_live.png'
      }
    },
    // Tax & Corporate Invoice (EU B2B)
    {
      id: 'node-tde-tax',
      type: 'flowStepNode',
      position: { x: 900, y: 1810 },
      data: {
        stepIndex: 7,
        name: 'EU USt-IdNr Validierung (VIES API & 19% MwSt.)',
        subtext: 'Bundeszentralamt für Steuern VIES Abfrage, B2B Reverse Charge Validierung',
        components: 10,
        metricTime: '1.2s',
        metricPassed: 28,
        metricAutomated: 28,
        isAutomated: true,
        status: 'passed',
        previewType: 'checkout'
      }
    },
    // Payment Gateway & Security (Klarna & PayPal)
    {
      id: 'node-tde-pay',
      type: 'flowStepNode',
      position: { x: 520, y: 2130 },
      data: {
        stepIndex: 8,
        name: 'Klarna Sofort, PayPal Express & 3DS2 SCA',
        subtext: 'PSD2 Richtlinie SCA 2-Faktor, Klarna Ratenkauf & Käuferschutz Garantie',
        components: 20,
        metricTime: '2.0s',
        metricPassed: 56,
        metricAutomated: 56,
        isAutomated: true,
        status: 'passed',
        previewType: 'payment',
        screenshot: '/screenshots/flowshop_de_checkout_live.png'
      }
    },
    // Logistics & DHL Packstation
    {
      id: 'node-tde-logistics',
      type: 'flowStepNode',
      position: { x: 140, y: 2550 },
      data: {
        stepIndex: 9,
        name: 'DHL Paket API, Packstation 24/7 & GoGreen',
        subtext: 'Postnummer & Packstation 102 Validierung, Tracking-Nummer Generierung',
        components: 7,
        metricTime: '1.0s',
        metricPassed: 21,
        metricAutomated: 21,
        isAutomated: true,
        status: 'passed',
        previewType: 'checkout'
      }
    },
    // Post-Purchase & German RMA
    {
      id: 'node-tde-postpurchase',
      type: 'flowStepNode',
      position: { x: 900, y: 2550 },
      data: {
        stepIndex: 10,
        name: 'Bestellbestätigung, Widerrufsrecht & RMA Retoure',
        subtext: 'Rechnung PDF per E-Mail, 30 Tage Rückgaberecht & DHL Retourenlabel QR-Code',
        components: 9,
        metricTime: '1.1s',
        metricPassed: 26,
        metricAutomated: 26,
        isAutomated: true,
        status: 'passed',
        previewType: 'confirmation',
        screenshot: '/screenshots/flowshop_de_rma_live.png'
      }
    },
    // Finalization Terminator
    {
      id: 'node-tde-end',
      type: 'terminatorNode',
      position: { x: 520, y: 2870 },
      data: {
        label: 'FlowShop DE Master Pipeline Tamamlandı',
        subtext: 'Alle DACH/EU-Phasen erfolgreich validiert (100% Passed)',
        status: 'passed',
        isEnd: true
      }
    }
  ],
  edges: [
    { id: 'e-de-1', source: 'node-tde-init', target: 'node-tde-storefront', label: 'Storefront Handshake', animated: true },
    { id: 'e-de-2a', source: 'node-tde-storefront', target: 'node-tde-search', label: 'Query Search Pipeline', animated: true },
    { id: 'e-de-2b', source: 'node-tde-storefront', target: 'node-tde-plp', label: 'Browse Category Catalog', animated: true },
    { id: 'e-de-3a', source: 'node-tde-search', target: 'node-tde-pdp', label: 'Select Audio Model', animated: true },
    { id: 'e-de-3b', source: 'node-tde-plp', target: 'node-tde-pdp', label: 'Select Catalog Product', animated: true },
    { id: 'e-de-4', source: 'node-tde-pdp', target: 'node-tde-cart', label: 'Add to Cart (€)', animated: true },
    { id: 'e-de-5a', source: 'node-tde-cart', target: 'node-tde-auth', label: 'DACH Customer Session', animated: true },
    { id: 'e-de-5b', source: 'node-tde-cart', target: 'node-tde-tax', label: 'B2B MwSt. Verification', animated: true },
    { id: 'e-de-6a', source: 'node-tde-auth', target: 'node-tde-pay', label: 'Address & SCA Validated', animated: true },
    { id: 'e-de-6b', source: 'node-tde-tax', target: 'node-tde-pay', label: 'VAT Tax Computed', animated: true },
    { id: 'e-de-7a', source: 'node-tde-pay', target: 'node-tde-logistics', label: 'Klarna / PayPal Captured', animated: true },
    { id: 'e-de-7b', source: 'node-tde-pay', target: 'node-tde-postpurchase', label: 'Emit Order & Invoice', animated: true },
    { id: 'e-de-8a', source: 'node-tde-logistics', target: 'node-tde-end', label: 'DHL Tracking Generated', animated: true },
    { id: 'e-de-8b', source: 'node-tde-postpurchase', target: 'node-tde-end', label: 'EU Post-Sale Lifecycle OK', animated: true }
  ]
};

// 3. Global Multi-Store Master Pipeline (Parallel Dual-Engine: TR Store vs. DE Store Side-by-Side)
export const MASTER_PIPELINE_GLOBAL: Scenario = {
  id: 'master-pipeline-global',
  title: 'Global E-Ticaret Master Pipeline (Tüm Mağazalar & Pazarlar)',
  category: 'Bütünleşik Master Mimari',
  categories: ['Temel Dönüşüm (Checkout)', 'Ödeme & Güvenlik', 'Lojistik & Kargo', 'Siber Güvenlik & PCI-DSS'],
  description: 'FlowShop Türkiye (TRY ₺, KVKK, 3DS) ve FlowShop Deutschland (EUR €, DSGVO, Klarna/DHL) platformlarının paralel dual-engine karşılaştırmalı uçtan uca otomasyon döngüsü.',
  criticality: 'Critical',
  componentsCount: 12,
  lastRunDuration: '31.5s',
  status: 'passed',
  targetUrl: 'https://flowshop-tr.mock / https://flowshop-de.mock',
  nodes: [
    {
      id: 'node-gbl-init',
      type: 'terminatorNode',
      position: { x: 520, y: 40 },
      data: {
        label: 'Global Multi-Store Orchestrator',
        subtext: 'Bütünleşik Dual-Engine (TR: ₺ & DE: €)',
        status: 'passed',
        isStart: true
      }
    },
    // Level 1: Storefronts side-by-side
    {
      id: 'node-gbl-tr-store',
      type: 'flowStepNode',
      position: { x: 160, y: 260 },
      data: {
        stepIndex: 1,
        name: '🇹🇷 FlowShop TR Storefront & KVKK',
        subtext: 'flowshop-tr.mock, TRY (₺), KVKK & SSL 1.3',
        components: 12,
        metricTime: '1.1s',
        metricPassed: 38,
        metricAutomated: 38,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/flowshop_home_live.png'
      }
    },
    {
      id: 'node-gbl-de-store',
      type: 'flowStepNode',
      position: { x: 880, y: 260 },
      data: {
        stepIndex: 2,
        name: '🇩🇪 FlowShop DE Storefront & Cookiebot',
        subtext: 'flowshop-de.mock, EUR (€), DSGVO & Cookiebot Consent',
        components: 12,
        metricTime: '1.2s',
        metricPassed: 38,
        metricAutomated: 38,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/flowshop_de_home_live.png'
      }
    },
    // Level 2: Catalogs side-by-side
    {
      id: 'node-gbl-tr-catalog',
      type: 'flowStepNode',
      position: { x: 160, y: 680 },
      data: {
        stepIndex: 3,
        name: '🇹🇷 FlowShop TR Ses Ekipmanları',
        subtext: '/audio-gear, ANC Kulaklık, Peşin Fiyatına 6 Taksit',
        components: 14,
        metricTime: '1.0s',
        metricPassed: 32,
        metricAutomated: 32,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/flowshop_category.png'
      }
    },
    {
      id: 'node-gbl-de-catalog',
      type: 'flowStepNode',
      position: { x: 880, y: 680 },
      data: {
        stepIndex: 4,
        name: '🇩🇪 FlowShop DE Audio & Kopfhörer PLP',
        subtext: '/audio-gear/, Studio Wireless Serie, Auf Lager Filter',
        components: 14,
        metricTime: '1.1s',
        metricPassed: 32,
        metricAutomated: 32,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/flowshop_de_plp_live.png'
      }
    },
    // Level 3: PDPs side-by-side
    {
      id: 'node-gbl-tr-pdp',
      type: 'flowStepNode',
      position: { x: 160, y: 1100 },
      data: {
        stepIndex: 5,
        name: '🇹🇷 FlowShop Studio Wireless PDP (₺)',
        subtext: 'Midnight Black, Aktif Gürültü Engelleme, Canlı Stok Kontrolü',
        components: 16,
        metricTime: '1.3s',
        metricPassed: 44,
        metricAutomated: 44,
        isAutomated: true,
        status: 'passed',
        previewType: 'pdp',
        screenshot: '/screenshots/flowshop_pdp.png'
      }
    },
    {
      id: 'node-gbl-de-pdp',
      type: 'flowStepNode',
      position: { x: 880, y: 1100 },
      data: {
        stepIndex: 6,
        name: '🇩🇪 FlowShop Studio Wireless PDP (149€)',
        subtext: 'ANC Pro, 20€ Rabatt, Konfigurieren & Kaufen',
        components: 16,
        metricTime: '1.4s',
        metricPassed: 44,
        metricAutomated: 44,
        isAutomated: true,
        status: 'passed',
        previewType: 'pdp',
        screenshot: '/screenshots/flowshop_de_pdp_live.png'
      }
    },
    // Level 4: Checkout side-by-side
    {
      id: 'node-gbl-tr-checkout',
      type: 'flowStepNode',
      position: { x: 160, y: 1520 },
      data: {
        stepIndex: 7,
        name: '🇹🇷 TR 3D Secure & Yurtiçi Kargo',
        subtext: 'BKM Express, Garanti/İş Bankası Taksit, Yurtiçi Kargo API',
        components: 20,
        metricTime: '2.0s',
        metricPassed: 56,
        metricAutomated: 56,
        isAutomated: true,
        status: 'passed',
        previewType: 'checkout',
        screenshot: '/screenshots/flowshop_checkout_live.png'
      }
    },
    {
      id: 'node-gbl-de-checkout',
      type: 'flowStepNode',
      position: { x: 880, y: 1520 },
      data: {
        stepIndex: 8,
        name: '🇩🇪 DE Klarna, PayPal & DHL Packstation',
        subtext: 'Klarna Sofort, PSD2 SCA, 19% MwSt., DHL Paket 24/7',
        components: 20,
        metricTime: '2.1s',
        metricPassed: 56,
        metricAutomated: 56,
        isAutomated: true,
        status: 'passed',
        previewType: 'checkout',
        screenshot: '/screenshots/flowshop_de_cart_live.png'
      }
    },
    // Convergence: Central BI & Analytics
    {
      id: 'node-gbl-bi',
      type: 'flowStepNode',
      position: { x: 520, y: 1940 },
      data: {
        stepIndex: 9,
        name: '🌐 Konsolide Çoklu Mağaza BI & QA Denetimi',
        subtext: 'TR & DE Dönüşüm Oranları, Para Birimi Arbitrajı & Hata Logları',
        components: 18,
        metricTime: '1.5s',
        metricPassed: 50,
        metricAutomated: 50,
        isAutomated: true,
        status: 'passed',
        previewType: 'confirmation'
      }
    },
    {
      id: 'node-gbl-end',
      type: 'terminatorNode',
      position: { x: 520, y: 2260 },
      data: {
        label: 'Global Multi-Store Pipeline Tamamlandı',
        subtext: 'Türkiye & Almanya Mağazaları Eşzamanlı Doğrulandı (%100 Pass)',
        status: 'passed',
        isEnd: true
      }
    }
  ],
  edges: [
    { id: 'e-gbl-1a', source: 'node-gbl-init', target: 'node-gbl-tr-store', label: 'Trigger TR Store Pipeline', animated: true },
    { id: 'e-gbl-1b', source: 'node-gbl-init', target: 'node-gbl-de-store', label: 'Trigger DE Store Pipeline', animated: true },
    { id: 'e-gbl-2a', source: 'node-gbl-tr-store', target: 'node-gbl-tr-catalog', label: 'TR Catalog Browsing', animated: true },
    { id: 'e-gbl-2b', source: 'node-gbl-de-store', target: 'node-gbl-de-catalog', label: 'DE Catalog Browsing', animated: true },
    { id: 'e-gbl-3a', source: 'node-gbl-tr-catalog', target: 'node-gbl-tr-pdp', label: 'TR Hardware Config', animated: true },
    { id: 'e-gbl-3b', source: 'node-gbl-de-catalog', target: 'node-gbl-de-pdp', label: 'DE Hardware Config', animated: true },
    { id: 'e-gbl-4a', source: 'node-gbl-tr-pdp', target: 'node-gbl-tr-checkout', label: 'TR 3DS & Delivery', animated: true },
    { id: 'e-gbl-4b', source: 'node-gbl-de-pdp', target: 'node-gbl-de-checkout', label: 'DE Klarna & DHL', animated: true },
    { id: 'e-gbl-5a', source: 'node-gbl-tr-checkout', target: 'node-gbl-bi', label: 'Consolidate TR Telemetry', animated: true },
    { id: 'e-gbl-5b', source: 'node-gbl-de-checkout', target: 'node-gbl-bi', label: 'Consolidate DE Telemetry', animated: true },
    { id: 'e-gbl-6', source: 'node-gbl-bi', target: 'node-gbl-end', label: 'Omnichannel Report Ready', animated: true }
  ]
};

// Default export aliases
export const MASTER_PIPELINE_FLOWSHOP = MASTER_PIPELINE_FLOWSHOP_TR;
export const MASTER_PIPELINE_SCENARIO = MASTER_PIPELINE_FLOWSHOP_TR;

export function getMasterPipeline(domainId: string = 'flowshop-tr'): Scenario {
  if (domainId === 'flowshop-de') {
    return MASTER_PIPELINE_FLOWSHOP_DE;
  }
  if (domainId === 'all') {
    return MASTER_PIPELINE_GLOBAL;
  }
  return MASTER_PIPELINE_FLOWSHOP_TR;
}
