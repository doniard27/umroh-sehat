# 📖 Panduan Instalasi & Deployment — Umroh Sehat

Dokumen ini berisi panduan lengkap langkah demi langkah untuk menjalankan aplikasi **Umroh Sehat** di lingkungan lokal (*development*) maupun menyebarkannya ke server produksi (*production deployment*).

---

## 📋 Daftar Isi
1. [Spesifikasi & Prasyarat Sistem](#1-spesifikasi--prasyarat-sistem)
2. [Instalasi di Lingkungan Lokal](#2-instalasi-di-lingkungan-lokal)
3. [Konfigurasi Environment Variables (`.env`)](#3-konfigurasi-environment-variables-env)
4. [Inisialisasi & Seeding Database](#4-inisialisasi--seeding-database)
5. [Opsi Deploy 1: VPS Linux (Ubuntu + PM2 + Nginx + SSL) [Direkomendasikan]](#5-opsi-deploy-1-vps-linux-ubuntu--pm2--nginx--ssl-direkomendasikan)
6. [Opsi Deploy 2: Platform Cloud (Vercel / Railway / Render)](#6-opsi-deploy-2-platform-cloud-vercel--railway--render)
7. [Akun Admin Default & Keamanan](#7-akun-admin-default--keamanan)
8. [Perawatan & Backup Rutin](#8-perawatan--backup-rutin)

---

## 1. Spesifikasi & Prasyarat Sistem

- **Node.js**: Versi `18.17.0` atau `20.x` (LTS direkomendasikan)
- **Package Manager**: `npm` (bawaan Node.js), `pnpm`, atau `yarn`
- **Database**: SQLite (bawaan, zero-config) atau PostgreSQL / MySQL
- **Sistem Operasi**: macOS, Linux (Ubuntu 20.04/22.04/24.04), atau Windows (WSL2)

---

## 2. Instalasi di Lingkungan Lokal

### Langkah 1: Masuk ke Direktori Proyek
```bash
cd "Umroh Sehat"
```

### Langkah 2: Install Dependensi
```bash
npm install
```

### Langkah 3: Siapkan File Konfigurasi `.env`
Periksa file `.env` di direktori utama:
```env
DATABASE_URL="file:./prisma/dev.db"
SESSION_SECRET="umroh-sehat-super-secret-key-change-this-in-production-min-32-chars"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"
```

### Langkah 4: Jalankan Migrasi & Seed Database
```bash
# Sinkronisasi skema prisma ke database
npx prisma db push

# Isi data awal bawaan (Paket, Artikel, Testimoni, Akun Admin, Pengaturan)
npx prisma db seed
```

### Langkah 5: Jalankan Server Development
```bash
npm run dev
```
Buka browser di: **`http://localhost:3000`**

---

## 3. Konfigurasi Environment Variables (`.env`)

| Variabel | Deskripsi | Contoh Nilai Produksi |
|---|---|---|
| `DATABASE_URL` | Lokasi koneksi database Prisma | `file:./prisma/dev.db` (SQLite) atau URL PostgreSQL |
| `SESSION_SECRET` | Kunci enkripsi cookie sesi (min. 32 karakter acak) | `9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a` |
| `NEXT_PUBLIC_SITE_URL` | Domain publik website | `https://umrohsehat.com` |
| `NODE_ENV` | Mode lingkungan aplikasi | `production` |

---

## 4. Inisialisasi & Seeding Database

Jika Anda ingin mereset atau mengisi ulang database dengan data awal bawaan:
```bash
# Reset database SQLite
npx prisma db push --force-reset

# Jalankan seeder
npx prisma db seed
```

---

## 5. Opsi Deploy 1: VPS Linux (Ubuntu + PM2 + Nginx + SSL) [Direkomendasikan]

Opsi ini paling ideal untuk stack bawaan karena mendukung database SQLite lokal dan penyimpanan foto upload secara langsung tanpa biaya layanan eksternal.

### Langkah 1: Persiapan Server VPS
Hubungkan ke VPS Anda via SSH:
```bash
ssh root@ip-server-anda
```

Update repositori dan install Node.js 20 LTS & Nginx:
```bash
# Update Ubuntu
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Install Process Manager (PM2) secara global
sudo npm install -g pm2
```

### Langkah 2: Deploy Kode Proyek ke VPS
```bash
# Buat folder aplikasi
mkdir -p /var/www/umrohsehat
cd /var/www/umrohsehat

# Clone repository atau upload source code
git clone <URL_REPO_ANDA> .

# Install dependensi
npm install --production=false

# Setup .env untuk produksi
cp .env.example .env 2>/dev/null || true
nano .env
```
> Pastikan `NODE_ENV="production"` dan `NEXT_PUBLIC_SITE_URL="https://domainanda.com"`.

### Langkah 3: Setup Database & Build Next.js
```bash
# Setup folder upload dan database
mkdir -p public/uploads prisma
npx prisma db push
npx prisma db seed

# Build Next.js
npm run build
```

### Langkah 4: Jalankan Aplikasi Menggunakan PM2
```bash
# Jalankan Next.js dengan nama service 'umroh-sehat'
pm2 start npm --name "umroh-sehat" -- start

# Simpan agar otomatis hidup saat server reboot
pm2 save
pm2 startup
```

### Langkah 5: Konfigurasi Reverse Proxy Nginx
Buat file konfigurasi Nginx:
```bash
sudo nano /etc/nginx/sites-available/umrohsehat
```

Masukkan konfigurasi berikut (ganti `domainanda.com` dengan domain Anda):
```nginx
server {
    listen 80;
    server_name domainanda.com www.domainanda.com;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan konfigurasi dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/umrohsehat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Langkah 6: Pasang SSL Gratis (HTTPS) dengan Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d domainanda.com -d www.domainanda.com
```

Website Anda kini aktif di **`https://domainanda.com`** dengan enkripsi SSL resmi! 🎉

---

## 6. Opsi Deploy 2: Platform Cloud (Vercel / Railway / Render)

### Deploy ke Vercel:
1. Hubungkan repository GitHub/GitLab Anda ke [Vercel](https://vercel.com).
2. **PENTING**: Karena Vercel menggunakan *serverless ephemeral filesystem*, gunakan database cloud (seperti **Supabase PostgreSQL**, **Neon.tech**, atau **PlanetScale**) dan ganti `provider = "postgresql"` di `prisma/schema.prisma`.
3. Masukkan Environment Variables di Dashboard Vercel:
   - `DATABASE_URL` = `postgresql://...`
   - `SESSION_SECRET` = `kunci_acak_minimal_32_karakter`
   - `NEXT_PUBLIC_SITE_URL` = `https://nama-project.vercel.app`
4. Klik **Deploy**.

---

## 7. Akun Admin & Keamanan

Setelah database di-seed, akun admin pertama menggunakan email `admin@umrohsehat.com`.

> ⚠️ **PENTING — WAJIB DILAKUKAN SEBELUM GO-LIVE:**
> 1. Login pertama kali, lalu **SEGERA ganti password** di menu **Profil Admin (`/admin/profil`)** dengan password kuat (min. 12 karakter, kombinasi huruf besar/kecil & angka).
> 2. Jangan pernah menuliskan password di dokumentasi, repo publik, atau chat.
> 3. Jangan biarkan form login terisi otomatis — pastikan form login selalu kosong.
> 4. Aktifkan rate limit login (sudah bawaan aplikasi: 5 percobaan gagal → terkunci sementara).
> 5. Untuk produksi, gunakan HTTPS + reverse proxy (Nginx/Cloudflare) dan batasi akses `/admin/` bila memungkinkan.

---

## 8. Perawatan & Backup Rutin

### 1. Backup Data dari Panel Admin (GUI)
Masuk ke menu **Pengaturan (`/admin/pengaturan`)** dan klik tombol **Backup Data**. Seluruh data paket, artikel, testimoni, galeri, pesan, dan pengaturan akan terunduh otomatis dalam format JSON.

### 2. Backup Database SQLite via Server:
```bash
# Salin database ke folder cadangan
cp /var/www/umrohsehat/prisma/dev.db /backup/dev_backup_$(date +%F).db
```

### 3. Update Versi Aplikasi:
```bash
cd /var/www/umrohsehat
git pull origin main
npm install
npx prisma db push
npm run build
pm2 restart umroh-sehat
```

---

## 9. Opsi Deploy 3: Shared Hosting cPanel (Setup Node.js App)

Aplikasi **Umroh Sehat** **BISA** dideploy di shared hosting cPanel asalkan paket hosting Anda memiliki menu **"Setup Node.js App"** (tersedia di Niagahoster, DomaiNesia, IDCloudHost, Hostinger, Rumahweb, dll).

### Langkah-langkah Deploy di cPanel:

#### 1. Siapkan File di Komputer Lokal
Di komputer lokal Anda, lakukan build terlebih dahulu agar tidak membebani memori RAM cPanel:
```bash
npm install
npm run build
```
Pastikan file `server.js` ada di folder utama proyek (sudah disediakan).

#### 2. Compress File Proyek Menjadi `.zip`
Kecualikan folder `node_modules` (agar ukuran zip kecil). File yang wajib ada di dalam zip:
- `.next/` (folder hasil build)
- `public/`
- `prisma/`
- `src/`
- `package.json`
- `server.js`
- `next.config.mjs`
- `tailwind.config.ts`
- `tsconfig.json`

#### 3. Buat Node.js App di cPanel
1. Login ke cPanel hosting Anda.
2. Cari menu **Setup Node.js App** (di bawah kategori *Software*).
3. Klik tombol **Create Application**.
4. Isi form:
   - **Node.js version**: Pilih `20.x` atau `18.x`.
   - **Application mode**: Pilih `Production`.
   - **Application root**: Isi nama folder, misal `umrohsehat`.
   - **Application URL**: Pilih domain Anda (misal `domainanda.com`).
   - **Application startup file**: Isi `server.js`.
5. Klik **Create**.

#### 4. Upload & Ekstrak File di File Manager
1. Buka menu **File Manager** di cPanel.
2. Masuk ke folder aplikasi yang tadi dibuat (misal `umrohsehat/`).
3. Upload file `.zip` tadi lalu klik **Extract**.

#### 5. Install Dependencies & Setup Database
1. Kembali ke menu **Setup Node.js App** di cPanel.
2. Pada bagian atas terdapat perintah *Virtual Environment* (misal: `source /home/user/nodevenv/umrohsehat/20/bin/activate`). Salin perintah tersebut.
3. Buka menu **Terminal** di cPanel.
4. Tempelkan perintah aktivasi tadi lalu jalankan:
```bash
# Pindah ke folder app
cd ~/umrohsehat

# Install dependensi produksi
npm install --production

# Setup database SQLite & seeder
npx prisma db push
npx prisma db seed
```

#### 6. Restart Aplikasi di cPanel
1. Kembali ke menu **Setup Node.js App** di cPanel.
2. Tambahkan **Environment Variables** di bagian bawah:
   - `SESSION_SECRET`: `kunci_acak_min_32_karakter`
   - `NEXT_PUBLIC_SITE_URL`: `https://domainanda.com`
   - `NODE_ENV`: `production`
3. Klik tombol **Restart Application**.
4. Buka domain website Anda di browser.
