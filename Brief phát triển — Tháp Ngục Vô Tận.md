# Brief phát triển — Tháp Ngục Vô Tận

## Tóm tắt

Bản nguồn **Super Dungeon** là game hành động nhập vai roguelike 3D góc nhìn thứ ba, xây bằng Three.js, TypeScript và Vite. Tiền đề: sau giờ giới nghiêm, học viện Super Academy chìm xuống một hầm ngục phong ấn bên dưới trường. Người chơi là học viên anh hùng, bắt đầu ở **Hall of Origins**, khám phá các phòng được tạo theo seed, đánh quái, giải cứu bạn học và chọn năng lực.

Bản remix được khởi tạo với tên **Tháp Ngục Vô Tận** và nội dung game cần chuyển sang **tiếng Việt**. Giữ Three.js/Vite và tương thích runtime của template Manus hiện có.

## Vòng lặp chơi từ bộ nguồn

1. Từ màn hình tiêu đề, vào Hall of Origins làm trung tâm; người chơi có thể luyện di chuyển, xem bảng/hướng dẫn và tới cổng hầm ngục.
2. Bắt đầu một lượt với seed. Seed quyết định bố cục; cùng seed phải tái tạo cùng bản đồ.
3. Đi qua phòng chiến đấu, né bẫy và telegraph, đánh theo combo, dùng đạn năng lượng, dash, nhảy và Super Nova.
4. Sau khi dọn phòng, chọn nâng cấp/phần thưởng; các nhánh phụ có thể có hồi máu, cửa hàng, cứu bạn học, thử thách, kho báu hoặc lore.
5. Đánh bại trùm tầng 1 **The Proctor**, xuống tầng 2 **The Stacks Below** và đối đầu **The Librarian**. Bộ build, HP còn lại (có hồi phục giữa tầng theo README) và credits được mang tiếp.
6. Kết thúc thắng/thua bằng màn hình kết quả; seed xuất hiện trong pause/kết quả và có thể nhập lại ở cổng để chơi lại cùng layout.

README mô tả 5 theme cho tầng 1: Corrupted Classrooms, Unstable Science Labs, Trophy Hall Gauntlet, Haunted Library Stacks và Anti-Gravity Gym; tầng 2 cố định là The Stacks Below. Hai trùm có nhiều pha và đòn đánh có báo trước.

## Điều khiển gốc

| Tác vụ | Bàn phím/chuột | Gamepad |
| --- | --- | --- |
| Di chuyển / nhìn | WASD / rê chuột (click để khóa chuột) | Cần trái / phải |
| Combo đấm | Chuột trái hoặc J | X / RT |
| Bắn năng lượng | Chuột phải hoặc K | RB / LT |
| Chạy nước rút | Giữ Shift | L3 |
| Nhảy | Space | A |
| Dash có khung bất tử | C | B |
| Super Nova | Q | LB |
| Tương tác | E | Y |
| Bản đồ / pause | Tab hoặc M / Esc | View / Start |

Có hỗ trợ điều khiển cảm ứng bằng cần ảo, kéo để nhìn và nút hành động. Nếu Preview không hỗ trợ pointer-lock, có thể giữ nút chuột và kéo để nhìn. Khi bản địa hóa, giữ ý nghĩa, chỉ dẫn theo input method đang hoạt động và trạng thái của các nút; không dịch tên phím/gamepad.

## Kiến trúc nguồn chính

| Đường dẫn trong `showcase-source/` | Trách nhiệm |
| --- | --- |
| `src/game/content.ts` | Nội dung theme tầng, template phòng, kẻ địch, nâng cấp, relic, nhân vật/lore. |
| `src/game/dungeon.ts`, `rng.ts` | Sinh dungeon thuần, có seed và tất định; kiểm tra khả năng đi tới mọi phòng/cửa, có layout dự phòng an toàn. |
| `src/game/rules.ts` | Tính chỉ số, roll nâng cấp, sát thương, merit/rank. |
| `src/game/level.ts`, `surfaces.ts` | Hình học/instancing, cửa, ánh sáng, va chạm, pathfinding và bề mặt. |
| `src/game/hero.ts`, `enemies.ts`, `hazards.ts`, `boss.ts`, `librarian.ts` | Nhân vật, kẻ địch, bẫy, boss tầng 1 và tầng 2. Gameplay state cần cập nhật trong `step()` cố định; `render()` dành cho hiển thị. |
| `src/game/character.ts`, `actors.ts`, `models.ts`, `assets3d.ts` | Nhân vật skinned, animation clips, clone model, tài nguyên nhân vật/props. |
| `src/game/game.ts` | State/mode, vòng đời run, luồng phòng, phần thưởng và kết quả. |
| `src/ui/ui.ts`, `icons.ts`, `src/styles/main.css` | HUD, menu, modal, bản đồ, nút cảm ứng và kiểu trình bày. |
| `src/engine/` | Game loop, renderer, input, âm thanh, save có version, streaming tải theo stage. |
| `public/` | Audio, model 3D, texture, particle, font, title art và các file phục vụ trình duyệt. |
| `assets/source/` | Tài nguyên gốc và thông tin nguồn/giấy phép; bảo toàn cấu trúc, License và metadata đi kèm. |
| `scripts/`, `tests/`, `docs/`, `smoke-shots/` | Công cụ build/xử lý, unit test, đề xuất hình ảnh và ảnh chụp smoke test. |

## Điểm kỹ thuật cần giữ

- `generateDungeon(seed, { floor })` không phụ thuộc Three.js; các thuật toán sinh dungeon và luật gameplay nên giữ thuần và được kiểm thử.
- Tầng 2 dùng seed dẫn xuất từ seed lượt; layout không đổi khi chơi lại cùng seed.
- Streamer chia tài nguyên theo stage (`title`, `wave1`, `hub`, `floor1`, `boss1`, `floor2`, `boss2`) và hạn chế tải nền khi giao tranh nóng. Giữ hành vi tải trì hoãn khi tích hợp.
- Các stage thiết yếu có thể chờ ở màn chuyển cảnh, nhưng lỗi tải asset không được làm treo lượt chơi; fallback dựng sẵn là một phần trải nghiệm.
- Mã nguồn mẫu có kiểm thử dungeon/rules/save/streamer/tutorial. Giữ `pnpm test`, `pnpm build` và bundle budget; `pnpm smoke` cần server đang chạy.
- Template Manus có các tệp Preview/Tweak và runtime riêng. Đối chiếu snapshot `runtime-starter/`; không bỏ `assets.lock.json`, bridge, config Vite hoặc scripts hệ thống mà chưa hiểu ảnh hưởng.

## Yêu cầu nội dung cho bản remix

- Tên bản remix: **Tháp Ngục Vô Tận**; tên nguồn **Super Dungeon** chỉ dùng khi ghi xuất xứ/ghi chú.
- Nội dung và UI hiển thị cho người chơi bằng tiếng Việt; nguồn mẫu README ghi rõ bản gốc English-only. Rà soát cả canvas/DOM, nút, prompt, tutorial, popup, lore, pause/results, tiêu đề và thông báo lỗi hiển thị.
- Giữ controls, seed replay, tiến trình qua hai tầng, boss phases, giải cứu, nâng cấp, bẫy và hỗ trợ keyboard/gamepad/touch trừ khi người dùng đưa yêu cầu thay đổi.
- Chỉ dùng tài nguyên có sẵn trong bộ nguồn cho giai đoạn hiện tại. Không tự suy ra quyền tạo ảnh/model mới từ Blueprint đã đóng.
