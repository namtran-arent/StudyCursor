# Kiểm tra Redirect URI thực tế

## ✅ NEXTAUTH_URL đã được set đúng!

Từ endpoint `/api/auth/check-env`, tôi thấy:
- ✅ `NEXTAUTH_URL` = `https://study-cursor-mu.vercel.app`
- ✅ `expectedRedirectUri` = `https://study-cursor-mu.vercel.app/api/auth/callback/google`

## 🔍 Bước tiếp theo: Kiểm tra Redirect URI thực tế

Mặc dù `NEXTAUTH_URL` đã đúng, bạn cần kiểm tra xem NextAuth có thực sự sử dụng nó không:

### Bước 1: Mở Developer Tools

1. Mở preview deployment URL (hoặc production URL)
2. Nhấn **F12** để mở Developer Tools
3. Vào tab **Network**

### Bước 2: Click "Sign in with Google"

1. Click button "Sign in with Google"
2. Trong Network tab, tìm request đến `accounts.google.com`

### Bước 3: Kiểm tra Redirect URI

1. Click vào request đến `accounts.google.com`
2. Vào tab **Headers** hoặc **Payload**
3. Tìm parameter `redirect_uri` trong URL hoặc form data

**Kết quả mong đợi:**
```
redirect_uri=https://study-cursor-mu.vercel.app/api/auth/callback/google
```

**Nếu thấy preview URL:**
```
redirect_uri=https://study-cursor-3gzxyxwg9-namtran-arents-projects.vercel.app/api/auth/callback/google
```
→ NextAuth vẫn đang dùng request URL thay vì NEXTAUTH_URL

## 🔧 Nếu Redirect URI vẫn sai

### Giải pháp 1: Kiểm tra lại Google Cloud Console

Đảm bảo Google Cloud Console có **chính xác** redirect URI này:
```
https://study-cursor-mu.vercel.app/api/auth/callback/google
```

**Lưu ý:**
- ✅ Không có dấu `/` cuối
- ✅ Phải là `https://` (không phải `http://`)
- ✅ Path phải chính xác: `/api/auth/callback/google`

### Giải pháp 2: Xóa cookies và thử lại

1. Xóa tất cả cookies cho domain
2. Hoặc dùng **Incognito mode**
3. Thử đăng nhập lại

### Giải pháp 3: Đợi Google cập nhật

Sau khi cập nhật Google Cloud Console:
- Đợi **2-5 phút** để Google cập nhật settings
- Google cache các OAuth settings

### Giải pháp 4: Kiểm tra logs trên Vercel

1. Vào Vercel Dashboard → Deployments
2. Click vào deployment mới nhất
3. Vào tab **Logs**
4. Tìm dòng: `✅ NEXTAUTH_URL is set to: https://study-cursor-mu.vercel.app`
5. Nếu không thấy → NEXTAUTH_URL chưa được load đúng

## 📝 Checklist

- [ ] Đã kiểm tra `/api/auth/check-env` và thấy NEXTAUTH_URL đúng
- [ ] Đã kiểm tra Network tab và thấy redirect_uri đúng
- [ ] Đã cập nhật Google Cloud Console với redirect URI chính xác
- [ ] Đã xóa tất cả preview URIs khác trong Google Cloud Console
- [ ] Đã đợi 2-5 phút sau khi save Google Cloud Console
- [ ] Đã xóa cookies/thử Incognito mode
- [ ] Đã test lại và hoạt động

## 🆘 Nếu vẫn không được

Nếu redirect URI trong Network tab vẫn là preview URL mặc dù NEXTAUTH_URL đã đúng:

1. **Kiểm tra lại code:**
   - Đảm bảo đã commit và push code mới nhất
   - Đảm bảo đã redeploy sau khi set NEXTAUTH_URL

2. **Kiểm tra Vercel Environment Variables:**
   - Vào Settings → Environment Variables
   - Đảm bảo NEXTAUTH_URL được set cho **tất cả 3 environments**
   - Thử xóa và tạo lại NEXTAUTH_URL

3. **Kiểm tra build logs:**
   - Xem logs của deployment
   - Tìm lỗi về environment variables

4. **Thử cách khác:**
   - Chỉ test OAuth trên production deployment
   - Không test trên preview deployments
