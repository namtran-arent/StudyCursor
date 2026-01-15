# Fix Error 400: redirect_uri_mismatch cho Vercel Preview

## 🔴 Lỗi trên Preview Deployment

Khi bạn thấy lỗi "Error 400: redirect_uri_mismatch" trên Vercel Preview Deployment, đây là cách fix:

**Redirect URI từ lỗi:**
```
https://study-cursor-cllnh3jwc-namtran-arents-projects.vercel.app/api/auth/callback/google
```

## ✅ Giải pháp nhanh

### Bước 1: Copy Preview URL chính xác

Từ lỗi, copy chính xác URL preview của bạn:
```
https://study-cursor-cllnh3jwc-namtran-arents-projects.vercel.app
```

### Bước 2: Thêm vào Google Cloud Console

1. **Truy cập Google Cloud Console:**
   - Vào [Google Cloud Console](https://console.cloud.google.com/)
   - Chọn project của bạn
   - Vào **APIs & Services** → **Credentials**

2. **Mở OAuth 2.0 Client ID:**
   - Click vào OAuth 2.0 Client ID của bạn

3. **Thêm Redirect URI cho Preview:**
   
   Trong phần **Authorized redirect URIs**, thêm:
   ```
   https://study-cursor-cllnh3jwc-namtran-arents-projects.vercel.app/api/auth/callback/google
   ```
   
   ⚠️ **Lưu ý quan trọng:**
   - Copy chính xác URL từ lỗi
   - Không có dấu `/` ở cuối
   - Phải là `https://` (không phải `http://`)
   - Path phải chính xác: `/api/auth/callback/google`

4. **Thêm Authorized JavaScript origins:**
   
   Trong phần **Authorized JavaScript origins**, thêm:
   ```
   https://study-cursor-cllnh3jwc-namtran-arents-projects.vercel.app
   ```
   
   ⚠️ **Lưu ý:**
   - Không có path, chỉ domain
   - Phải là `https://`

5. **Click "SAVE"**

6. **Đợi 2-5 phút** để Google cập nhật settings (Google cache các settings này)

### Bước 3: Test lại

1. Refresh trang preview deployment
2. Click "Sign In with Google"
3. Kiểm tra xem có còn lỗi không

## 🎯 Checklist

- [ ] Đã copy chính xác preview URL từ lỗi
- [ ] Đã thêm redirect URI vào Google Cloud Console
- [ ] Đã thêm JavaScript origin vào Google Cloud Console
- [ ] Đã Save trong Google Cloud Console
- [ ] Đã đợi 2-5 phút sau khi save
- [ ] Đã test lại và không còn lỗi

## 💡 Lưu ý về Preview Deployments

**Vercel tạo preview URL khác nhau cho mỗi branch/PR:**
- Mỗi preview deployment có URL riêng
- Bạn có thể:
  1. **Thêm từng preview URL** vào Google Cloud Console (nếu cần test nhiều preview)
  2. **Chỉ dùng Production URL** cho OAuth (khuyến nghị)
  3. **Tắt OAuth trên preview** và chỉ test trên production

## 🔧 Giải pháp tốt hơn: Dùng Production URL

Thay vì thêm từng preview URL, bạn có thể:

1. **Chỉ test OAuth trên Production:**
   - Preview deployments: Không test OAuth
   - Production deployment: Test OAuth

2. **Hoặc set NEXTAUTH_URL trên Vercel:**
   - Vào Vercel Dashboard → Settings → Environment Variables
   - Set `NEXTAUTH_URL` = Production URL của bạn
   - Tất cả preview deployments sẽ dùng production URL cho OAuth

## 📝 Ví dụ cấu hình đầy đủ

### Google Cloud Console - Authorized redirect URIs:

```
http://localhost:3000/api/auth/callback/google
https://your-production-app.vercel.app/api/auth/callback/google
https://study-cursor-cllnh3jwc-namtran-arents-projects.vercel.app/api/auth/callback/google
```

### Google Cloud Console - Authorized JavaScript origins:

```
http://localhost:3000
https://your-production-app.vercel.app
https://study-cursor-cllnh3jwc-namtran-arents-projects.vercel.app
```

## 🆘 Vẫn không được?

1. Kiểm tra lại URL trong lỗi có match chính xác với Google Cloud Console không
2. Đảm bảo đã đợi đủ thời gian (2-5 phút) sau khi save
3. Thử xóa cookies và test lại
4. Kiểm tra `NEXTAUTH_URL` trên Vercel có đúng không
