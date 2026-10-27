# Tháp Ngục Vô Tận (Latern)

**Tháp Ngục Vô Tận (Latern)** là tựa game hành động roguelike 3D góc nhìn thứ ba lấy bối cảnh học viện siêu anh hùng lúc nửa đêm, được xây dựng bằng **Three.js + TypeScript + Vite** (phát triển và Việt hóa từ bản gốc *Super Dungeon*).

## 1. Giới thiệu & Cốt truyện

Sau giờ giới nghiêm, Học viện Siêu Anh Hùng (*Super Academy*) chìm xuống **Hầm Ngục Ngầm** (*Underhall*) — một khu hầm phong ấn nằm sâu bên dưới trường học. Bạn vào vai một học viên anh hùng trực đêm, bắt đầu mỗi lượt khám phá tại trung tâm **Sảnh Khởi Nguồn** (*Hall of Origins*) và tiến sâu qua hai tầng hầm ngục được sinh tự động theo mã hạt giống (*seed*):

- **Sảnh Khởi Nguồn (*Hall of Origins* - Hub):** Khu vực tập kết an toàn nơi người chơi rèn luyện kỹ năng di chuyển, mở Bảng Phát Triển & Từ Điển (*Development Board & Codex*) để nâng cấp chỉ số vĩnh viễn bằng điểm Công Trạng (*Merit*), xem lại thông tin bạn học đã giải cứu và bước vào Cổng Hầm Ngục (*Vault Portal*).
- **Tầng 1 – Cánh Trường Phong Ấn (5 Khu vực):** Mỗi lượt chơi chọn ngẫu nhiên một trong 5 khu vực (*wing*) với bảng màu, chướng ngại vật, bẫy và đội hình quái vật riêng biệt:
  1. **Lớp Học Tha Hóa** (*Corrupted Classrooms*)
  2. **Phòng Thí Nghiệm Bất Ổn** (*Unstable Science Labs*)
  3. **Hành Lang Cúp Danh Dự** (*Trophy Hall Gauntlet*)
  4. **Khu Kệ Sách Ám Ảnh** (*Haunted Library Stacks*)
  5. **Phòng Tập Phản Trọng Lực** (*Anti-Gravity Gym*)
  - Cuối Tầng 1, bạn phải đối đầu với Trùm **Giám Thị** (**The Proctor**) — kẻ canh gác mang áo choàng mô phỏng vật lý 3 giai đoạn (*3 phases*).
- **Tầng 2 – Thư Khố Sâu Thẳm (*The Stacks Below*):** Sau khi đánh bại Giám Thị, cánh cổng dịch chuyển đưa bạn xuống Tầng 2 cùng toàn bộ kỹ năng, điểm tín dụng và lượng máu hiện tại (kèm hồi phục 25% HP nghỉ ngơi). Đây là kho lưu trữ ma mị với mật độ quái dày đặc hơn, các trang biên niên sử ẩn và được canh giữ bởi Trùm cuối **Thủ Thư** (**The Librarian**).
  - **Thủ Thư** sở hữu 3 giai đoạn chiến đấu với các đòn lốc xoáy trang sách (*page-storm spirals*), kệ sách đổ sập theo vạch cảnh báo trên sàn (*falling bookshelves*), bức tường câm lặng **"SUỴT!"** (*"SHHH!" silence wall* — cần lướt qua hoặc chạy thoát), triệu hồi phiếu phạt quá hạn và dịch chuyển tức thời khắp phòng đọc từ giai đoạn 2.
- Trên đường đi, bạn giải cứu các bạn học bị giam giữ (mỗi người có điệu nhảy ăn mừng riêng), thu thập di vật (*relics*) và chọn thẻ nâng cấp sức mạnh (*power cards*). Cả hai Trùm đều khoác áo choàng viền đỏ-vàng có mô phỏng va chạm vật lý tương tự áo choàng của nhân vật chính (kiểm thử qua `scripts/boss-cape.mjs`, `scripts/cape-clip.mjs` và `scripts/cape-diag.mjs`).

