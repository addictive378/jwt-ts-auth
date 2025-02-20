# jwt-ts-auth
My learning process about jwt and TypeScript
# JWT

🎯 **JSON Web Token (JWT)** adalah **standar terbuka (RFC 7519)** yang digunakan untuk **mengirimkan informasi yang diverifikasi dan aman** antara dua pihak, biasanya antara **server** dan **client**, dalam bentuk **token**. JWT sangat populer untuk **autentikasi** dan **otorisasi** di aplikasi web.

---

## 🔍 **Kenapa JWT Penting?**

1️⃣ **Stateless Authentication**

- **Tanpa session di server**. Semua informasi user (seperti ID, email, role) sudah ada di token.
- Server cukup memverifikasi token, **tidak perlu menyimpan session**.

2️⃣ **Skalabilitas Tinggi**

- Cocok untuk aplikasi **microservices** karena tidak bergantung pada memori server tertentu.
- **Single Sign-On (SSO):** User bisa login satu kali untuk mengakses banyak aplikasi.

3️⃣ **Aman dan Praktis**

- Token bisa ditandatangani dengan algoritma seperti **HMAC SHA256** atau **RSA** untuk mencegah pemalsuan.

---

## 🏗 **Struktur JWT**

JWT terdiri dari **3 bagian** yang dipisahkan dengan tanda titik (`.`):

```
HEADER.PAYLOAD.SIGNATURE

1️⃣ Header (Tipe token dan algoritma yang digunakan)
{
  "alg": "HS256",
  "typ": "JWT"
}

✅ Hasil encoded (Base64Url):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

2️⃣ Payload (Data/informasi yang dikirim)Berisi klaim (claims), yaitu pernyataan tentang entitas (biasanya user) dan data tambahan.
Contoh:
{
  "id": 1,
  "email": "adi@example.com",
  "role": "admin",
  "iat": 1718925577,
  "exp": 1718930000
}
✅ Hasil encoded (Base64Url):
eyJpZCI6MSwiZW1haWwiOiJhZGlAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTg5MjU1NzcsImV4cCI6MTcxODkzMDAwMH0

3️⃣ Signature (Tanda tangan digital)Digunakan untuk memverifikasi bahwa token belum diubah. Dibuat dengan:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
✅ Contoh Signature:
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

```

## 🔒 **Bagaimana JWT Bekerja?**

1️⃣ **Login:**

- User mengirim kredensial (email & password).
- Server memverifikasi dan **menghasilkan JWT** lalu mengirimnya ke client.

2️⃣ **Mengakses Endpoint Terproteksi:**

- Client mengirim token di **Authorization Header**:

```tsx
Authorization: Bearer <token>
```

3️⃣ **Verifikasi Token:**

- Server memverifikasi signature JWT. Jika valid, user diizinkan mengakses resource.

## 🚀 **Kelebihan JWT**

✅ **Stateless & Skalabel** (tidak butuh session di server)

✅ **Fleksibel** (dapat digunakan untuk auth, info sharing, dll)

✅ **Aman** jika menggunakan **secret key** yang kuat dan **HTTPS**

✅ **Mendukung Expired Time** (token otomatis invalid setelah waktu tertentu)

---

## ⚡ **Kekurangan JWT**

⚠ **Tidak bisa dibatalkan** sebelum expired, kecuali implementasi token blacklist.

⚠ **Ukuran token bisa besar** karena menyimpan payload.

⚠ **Penting untuk menyimpan secret key dengan aman**.

Ini merupakan projek saya belajar impementasi json web token atau jwt, saya menggunakan ts, express, prisma dan postgresql.

Pertama masuk ke postgresql lalu membuat table users

```sql
sudo -u postgres psql

create database users;
```

Setelah membuat database setup projek dengan menginstal module serta tools yang akan di gunakan.

```bash
npm init -y
npm i express jsonwebtoken bcryptjs dotenv cord

```

Lalu karna projek ini menggunakan ts maka install juga types definisi untuk ts, karna paket javascript murni memerlukan file tpe .d.ts agar dapat di gunakan intellisense dan typing check.

1️⃣ **`@types/express`**

- Memberikan definisi tipe untuk **Express.js**.
- Membantu TypeScript memahami objek seperti `Request`, `Response`, dan `NextFunction`.
- Contoh penggunaan:
    
    ```tsx
    import { Request, Response } from "express";
    
    app.get("/", (req: Request, res: Response) => {
      res.send("Hello TypeScript!");
    });
    ```
    

**2️⃣`@types/jsonwebtoken`**

- Memberikan tipe untuk **JWT (jsonwebtoken)**.
- Tanpa ini, TypeScript tidak akan tahu tipe hasil dari `jwt.sign()` atau `jwt.verify()`.

3️⃣ **`@types/bcryptjs`**

- Memberikan tipe untuk **bcryptjs** (hashing password).
- Memastikan fungsi seperti `bcrypt.hash()` dan `bcrypt.compare()` dikenali TypeScript.

4️⃣ **`@types/node`**

- Memberikan tipe untuk **Node.js API**.
- Dibutuhkan untuk bekerja dengan modul bawaan seperti `fs`, `path`, `process`, dll.
- Contoh:

```tsx
import * as fs from "fs";

fs.readFileSync("file.txt", "utf-8");
```

### **Kesimpulan**

✅ **Tanpa ini** → TypeScript akan error saat menggunakan paket-paket JavaScript murni.

✅ **Dengan ini** → Code lebih **aman, mudah dibaca, dan mendapatkan auto-complete di editor**.

💡 **Perintah ini hanya perlu dijalankan sekali**, kecuali jika ada pembaruan paket. 🚀

Setelah itu selanjutnya install prisma untuk orm database nya

```bash
npm install @prisma/client
npm install --save-dev prisma typescript tsx @types/node

// lalu inisialisasi
npx prisma init

```

Edit file . env

```bash
DATABASE_URL="postgresql://postgres:Adi120104@localhost:5432/jwt_auth"
JWT_SECRET="supersecretkey"
PORT=5000
```

Edit file `prisma/schema.prisma` untuk membuat tabel user:

```tsx
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       String  @id @default(uuid())
  email    String  @unique
  password String
  role     String  @default("user")
  createdAt DateTime @default(now())
}
```

Lakukan migrate

```tsx
npx prisma migrate dev --name init
```

Lalu membuat backend express

```tsx
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🔑 **4. Buat Authentication (Register & Login)**

### 📂 `src/controllers/authController.ts`

```tsx
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    res.json({ message: "User registered", user });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
```

## 📌 **5. Buat Route Authentication**

### 📂 `src/routes/auth.ts`

```tsx
import express from "express";
import { register, login } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
```

## 🔐 **6. Middleware untuk Proteksi API**

### 📂 `src/middleware/authMiddleware.ts`

```tsx
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
  res.status(401).json({ error: "Access denied" });
  return
  {

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
```

## 🏆 **7. Endpoint Proteksi API**

Misal, kita buat route yang hanya bisa diakses user yang login.

### 📂 `src/routes/protected.ts`

```tsx
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to your profile!", user: (req as any).user });
});

export default router;
```

Tambahkan di `server.ts`:

```tsx
import protectedRoutes from "./routes/protected";
app.use("/api/protected", protectedRoutes);
```

### **Jalankan dengan `tsx`**

Jika sudah menginstal `tsx`, jalankan:

```
npx tsx src/server.ts
```

💡
