# Bộ bàn giao cho agent — Tháp Ngục Vô Tận

## Mục đích

Bộ này giúp agent khác tiếp tục phát triển bản remix **Tháp Ngục Vô Tận** từ game mẫu **Super Dungeon / Hầm ngục Siêu cấp**. Tất cả mã nguồn, tài nguyên hình ảnh, âm thanh, mô hình, tài liệu và ghi chú của gói nguồn đã cho được giữ trong `showcase-source/`. Bản template Three.js/Vite mà dự án Manus đã khởi tạo được giữ riêng trong `runtime-starter/` để agent có thể đối chiếu runtime và các tích hợp của template.

## Nội dung

- `showcase-source/`: bản giải nén của gói nguồn đầy đủ, gồm mã TypeScript, cấu hình, kiểm thử, hình ảnh, texture, mô hình 3D, âm thanh, font, script, giấy phép và Markdown gốc.
- `runtime-starter/`: snapshot mã nguồn template Three.js/Vite của dự án `Tháp Ngục Vô Tận`, không gồm `node_modules`, `.git` hoặc định danh Preview nội bộ.
- `PROJECT_BRIEF_VI.md`: ý tưởng, vòng lặp gameplay, điều khiển, cấu trúc mã và yêu cầu bản địa hóa.
- `ASSET_INDEX_VI.md`: danh mục toàn bộ ảnh raster của gói nguồn, kèm đường dẫn trong `showcase-source/`.
- `PROVENANCE_VI.md`: nguồn gốc, giấy phép và các lưu ý khi dùng/phân phối lại tài nguyên.

## Trạng thái khi đóng gói

Dự án Manus `Tháp Ngục Vô Tận` đã được khởi tạo bằng Three.js/Vite. Sau đó yêu cầu chuyển thành tạo bộ bàn giao cho agent khác; thẻ Game Blueprint đang chờ đã được đóng và **không được xem là đã phê duyệt**. Gói nguồn đã tải về và chép nguyên trạng vào thư mục `showcase-source/` (ngoại trừ hai định danh nội bộ nêu dưới đây), nhưng **chưa được tích hợp vào dự án Manus** và chưa có phiên bản game remix hoàn chỉnh để chơi.

Blueprint cũ không cấp quyền tạo thêm ảnh/mô hình bằng AI hoặc cấu hình tính năng online. Tiếp tục dùng các tài nguyên sẵn có trong bộ này; nếu cần nguồn sản xuất tài nguyên mới hay tính năng online, hãy xin chỉ dẫn/phê duyệt tương ứng trước. Không suy luận rằng lựa chọn chưa trả lời trên Blueprint là đồng ý.

## Thứ tự làm việc đề xuất

1. Đọc file này, `PROJECT_BRIEF_VI.md`, `PROVENANCE_VI.md` và README gốc tại `showcase-source/README.md`.
2. Đối chiếu `runtime-starter/README.md`, `package.json`, `vite.config.ts`, `assets.lock.json`, `scripts/` và các điểm tích hợp runtime trước khi chỉnh sửa.
3. Dùng `showcase-source/` làm nền tảng nội dung/gameplay; dùng `runtime-starter/` để giữ tương thích với runtime đã khởi tạo. Không ghi đè nguyên cây template một cách mù quáng.
4. Bản đích cần dùng tiếng Việt cho nội dung hiển thị trong game. Gói nguồn hiện tại chủ yếu tiếng Anh; cần rà soát HUD, menu, hướng dẫn, lore, kết quả, nút tương tác và tiêu đề.
5. Không chạy script tài nguyên trong gói trước khi kiểm tra nội dung và phụ thuộc; không commit bí mật hoặc metadata định danh cá nhân/phiên.

## Khởi chạy nguồn mẫu độc lập

Tại `showcase-source/`, README gốc ghi các lệnh:

```bash
pnpm install
PORT=3000 HOST=0.0.0.0 pnpm dev
pnpm build
pnpm test
```

`pnpm smoke` cần dev server đang chạy và Playwright; có thể chụp ảnh vào `smoke-shots/`. Đây là quy trình của **mã nguồn mẫu**, chưa phải xác nhận rằng nó đã được nhập hoặc xác minh trong dự án Manus. Khi tích hợp, kiểm tra lại yêu cầu của runtime-starter; giữ Preview dùng URL tương đối và port/runtime hiện có.

## Tính đầy đủ và lọc nội bộ

Gói gốc có 574 file; bản bàn giao có 572 file trong `showcase-source/`, giữ toàn bộ ảnh và Markdown nguồn. Chỉ bỏ hai file định danh riêng của nền tảng: `.manus-starter-init.json` và `.manus-webdev/preview-identity.json`. Snapshot `runtime-starter/` cũng không chứa `.git`, `node_modules`, thư mục `.manus-webdev` hoặc các tệp `.env`. Không có file `.env` hay khóa riêng nào được phát hiện theo tên trong ZIP nguồn.

SHA-256 của ZIP tải từ URL người dùng chỉ định:

```text
467bc2058b307dabd00ac3c3996f30010a10c32f3afcff8a24cd22e891f7f6b0
```

Giá trị này trùng với thành phần hash trong tên đường dẫn URL. Gói bàn giao có thể được kiểm tra độc lập bằng SHA-256 của chính file ZIP mới sau khi tạo.