---

## 2. Hướng dẫn cài đặt & Khởi chạy

Yêu cầu môi trường: **Node.js 20+** và **pnpm**.

```bash
pnpm install  # Cài đặt toàn bộ gói phụ thuộc
pnpm dev      # Khởi chạy máy chủ phát triển (mặc định tại http://127.0.0.1:3000, hỗ trợ biến môi trường PORT/HOST)
pnpm build    # Kiểm tra kiểu TypeScript + đóng gói bản dựng production + tạo metadata chia sẻ + kiểm tra ngân sách dung lượng (bundle budget)
pnpm test     # Chạy bộ kiểm thử đơn vị (unit tests): trình sinh hầm ngục, luật lượt chơi, cấu trúc lưu trữ, streamer, hướng dẫn
pnpm smoke    # Khi máy chủ dev đang chạy: tự động chơi thử trên trình duyệt ẩn (headless) + chụp ảnh màn hình vào thư mục smoke-shots/
```

**Chế độ gỡ lỗi (Debug):** Mở trình duyệt với tham số `?debug=1` (ví dụ `http://127.0.0.1:3000/?debug=1`) để kích hoạt đối tượng `window.__aegis` trên DevTools Console (ví dụ: `__aegis.startRun(12345)` hoặc `__aegis.openBoard()`).

---

## 3. Bảng điều khiển

| Hành động | Bàn phím + Chuột | Tay cầm (Gamepad) | Cảm ứng (Touch) |
| --- | --- | --- | --- |
| **Di chuyển / Xoay góc nhìn** | `WASD` / Chuột (nhấp để khóa con trỏ) | Cần gạt trái / Cần gạt phải | Cần điều khiển ảo bên trái / Kéo trên màn hình để xoay góc nhìn |
| **Đấm liên hoàn (Combo Punch)** | Chuột trái hoặc `J` | `X` / `RT` | Nút Đánh cận chiến |
| **Tia năng lượng (Power Bolt)** | Chuột phải hoặc `K` | `RB` / `LT` | Nút Bắn năng lượng |
| **Chạy nước rút (Sprint - giữ)** | `Shift` | `L3` | Đẩy cần điều khiển ảo sát viền ngoài |
| **Nhảy (Jump - né chấn động, axit, sóng xung kích)** | `Space` | `A` | Nút Nhảy |
| **Lướt (Dash - có khung hình bất tử i-frames)** | `C` | `B` | Nút Lướt |
| **Siêu Tân Tinh (Super Nova - khi đầy năng lượng)** | `Q` | `LB` | Nút Tuyệt kỹ (Nova) |
| **Tương tác (Interact)** | `E` | `Y` | Nút Tương tác ngữ cảnh |
| **Bản đồ / Tạm dừng (Map / Pause)** | `Tab` hoặc `M` / `Esc` | `View` / `Start` | Nút Bản đồ / Nút Menu tạm dừng |

> **Lưu ý:** Nếu môi trường trình duyệt nhúng không hỗ trợ khóa con trỏ chuột (*Pointer Lock*), bạn có thể giữ một nút chuột và kéo để xoay góc nhìn.

### Huấn luyện di chuyển (Dành cho người chơi mới)

Khi người chơi mới lần đầu bước vào **Sảnh Khởi Nguồn**, thẻ hướng dẫn gồm 3 bài tập ngắn sẽ tự động xuất hiện:
1. **Chạy nước rút (Sprint):** Giữ `Shift` và di chuyển trong khoảng 1 giây.
2. **Nhảy (Jump):** Thực hiện nhảy 2 lần (`Space`).
3. **Lướt (Dash):** Thực hiện lướt 2 lần (`C`).

