const path = require('path');
const fs = require('fs');
const { chromium } = require(require.resolve('playwright', { paths: [path.join(__dirname, '..', 'server')] }));

const clientScreenshotsDir = path.join(__dirname, '..', 'client', 'public', 'screenshots');
const serverScreenshotsDir = path.join(__dirname, '..', 'server', 'public', 'screenshots');

if (!fs.existsSync(clientScreenshotsDir)) fs.mkdirSync(clientScreenshotsDir, { recursive: true });
if (!fs.existsSync(serverScreenshotsDir)) fs.mkdirSync(serverScreenshotsDir, { recursive: true });

// Shared CSS styles for sleek, premium gaming tech e-commerce
const commonCss = `
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
  body { background-color: #090d16; color: #f1f5f9; min-height: 100vh; display: flex; flex-direction: column; overflow-x: hidden; }
  
  /* Top Banner */
  .top-strip { background: linear-gradient(90deg, #1e1b4b, #0f766e); padding: 8px 32px; font-size: 13px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; }
  .top-strip span strong { color: #38bdf8; }
  
  /* Header */
  header { background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #1e293b; padding: 18px 48px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .logo { display: flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; text-decoration: none; color: #ffffff; }
  .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; box-shadow: 0 0 15px rgba(6, 182, 212, 0.4); }
  .logo-badge { font-size: 11px; padding: 2px 8px; border-radius: 6px; font-weight: 700; text-transform: uppercase; margin-left: 4px; }
  .badge-tr { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
  .badge-de { background: rgba(234, 179, 8, 0.2); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.3); }

  nav { display: flex; gap: 28px; }
  nav a { color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
  nav a:hover, nav a.active { color: #38bdf8; }

  .header-actions { display: flex; align-items: center; gap: 20px; }
  .search-box { position: relative; }
  .search-input { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 9px 16px 9px 38px; color: white; font-size: 13px; width: 260px; outline: none; }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 14px; color: #64748b; }

  .cart-btn { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 9px 16px; color: white; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; text-decoration: none; }
  .cart-count { background: #06b6d4; color: #000; font-size: 11px; font-weight: bold; border-radius: 12px; padding: 2px 6px; }

  /* Hero Section */
  .hero-container { padding: 60px 48px; background: radial-gradient(circle at 75% 30%, rgba(6, 182, 212, 0.12) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%); display: grid; grid-template-columns: 1.1fr 0.9fr; align-items: center; gap: 48px; border-bottom: 1px solid #1e293b; }
  .hero-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; padding: 6px 14px; font-size: 12px; color: #38bdf8; font-weight: 600; margin-bottom: 20px; }
  .hero-title { font-size: 52px; font-weight: 900; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 20px; background: linear-gradient(135deg, #ffffff 40%, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero-desc { font-size: 16px; color: #94a3b8; line-height: 1.6; margin-bottom: 32px; max-width: 580px; }
  .hero-stats { display: flex; gap: 32px; margin-bottom: 36px; }
  .stat-item h4 { font-size: 28px; font-weight: 800; color: #38bdf8; }
  .stat-item p { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; }
  
  .btn-primary { background: linear-gradient(135deg, #06b6d4, #2563eb); border: none; border-radius: 8px; color: white; padding: 14px 28px; font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4); text-decoration: none; display: inline-flex; align-items: center; gap: 10px; }
  .btn-secondary { background: #1e293b; border: 1px solid #334155; border-radius: 8px; color: #cbd5e1; padding: 14px 24px; font-size: 15px; font-weight: 600; cursor: pointer; margin-left: 14px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }

  /* Product Vector Art (Laptop Graphic) */
  .laptop-render { position: relative; display: flex; justify-content: center; align-items: center; }
  .laptop-screen { width: 480px; height: 300px; background: #0b1329; border: 4px solid #334155; border-radius: 16px 16px 0 0; position: relative; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(6, 182, 212, 0.2); overflow: hidden; display: flex; flex-direction: column; }
  .screen-glow { position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(6, 182, 212, 0.3) 0%, transparent 70%); }
  .screen-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 24px; }
  .laptop-base { width: 560px; height: 20px; background: linear-gradient(180deg, #475569, #1e293b); border-radius: 0 0 14px 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); position: relative; }
  .laptop-notch { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 90px; height: 6px; background: #0f172a; border-radius: 0 0 6px 6px; }

  /* Cookie / GDPR Bar */
  .cookie-bar { background: rgba(15, 23, 42, 0.95); border-top: 1px solid #334155; padding: 16px 48px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #94a3b8; position: fixed; bottom: 0; width: 100%; z-index: 999; backdrop-filter: blur(8px); }
  .cookie-btn-accept { background: #10b981; color: white; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; }
  .cookie-btn-settings { background: #334155; color: #cbd5e1; border: none; padding: 8px 14px; border-radius: 6px; margin-right: 8px; cursor: pointer; }

  /* Product Card Grids */
  .grid-container { padding: 48px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
  .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; transition: transform 0.2s, border-color 0.2s; position: relative; }
  .card:hover { border-color: #38bdf8; transform: translateY(-4px); }
  .card-badge { position: absolute; top: 16px; left: 16px; background: #2563eb; color: white; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px; text-transform: uppercase; }
  .card-img-placeholder { height: 180px; background: #1e293b; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .card-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; color: white; }
  .card-specs { font-size: 12px; color: #94a3b8; line-height: 1.5; margin-bottom: 16px; flex-grow: 1; }
  .card-price { font-size: 22px; font-weight: 800; color: #38bdf8; margin-bottom: 14px; }
  .card-old-price { font-size: 13px; color: #64748b; text-decoration: line-through; margin-left: 8px; font-weight: normal; }
  .card-btn { background: #1e293b; border: 1px solid #334155; color: white; border-radius: 6px; padding: 10px; font-weight: 600; font-size: 13px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .card-btn:hover { background: #06b6d4; color: black; border-color: #06b6d4; }
`;

