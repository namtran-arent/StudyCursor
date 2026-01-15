# Quick Fix: redirect_uri_mismatch

## 🚀 Các bước nhanh để fix

### Bước 1: Kiểm tra NEXTAUTH_URL trên Vercel

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project → **Settings** → **Environment Variables**
3. Tìm `NEXTAUTH_URL`
4. **Phải là:** `https://study-cursor-mu.vercel.app` (KHÔNG có dấu `/` cuối)
5. **Phải chọn:** ✅ Production, ✅ Preview, ✅ Development

### Bước 2: Kiểm tra NEXTAUTH_URL đang được sử dụng

Sau khi deploy, mở URL này trong browser:
```
https://study-cursor-mu.vercel.app/api/auth/check-env
```

Hoặc trên preview deployment:
```
https://your-preview-url.vercel.app/api/auth/check-env
```

**Kết quả mong đợi:**
```json
{
  "NEXTAUTH_URL": "https://study-cursor-mu.vercel.app",
  "expectedRedirectUri": "https://study-cursor-mu.vercel.app/api/auth/callback/google",
  "hasGoogleClientId": true,
  "hasGoogleClientSecret": true,
  "hasNextAuthSecret": true
}
```

**Nếu `NEXTAUTH_URL` là `"NOT SET"` hoặc preview URL:**
- ❌ NEXTAUTH_URL chưa được set đúng trên Vercel
- ❌ Hoặc chưa redeploy sau khi set

### Bước 3: Redeploy

**QUAN TRỌNG:** Sau khi set NEXTAUTH_URL, PHẢI redeploy:

1. Vào **Deployments**
2. Click **"..."** → **Redeploy**
3. **Tắt** "Use existing Build Cache"
4. Click **Redeploy**

### Bước 4: Kiểm tra lại

1. Mở `/api/auth/check-env` để xác nhận NEXTAUTH_URL đúng
2. Mở Developer Tools (F12) → Network tab
3. Click "Sign in with Google"
4. Tìm request đến `accounts.google.com`
5. Xem `redirect_uri` trong URL
6. **Phải là:** `https://study-cursor-mu.vercel.app/api/auth/callback/google`

### Bước 5: Cập nhật Google Cloud Console

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://study-cursor-mu.vercel.app/api/auth/callback/google
```

**Authorized JavaScript origins:**
```
http://localhost:3000
https://study-cursor-mu.vercel.app
```

**Xóa tất cả preview URIs khác!**

## 🔍 Debug Endpoint

Tôi đã tạo endpoint để check NEXTAUTH_URL:

```
GET /api/auth/check-env
```

Endpoint này sẽ trả về:
- NEXTAUTH_URL hiện tại
- Expected redirect URI
- Các env vars khác có được set không

## ✅ Checklist

- [ ] Đã set `NEXTAUTH_URL=https://study-cursor-mu.vercel.app` trên Vercel
- [ ] Đã chọn tất cả 3 environments
- [ ] Đã redeploy (với cache OFF)
- [ ] Đã check `/api/auth/check-env` và thấy NEXTAUTH_URL đúng
- [ ] Đã check Network tab và thấy redirect_uri đúng
- [ ] Đã cập nhật Google Cloud Console
- [ ] Đã đợi 2-5 phút sau khi save Google Cloud Console
- [ ] Đã test lại và hoạt động

## 🆘 Vẫn không được?

1. **Kiểm tra `/api/auth/check-env`:**
   - Nếu NEXTAUTH_URL = "NOT SET" → Chưa set trên Vercel hoặc chưa redeploy
   - Nếu NEXTAUTH_URL = preview URL → Vercel đang override, cần kiểm tra lại

2. **Kiểm tra logs trên Vercel:**
   - Vào Deployments → Logs
   - Tìm dòng: `✅ NEXTAUTH_URL is set to: https://study-cursor-mu.vercel.app`

3. **Thử xóa và tạo lại NEXTAUTH_URL:**
   - Xóa biến cũ
   - Tạo lại với giá trị chính xác
   - Redeploy