Mỗi bước chỉ hoàn thành khi nhân vật thực sự thực hiện động tác; gợiig nút bấm tự động thay đổi theo thiết bị đang dùng (Bàn phím, Tay cầm hoặc Cảm ứng), đồng thời ô kỹ năng Lướt sẽ phát sáng. Khi hoàn thành hoặc bỏ qua, trạng thái `tutorialDone` được lưu vào bộ nhớ và nhân vật vẫn ở lại Sảnh Khởi Nguồn. Bạn có thể tập lại bất kỳ lúc nào từ menu Tạm dừng tại Sảnh (**Huấn luyện di chuyển** / *Movement Training*). Kiểm thử tự động bằng trình duyệt: `node scripts/tutorial-check.mjs`.

---

## 4. Kiến trúc hệ thống

### 4.1. Sinh hầm ngục theo hạt giống (`src/game/dungeon.ts`)

Hàm thuần túy, tất định theo hạt giống `generateDungeon(seed, { floor })`, hoàn toàn độc lập với Three.js. Tầng 2 sử dụng `floorSeed(runSeed, 2)`, giúp một mã hạt giống duy nhất tái hiện chính xác cả hai tầng:

1. **Chủ đề khu vực (Wing theme):** Tầng 1 chọn ngẫu nhiên 1 trong 5 khu vực; Tầng 2 luôn là **Thư Khố Sâu Thẳm** (*The Stacks Below*) với bảng màu, bẫy, tỷ lệ quái và các trang cốt truyện riêng.
2. **Đường đi chính (Critical path):** Thuật toán bước ngẫu nhiên trên lưới phòng từ phòng Khởi đầu đến phòng Trùm (luôn giữ một ô trống kế bên phòng Trùm cho Cổng thoát).
3. **Nhánh phụ (Branches):** Các phòng phụ tùy chọn (Hồi máu, Cửa hàng, Giải cứu bạn học, Thử thách, Kho báu, Cốt truyện) được gắn vào đường chính qua các cổng kết nối còn trống.
4. **Mẫu phòng (Templates):** Mỗi phòng được gán một cấu trúc thiết kế sẵn khớp với các cửa kết nối.
5. **Luật nhịp độ (Pacing rules):** Đánh giá độ nguy hiểm từng phòng — không quá 2 phòng nguy hiểm cao liên tiếp, đảm bảo ít nhất 1 cơ hội hồi máu trước phòng Trùm và đặt phòng Tinh anh (*Elite*) ở cuối chặng.
6. **Phân bổ thực thể (Population):** Sinh các đợt quái theo trọng số của khu vực, bẫy (bẫy xung điện, hồ axit, tia laser quét), phần thưởng, vật trang trí và màu ánh sáng.
7. **Kiểm chứng liên thông (Validation):** Thuật toán loang (*flood fill*) trên bản đồ ô lưới chứng minh mọi phòng và cửa đều có thể tiếp cận. Nếu sinh ngẫu nhiên thất bại sau nhiều lần thử, một sơ đồ dự phòng an toàn sẽ được sử dụng.

### 4.2. Luật chơi & Tính toán chỉ số (`src/game/rules.ts`)

Mô-đun thuần túy xử lý toàn bộ công thức toán học và quy tắc gameplay:
- **Tổng hợp chỉ số (`deriveStats`):** Kết hợp chỉ số gốc của nhân vật, nâng cấp vĩnh viễn tại Bảng Phát Triển, thẻ kỹ năng nhặt được trong lượt chơi và hiệu ứng cộng hưởng từ Di vật (*Relics*).
- **Quay thưởng nâng cấp (`rollUpgrades`):** Chọn ngẫu nhiên có trọng số theo độ hiếm và loại bỏ trùng lặp các thẻ nâng cấp tối đa cấp độ.
- **Công thức sát thương & Điểm Công Trạng (`merit`):** Tính toán sát thương cận chiến, đạn năng lượng, phạm vi nổ Super Nova, giảm sát thương nhận vào và quy đổi thành tích (số phòng dọn sạch, bạn học giải cứu, trùm tiêu diệt) thành điểm Công Trạng sau mỗi lượt.

