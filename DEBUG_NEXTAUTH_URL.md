# Debug NEXTAUTH_URL trên Vercel

## 🔴 Vấn đề: Vẫn bị lỗi redirect_uri_mismatch

Nếu bạn vẫn thấy lỗi với preview URL khác nhau, hãy làm theo các bước sau:

## ✅ Bước 1: Kiểm tra NEXTAUTH_URL trên Vercel

1. **Vào Vercel Dashboard:**
   - [Vercel Dashboard](https://vercel.com/dashboard)
   - Chọn project của bạn

2. **Kiểm tra Environment Variables:**
   - Vào **Settings** → **Environment Variables**
   - Tìm biến `NEXTAUTH_URL`
   - **Đảm bảo:**
     - ✅ Value = `https://study-cursor-mu.vercel.app` (KHÔNG có dấu `/` cuối)
     - ✅ Đã chọn **tất cả 3 environments** (Production, Preview, Development)
     - ✅ Không có biến `NEXTAUTH_URL` nào khác với giá trị khác

3. **Nếu chưa có hoặc sai:**
   - Click **Add New** hoặc **Edit**
   - Set:
     - Name: `NEXTAUTH_URL`
     - Value: `https://study-cursor-mu.vercel.app`
     - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

## ✅ Bước 2: Xóa và tạo lại NEXTAUTH_URL (nếu cần)

Nếu đã có nhưng vẫn không hoạt động:

1. **Xóa biến cũ:**
   - Tìm `NEXTAUTH_URL` trong Environment Variables
   - Click **Delete** hoặc **Remove**
   - Xác nhận xóa

2. **Tạo lại:**
   - Click **Add New**
   - Name: `NEXTAUTH_URL`
   - Value: `https://study-cursor-mu.vercel.app`
   - Environment: Chọn **tất cả 3**
   - Click **Save**

## ✅ Bước 3: Kiểm tra trong Code

Sau khi deploy, kiểm tra logs trên Vercel:

1. Vào **Deployments** → Click vào deployment mới nhất
2. Vào tab **Logs**
3. Tìm dòng: `✅ NEXTAUTH_URL is set to: https://study-cursor-mu.vercel.app`
4. Nếu không thấy hoặc thấy URL khác → NEXTAUTH_URL chưa được set đúng

## ✅ Bước 4: Redeploy

**QUAN TRỌNG:** Sau khi set NEXTAUTH_URL, PHẢI redeploy:

1. **Cách 1: Redeploy từ Dashboard**
   - Vào **Deployments**
   - Click **"..."** trên deployment mới nhất
   - Click **Redeploy**
   - Chọn **Use existing Build Cache** = OFF (để đảm bảo env vars được load lại)

2. **Cách 2: Push commit mới**
   - Tạo một commit nhỏ (ví dụ: thêm comment)
   - Push lên Git
   - Vercel sẽ tự động deploy

## ✅ Bước 5: Kiểm tra Redirect URI thực tế

Sau khi redeploy, kiểm tra redirect URI thực tế:

1. **Mở preview deployment URL** (URL bất kỳ)
2. **Mở Developer Tools** (F12)
3. **Vào tab Network**
4. **Click "Sign in with Google"**
5. **Tìm request đến `accounts.google.com`**
6. **Xem parameter `redirect_uri` trong URL**

**Kết quả mong đợi:**
- ✅ `redirect_uri=https://study-cursor-mu.vercel.app/api/auth/callback/google`
- ❌ KHÔNG phải preview URL như `https://study-cursor-qhb2cnhu2-namtran-arents-projects.vercel.app/...`

## ✅ Bước 6: Cập nhật Google Cloud Console

Đảm bảo Google Cloud Console chỉ có:

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

## 🔍 Troubleshooting

### Nếu vẫn thấy preview URL trong redirect_uri:

1. **Kiểm tra lại NEXTAUTH_URL trên Vercel:**
   - Đảm bảo đã set cho **tất cả 3 environments**
   - Đảm bảo không có typo
   - Đảm bảo không có dấu `/` cuối

2. **Kiểm tra logs trên Vercel:**
   - Xem logs của deployment
   - Tìm dòng log `✅ NEXTAUTH_URL is set to:`
   - Nếu không thấy → env var chưa được load

3. **Thử xóa cache:**
   - Vào Vercel Dashboard → Project → Settings
   - Tìm phần **Build & Development Settings**
   - Clear build cache nếu có

4. **Kiểm tra có biến NEXTAUTH_URL nào khác không:**
   - Có thể có biến trong `.env.local` hoặc `.env` đang override
   - Xóa các file `.env*` khỏi Git (nếu đang commit)

### Nếu logs không hiển thị NEXTAUTH_URL:

1. **Kiểm tra build logs:**
   - Vào deployment → Logs
   - Tìm lỗi về environment variables

2. **Kiểm tra Vercel có đang dùng env vars cũ không:**
   - Có thể cần đợi vài phút để Vercel sync
   - Thử redeploy lại

## 📝 Checklist đầy đủ

- [ ] Đã set `NEXTAUTH_URL=https://study-cursor-mu.vercel.app` trên Vercel
- [ ] Đã chọn **tất cả 3 environments** (Production, Preview, Development)
- [ ] Đã **Redeploy** sau khi set NEXTAUTH_URL
- [ ] Đã kiểm tra logs và thấy `✅ NEXTAUTH_URL is set to: https://study-cursor-mu.vercel.app`
- [ ] Đã kiểm tra redirect URI thực tế trong Network tab = `https://study-cursor-mu.vercel.app/api/auth/callback/google`
- [ ] Đã cập nhật Google Cloud Console với redirect URI cố định
- [ ] Đã xóa tất cả preview URIs khác trong Google Cloud Console
- [ ] Đã đợi 2-5 phút sau khi save Google Cloud Console
- [ ] Đã test lại và hoạt động

## 🆘 Vẫn không được?

Nếu sau tất cả các bước trên vẫn không được:

1. **Tạo issue mới trên GitHub** với:
   - Screenshot của Environment Variables trên Vercel
   - Screenshot của logs từ Vercel deployment
   - Screenshot của redirect URI từ Network tab

2. **Hoặc thử cách khác:**
   - Chỉ test OAuth trên production deployment
   - Tắt OAuth trên preview deployments
   - Sử dụng custom domain thay vì Vercel preview URLs
