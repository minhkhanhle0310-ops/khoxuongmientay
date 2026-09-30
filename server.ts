import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_FILE = path.resolve(DATA_DIR, 'store.json');

interface StoreData {
  adminPass: string;
  listings: any[];
  leads: any[];
}

function loadStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        adminPass: parsed.adminPass || 'khanhkhoxuongmientay123@!',
        listings: Array.isArray(parsed.listings) ? parsed.listings : [],
        leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      };
    }
  } catch (err) {
    console.error('Error loading store.json:', err);
  }

  return {
    adminPass: 'khanhkhoxuongmientay123@!',
    listings: [],
    leads: [],
  };
}

function saveStore(data: StoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store.json:', err);
  }
}

let store = loadStore();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Check admin setup status (does not expose password)
  app.get('/api/admin/check-status', (_req, res) => {
    res.json({
      hasCustomPass: store.adminPass !== 'khanhkhoxuongmientay123@!',
    });
  });

  // Admin Login
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu!' });
    }
    if (password === store.adminPass) {
      return res.json({ success: true, message: 'Đăng nhập thành công!' });
    } else {
      return res.status(401).json({ success: false, message: 'Mật khẩu quản trị không chính xác!' });
    }
  });

  // Admin Change Password - updates store and persists across all clients
  app.post('/api/admin/change-password', (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 4 ký tự!',
      });
    }

    if (currentPassword !== undefined && currentPassword !== null) {
      if (currentPassword !== store.adminPass) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu hiện tại không chính xác!',
        });
      }
    }

    store.adminPass = newPassword.trim();
    saveStore(store);

    console.log('[Security] Admin password updated and synced globally.');
    return res.json({
      success: true,
      message: 'Mật khẩu quản trị đã được cập nhật và đồng bộ cho tất cả các thiết bị!',
    });
  });

  // Get all listings
  app.get('/api/listings', (_req, res) => {
    res.json(store.listings);
  });

  // Create new listing
  app.post('/api/listings', (req, res) => {
    const newListing = {
      ...req.body,
      id: Date.now(),
    };
    store.listings = [newListing, ...store.listings];
    saveStore(store);
    res.json({ success: true, listing: newListing });
  });

  // Update listing
  app.put('/api/listings/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updatedListing = {
      ...req.body,
      id,
    };
    store.listings = store.listings.map((item) => (item.id === id ? updatedListing : item));
    saveStore(store);
    res.json({ success: true, listing: updatedListing });
  });

  // Delete listing
  app.delete('/api/listings/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    store.listings = store.listings.filter((item) => item.id !== id);
    saveStore(store);
    res.json({ success: true });
  });

  // Get all leads
  app.get('/api/leads', (_req, res) => {
    res.json(store.leads);
  });

  // Submit lead
  app.post('/api/leads', (req, res) => {
    const { name, phone, note } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Số điện thoại là bắt buộc!' });
    }

    const now = new Date();
    const timeString = now.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const newLead = {
      id: Date.now(),
      time: timeString,
      name: name || 'Khách hàng gửi yêu cầu',
      phone,
      note: note || '',
    };

    store.leads = [newLead, ...store.leads];
    saveStore(store);
    res.json({ success: true, lead: newLead });
  });

  // Delete lead
  app.delete('/api/leads/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    store.leads = store.leads.filter((l) => l.id !== id);
    saveStore(store);
    res.json({ success: true });
  });

  // --- VITE MIDDLEWARE / STATIC ASSETS ---
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