### 4.3. Tải tài nguyên theo giai đoạn (`src/engine/streamer.ts`)

Không tải bất kỳ tài nguyên nào trước khi cần thiết. Tài nguyên được chia thành 7 giai đoạn:

| Giai đoạn | Tài nguyên tải | Thời điểm |
| --- | --- | --- |
| `title` | Mô hình/texture học viện, shader cảnh chính, âm thanh menu | Ngay sau khi màn hình tiêu đề hiện lên (cảnh 3D được dựng ngầm phía sau tấm poster) |
| `wave1` | Shader cho toàn bộ quái, vật phẩm, bẫy và đồ vật; âm thanh chiến đấu | Tải nền trước lượt chơi đầu tiên |
| `hub` | Nhạc nền Sảnh Khởi Nguồn | Tải nền |
| `floor1` | Nhạc nền Tầng 1, âm thanh hồi máu/giải cứu/thất bại | Tải nền |
| `boss1` | Shader và âm thanh của Giám Thị, nhạc Trùm 1, âm thanh xuống tầng | Tải nền, được ưu tiên khi người chơi đến gần cửa phòng Trùm |
| `floor2` | Nhạc nền Thư Khố Sâu Thẳm | Tải nền |
| `boss2` | Shader của Thủ Thư (gồm kệ sách và sóng câm lặng), âm thanh, nhạc Trùm 2 & nhạc chiến thắng | Tải nền |

- **Màn hình tiêu đề tức thời:** Khởi động chỉ cần JS, CSS, phông chữ và ảnh poster ~100 KB (`public/title/campus.webp`), giúp menu phản hồi trong ~0.5 giây.
- **Cơ chế chặn theo nhiệt độ trận đấu (*Heat gating*):** Tự động tạm dừng tải nền và biên dịch shader khi đang giao tranh ác liệt (phòng khóa, quái đang sống, nhiều hạt/đạn/cảnh báo hoặc đang đánh Trùm) và chỉ tiếp tục sau khi màn hình yên tĩnh trở lại.
- **Làm nóng Shader (`Renderer.warm`):** Tận dụng `KHR_parallel_shader_compile` (`compileAsync`) hoặc chia nhỏ từng vật liệu theo ngân sách khung hình để tránh giật khung hình (*frame stall*).
- **Âm thanh dự phòng Web Audio:** Nếu tệp âm thanh chưa tải xong hoặc lỗi mạng, hệ thống tự động phát âm thanh tổng hợp (*synthesized fallback*) tương ứng mà không làm gián đoạn trò chơi.

### 4.4. Tích hợp Manus Preview Tweak (`src/config.ts` & `src/tuning.ts`)

- **`src/config.ts`:** Chứa tập hằng số cấu hình cốt lõi của trò chơi (thông số điều khiển nhân vật, tốc độ chạy/lướt, sát thương cơ bản, thời lượng hồi chiêu, cấu hình camera và hiển thị).
- **`src/tuning.ts` & `scripts/manus-tuning/`:** Cung cấp cầu nối tinh chỉnh thời gian thực (*live tuning adapter*), đồng bộ hóa thông số giữa giao diện chỉnh sửa nhanh (*Manus Preview Tweak panel*) và trạng thái runtime của trò chơi mà không cần tải lại trang.

### 4.5. Cấu trúc thư mục chính