// Define the 12 templates
const templates = [
  // 1. flowshop_home_live.png (flowshop TR Homepage)
  {
    filename: 'flowshop_home_live.png',
    viewport: { width: 1440, height: 900 },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${commonCss}</style></head><body>
      <div class="top-strip">
        <span>🚀 <strong>flowshop Türkiye</strong> Resmi Mağazası | Tüm Siparişlerde Ücretsiz Kargo & 2 Yıl Yerinde Garanti</span>
        <span>📞 Müşteri Destek: 0850 444 66 82 | TR - Türkçe</span>
      </div>
      <header>
        <div class="logo">
          <div class="logo-icon">NT</div>
          <span>flowshop<span class="logo-badge badge-tr">TR</span></span>
        </div>
        <nav>
          <a href="#" class="active">Ana Sayfa</a>
          <a href="#">Oyun Bilgisayarları</a>
          <a href="#">Horizon X15</a>
          <a href="#">Apex Serisi</a>
          <a href="#">Monitörler</a>
          <a href="#">Destek</a>
        </nav>
        <div class="header-actions">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input class="search-input" placeholder="Horizon Gaming Laptop ara..." />
          </div>
          <div class="cart-btn">
            <span>🛒 Sepetim</span>
            <span class="cart-count">1</span>
          </div>
        </div>
      </header>

      <div class="hero-container">
        <div>
          <div class="hero-tag">🔥 YENİ NESİL PERFORMANS &bull; 2026 MİMARİSİ</div>
          <h1 class="hero-title">HORIZON X15<br><span style="color:#06b6d4;">YENİ ÇAĞIN CANAVARI</span></h1>
          <p class="hero-desc">14. Nesil Intel® Core™ i7-14700HX işlemci ve NVIDIA® GeForce RTX™ 4070 ekran kartı ile sınırları zorlayın. 165Hz QHD ekran, sıvı metal soğutma ve yapay zeka destekli DLSS 3.5 teknolojisi.</p>
          <div class="hero-stats">
            <div class="stat-item"><h4>RTX 4070</h4><p>8GB GDDR6 GPU</p></div>
            <div class="stat-item"><h4>165 Hz</h4><p>QHD 2.5K IPS</p></div>
            <div class="stat-item"><h4>140W</h4><p>Max TGP Gücü</p></div>
            <div class="stat-item"><h4>32 GB</h4><p>5600MHz DDR5</p></div>
          </div>
          <div>
            <a href="#" class="btn-primary">⚡ Hemen İncele & Satın Al</a>
            <a href="#" class="btn-secondary">⚙️ Kendi Modelini Yap</a>
          </div>
        </div>

        <div class="laptop-render">
          <div>
            <div class="laptop-screen">
              <div class="screen-glow"></div>
              <div class="screen-content">
                <span style="font-size:32px; font-weight:900; color:#38bdf8; letter-spacing:2px;">HORIZON X15</span>
                <span style="font-size:14px; color:#94a3b8; margin-top:8px;">140W FULL PERFORMANCE GRAPHICS</span>
                <div style="margin-top:20px; display:flex; gap:10px;">
                  <span style="background:rgba(6,182,212,0.2); border:1px solid #06b6d4; padding:4px 10px; border-radius:4px; font-size:11px; color:#38bdf8;">RTX AI ACCELERATED</span>
                  <span style="background:rgba(99,102,241,0.2); border:1px solid #6366f1; padding:4px 10px; border-radius:4px; font-size:11px; color:#a5b4fc;">DDR5 ULTRA</span>
                </div>
              </div>
            </div>
            <div class="laptop-base"><div class="laptop-notch"></div></div>
          </div>
        </div>
      </div>

      <div class="cookie-bar">
        <span>🍪 flowshop Türkiye olarak sizlere daha iyi bir alışveriş deneyimi sunabilmek için KVKK ve çerez politikamıza uygun çerezler kullanıyoruz.</span>
        <div>
          <button class="cookie-btn-settings">Tercihleri Yönet</button>
          <button class="cookie-btn-accept">Tümünü Kabul Et</button>
        </div>
      </div>
    </body></html>`
  },

  // 2. flowshop_category.png (flowshop TR PLP)
  {
    filename: 'flowshop_category.png',
    viewport: { width: 1440, height: 900 },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${commonCss}
      .plp-layout { display: grid; grid-template-columns: 280px 1fr; gap: 32px; padding: 32px 48px; }
      .sidebar { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; }
      .filter-group { margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 16px; }
      .filter-title { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 12px; }
      .filter-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #94a3b8; margin-bottom: 8px; cursor: pointer; }
      .filter-item input { accent-color: #06b6d4; }
    </style></head><body>
      <header>
        <div class="logo">
          <div class="logo-icon">NT</div>
          <span>flowshop<span class="logo-badge badge-tr">TR</span></span>
        </div>
        <nav>
          <a href="#">Ana Sayfa</a>
          <a href="#" class="active">Oyun Bilgisayarları</a>
          <a href="#">Horizon Serisi</a>
          <a href="#">Apex Serisi</a>
          <a href="#">Destek</a>
        </nav>
        <div class="header-actions">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input class="search-input" value="Horizon" />
          </div>
          <div class="cart-btn"><span>🛒 Sepetim</span><span class="cart-count">0</span></div>
        </div>
      </header>

      <div class="plp-layout">
        <div class="sidebar">
          <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 20px; color: white;">Filtreler (14 Model)</h3>
          <div class="filter-group">
            <div class="filter-title">Ekran Kartı (GPU)</div>
            <label class="filter-item"><input type="checkbox" checked> NVIDIA RTX 4070 (8)</label>
            <label class="filter-item"><input type="checkbox"> NVIDIA RTX 4080 (4)</label>
            <label class="filter-item"><input type="checkbox"> NVIDIA RTX 4060 (2)</label>
          </div>
          <div class="filter-group">
            <div class="filter-title">İşlemci</div>
            <label class="filter-item"><input type="checkbox" checked> Intel Core i7 14. Nesil</label>
            <label class="filter-item"><input type="checkbox"> Intel Core i9 14. Nesil</label>
            <label class="filter-item"><input type="checkbox"> AMD Ryzen 7 / 9</label>
          </div>
          <div class="filter-group">
            <div class="filter-title">Ekran Boyutu</div>
            <label class="filter-item"><input type="checkbox" checked> 15.6" Full HD / QHD</label>
            <label class="filter-item"><input type="checkbox"> 17.3" QHD 240Hz</label>
          </div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 style="font-size: 22px; font-weight: 800; color: white;">flowshop Horizon & Apex Oyun Dizüstüleri</h2>
            <span style="font-size: 13px; color: #94a3b8;">Sıralama: <strong>Fiyat (Düşükten Yükseğe)</strong></span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <div class="card">
              <span class="card-badge">Çok Satan</span>
              <div class="card-img-placeholder"><span style="font-size: 36px;">💻</span></div>
              <div class="card-title">flowshop Horizon X15 v2.1</div>
              <div class="card-specs">Intel i7-14700HX &bull; RTX 4070 8GB &bull; 16GB DDR5 &bull; 1TB Gen4 SSD &bull; 15.6" 165Hz QHD IPS</div>
              <div class="card-price">₺54.999 <span class="card-old-price">₺59.999</span></div>
              <button class="card-btn">Özelleştir & Satın Al</button>
            </div>

            <div class="card">
              <span class="card-badge" style="background: #10b981;">Stokta Var</span>
              <div class="card-img-placeholder"><span style="font-size: 36px;">💻</span></div>
              <div class="card-title">flowshop Horizon X17 Max</div>
              <div class="card-specs">Intel i9-14900HX &bull; RTX 4080 12GB &bull; 32GB DDR5 &bull; 2TB Gen4 SSD &bull; 17.3" 240Hz QHD</div>
              <div class="card-price">₺79.499 <span class="card-old-price">₺84.999</span></div>
              <button class="card-btn">Özelleştir & Satın Al</button>
            </div>

            <div class="card">
              <span class="card-badge" style="background: #8b5cf6;">E-Spor Özel</span>
              <div class="card-img-placeholder"><span style="font-size: 36px;">💻</span></div>
              <div class="card-title">flowshop Apex Pro 16</div>
              <div class="card-specs">AMD Ryzen 9 7945HX &bull; RTX 4070 8GB &bull; 32GB DDR5 &bull; 1TB Gen4 SSD &bull; 16" 240Hz OLED</div>
              <div class="card-price">₺62.999</div>
              <button class="card-btn">Özelleştir & Satın Al</button>
            </div>
          </div>
        </div>
      </div>
    </body></html>`
  },

  // 3. flowshop_pdp.png (flowshop TR Horizon X15 PDP)
  {
    filename: 'flowshop_pdp.png',
    viewport: { width: 1440, height: 900 },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${commonCss}
      .pdp-container { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; padding: 40px 48px; }
      .pdp-gallery { display: flex; flex-direction: column; gap: 16px; }
      .pdp-main-view { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; height: 420px; display: flex; align-items: center; justify-content: center; position: relative; }
      .pdp-thumbs { display: flex; gap: 12px; }
      .pdp-thumb { width: 80px; height: 60px; background: #1e293b; border: 2px solid transparent; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
      .pdp-thumb.active { border-color: #06b6d4; }
      .config-option { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
      .config-option.selected { border-color: #06b6d4; background: rgba(6,182,212,0.08); }
    </style></head><body>
      <header>
        <div class="logo">
          <div class="logo-icon">NT</div>
          <span>flowshop<span class="logo-badge badge-tr">TR</span></span>
        </div>
        <nav>
          <a href="#">Ana Sayfa</a>
          <a href="#">Oyun Bilgisayarları</a>
          <a href="#" class="active">Horizon X15</a>
          <a href="#">Destek</a>
        </nav>
        <div class="header-actions">
          <div class="cart-btn"><span>🛒 Sepetim</span><span class="cart-count">1</span></div>
        </div>
      </header>

      <div class="pdp-container">
        <div class="pdp-gallery">
          <div class="pdp-main-view">
            <div style="text-align: center;">
              <span style="font-size: 80px;">💻</span>
              <p style="color: #38bdf8; font-weight: 700; margin-top: 10px; font-size: 18px;">HORIZON X15 V2.1</p>
              <span style="background: rgba(6,182,212,0.15); border: 1px solid #06b6d4; color: #06b6d4; padding: 4px 12px; border-radius: 12px; font-size: 11px;">RGB KLAVYE & SIVI METAL</span>
            </div>
          </div>
          <div class="pdp-thumbs">
            <div class="pdp-thumb active"><span>🖥️ Önden</span></div>
            <div class="pdp-thumb"><span>⌨️ Klavye</span></div>
            <div class="pdp-thumb"><span>🔌 Portlar</span></div>
            <div class="pdp-thumb"><span>📐 Profil</span></div>
          </div>
        </div>

        <div>
          <span style="color: #10b981; font-size: 12px; font-weight: 700; text-transform: uppercase;">✓ Stokta Var - Aynı Gün Kargo</span>
          <h1 style="font-size: 32px; font-weight: 900; margin: 8px 0 12px 0;">flowshop Horizon X15 Gaming Laptop</h1>
          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 20px;">Intel Core i7-14700HX, RTX 4070 8GB GDDR6 140W, 16GB DDR5 5600MHz, 1TB Gen4 NVMe M.2 SSD, 15.6" 165Hz QHD 100% sRGB.</p>
          
          <div style="font-size: 36px; font-weight: 900; color: #38bdf8; margin-bottom: 24px;">
            ₺54.999 <span style="font-size: 18px; color: #64748b; text-decoration: line-through;">₺59.999</span>
            <span style="font-size: 13px; color: #10b981; font-weight: 700; display: block; margin-top: 4px;">Peşin Fiyatına 12 Taksit Fırsatı</span>
          </div>

          <h4 style="font-size: 14px; font-weight: 700; color: white; margin-bottom: 12px;">Bellek (RAM) Konfigürasyonu:</h4>
          <div class="config-option selected">
            <span><strong>16GB (2x8GB) DDR5 5600MHz</strong></span>
            <span style="color: #06b6d4; font-weight: 700;">Standart</span>
          </div>
          <div class="config-option">
            <span><strong>32GB (2x16GB) DDR5 5600MHz</strong></span>
            <span style="color: #94a3b8;">+₺2.499</span>
          </div>

          <div style="margin-top: 28px; display: flex; gap: 16px;">
            <button class="btn-primary" style="flex-grow: 1; justify-content: center; font-size: 16px;">🛒 Sepete Ekle</button>
            <button class="btn-secondary">❤️ Favorilere Ekle</button>
          </div>
        </div>
      </div>
    </body></html>`
  },

  // 4. flowshop_cart_live.png (flowshop TR Cart)
  {
    filename: 'flowshop_cart_live.png',
    viewport: { width: 1440, height: 900 },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${commonCss}
      .cart-container { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; padding: 40px 48px; }
      .cart-table { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; }
      .cart-item { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 20px; }
      .summary-box { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; height: fit-content; }
      .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #94a3b8; margin-bottom: 12px; }
      .coupon-box { display: flex; gap: 8px; margin: 20px 0; }
    </style></head><body>
      <header>
        <div class="logo">
          <div class="logo-icon">NT</div>
          <span>flowshop<span class="logo-badge badge-tr">TR</span></span>
        </div>
        <nav><a href="#">Alışverişe Devam Et</a></nav>
        <div class="header-actions">
          <span style="font-size: 13px; color: #10b981;">🔒 256-Bit SSL Güvenli Sepet</span>
        </div>
      </header>

      <div class="cart-container">
        <div class="cart-table">
          <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 24px; color: white;">Alışveriş Sepetiniz (1 Ürün)</h2>
          
          <div class="cart-item">
            <div style="display: flex; gap: 16px; align-items: center;">
              <div style="width: 70px; height: 70px; background: #1e293b; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 32px;">💻</div>
              <div>
                <h4 style="font-size: 16px; font-weight: 700; color: white;">flowshop Horizon X15 Gaming Laptop</h4>
                <p style="font-size: 12px; color: #94a3b8;">Intel i7-14700HX / RTX 4070 / 16GB RAM / 1TB SSD</p>
                <span style="font-size: 11px; color: #10b981;">✓ 2 Yıl flowshop Garantisi Dahil</span>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 18px; font-weight: 800; color: #38bdf8;">₺54.999</div>
              <span style="font-size: 12px; color: #ef4444; cursor: pointer;">Kaldır</span>
            </div>
          </div>

          <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px; color: #34d399; font-size: 13px;">
            <span>🎁</span>
            <span>Tebrikler! Siparişinize özel <strong>flowshop Titan Pro Gaming Sırt Çantası</strong> sepetinize hediye olarak eklendi!</span>
          </div>
        </div>

        <div class="summary-box">
          <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 20px; color: white;">Sipariş Özeti</h3>
          <div class="summary-row"><span>Ara Toplam</span><span>₺54.999</span></div>
          <div class="summary-row"><span>Kargo Ücreti</span><span style="color: #10b981;">ÜCRETSİZ</span></div>
          <div class="summary-row" style="color: #34d399;"><span>Kupon İndirimi (NOVAPRO20)</span><span>-₺2.000</span></div>
          
          <div style="border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 16px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; font-size: 16px; color: white;">Genel Toplam:</span>
            <span style="font-size: 24px; font-weight: 900; color: #38bdf8;">₺52.999</span>
          </div>

          <div class="coupon-box">
            <input class="search-input" value="NOVAPRO20" style="width: 100%; border-color: #10b981;" />
            <button class="btn-secondary" style="margin: 0; padding: 9px 16px;">Uygula</button>
          </div>

          <button class="btn-primary" style="width: 100%; justify-content: center; margin-top: 10px;">Ödemeye Geç &rarr;</button>
        </div>
      </div>
    </body></html>`
  },

  // 5. flowshop_checkout_live.png (flowshop TR Checkout)
  {
    filename: 'flowshop_checkout_live.png',
    viewport: { width: 1440, height: 900 },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${commonCss}
      .checkout-grid { display: grid; grid-template-columns: 1.8fr 1.2fr; gap: 32px; padding: 40px 48px; }
      .panel { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
      .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; }
      .form-input { background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 10px 14px; color: white; width: 100%; font-size: 13px; }
      .form-label { font-size: 12px; color: #94a3b8; margin-bottom: 6px; display: block; font-weight: 600; }
    </style></head><body>
      <header>
        <div class="logo">
          <div class="logo-icon">NT</div>
          <span>flowshop<span class="logo-badge badge-tr">TR</span></span>
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #38bdf8;">Adım 2: Güvenli Ödeme & Teslimat</div>
        <div class="header-actions"><span style="font-size: 13px; color: #94a3b8;">Sipariş Tutarı: ₺52.999</span></div>
      </header>

      <div class="checkout-grid">
        <div>
          <div class="panel">
            <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 16px; color: white;">1. Teslimat Adresi</h3>
            <div class="field-row">
              <div><label class="form-label">Ad Soyad</label><input class="form-input" value="QA Test Kullanıcısı" /></div>
              <div><label class="form-label">Telefon</label><input class="form-input" value="+90 532 555 0199" /></div>
            </div>
            <div><label class="form-label">Teslimat Adresi</label><input class="form-input" value="Bağdat Caddesi No: 124/6 Kadıköy / İSTANBUL" /></div>
          </div>

          <div class="panel">
            <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 16px; color: white;">2. Güvenli Ödeme Seçenekleri</h3>
            <div style="background: rgba(6,182,212,0.08); border: 1px solid #06b6d4; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <span style="font-weight: 700; color: white;">Kredi / Banka Kartı (İyziPay 3D Secure)</span>
                <span style="font-size: 12px; color: #38bdf8;">Peşin Fiyatına 12 Taksit</span>
              </div>
              <div style="margin-bottom: 12px;"><label class="form-label">Kart Numarası</label><input class="form-input" value="**** **** **** 4242" /></div>
              <div class="field-row">
                <div><label class="form-label">Son Kullanma Tarihi</label><input class="form-input" value="12 / 28" /></div>
                <div><label class="form-label">CVV / Güvenlik Kodu</label><input class="form-input" value="***" /></div>
              </div>
            </div>
            <button class="btn-primary" style="width: 100%; justify-content: center; font-size: 16px;">🔒 3D Secure ile ₺52.999 Öde</button>
          </div>
        </div>

        <div class="panel" style="height: fit-content;">
          <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 16px; color: white;">Sipariş Özeti</h3>
          <p style="font-size: 14px; font-weight: 600; color: white; margin-bottom: 4px;">flowshop Horizon X15 Gaming Laptop</p>
          <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">Intel i7-14700HX &bull; RTX 4070 &bull; 16GB RAM &bull; 1TB SSD</p>
          <div style="border-top: 1px solid #1e293b; padding-top: 12px; font-size: 13px; color: #94a3b8; display: flex; justify-content: space-between;">
            <span>Toplam Tutar:</span>
            <span style="font-size: 20px; font-weight: 900; color: #38bdf8;">₺52.999</span>
          </div>
        </div>
      </div>
    </body></html>`
  },

  // 6. flowshop_de_home_live.png (flowshop DE Homepage)
  {
    filename: 'flowshop_de_home_live.png',
    viewport: { width: 1440, height: 900 },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${commonCss}</style></head><body>
      <div class="top-strip">
        <span>🇪🇺 <strong>flowshop Deutschland & Europe</strong> | Kostenloser Versand nach Deutschland & Österreich | 3 Jahre Vor-Ort-Garantie</span>
        <span>📞 DE Hotline: +49 (0) 30 890 120 44 | EUR (€) - Deutsch</span>
      </div>
      <header>
        <div class="logo">
          <div class="logo-icon" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">NT</div>
          <span>flowshop<span class="logo-badge badge-de">DE</span></span>
        </div>
        <nav>
          <a href="#" class="active">Startseite</a>
          <a href="#">Gaming Laptops</a>
          <a href="#">Titan Serie</a>
          <a href="#">Konfigurator</a>
          <a href="#">Monitore</a>
          <a href="#">Service & Garantie</a>
        </nav>
        <div class="header-actions">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input class="search-input" placeholder="Titan Gaming Laptop suchen..." />
          </div>
          <div class="cart-btn">
            <span>🛒 Warenkorb</span>
            <span class="cart-count">1</span>
          </div>
        </div>
      </header>

      <div class="hero-container">
        <div>
          <div class="hero-tag" style="border-color: #f59e0b; color: #facc15; background: rgba(245,158,11,0.1);">⚡ HIGH-END PERFORMANCE &bull; MADE FOR DACH</div>
          <h1 class="hero-title">TITAN X17 ULTRA<br><span style="color:#f59e0b;">KOMPROMISSLOSE KRAFT</span></h1>
          <p class="hero-desc">Erleben Sie unübertroffene Spitzenleistung mit dem Intel® Core™ i9-14900HX und NVIDIA® GeForce RTX™ 4080. Speziell entwickelt für anspruchsvolles 4K-Gaming und Content Creation mit deutschem QWERTZ-Layout.</p>
          <div class="hero-stats">
            <div class="stat-item"><h4 style="color:#facc15;">RTX 4080</h4><p>12GB GDDR6 VRAM</p></div>
            <div class="stat-item"><h4 style="color:#facc15;">240 Hz</h4><p>QHD+ 16:10 Panel</p></div>
            <div class="stat-item"><h4 style="color:#facc15;">175W</h4><p>Max Graphics Power</p></div>
            <div class="stat-item"><h4 style="color:#facc15;">64 GB</h4><p>DDR5-5600 RAM</p></div>
          </div>
          <div>
            <a href="#" class="btn-primary" style="background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);">⚡ Jetzt Konfigurieren</a>
            <a href="#" class="btn-secondary">⚙️ Alle Spezifikationen</a>
          </div>
        </div>

        <div class="laptop-render">
          <div>
            <div class="laptop-screen" style="border-color: #475569; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.2);">
              <div class="screen-glow" style="background: radial-gradient(circle at center, rgba(245, 158, 11, 0.25) 0%, transparent 70%);"></div>
              <div class="screen-content">
                <span style="font-size:32px; font-weight:900; color:#facc15; letter-spacing:2px;">TITAN X17 ULTRA</span>
                <span style="font-size:14px; color:#cbd5e1; margin-top:8px;">HIGH-END GERMAN ENGINEERING</span>
                <div style="margin-top:20px; display:flex; gap:10px;">
                  <span style="background:rgba(245,158,11,0.2); border:1px solid #f59e0b; padding:4px 10px; border-radius:4px; font-size:11px; color:#facc15;">DSGVO CONFORM</span>
                  <span style="background:rgba(59,130,246,0.2); border:1px solid #3b82f6; padding:4px 10px; border-radius:4px; font-size:11px; color:#93c5fd;">3 JAHRE GARANTIE</span>
                </div>
              </div>
            </div>
            <div class="laptop-base"><div class="laptop-notch"></div></div>
          </div>
        </div>
      </div>

      <div class="cookie-bar">
        <span>🍪 flowshop Deutschland nutzt Cookies zur Personalisierung und Analyse gemäß DSGVO. Sie haben die volle Kontrolle über Ihre Privatsphäre.</span>
        <div>
          <button class="cookie-btn-settings">Einstellungen</button>
          <button class="cookie-btn-accept" style="background: #f59e0b; color: black; font-weight: bold;">Alle Akzeptieren</button>
        </div>
      </div>
    </body></html>`
  },

  // 7. flowshop_de_search_live.png (flowshop DE Search Results)
  {
    filename: 'flowshop_de_search_live.png',
    viewport: { width: 1440, height: 900 },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${commonCss}</style></head><body>
      <header>
        <div class="logo">
          <div class="logo-icon" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">NT</div>
          <span>flowshop<span class="logo-badge badge-de">DE</span></span>
        </div>
        <nav>
          <a href="#">Startseite</a>
          <a href="#">Gaming Laptops</a>
          <a href="#">Titan Serie</a>
          <a href="#">Support</a>
        </nav>
        <div class="header-actions">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input class="search-input" value="Titan" />
          </div>
          <div class="cart-btn"><span>🛒 Warenkorb</span><span class="cart-count">0</span></div>
        </div>
      </header>

      <div style="padding: 40px 48px;">
        <h2 style="font-size: 24px; font-weight: 800; color: white; margin-bottom: 8px;">Suchergebnisse für &bdquo;Titan&ldquo; (4 Treffer)</h2>
        <p style="font-size: 14px; color: #94a3b8; margin-bottom: 32px;">Alle Modelle werden mit deutschem QWERTZ-Layout und 3 Jahren Europa-Garantie geliefert.</p>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
          <div class="card">
            <span class="card-badge" style="background: #f59e0b; color: black;">Top Bestseller</span>
            <div class="card-img-placeholder"><span style="font-size: 40px;">💻</span></div>
            <div class="card-title">flowshop Titan X17 Pro</div>
            <div class="card-specs">Intel Core i9-14900HX &bull; RTX 4080 12GB &bull; 32GB DDR5 &bull; 2TB NVMe SSD &bull; 17.3" QHD 240Hz</div>
            <div class="card-price" style="color: #facc15;">2.499,00 € <span class="card-old-price">2.699,00 €</span></div>
            <button class="card-btn">Konfigurieren & Kaufen</button>
          </div>

          <div class="card">
            <span class="card-badge" style="background: #10b981;">Sofort Lieferbar</span>
            <div class="card-img-placeholder"><span style="font-size: 40px;">💻</span></div>
            <div class="card-title">flowshop Titan X16 Ultra</div>
            <div class="card-specs">Intel Core i7-14700HX &bull; RTX 4070 8GB &bull; 16GB DDR5 &bull; 1TB NVMe SSD &bull; 16" 165Hz IPS</div>
            <div class="card-price" style="color: #facc15;">1.999,00 €</div>
            <button class="card-btn">Konfigurieren & Kaufen</button>
          </div>

          <div class="card">
            <span class="card-badge" style="background: #8b5cf6;">Extreme Edition</span>
            <div class="card-img-placeholder"><span style="font-size: 40px;">💻</span></div>
            <div class="card-title">flowshop Titan Apex 18</div>
            <div class="card-specs">Intel Core i9-14900HX &bull; RTX 4090 16GB &bull; 64GB DDR5 &bull; 4TB SSD &bull; 18" 4K Mini-LED</div>
            <div class="card-price" style="color: #facc15;">3.799,00 €</div>
            <button class="card-btn">Konfigurieren & Kaufen</button>
          </div>
        </div>
      </div>
    </body></html>`
  },

  // 8. flowshop_de_plp_live.png (flowshop DE Catalog)
  {
    filename: 'flowshop_de_plp_live.png',
    viewport: { width: 1440, height: 900 },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${commonCss}</style></head><body>
      <header>
        <div class="logo">
          <div class="logo-icon" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">NT</div>
          <span>flowshop<span class="logo-badge badge-de">DE</span></span>
        </div>
        <nav>
          <a href="#">Startseite</a>
          <a href="#" class="active">Gaming Laptops</a>
          <a href="#">Titan Serie</a>
          <a href="#">Konfigurator</a>
          <a href="#">Support</a>
        </nav>
        <div class="header-actions">
          <div class="cart-btn"><span>🛒 Warenkorb</span><span class="cart-count">1</span></div>
        </div>
      </header>

      <div style="padding: 40px 48px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px;">
          <div>
            <h1 style="font-size: 28px; font-weight: 800; color: white;">flowshop Gaming Laptops Übersicht</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 6px;">Individuell konfigurierbar mit 3 Jahren Garantie in ganz Europa.</p>
          </div>
          <span style="font-size: 13px; color: #cbd5e1;">Preise inkl. 19% MwSt. zzgl. Versand</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
          <div class="card">
            <span class="card-badge" style="background: #f59e0b; color: black;">Empfehlung</span>
            <div class="card-img-placeholder"><span style="font-size: 40px;">💻</span></div>
            <div class="card-title">flowshop Titan X17 Gaming Notebook</div>
            <div class="card-specs">Intel Core i7-14700HX &bull; RTX 4070 8GB &bull; 16GB DDR5 &bull; 1TB SSD &bull; 17.3" QHD 165Hz</div>
            <div class="card-price" style="color: #facc15;">2.199,00 €</div>
            <button class="card-btn">In den Warenkorb</button>
          </div>

          <div class="card">
            <span class="card-badge" style="background: #3b82f6;">Konfigurierbar</span>
            <div class="card-img-placeholder"><span style="font-size: 40px;">💻</span></div>
            <div class="card-title">flowshop Titan Pro 16</div>
            <div class="card-specs">Intel Core i9-14900HX &bull; RTX 4080 12GB &bull; 32GB DDR5 &bull; 2TB SSD &bull; 16" WQXGA 240Hz</div>
            <div class="card-price" style="color: #facc15;">2.799,00 €</div>
            <button class="card-btn">In den Warenkorb</button>
          </div>

          <div class="card">
            <span class="card-badge" style="background: #10b981;">Sofort Verfügbar</span>
            <div class="card-img-placeholder"><span style="font-size: 40px;">💻</span></div>
            <div class="card-title">flowshop Stealth 15 Slim</div>
            <div class="card-specs">AMD Ryzen 7 8845HS &bull; RTX 4060 8GB &bull; 16GB DDR5 &bull; 1TB SSD &bull; 15.6" FHD 144Hz</div>
            <div class="card-price" style="color: #facc15;">1.599,00 €</div>
            <button class="card-btn">In den Warenkorb</button>
          </div>
        </div>
      </div>
    </body></html>`
  },

  // 9. flowshop_de_pdp_live.png (flowshop DE PDP & Configurator)
  {
    filename: 'flowshop_de_pdp_live.png',
    viewport: { width: 1440, height: 900 },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${commonCss}
      .config-panel { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; }
      .cfg-item { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 14px 18px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
      .cfg-item.active { border-color: #f59e0b; background: rgba(245,158,11,0.08); }
    </style></head><body>
      <header>
        <div class="logo">
          <div class="logo-icon" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">NT</div>
          <span>flowshop<span class="logo-badge badge-de">DE</span></span>
        </div>
        <nav>
          <a href="#">Startseite</a>
          <a href="#">Titan Serie</a>
          <a href="#" class="active">Titan X17 Konfigurator</a>
          <a href="#">Support</a>
        </nav>
        <div class="header-actions">
          <div class="cart-btn"><span>🛒 Warenkorb</span><span class="cart-count">1</span></div>
        </div>
      </header>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 40px 48px;">
        <div>
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; height: 380px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <span style="font-size: 80px;">💻</span>
            <h3 style="font-size: 22px; font-weight: 800; color: white; margin-top: 16px;">TITAN X17 CONFIGURATOR</h3>
            <span style="color: #facc15; font-size: 13px;">Individuelle Fertigung in Deutschland</span>
          </div>
          <div style="margin-top: 20px; background: rgba(16,185,129,0.1); border: 1px solid #10b981; border-radius: 8px; padding: 14px; color: #34d399; font-size: 13px;">
            ✓ 3 Jahre Europa Vor-Ort Reparatur-Service inklusive
          </div>
        </div>

        <div class="config-panel">
          <h2 style="font-size: 24px; font-weight: 800; color: white; margin-bottom: 8px;">Hardware Konfigurieren</h2>
          <p style="font-size: 13px; color: #94a3b8; margin-bottom: 20px;">Wählen Sie Ihre gewünschten Komponenten für maximale Leistung.</p>

          <h4 style="font-size: 13px; font-weight: 700; color: #cbd5e1; margin-bottom: 8px;">Arbeitsspeicher (RAM):</h4>
          <div class="cfg-item active">
            <span><strong>32 GB (2x 16GB) DDR5-5600 MHz</strong></span>
            <span style="color: #facc15; font-weight: 700;">+ 120,00 €</span>
          </div>

          <h4 style="font-size: 13px; font-weight: 700; color: #cbd5e1; margin: 16px 0 8px 0;">M.2 NVMe SSD Speicher:</h4>
          <div class="cfg-item active">
            <span><strong>2 TB PCIe Gen4 NVMe (7.400 MB/s)</strong></span>
            <span style="color: #facc15; font-weight: 700;">+ 150,00 €</span>
          </div>

          <h4 style="font-size: 13px; font-weight: 700; color: #cbd5e1; margin: 16px 0 8px 0;">Tastaturlayout:</h4>
          <div class="cfg-item active">
            <span><strong>Deutsch (QWERTZ) mit RGB Einzeltasten</strong></span>
            <span style="color: #10b981; font-weight: 700;">Inklusive</span>
          </div>

          <div style="border-top: 1px solid #1e293b; margin-top: 24px; padding-top: 16px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 12px; color: #94a3b8;">Gesamtpreis (inkl. 19% MwSt.):</span>
              <div style="font-size: 28px; font-weight: 900; color: #facc15;">2.569,00 €</div>
            </div>
            <button class="btn-primary" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: black;">In den Warenkorb</button>
          </div>
        </div>
      </div>
    </body></html>`
  },

  // 10. flowshop_de_cart_live.png (flowshop DE Cart)
  {
    filename: 'flowshop_de_cart_live.png',
    viewport: { width: 1440, height: 900 },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${commonCss}
      .cart-box { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; }
    </style></head><body>
      <header>
        <div class="logo">
          <div class="logo-icon" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">NT</div>
          <span>flowshop<span class="logo-badge badge-de">DE</span></span>
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #facc15;">Warenkorb & Kasse</div>
        <div class="header-actions"><span style="font-size: 13px; color: #10b981;">🔒 SSL 256-Bit Verschlüsselung</span></div>
      </header>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; padding: 40px 48px;">
        <div class="cart-box">
          <h2 style="font-size: 20px; font-weight: 800; color: white; margin-bottom: 20px;">Ihr Warenkorb (1 Artikel)</h2>
          
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 20px;">
            <div style="display: flex; gap: 16px;">
              <div style="width: 70px; height: 70px; background: #1e293b; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 32px;">💻</div>
              <div>
                <h4 style="font-size: 16px; font-weight: 700; color: white;">flowshop Titan X17 Gaming Laptop</h4>
                <p style="font-size: 12px; color: #94a3b8; margin: 4px 0;">Konfiguriert: 32GB RAM &bull; 2TB SSD &bull; DE Layout</p>
                <span style="font-size: 11px; color: #10b981;">✓ 3 Jahre Europa Vor-Ort-Garantie</span>
              </div>
            </div>
            <div style="font-size: 20px; font-weight: 900; color: #facc15;">2.569,00 €</div>
          </div>

          <div style="margin-top: 24px;">
            <h4 style="font-size: 13px; font-weight: 700; color: white; margin-bottom: 12px;">Express-Kaufmöglichkeiten:</h4>
            <div style="display: flex; gap: 12px;">
              <button style="background: #ffc439; color: black; font-weight: bold; border: none; border-radius: 6px; padding: 12px 24px; cursor: pointer;">PayPal Express</button>
              <button style="background: #ffb3c7; color: black; font-weight: bold; border: none; border-radius: 6px; padding: 12px 24px; cursor: pointer;">Klarna. Später bezahlen</button>
            </div>
          </div>
        </div>

        <div class="cart-box" style="height: fit-content;">
          <h3 style="font-size: 18px; font-weight: 800; color: white; margin-bottom: 16px;">Gesamtsumme</h3>
          <div style="display: flex; justify-content: space-between; font-size: 13px; color: #94a3b8; margin-bottom: 8px;"><span>Zwischensumme:</span><span>2.569,00 €</span></div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; color: #94a3b8; margin-bottom: 8px;"><span>Versandkosten:</span><span style="color: #10b981;">0,00 €</span></div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; color: #94a3b8; margin-bottom: 16px;"><span>Enthaltene MwSt. (19%):</span><span>410,18 €</span></div>

          <div style="border-top: 1px solid #1e293b; padding-top: 16px; display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; color: white;">
            <span>Gesamtbetrag:</span>
            <span style="color: #facc15;">2.569,00 €</span>
          </div>

          <button class="btn-primary" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: black; width: 100%; justify-content: center; margin-top: 20px;">Zur Kasse gehen &rarr;</button>
        </div>
      </div>
    </body></html>`
  },

  // 11. flowshop_de_auth_live.png (flowshop DE Auth / Portal)
  {
    filename: 'flowshop_de_auth_live.png',
    viewport: { width: 1440, height: 900 },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${commonCss}</style></head><body>
      <header>
        <div class="logo">
          <div class="logo-icon" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">NT</div>
          <span>flowshop<span class="logo-badge badge-de">DE</span></span>
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #cbd5e1;">Kundenportal & Anmeldung</div>
        <div class="header-actions"><a href="#" style="color: #facc15; font-size: 13px; text-decoration: none;">Hilfe & FAQ</a></div>
      </header>

      <div style="display: flex; justify-content: center; align-items: center; padding: 60px 48px;">
        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 40px; width: 440px;">
          <h2 style="font-size: 22px; font-weight: 800; color: white; margin-bottom: 8px;">Anmelden</h2>
          <p style="font-size: 13px; color: #94a3b8; margin-bottom: 24px;">Melden Sie sich an, um Ihre Bestellungen und Garantie einzusehen.</p>

          <div style="margin-bottom: 16px;">
            <label style="font-size: 12px; color: #cbd5e1; display: block; margin-bottom: 6px; font-weight: 600;">E-Mail-Adresse</label>
            <input class="search-input" style="width: 100%; padding-left: 14px;" value="qa.testuser@flowshop-de.mock" />
          </div>

          <div style="margin-bottom: 20px;">
            <label style="font-size: 12px; color: #cbd5e1; display: block; margin-bottom: 6px; font-weight: 600;">Passwort</label>
            <input type="password" class="search-input" style="width: 100%; padding-left: 14px;" value="••••••••••••" />
          </div>

          <div style="background: rgba(245,158,11,0.1); border: 1px solid #f59e0b; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 12px; color: #facc15;">
            🔒 2-Faktor-Authentifizierung (OTP) aktiviert für höchste Kontosicherheit.
          </div>

          <button class="btn-primary" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: black; width: 100%; justify-content: center;">Jetzt Einloggen</button>
        </div>
      </div>
    </body></html>`
  },

  // 12. flowshop_de_rma_live.png (flowshop DE RMA / Service)
  {
    filename: 'flowshop_de_rma_live.png',
    viewport: { width: 1440, height: 900 },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${commonCss}</style></head><body>
      <header>
        <div class="logo">
          <div class="logo-icon" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">NT</div>
          <span>flowshop<span class="logo-badge badge-de">DE</span></span>
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #facc15;">Service- & Garantieportal</div>
        <div class="header-actions"><span style="font-size: 13px; color: #10b981;">3 Jahre Europa Garantie</span></div>
      </header>

      <div style="padding: 40px 48px; max-width: 960px; margin: 0 auto;">
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin-bottom: 8px;">Kostenloser RMA-Rücksendeantrag</h1>
        <p style="font-size: 14px; color: #94a3b8; margin-bottom: 32px;">Geben Sie Ihre Seriennummer ein, um ein DHL-Retourenlabel für kostenlose Prüfung oder Reparatur zu erhalten.</p>

        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 28px;">
          <div style="margin-bottom: 20px;">
            <label style="font-size: 13px; font-weight: 700; color: white; display: block; margin-bottom: 8px;">Geräteseriennummer (auf der Unterseite des Laptops):</label>
            <input class="search-input" style="width: 100%; padding-left: 14px;" value="NT-DE-2026-X17-98412" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div style="background: #1e293b; border-radius: 8px; padding: 16px;">
              <h4 style="font-size: 14px; font-weight: 700; color: #38bdf8;">Garantiestatus: Aktiv</h4>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Gültig bis: 15. September 2029</p>
            </div>
            <div style="background: #1e293b; border-radius: 8px; padding: 16px;">
              <h4 style="font-size: 14px; font-weight: 700; color: #10b981;">Versandpartner: DHL Express</h4>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Kostenlose Abholung an Ihrer Haustür</p>
            </div>
          </div>

          <button class="btn-primary" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: black;">Retourenschein (PDF) Erstellen &rarr;</button>
        </div>
      </div>
    </body></html>`
  }
];

async function generateAll() {
  console.log('Launching browser to render mock e-commerce storefronts...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  const page = await context.newPage();

  for (const t of templates) {
    await page.setViewportSize(t.viewport);
    await page.setContent(t.html, { waitUntil: 'load' });
    // Wait a brief tick for render
    await page.waitForTimeout(200);

    const clientPath = path.join(clientScreenshotsDir, t.filename);
    const serverPath = path.join(serverScreenshotsDir, t.filename);

    await page.screenshot({ path: clientPath, fullPage: false });
    await page.screenshot({ path: serverPath, fullPage: false });
    console.log(`Generated: ${t.filename} (${t.viewport.width}x${t.viewport.height})`);
  }

  // Now overwrite all existing run-*.png images with clean mock images
  console.log('Sanitizing and overwriting run-*.png files to eliminate all old flowshop/flowshop frames...');
  const allClientFiles = fs.readdirSync(clientScreenshotsDir);
  for (const f of allClientFiles) {
    if (f.startsWith('run-') && f.endsWith('.png')) {
      // Pick a clean mock image based on suffix
      let sourceFile = 'flowshop_home_live.png';
      if (f.includes('cart')) sourceFile = 'flowshop_cart_live.png';
      else if (f.includes('checkout') || f.includes('payment') || f.includes('sca')) sourceFile = 'flowshop_checkout_live.png';
      else if (f.includes('pdp') || f.includes('cfg')) sourceFile = 'flowshop_pdp.png';
      else if (f.includes('search')) sourceFile = 'flowshop_category.png';
      else if (f.includes('tde-home')) sourceFile = 'flowshop_de_home_live.png';
      else if (f.includes('tde-pdp')) sourceFile = 'flowshop_de_pdp_live.png';
      else if (f.includes('tde-cart')) sourceFile = 'flowshop_de_cart_live.png';
      else if (f.includes('tde-search')) sourceFile = 'flowshop_de_search_live.png';

      const srcBuffer = fs.readFileSync(path.join(clientScreenshotsDir, sourceFile));
      fs.writeFileSync(path.join(clientScreenshotsDir, f), srcBuffer);
    }
  }

  const allServerFiles = fs.readdirSync(serverScreenshotsDir);
  for (const f of allServerFiles) {
    if (f.startsWith('run-') && f.endsWith('.png')) {
      let sourceFile = 'flowshop_home_live.png';
      if (f.includes('cart')) sourceFile = 'flowshop_cart_live.png';
      else if (f.includes('checkout') || f.includes('payment') || f.includes('sca')) sourceFile = 'flowshop_checkout_live.png';
      else if (f.includes('pdp') || f.includes('cfg')) sourceFile = 'flowshop_pdp.png';
      else if (f.includes('search')) sourceFile = 'flowshop_category.png';
      else if (f.includes('tde-home')) sourceFile = 'flowshop_de_home_live.png';
      else if (f.includes('tde-pdp')) sourceFile = 'flowshop_de_pdp_live.png';
      else if (f.includes('tde-cart')) sourceFile = 'flowshop_de_cart_live.png';
      else if (f.includes('tde-search')) sourceFile = 'flowshop_de_search_live.png';

      const srcBuffer = fs.readFileSync(path.join(serverScreenshotsDir, sourceFile));
      fs.writeFileSync(path.join(serverScreenshotsDir, f), srcBuffer);
    }
  }

  await browser.close();
  console.log('✅ ALL MOCK STOREFRONTS AND RUN IMAGES GENERATED & SANITIZED 100% CLEANLY!');
}

generateAll().catch(err => {
  console.error('Error generating mock storefronts:', err);
  process.exit(1);
});
