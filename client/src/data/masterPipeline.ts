import { Scenario } from '../types';

export interface MasterDomainOption {
  id: 'novatech-tr' | 'novatech-de' | 'all';
  name: string;
  domain: string;
  flag: string;
  badge: string;
  baseUrl: string;
}

export const MASTER_DOMAINS: MasterDomainOption[] = [
  {
    id: 'novatech-tr',
    name: 'NovaTech Türkiye',
    domain: 'novatech.com.tr',
    flag: '🇹🇷',
    badge: 'TRY (₺) • KVKK',
    baseUrl: 'https://www.novatech.com.tr'
  },
  {
    id: 'novatech-de',
    name: 'NovaTech Deutschland',
    domain: 'novatech.de',
    flag: '🇩🇪',
    badge: 'EUR (€) • DSGVO / MwSt',
    baseUrl: 'https://www.novatech.de'
  },
  {
    id: 'all',
    name: 'Bütünleşik Multi-Store',
    domain: 'Global E2E (TR & DE)',
    flag: '🌐',
    badge: 'Çoklu Mağaza Karşılaştırma',
    baseUrl: 'https://www.novatech.com.tr / https://www.novatech.de'
  }
];

// 1. NovaTech TR Master Pipeline (Spacious layout, Turkey-specific flows & real TR screenshots)
export const MASTER_PIPELINE_NOVATECH_TR: Scenario = {
  id: 'master-pipeline-novatech-tr',
  title: 'NovaTech TR (novatech.com.tr) - Genel Master Pipeline',
  category: 'Bütünleşik Master Mimari',
  categories: ['Temel Dönüşüm (Checkout)', 'Ödeme & Güvenlik', 'Lojistik & Kargo', 'Siber Güvenlik & PCI-DSS'],
  description: 'NovaTech Türkiye mağazasında mağaza açılışından arama motoruna, donanım özelleştirmeden ₺1000 sepet indirimi, üye kasası, Garanti/İş Bankası 3D Secure taksit ve Yurtiçi Kargo teslimatına kadar tam otomatik test döngüsü.',
  criticality: 'Critical',
  componentsCount: 12,
  lastRunDuration: '24.2s',
  status: 'passed',
  targetUrl: 'https://www.novatech.com.tr',
  nodes: [
    {
      id: 'node-mp-tr-init',
      type: 'terminatorNode',
      position: { x: 520, y: 40 },
      data: {
        label: 'NovaTech TR Test Initializer',
        subtext: 'Playwright E2E Motoru (novatech.com.tr)',
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
        screenshot: '/screenshots/novatech_home_live.png'
      }
    },
    // Branch 1: Search
    {
      id: 'node-mp-tr-search',
      type: 'flowStepNode',
      position: { x: 140, y: 650 },
      data: {
        stepIndex: 2,
        name: 'NovaTech Akıllı Arama & Fuzzy Search',
        subtext: 'Horizon, Titan, Apex Pro modelleri ve sıfır sonuç önleme',
        components: 9,
        metricTime: '0.8s',
        metricPassed: 27,
        metricAutomated: 27,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/run-da2f5f7c_node-search.png'
      }
    },
    // Branch 2: Category PLP
    {
      id: 'node-mp-tr-plp',
      type: 'flowStepNode',
      position: { x: 900, y: 650 },
      data: {
        stepIndex: 3,
        name: 'Oyun Bilgisayarları Kataloğu (PLP)',
        subtext: 'RTX 4070, 32GB RAM, Fiyat aralığı ve sıralama motoru',
        components: 14,
        metricTime: '1.0s',
        metricPassed: 32,
        metricAutomated: 32,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/novatech_category.png'
      }
    },
    // Convergence: PDP & Configurator
    {
      id: 'node-mp-tr-config',
      type: 'flowStepNode',
      position: { x: 520, y: 970 },
      data: {
        stepIndex: 4,
        name: 'Horizon X15 V20.8 Donanım Konfigüratörü',
        subtext: '16GB->32GB RAM, 1TB SSD, Türkçe Q Klavye & Canlı Stok Kontrolü',
        components: 16,
        metricTime: '1.3s',
        metricPassed: 44,
        metricAutomated: 44,
        isAutomated: true,
        status: 'passed',
        previewType: 'pdp',
        screenshot: '/screenshots/novatech_pdp.png'
      }
    },
    // Cart & Promotion
    {
      id: 'node-mp-tr-cart',
      type: 'flowStepNode',
      position: { x: 520, y: 1390 },
      data: {
        stepIndex: 5,
        name: 'NovaTech Sepet & Kupon İndirim Matrisi',
        subtext: 'Promosyon kodu, ₺1.000 üzeri Ücretsiz Kargo Barı & Çapraz Satış',
        components: 11,
        metricTime: '0.9s',
        metricPassed: 30,
        metricAutomated: 30,
        isAutomated: true,
        status: 'passed',
        previewType: 'cart',
        screenshot: '/screenshots/novatech_cart_live.png'
      }
    },
    // Checkout: User Auth or Guest
    {
      id: 'node-mp-tr-auth',
      type: 'flowStepNode',
      position: { x: 140, y: 1810 },
      data: {
        stepIndex: 6,
        name: 'NovaTech Üye Girişi & Adres Kasası',
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
        screenshot: '/screenshots/novatech_checkout_live.png'
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
        label: 'NovaTech TR Master Pipeline Tamamlandı',
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
    { id: 'e-tr-3a', source: 'node-mp-tr-search', target: 'node-mp-tr-config', label: 'Select Laptop PDP', animated: true },
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

// 2. NovaTech DE Master Pipeline (Spacious layout, Germany/EU-specific flows & authentic DE live screenshots)
export const MASTER_PIPELINE_NOVATECH_DE: Scenario = {
  id: 'master-pipeline-novatech-de',
  title: 'NovaTech DE (novatech.de) - Genel Master Pipeline',
  category: 'Bütünleşik Master Mimari',
  categories: ['Temel Dönüşüm (Checkout)', 'Ödeme & Güvenlik', 'Lojistik & Kargo', 'Siber Güvenlik & PCI-DSS'],
  description: 'NovaTech Almanya ve Avrupa Birliği e-ticaret platformunda Cookiebot/DSGVO çerez izninden Almanca arama, GeForce RTX 50 PLP, QWERTZ konfigüratör, €100 kostenlose Lieferung, Klarna/PayPal, %19 MwSt. ve DHL Packstation 24/7 teslimatına kadar Avrupa odaklı otomasyon döngüsü.',
  criticality: 'Critical',
  componentsCount: 12,
  lastRunDuration: '26.8s',
  status: 'passed',
  targetUrl: 'https://www.novatech.de',
  nodes: [
    {
      id: 'node-tde-init',
      type: 'terminatorNode',
      position: { x: 520, y: 40 },
      data: {
        label: 'NovaTech DE DACH/EU Test Initializer',
        subtext: 'Playwright Browser Session (novatech.de)',
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
        screenshot: '/screenshots/novatech_de_home_live.png'
      }
    },
    // Branch 1: Search
    {
      id: 'node-tde-search',
      type: 'flowStepNode',
      position: { x: 140, y: 650 },
      data: {
        stepIndex: 2,
        name: 'NovaTech Suche & Autocomplete Engine',
        subtext: "Almanca 'NovaTech' arama sorgusu, RTX 50-serisi önerileri",
        components: 9,
        metricTime: '0.8s',
        metricPassed: 27,
        metricAutomated: 27,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/novatech_de_search_live.png'
      }
    },
    // Branch 2: Category PLP
    {
      id: 'node-tde-plp',
      type: 'flowStepNode',
      position: { x: 900, y: 650 },
      data: {
        stepIndex: 3,
        name: 'Gaming Laptops PLP & Filter Drawer',
        subtext: 'GeForce RTX 5050/5060/5070, Sortieren: NovaTech Wahl & Auf Lager',
        components: 14,
        metricTime: '1.1s',
        metricPassed: 32,
        metricAutomated: 32,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/novatech_de_plp_live.png'
      }
    },
    // Convergence: PDP & Configurator
    {
      id: 'node-tde-pdp',
      type: 'flowStepNode',
      position: { x: 520, y: 970 },
      data: {
        stepIndex: 4,
        name: 'NovaTech Titan X17 Gaming Laptop PDP',
        subtext: '1.089,00 € (inkl. MwSt.), 100,00 € Rabatt, QWERTZ Tastatur Layout',
        components: 16,
        metricTime: '1.4s',
        metricPassed: 44,
        metricAutomated: 44,
        isAutomated: true,
        status: 'passed',
        previewType: 'pdp',
        screenshot: '/screenshots/novatech_de_pdp_live.png'
      }
    },
    // Cart & Promotion
    {
      id: 'node-tde-cart',
      type: 'flowStepNode',
      position: { x: 520, y: 1390 },
      data: {
        stepIndex: 5,
        name: 'Warenkorb & Gutscheincode (€100 Barı)',
        subtext: 'Warenkorb Validierung, NOVATECH-EU-50 Gutschein & Versandkostenfrei ab €100',
        components: 11,
        metricTime: '1.0s',
        metricPassed: 30,
        metricAutomated: 30,
        isAutomated: true,
        status: 'passed',
        previewType: 'cart',
        screenshot: '/screenshots/novatech_de_cart_live.png'
      }
    },
    // Checkout: User Auth or Guest
    {
      id: 'node-tde-auth',
      type: 'flowStepNode',
      position: { x: 140, y: 1810 },
      data: {
        stepIndex: 6,
        name: 'Kundenkonto Login & Gast-Bestellung',
        subtext: 'DSGVO-konforme Gast-Bestellung oder Kundenkonto mit 2FA',
        components: 8,
        metricTime: '0.9s',
        metricPassed: 24,
        metricAutomated: 24,
        isAutomated: true,
        status: 'passed',
        previewType: 'checkout',
        screenshot: '/screenshots/novatech_de_auth_live.png'
      }
    },
    // Tax & Corporate Invoice
    {
      id: 'node-tde-tax',
      type: 'flowStepNode',
      position: { x: 900, y: 1810 },
      data: {
        stepIndex: 7,
        name: '%19 MwSt. & USt-IdNr AB KDV Muafiyeti',
        subtext: 'Deutsche 19% MwSt. Steuerberechnung, VIES B2B Reverse Charge Validierung',
        components: 10,
        metricTime: '1.1s',
        metricPassed: 28,
        metricAutomated: 28,
        isAutomated: true,
        status: 'passed',
        previewType: 'checkout'
      }
    },
    // Payment Gateway & Security
    {
      id: 'node-tde-pay',
      type: 'flowStepNode',
      position: { x: 520, y: 2130 },
      data: {
        stepIndex: 8,
        name: 'Klarna Sofort, PayPal Express & PSD2 SCA 3DS',
        subtext: 'Klarna Ratenkauf/Sofortüberweisung, PayPal Smart Buttons, 3D Secure 2.2',
        components: 20,
        metricTime: '2.1s',
        metricPassed: 56,
        metricAutomated: 56,
        isAutomated: true,
        status: 'passed',
        previewType: 'payment',
        screenshot: '/screenshots/run-a1524389_node-payment.png'
      }
    },
    // Logistics & Fulfillment
    {
      id: 'node-tde-dhl',
      type: 'flowStepNode',
      position: { x: 140, y: 2550 },
      data: {
        stepIndex: 9,
        name: 'DHL Paket & Packstation 24/7 Abholstation',
        subtext: 'Deutschlandweite Packstation 24/7 Auswahl, Postnummer & Sendungsverfolgung',
        components: 7,
        metricTime: '1.0s',
        metricPassed: 21,
        metricAutomated: 21,
        isAutomated: true,
        status: 'passed',
        previewType: 'checkout'
      }
    },
    // Post-Purchase & Returns
    {
      id: 'node-tde-rma',
      type: 'flowStepNode',
      position: { x: 900, y: 2550 },
      data: {
        stepIndex: 10,
        name: 'BGB § 312g 14 Tage Gesetzliches Widerrufsrecht',
        subtext: 'Widerrufsbelehrung, PDF Rechnung Download & DHL QR Retourenlabel',
        components: 9,
        metricTime: '1.2s',
        metricPassed: 26,
        metricAutomated: 26,
        isAutomated: true,
        status: 'passed',
        previewType: 'confirmation',
        screenshot: '/screenshots/novatech_de_rma_live.png'
      }
    },
    // Finalization Terminator
    {
      id: 'node-tde-end',
      type: 'terminatorNode',
      position: { x: 520, y: 2870 },
      data: {
        label: 'NovaTech DE Master Pipeline Tamamlandı',
        subtext: 'Alle europäischen DACH/EU E-Commerce Flows Erfolgreich Verifiziert (%100 Pass)',
        status: 'passed',
        isEnd: true
      }
    }
  ],
  edges: [
    { id: 'e-tde-1', source: 'node-tde-init', target: 'node-tde-storefront', label: 'Cookiebot DSGVO Consent', animated: true },
    { id: 'e-tde-2a', source: 'node-tde-storefront', target: 'node-tde-search', label: 'Query Search Pipeline', animated: true },
    { id: 'e-tde-2b', source: 'node-tde-storefront', target: 'node-tde-plp', label: 'Browse Category Catalog', animated: true },
    { id: 'e-tde-3a', source: 'node-tde-search', target: 'node-tde-pdp', label: 'Select Gaming Laptop PDP', animated: true },
    { id: 'e-tde-3b', source: 'node-tde-plp', target: 'node-tde-pdp', label: 'Select Configured Model', animated: true },
    { id: 'e-tde-4', source: 'node-tde-pdp', target: 'node-tde-cart', label: 'In den Warenkorb Legen', animated: true },
    { id: 'e-tde-5a', source: 'node-tde-cart', target: 'node-tde-auth', label: 'Zur Kasse (Gast/Login)', animated: true },
    { id: 'e-tde-5b', source: 'node-tde-cart', target: 'node-tde-tax', label: '19% MwSt. & B2B Invoice', animated: true },
    { id: 'e-tde-6a', source: 'node-tde-auth', target: 'node-tde-pay', label: 'Lieferadresse Bestätigt', animated: true },
    { id: 'e-tde-6b', source: 'node-tde-tax', target: 'node-tde-pay', label: 'Steuerberechnung Gesperrt', animated: true },
    { id: 'e-tde-7a', source: 'node-tde-pay', target: 'node-tde-dhl', label: 'Klarna/PayPal Freigegeben', animated: true },
    { id: 'e-tde-7b', source: 'node-tde-pay', target: 'node-tde-rma', label: 'Bestellbestätigung Versendet', animated: true },
    { id: 'e-tde-8a', source: 'node-tde-dhl', target: 'node-tde-end', label: 'DHL Tracking & Versand', animated: true },
    { id: 'e-tde-8b', source: 'node-tde-rma', target: 'node-tde-end', label: '14 Tage Retourenschutz Bereit', animated: true }
  ]
};

// 3. Global Multi-Store Master Pipeline (Parallel Dual-Engine: TR Store vs. DE Store Side-by-Side)
export const MASTER_PIPELINE_GLOBAL: Scenario = {
  id: 'master-pipeline-global',
  title: 'Global E-Ticaret Master Pipeline (Tüm Mağazalar & Pazarlar)',
  category: 'Bütünleşik Master Mimari',
  categories: ['Temel Dönüşüm (Checkout)', 'Ödeme & Güvenlik', 'Lojistik & Kargo', 'Siber Güvenlik & PCI-DSS'],
  description: 'NovaTech Türkiye (TRY ₺, KVKK, 3DS) ve NovaTech Deutschland (EUR €, DSGVO, Klarna/DHL) platformlarının paralel dual-engine karşılaştırmalı uçtan uca otomasyon döngüsü.',
  criticality: 'Critical',
  componentsCount: 12,
  lastRunDuration: '31.5s',
  status: 'passed',
  targetUrl: 'https://www.novatech.com.tr / https://www.novatech.de',
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
        name: '🇹🇷 NovaTech TR Storefront & KVKK',
        subtext: 'novatech.com.tr, TRY (₺), KVKK & SSL 1.3',
        components: 12,
        metricTime: '1.1s',
        metricPassed: 38,
        metricAutomated: 38,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/novatech_home_live.png'
      }
    },
    {
      id: 'node-gbl-de-store',
      type: 'flowStepNode',
      position: { x: 880, y: 260 },
      data: {
        stepIndex: 2,
        name: '🇩🇪 NovaTech DE Storefront & Cookiebot',
        subtext: 'novatech.de, EUR (€), DSGVO & Cookiebot Consent',
        components: 12,
        metricTime: '1.2s',
        metricPassed: 38,
        metricAutomated: 38,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/novatech_de_home_live.png'
      }
    },
    // Level 2: Catalogs side-by-side
    {
      id: 'node-gbl-tr-catalog',
      type: 'flowStepNode',
      position: { x: 160, y: 680 },
      data: {
        stepIndex: 3,
        name: '🇹🇷 NovaTech TR Oyun Bilgisayarları',
        subtext: '/oyun-bilgisayarlari, RTX 4070, Peşin Fiyatına 6 Taksit',
        components: 14,
        metricTime: '1.0s',
        metricPassed: 32,
        metricAutomated: 32,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/novatech_category.png'
      }
    },
    {
      id: 'node-gbl-de-catalog',
      type: 'flowStepNode',
      position: { x: 880, y: 680 },
      data: {
        stepIndex: 4,
        name: '🇩🇪 NovaTech DE Gaming Laptops PLP',
        subtext: '/gaming-laptops/, GeForce RTX 50-Serie, Auf Lager Filter',
        components: 14,
        metricTime: '1.1s',
        metricPassed: 32,
        metricAutomated: 32,
        isAutomated: true,
        status: 'passed',
        previewType: 'search',
        screenshot: '/screenshots/novatech_de_plp_live.png'
      }
    },
    // Level 3: PDPs side-by-side
    {
      id: 'node-gbl-tr-pdp',
      type: 'flowStepNode',
      position: { x: 160, y: 1100 },
      data: {
        stepIndex: 5,
        name: '🇹🇷 NovaTech Horizon X15 PDP (₺)',
        subtext: 'Türkçe Q Klavye, RGB Aydınlatma, Canlı Stok Kontrolü',
        components: 16,
        metricTime: '1.3s',
        metricPassed: 44,
        metricAutomated: 44,
        isAutomated: true,
        status: 'passed',
        previewType: 'pdp',
        screenshot: '/screenshots/novatech_pdp.png'
      }
    },
    {
      id: 'node-gbl-de-pdp',
      type: 'flowStepNode',
      position: { x: 880, y: 1100 },
      data: {
        stepIndex: 6,
        name: '🇩🇪 NovaTech Titan X17 Laptop (1.089€)',
        subtext: 'Alman QWERTZ Tastatur, 100€ Rabatt, Konfigurieren & Kaufen',
        components: 16,
        metricTime: '1.4s',
        metricPassed: 44,
        metricAutomated: 44,
        isAutomated: true,
        status: 'passed',
        previewType: 'pdp',
        screenshot: '/screenshots/novatech_de_pdp_live.png'
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
        screenshot: '/screenshots/novatech_checkout_live.png'
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
        screenshot: '/screenshots/novatech_de_cart_live.png'
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

// Default export alias for backward compatibility
export const MASTER_PIPELINE_SCENARIO = MASTER_PIPELINE_NOVATECH_TR;
export const MASTER_PIPELINE_MONSTER_TR = MASTER_PIPELINE_NOVATECH_TR;
export const MASTER_PIPELINE_TULPAR_DE = MASTER_PIPELINE_NOVATECH_DE;

export function getMasterPipeline(domainId: string = 'novatech-tr'): Scenario {
  if (domainId === 'novatech-de' || domainId === 'tulpar-de') {
    return MASTER_PIPELINE_NOVATECH_DE;
  }
  if (domainId === 'all') {
    return MASTER_PIPELINE_GLOBAL;
  }
  return MASTER_PIPELINE_NOVATECH_TR;
}