| Đường dẫn | Vai trò |
| --- | --- |
| `src/config.ts`, `src/tuning.ts` | Hằng số cấu hình gameplay và bộ điều hợp tinh chỉnh trực tiếp (Manus Preview Tweak) |
| `src/engine/i18n.ts` | Hệ thống đa ngôn ngữ & từ điển Việt hóa giao diện |
| `src/game/content.ts` | Dữ liệu 5 khu vực, mẫu phòng, quái vật, thẻ nâng cấp, di vật, bạn học và cốt truyện |
| `src/game/dungeon.ts` | Trình sinh hầm ngục theo seed, kiểm chứng đường đi, bố cục dự phòng |
| `src/game/rules.ts` | Tính toán chỉ số, quay thẻ nâng cấp, toán học sát thương và điểm Công Trạng |
| `src/game/level.ts` | Hình học toon instanced, cửa, ánh sáng, va chạm và tìm đường trường dòng chảy (*flow-field pathing*) |
| `src/game/hero.ts`, `enemies.ts`, `hazards.ts` | Thực thể chiến đấu và vùng cảnh báo đòn đánh (*telegraphs*) |
| `src/game/boss.ts`, `librarian.ts` | Giao diện `BossActor`, Trùm Giám Thị (Tầng 1) và Trùm Thủ Thư (Tầng 2) |
| `src/game/character.ts`, `actors.ts` | Nhân vật gắn xương (*skinned mesh*), chuyển đổi hoạt ảnh, áo choàng vật lý, giải cứu bạn học |
| `src/game/dances.ts` | 6 điệu nhảy ăn mừng được thiết kế riêng cho từng bạn học |
| `src/game/game.ts` | Quản lý chế độ chơi, vòng đời lượt chạy, luồng phòng, phần thưởng và màn hình kết quả |
| `src/ui/ui.ts` | Giao diện DOM HUD, menu, hộp thoại modal, bản đồ và điều khiển cảm ứng |
| `src/engine/*` | Vòng lặp thời gian cố định (`loop.ts`), kết xuất (`renderer.ts`), đầu vào (`input.ts`), bộ trộn âm thanh (`audio.ts`), tải theo giai đoạn (`streamer.ts`), lưu trữ có phiên bản (`save.ts`) |
| `scripts/check-size.mjs` | Kiểm tra ngân sách dung lượng gói tin (JS, Fonts, Transfer, Audio, 3D Assets) |
| `scripts/smoke.mjs`, `scripts/tutorial-check.mjs` | Kịch bản kiểm thử tự động toàn luồng và kiểm thử huấn luyện di chuyển bằng Playwright |

---

## 5. Nguồn gốc & Giấy phép tài nguyên (Provenance & Credits)

- **Mã nguồn & Thiết kế gốc:** Phối lại (*remix*) và Việt hóa từ dự án mẫu **Super Dungeon** (*Aegis After Hours*) kết hợp cùng bộ khung **Manus Runtime Starter**.
- **Thư viện 3D:** [Three.js](https://threejs.org/) (Giấy phép MIT). Các mô hình và vật liệu hoạt họa được tối ưu hóa dưới dạng GLB nén Meshopt và hình học sinh tự động (*procedural*).
- **Phông chữ (Fonts):**
  - **Bangers**, **Sora**, **Figtree** — phát hành theo giấy phép **SIL Open Font License 1.1** (xem chi tiết tại `public/fonts/*-OFL.txt`).
  - **ManusCC0** (`ManusCC0-Regular/Medium/Bold.ttf`, `ManusCC0SansCJKSC-Regular.woff2`) — phát hành theo giấy phép **CC0 1.0 Universal** (xem `public/fonts/ManusCC0-LICENSE.txt`).
- **Âm nhạc & Hiệu ứng âm thanh (Audio):**
  - Nhạc nền (Sảnh Khởi Nguồn, Tầng 1, Tầng 2, nhạc Trùm Giám Thị, nhạc Trùm Thủ Thư và nhạc Chiến thắng) được tạo bằng **Google Lyria**.
  - 29 hiệu ứng âm thanh (SFX) được tạo bằng **ElevenLabs** và chuẩn hóa âm lượng qua `scripts/process-audio.sh`.
  - Bộ trộn `src/engine/audio.ts` phát nhạc trực tuyến kèm chuyển tiếp mượt (*crossfade*) và bộ lọc thông thấp (*low-pass filter*) tự động mở rộng khi bước vào giao tranh.
