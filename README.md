# Proyek: Aplikasi Sosial Media Sederhana (Post Management)

Aplikasi website ini adalah bagian dari proyek UTS untuk mata kuliah Pengembangan Aplikasi Berbasis Web (PABWE) yang fokus pada implementasi antarmuka pengguna (UI) untuk manajemen postingan, menggunakan **React** dan **Redux** untuk manajemen state.

Url proyek resmi dapat diakses disini: https://11s23050-proyek-posts.vercel.app/

## 👤 Informasi Pengembang

| :------- | :----------------------- |
| **Nama** | Zefanya Ecklezia Saragih |
| **NIM** | 11S23050 |

---

## 🚀 Ikhtisar Proyek

Komponen utama yang disorot dalam kode ini adalah **`HomePage.jsx`**, yang berfungsi sebagai _timeline_ pengguna. Halaman ini memungkinkan pengguna untuk melihat daftar postingan, memfilter postingan berdasarkan kepemilikan ("Semua Pengguna" atau "Milku Saja"), serta melakukan operasi **CRUD (Create, Read, Update, Delete)** pada postingan mereka sendiri.

### Teknologi Utama

- **Frontend:** React.js
- **State Management:** Redux (dengan Async Thunks)
- **Styling:** CSS In JS (Inline Styles) dan Custom CSS (Bootstrap dan Bi-Icons)
- **Routing:** React Router DOM (digunakan oleh `useNavigate`)
- **Utilities:** SweetAlert/Custom Dialogs (digunakan oleh `showConfirmDialog`, `showSuccessDialog`)

---

## 🛠️ Fitur Utama

Berdasarkan analisis komponen `HomePage.jsx`, fitur-fitur utama yang didukung adalah:

### 1. Tampilan Timeline yang Interaktif

- **Visual Menarik:** Menggunakan latar belakang gradien animasi dan efek bayangan/transisi yang modern.
- **Fade-in Animation:** Halaman dimuat dengan efek _fade-in_ yang halus.

### 2. Manajemen Postingan (CRUD Interface)

- **Create (Buat):** Tombol **"Buat Post Baru"** membuka `AddModal`.
- **Read (Baca):** Daftar postingan (`PostCard`) ditampilkan secara _live_ dari state Redux. Mengklik post akan menavigasi ke halaman detail (`/posts/:id`).
- **Update (Ubah):** Tombol **Edit** (hanya muncul untuk post milik sendiri) membuka `ChangeModal`.
- **Delete (Hapus):** Tombol **Hapus** (hanya muncul untuk post milik sendiri) memicu dialog konfirmasi sebelum menghapus post.

### 3. Filter Data

- **Filter Kepemilikan:** Pengguna dapat beralih antara melihat **"Postingan Saya Saja"** atau **"Semua Postingan Pengguna"** menggunakan dropdown.
- **Statistik Real-time:** Menampilkan jumlah total postingan yang sedang ditampilkan berdasarkan filter aktif.

### 4. Responsif dan Komponen Modular

- **Layout:** Konten utama diatur untuk mengakomodasi lebar sidebar tetap (`SIDEBAR_WIDTH = 250px`).
- **Modularitas:** Menggunakan komponen terpisah seperti `PostCard`, `AddModal`, dan `ChangeModal`.

---

## 📂 Struktur Komponen Kunci (`HomePage.jsx`)

| Elemen                  | Deskripsi                                                                                                                                                         |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **State Redux**         | `profile`, `posts`, `isPostDeleted` (untuk pemicu refresh).                                                                                                       |
| **Local State**         | `ownerFilter` (kontrol filter "mine" vs "all"), `showAddModal`, `showChangeModal`, `selectedPostId`.                                                              |
| **`useEffect` Hooks**   | Mengambil data post saat filter berubah dan memuat ulang data setelah operasi hapus post berhasil.                                                                |
| **`isPostCreatedByMe`** | Logika yang kompleks untuk memverifikasi kepemilikan post berdasarkan berbagai kemungkinan properti ID (`user_id`, `user.id`, `author.id`, dll.) pada objek post. |
| **`displayedPosts`**    | Array post hasil filter berdasarkan `ownerFilter`.                                                                                                                |
| **UI Control Card**     | Kotak berwarna gradien yang berisi statistik jumlah post dan kontrol filter/tombol tambah post.                                                                   |
| **Post Timeline Area**  | Area yang menampilkan post dalam komponen `PostCard` dan menangani _hover_ visual pada setiap post.                                                               |

---

## ⚙️ Cara Menggunakan

Untuk menjalankan proyek ini (dengan asumsi sudah ada _boilerplate_ React/Redux):

1.  **Dependencies:** Pastikan Anda telah menginstal paket-paket berikut:
    ```bash
    bun install react react-dom react-redux react-router-dom
    # Tambahkan library untuk dialog
    # bun install sweetalert2 (atau library dialog yang digunakan toolsHelper)
    ```
2.  **Jalankan Aplikasi:**
    ```bash
    bun run dev
    ```
3.  **Akses:** Komponen `HomePage` akan terlihat di rute utama aplikasi Anda (`/` atau sesuai konfigurasi router).
