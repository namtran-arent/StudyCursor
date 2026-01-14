# Fix Error 400: redirect_uri_mismatch

## 🔴 Lỗi: "Error 400: redirect_uri_mismatch"

Lỗi này xảy ra khi redirect URI trong Google Cloud Console không khớp với URI mà NextAuth đang sử dụng.

## 🔍 Cách xác định redirect URI đang được sử dụng

NextAuth tự động tạo redirect URI dựa trên `NEXTAUTH_URL`:
- Format: `{NEXTAUTH_URL}/api/auth/callback/google`

### Ví dụ:
- Nếu `NEXTAUTH_URL=http://localhost:3000` → Redirect URI: `http://localhost:3000/api/auth/callback/google`
- Nếu `NEXTAUTH_URL=https://your-app.vercel.app` → Redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

## ✅ Giải pháp

### Bước 1: Xác định bạn đang chạy ở đâu

**Local Development:**
- URL: `http://localhost:3000`
- Redirect URI cần: `http://localhost:3000/api/auth/callback/google`

**Production (Vercel):**
- URL: `https://your-app.vercel.app` (thay bằng URL thực tế của bạn)
- Redirect URI cần: `https://your-app.vercel.app/api/auth/callback/google`

### Bước 2: Kiểm tra NEXTAUTH_URL

**Local:**
Kiểm tra file `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
```

**Production:**
Kiểm tra trên Vercel Dashboard → Settings → Environment Variables:
- `NEXTAUTH_URL` phải là URL production của bạn

### Bước 3: Cập nhật Google Cloud Console

1. **Truy cập Google Cloud Console:**
   - Vào [Google Cloud Console](https://console.cloud.google.com/)
   - Chọn project của bạn

2. **Vào OAuth Credentials:**
   - APIs & Services → Credentials
   - Click vào OAuth 2.0 Client ID của bạn

3. **Thêm Redirect URIs:**
   
   **Cho Local Development:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   
   **Cho Production:**
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
   
   **Lưu ý:**
   - ✅ Copy chính xác, không có khoảng trắng thừa
   - ✅ Không có dấu `/` ở cuối
   - ✅ Phải match chính xác với `NEXTAUTH_URL` + `/api/auth/callback/google`

4. **Thêm Authorized JavaScript origins (nếu chưa có):**
   
   **Cho Local:**
   ```
   http://localhost:3000
   ```
   
   **Cho Production:**
   ```
   https://your-app.vercel.app
   ```

5. **Click "Save"**

6. **Đợi 2-5 phút** để Google cập nhật settings (Google cache các settings này)

### Bước 4: Kiểm tra lại

**Local:**
1. Đảm bảo `.env.local` có:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   NEXTAUTH_SECRET=your-secret
   ```

2. Restart development server:
   ```bash
   # Dừng server (Ctrl+C)
   yarn dev
   ```

3. Xóa cookies/cache hoặc dùng Incognito mode

4. Test lại: `http://localhost:3000/dashboards`

**Production:**
1. Đảm bảo Vercel có đầy đủ env vars:
   - `NEXTAUTH_URL=https://your-app.vercel.app`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`

2. Redeploy trên Vercel

3. Test lại: `https://your-app.vercel.app/dashboards`

## 🎯 Checklist nhanh

- [ ] Đã thêm redirect URI vào Google Cloud Console
- [ ] Redirect URI match chính xác với `NEXTAUTH_URL/api/auth/callback/google`
- [ ] Đã thêm Authorized JavaScript origins
- [ ] Đã Save trong Google Cloud Console
- [ ] Đã đợi 2-5 phút sau khi save
- [ ] Đã restart server (local) hoặc redeploy (production)
- [ ] Đã xóa cookies/cache hoặc dùng Incognito mode

## 🐛 Vẫn không được?

### Kiểm tra lại redirect URI:

1. **Xem redirect URI thực tế trong browser:**
   - Mở Developer Tools (F12)
   - Vào Network tab
   - Click "Sign in with Google"
   - Xem request đến Google, tìm parameter `redirect_uri` trong URL
   - Copy redirect URI đó

2. **So sánh với Google Cloud Console:**
   - Redirect URI trong request phải match chính xác với URI trong Google Cloud Console
   - Kiểm tra:
     - Protocol (http vs https)
     - Domain (localhost vs production domain)
     - Port (nếu có)
     - Path (`/api/auth/callback/google`)

### Common mistakes:

❌ **Sai:** `http://localhost:3000/api/auth/callback/google/` (có dấu `/` cuối)
✅ **Đúng:** `http://localhost:3000/api/auth/callback/google`

❌ **Sai:** `https://your-app.vercel.app/api/auth/callback/Google` (chữ G hoa)
✅ **Đúng:** `https://your-app.vercel.app/api/auth/callback/google`

❌ **Sai:** `http://localhost:3000` (thiếu path)
✅ **Đúng:** `http://localhost:3000/api/auth/callback/google`

## 📝 Ví dụ cấu hình đúng

### Google Cloud Console - Authorized redirect URIs:

```
http://localhost:3000/api/auth/callback/google
https://your-app.vercel.app/api/auth/callback/google
https://preview-your-app.vercel.app/api/auth/callback/google
```

### Google Cloud Console - Authorized JavaScript origins:

```
http://localhost:3000
https://your-app.vercel.app
https://preview-your-app.vercel.app
```

### .env.local (Local):

```env
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123
NEXTAUTH_SECRET=your-secret-here
```

### Vercel Environment Variables (Production):

```
NEXTAUTH_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123
NEXTAUTH_SECRET=your-secret-here
```

## 💡 Tip

Nếu bạn có nhiều environments (local, preview, production), thêm tất cả redirect URIs vào Google Cloud Console để tránh lỗi khi switch giữa các environments.
