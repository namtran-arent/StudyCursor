# Giải pháp cuối cùng cho redirect_uri_mismatch

## 🔴 Vấn đề

Mặc dù `NEXTAUTH_URL` đã được set đúng (`https://study-cursor-mu.vercel.app`), NextAuth vẫn đang gửi preview URL trong redirect_uri khi test trên preview deployments.

## ✅ Giải pháp đã thử

1. ✅ Set `NEXTAUTH_URL` trên Vercel cho tất cả environments
2. ✅ Thêm `url` và `basePath` trong authOptions
3. ✅ Thêm `trustHost: true`
4. ✅ Thêm redirect callback
5. ✅ Override trong route handler

**Kết quả:** Vẫn không hoạt động trên preview deployments vì NextAuth detect từ request headers.

## 🎯 Giải pháp thực tế

### Giải pháp 1: Chỉ test OAuth trên Production (KHUYẾN NGHỊ)

**Cách làm:**
1. Chỉ test OAuth trên: `https://study-cursor-mu.vercel.app`
2. Preview deployments: Chỉ test các tính năng khác, KHÔNG test OAuth
3. Production deployment: Test đầy đủ bao gồm OAuth

**Ưu điểm:**
- ✅ Đơn giản, không cần thêm nhiều URLs
- ✅ OAuth hoạt động ổn định trên production
- ✅ Preview deployments vẫn có thể test các tính năng khác

**Nhược điểm:**
- ❌ Không thể test OAuth trên preview deployments

### Giải pháp 2: Thêm preview URLs vào Google Cloud Console

**Cách làm:**
1. Mỗi khi có preview deployment mới, copy preview URL
2. Vào Google Cloud Console → APIs & Services → Credentials
3. Thêm redirect URI: `https://preview-url.vercel.app/api/auth/callback/google`
4. Thêm JavaScript origin: `https://preview-url.vercel.app`
5. Save và đợi 2-5 phút

**Ưu điểm:**
- ✅ Có thể test OAuth trên preview deployments

**Nhược điểm:**
- ❌ Phải thêm từng preview URL (Google không hỗ trợ wildcard)
- ❌ Mỗi preview deployment mới cần thêm URL mới
- ❌ Tốn thời gian và dễ quên

### Giải pháp 3: Sử dụng Custom Domain

**Cách làm:**
1. Mua custom domain (ví dụ: `dandi-analyzer.com`)
2. Set custom domain trên Vercel
3. Set `NEXTAUTH_URL` = custom domain
4. Thêm custom domain vào Google Cloud Console

**Ưu điểm:**
- ✅ URL cố định, không thay đổi
- ✅ Professional hơn
- ✅ Hoạt động trên cả production và preview (nếu set đúng)

**Nhược điểm:**
- ❌ Cần mua domain
- ❌ Cần cấu hình DNS

## 📝 Khuyến nghị

**Tôi khuyến nghị Giải pháp 1:** Chỉ test OAuth trên production deployment.

**Lý do:**
- Đơn giản và ổn định nhất
- OAuth là tính năng quan trọng, nên test trên production là đủ
- Preview deployments vẫn có thể test các tính năng khác
- Tránh phải thêm nhiều URLs vào Google Cloud Console

## 🔧 Cấu hình hiện tại

### Vercel Environment Variables:
```
NEXTAUTH_URL=https://study-cursor-mu.vercel.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
```

### Google Cloud Console - Authorized redirect URIs:
```
http://localhost:3000/api/auth/callback/google
https://study-cursor-mu.vercel.app/api/auth/callback/google
```

### Google Cloud Console - Authorized JavaScript origins:
```
http://localhost:3000
https://study-cursor-mu.vercel.app
```

## ✅ Checklist

- [x] Đã set `NEXTAUTH_URL` trên Vercel
- [x] Đã cập nhật Google Cloud Console với production URL
- [x] Đã test OAuth trên production: `https://study-cursor-mu.vercel.app`
- [ ] Đã quyết định: Test OAuth chỉ trên production (khuyến nghị)

## 🆘 Nếu vẫn cần test trên Preview

Nếu bạn thực sự cần test OAuth trên preview deployments:

1. **Mỗi lần có preview deployment mới:**
   - Copy preview URL từ Vercel Dashboard
   - Thêm vào Google Cloud Console
   - Đợi 2-5 phút
   - Test lại

2. **Hoặc tự động hóa:**
   - Tạo script để tự động thêm preview URLs
   - Sử dụng Google Cloud API để thêm URLs programmatically

## 💡 Kết luận

Vấn đề `redirect_uri_mismatch` trên preview deployments là do NextAuth detect URL từ request headers. Đây là behavior mặc định của NextAuth và khó override hoàn toàn.

**Giải pháp tốt nhất:** Chỉ test OAuth trên production deployment (`https://study-cursor-mu.vercel.app`). Preview deployments vẫn có thể test các tính năng khác.
