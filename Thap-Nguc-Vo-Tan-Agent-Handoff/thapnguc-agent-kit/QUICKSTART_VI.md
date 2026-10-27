# Bắt đầu nhanh cho agent

## Thư mục nào dùng làm gì?

- `showcase-source/` là game mẫu đầy đủ cùng toàn bộ ảnh và tài nguyên gốc. Đây là mã nguồn chính cần nghiên cứu/remix.
- `runtime-starter/` là snapshot template Three.js/Vite đã khởi tạo trong dự án Manus. Dùng nó để đối chiếu runtime và tích hợp platform; thư mục này chưa chứa bản remix.
- Đọc `README_AGENT_VI.md` và `PROJECT_BRIEF_VI.md` trước khi thay đổi.

## Chạy source mẫu riêng

```bash
cd showcase-source
pnpm install
PORT=3000 HOST=0.0.0.0 pnpm dev
```

Lệnh nguồn mẫu khác:

```bash
pnpm build
pnpm test
pnpm smoke # cần dev server đang chạy
```

Để chạy trong runtime Manus, hãy làm việc trong project đang được bind, kiểm tra `runtime-starter/` và hướng dẫn WebDev mới nhất. Không chạy một server ở port khác nếu runtime đã cấu hình port cụ thể; giữ Preview trên `0.0.0.0` và dùng URL tương đối ở phía trình duyệt.

## Quy tắc tích hợp

- So sánh từng thay đổi trong `package.json`, `pnpm-lock.yaml`, `vite.config.ts`, `index.html`, `src/main.ts`, `scripts/` và `assets.lock.json` trước khi mang file từ nguồn mẫu vào template.
- Không sao chép `.git`, `node_modules`, Preview identity hoặc secrets từ bất kỳ nguồn nào.
- Giữ các cầu nối runtime/Tweak/Preview của template. Nếu thay đổi giao diện của hệ thống Tweak, đọc đúng hướng dẫn runtime của dự án trước.
- Giữ game state trong fixed-step `step()`; cập nhật visual trong `render()`; giữ generator/rules thuần.
- Tài nguyên lớn nên tiếp tục tải theo stage; không làm title hoặc combat chờ toàn bộ audio/model.
- Chuyển mọi câu chữ hiển thị cho người chơi sang tiếng Việt, kể cả chuỗi hard-code và nội dung được sinh từ data.
- Dùng tài nguyên có sẵn; Blueprint trước đã đóng và không phê duyệt image generation/online features.

## Kiểm tra trước khi bàn giao

Khi code đã được nhập vào project thật, chạy các lệnh phù hợp trên project đó: typecheck/build, unit tests, bundle-size check và kiểm tra `pnpm smoke` khi môi trường hỗ trợ. Xác nhận ảnh/model/audio được tham chiếu bằng path hợp lệ trong Preview; việc có file trong thư mục chưa có nghĩa là game đã tải hoặc hiển thị asset.
