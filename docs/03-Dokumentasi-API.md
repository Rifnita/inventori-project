````markdown
# 03. Dokumentasi RESTful API

Dokumentasi ini menjelaskan endpoint yang tersedia pada layanan backend, yang berjalan pada Google Cloud Run.

**Base URL:** `https://inventori-backend-894858667370.us-central1.run.app/api`

---

## 1. Otentikasi (Auth)

Semua endpoint kecuali `/api/auth/login` dan `/api/auth/register` (jika ada) membutuhkan token otorisasi.

### 1.1 Login Pengguna

| Detail | Deskripsi |
| :--- | :--- |
| **Endpoint** | `/api/auth/login` |
| **Metode** | `POST` |
| **Deskripsi** | Digunakan untuk otentikasi pengguna dan mendapatkan **JSON Web Token (JWT)**. |

**Request Body (JSON):**
```json
{
  "username": "nama_pengguna",
  "password": "kata_sandi"
}
````

**Response Sukses (200 OK):**

```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDUifQ.SflKxwR",
  "user": {
    "id": "12345",
    "username": "nama_pengguna"
  }
}
```

> **Header Otorisasi:** Gunakan token yang didapat pada setiap request terproteksi dengan skema **Bearer Token**.
> `Authorization: Bearer <TOKEN_JWT_ANDA>`

-----

## 2\. Manajemen Barang (Items)

### 2.1 Mendapatkan Semua Barang

| Detail | Deskripsi |
| :--- | :--- |
| **Endpoint** | `/api/items` |
| **Metode** | `GET` |
| **Deskripsi** | Mengambil daftar semua barang inventori. |
| **Otorisasi** | Ya (Bearer Token) |

**Parameter Query (Opsional):**

| Parameter | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `limit` | Integer | Batas jumlah barang yang ditampilkan per halaman. |
| `page` | Integer | Nomor halaman yang ingin diambil. |

**Response Sukses (200 OK):**

```json
[
  {
    "id": "item-001",
    "nama": "Mouse Wireless Logitech",
    "sku": "LGT-M01",
    "stok": 50,
    "unit": "pcs",
    "harga": 150000
  },
  // ... barang lainnya
]
```

### 2.2 Menambah Barang Baru

| Detail | Deskripsi |
| :--- | :--- |
| **Endpoint** | `/api/items` |
| **Metode** | `POST` |
| **Deskripsi** | Menambahkan entri barang baru ke dalam inventori. |
| **Otorisasi** | Ya (Bearer Token) |

**Request Body (JSON):**

```json
{
  "nama": "Monitor LED 24 Inci",
  "sku": "SAMS-M24",
  "stok": 25,
  "unit": "unit",
  "harga": 2200000
}
```

**Response Sukses (201 Created):**
Mengembalikan objek barang yang baru dibuat beserta ID-nya.

-----

## 3\. Manajemen Transaksi (Transactions)

### 3.1 Mencatat Transaksi Barang

| Detail | Deskripsi |
| :--- | :--- |
| **Endpoint** | `/api/transactions` |
| **Metode** | `POST` |
| **Deskripsi** | Mencatat transaksi **masuk** (restock) atau **keluar** (penjualan/penggunaan) dan secara otomatis memperbarui stok barang. |
| **Otorisasi** | Ya (Bearer Token) |

**Request Body (JSON):**

```json
{
  "item_id": "item-001",
  "jumlah": 5,
  "tipe": "keluar", // Nilai harus 'masuk' atau 'keluar'
  "keterangan": "Penjualan ke Toko Bintang"
}
```

**Response Sukses (201 Created):**

```json
{
  "id": "trx-005",
  "item_id": "item-001",
  "jumlah": 5,
  "tipe": "keluar",
  "stok_sebelum": 50,
  "stok_sesudah": 45,
  "tanggal": "2025-12-12T14:00:00Z"
}
```

````