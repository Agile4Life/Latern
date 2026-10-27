/**
 * All authored content in one place: the five dungeon wings, the modular room chunks the
 * generator assembles, enemy stats, upgrade cards, relics, classmates and lore. Pure data — no
 * three.js — so the generator and rules stay unit-testable.
 */

export type Dir = 'N' | 'E' | 'S' | 'W'
export const DIRS: readonly Dir[] = ['N', 'E', 'S', 'W']
export const DIR_VEC: Record<Dir, { x: number; y: number }> = { N: { x: 0, y: -1 }, E: { x: 1, y: 0 }, S: { x: 0, y: 1 }, W: { x: -1, y: 0 } }
export const OPPOSITE: Record<Dir, Dir> = { N: 'S', S: 'N', E: 'W', W: 'E' }

// ─── Wings ────────────────────────────────────────────────────────────────

export type WingId = 'classrooms' | 'labs' | 'trophy' | 'library' | 'gym' | 'stacks'
export type HazardType = 'chalk' | 'acid' | 'spark' | 'laser' | 'tomes' | 'vent'
export type EnemyType = 'swarm' | 'shade' | 'monitor' | 'bruiser'
export type CoverKind = 'desk' | 'bench' | 'case' | 'shelf' | 'mat'

export type WingDef = {
  id: WingId | 'hub'
  name: string
  short: string
  tagline: string
  floorA: string
  floorB: string
  corridor: string
  wall: string
  wallTop: string
  trim: string
  fog: string
  sky: string
  ground: string
  lights: string[]
  cover: CoverKind
  hazards: Partial<Record<HazardType, number>>
  enemies: Partial<Record<EnemyType, number>>
  /** Template ids this wing favours (weighted x3 during selection). */
  favours: string[]
}

export const WINGS: Record<WingId, WingDef> = {
  classrooms: {
    id: 'classrooms', name: 'Dãy Phòng Học Tha Hóa', short: 'Phòng Học',
    tagline: 'Bàn ghế tự trôi. Phấn tự viết lên bảng. Tiết học này không bao giờ tan.',
    floorA: '#5b4a7a', floorB: '#4d3f69', corridor: '#3a3052', wall: '#2f2a4a', wallTop: '#6e5fa3', trim: '#ffd35c',
    fog: '#1a1430', sky: '#8f7fd6', ground: '#2a1f3a', lights: ['#ffd35c', '#ff9f5c', '#b58cff'],
    cover: 'desk', hazards: { chalk: 3, tomes: 1 }, enemies: { shade: 3, swarm: 3, monitor: 2, bruiser: 1 },
    favours: ['rows', 'pillars'],
  },
  labs: {
    id: 'labs', name: 'Phòng Thí Nghiệm Bất Ổn', short: 'Phòng Thí Nghiệm',
    tagline: 'Mọi thí nghiệm đều thất bại cùng lúc — và tự mọc chân bước đi.',
    floorA: '#2f5d5a', floorB: '#284f4d', corridor: '#1f3b3d', wall: '#1d2f36', wallTop: '#3fbfa6', trim: '#6dff9e',
    fog: '#0c1f22', sky: '#6fd6c1', ground: '#12272a', lights: ['#6dff9e', '#7ef9ff', '#c8ff5c'],
    cover: 'bench', hazards: { acid: 3, spark: 2 }, enemies: { swarm: 2, monitor: 3, shade: 2, bruiser: 1 },
    favours: ['islands', 'ring'],
  },
  trophy: {
    id: 'trophy', name: 'Hành Lang Danh Dự', short: 'Sảnh Danh Dự',
    tagline: 'Một thế kỷ vinh quang, và chiếc cúp nào cũng đòi tái đấu.',
    floorA: '#6b4a2e', floorB: '#5c3f27', corridor: '#43301f', wall: '#3a2618', wallTop: '#c98f3a', trim: '#ffcf4d',
    fog: '#1f140c', sky: '#ffcc80', ground: '#2a1a10', lights: ['#ffcf4d', '#ff7a45', '#fff0b3'],
    cover: 'case', hazards: { laser: 3, chalk: 1 }, enemies: { bruiser: 2, shade: 3, monitor: 2, swarm: 1 },
    favours: ['lanes', 'arena'],
  },
  library: {
    id: 'library', name: 'Khu Thư Viện Ma Ám', short: 'Thư Viện',
    tagline: 'Những cuốn sách quá hạn lượn lờ như cá mập giữa các dãy kệ.',
    floorA: '#3d3a5c', floorB: '#35324f', corridor: '#28263d', wall: '#231f33', wallTop: '#7a64c9', trim: '#c58cff',
    fog: '#120f1f', sky: '#a393ff', ground: '#1a1528', lights: ['#c58cff', '#7ea6ff', '#ffd9a8'],
    cover: 'shelf', hazards: { tomes: 3, chalk: 1 }, enemies: { swarm: 3, shade: 3, monitor: 1, bruiser: 1 },
    favours: ['stacks', 'rows'],
  },
  gym: {
    id: 'gym', name: 'Nhà Thi Đấu Phản Trọng Lực', short: 'Nhà Thi Đấu',
    tagline: 'Trọng lực xin nghỉ phép. Nhưng bóng né thì không.',
    floorA: '#7a4b3a', floorB: '#6b4133', corridor: '#3f2b2b', wall: '#2c2230', wallTop: '#ff6b8b', trim: '#7ef9ff',
    fog: '#180f1a', sky: '#ff9fb5', ground: '#241624', lights: ['#7ef9ff', '#ff6b8b', '#ffe066'],
    cover: 'mat', hazards: { vent: 3, spark: 1 }, enemies: { bruiser: 2, swarm: 2, shade: 2, monitor: 2 },
    favours: ['arena', 'pillars'],
  },
  stacks: {
    id: 'stacks', name: 'Tầng Thư Khố Sâu Thẳm', short: 'Tầng Thư Khố',
    tagline: 'Sâu dưới thư viện, mọi cuốn sách quá hạn vẫn đang chờ ngày được trả lại.',
    floorA: '#243a44', floorB: '#1f323b', corridor: '#172329', wall: '#141c22', wallTop: '#3fd3b0', trim: '#7effd4',
    fog: '#081214', sky: '#7effd4', ground: '#0f191c', lights: ['#7effd4', '#c58cff', '#ffd9a8'],
    cover: 'shelf', hazards: { tomes: 3, laser: 1, chalk: 1 }, enemies: { shade: 3, swarm: 2, monitor: 2, bruiser: 2 },
    favours: ['stacks', 'rows', 'islands'],
  },
}
/** Every wing id (the hub is not a wing). */
export const WING_IDS = Object.keys(WINGS) as WingId[]
/** Floor 1 rolls one of the five academy wings; Floor 2 is always The Stacks Below. */
export const FLOOR1_WINGS: WingId[] = ['classrooms', 'labs', 'trophy', 'library', 'gym']
export const FLOOR_COUNT = 2

// ─── Room templates (modular chunks) ─────────────────────────────────────
// Interior tiles only; the builder adds the outer wall ring and 3-wide door sockets centred on
// each side. '.' floor · '#' pillar · 'c' wing cover prop (solid, blocks shots) · 'e' enemy spawn
// · 'h' hazard anchor · 'p' decor · 'x' room centre / feature.

export type TemplateRole = 'combat' | 'special' | 'boss' | 'rescue'
export type TemplateDef = { id: string; role: TemplateRole; sockets: string; rows: string[] }

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'rows', role: 'combat', sockets: 'NESW', rows: [
      '...........',
      '.e.......e.',
      '..cc.c.cc..',
      '...........',
      '..cc...cc..',
      '.h...x...h.',
      '..cc...cc..',
      '...........',
      '..cc.c.cc..',
      '.e...e...e.',
      '...........',
    ],
  },
  {
    id: 'ring', role: 'combat', sockets: 'NESW', rows: [
      '...........',
      '.e.......e.',
      '.....h.....',
      '...##.##...',
      '...#...#...',
      '.h...x...h.',
      '...#...#...',
      '...##.##...',
      '...........',
      '.e...e...e.',
      '...........',
    ],
  },
  {
    id: 'pillars', role: 'combat', sockets: 'NESW', rows: [
      '...........',
      '.e.......e.',
      '..#..h..#..',
      '...........',
      '....c.c....',
      '.h...x...h.',
      '....c.c....',
      '...........',
      '..#..h..#..',
      '.e...e...e.',
      '...........',
    ],
  },
  {
    id: 'lanes', role: 'combat', sockets: 'NS', rows: [
      '.....e.....',
      '.ccc...ccc.',
      '.e.......e.',
      '.h..ccc..h.',
      '...........',
      '.ccc.x.ccc.',
      '...........',
      '.h..ccc..h.',
      '.e.......e.',
      '.ccc...ccc.',
      '.....e.....',
    ],
  },
  {
    id: 'corner', role: 'combat', sockets: 'NSW', rows: [
      '.......####',
      '.e.....####',
      '.......####',
      '...h...####',
      '.......####',
      '.h...x.....',
      '...........',
      '..c...c..e.',
      '...........',
      '.e...h...e.',
      '...........',
    ],
  },
  {
    id: 'stacks', role: 'combat', sockets: 'NESW', rows: [
      '...........',
      '.cc.ccc.cc.',
      '.e.......e.',
      '.cc.c.c.cc.',
      '.....h.....',
      '.h...x...h.',
      '.....h.....',
      '.cc.c.c.cc.',
      '.e.......e.',
      '.cc.ccc.cc.',
      '...........',
    ],
  },
  {
    id: 'cross', role: 'combat', sockets: 'NESW', rows: [
      '##.....##',
      '#e.....e#',
      '...h.h...',
      '.........',
      '....x....',
      '.........',
      '...c.c...',
      '#e.....e#',
      '##.....##',
    ],
  },
  {
    id: 'islands', role: 'combat', sockets: 'NESW', rows: [
      '.............',
      '.e....e....e.',
      '..cc.....cc..',
      '..c...h...c..',
      '.............',
      '...#.....#...',
      '.h....x....h.',
      '...#.....#...',
      '.............',
      '..c...h...c..',
      '..cc.....cc..',
      '.e....e....e.',
      '.............',
    ],
  },
  {
    id: 'arena', role: 'combat', sockets: 'NESW', rows: [
      '.............',
      '.e.........e.',
      '...h.....h...',
      '.............',
      '.....#.#.....',
      '.............',
      '.e....x....e.',
      '.............',
      '.....#.#.....',
      '.............',
      '...h.....h...',
      '.e.........e.',
      '.............',
    ],
  },
  {
    id: 'chamber', role: 'special', sockets: 'NESW', rows: [
      '.........',
      '.p.....p.',
      '.........',
      '.........',
      '....x....',
      '.........',
      '.........',
      '.p.....p.',
      '.........',
    ],
  },
  {
    id: 'alcove', role: 'special', sockets: 'NESW', rows: [
      '##.....##',
      '#p.....p#',
      '.........',
      '.........',
      '....x....',
      '.........',
      '.........',
      '#p.....p#',
      '##.....##',
    ],
  },
  {
    id: 'rescue', role: 'rescue', sockets: 'NESW', rows: [
      '...........',
      '.e.......e.',
      '...p...p...',
      '...........',
      '...........',
      '.e...x...e.',
      '...........',
      '...........',
      '...p...p...',
      '.e.......e.',
      '...........',
    ],
  },
  {
    id: 'proctor', role: 'boss', sockets: 'NESW', rows: [
      '.............',
      '.p.........p.',
      '.............',
      '...#.....#...',
      '.............',
      '.............',
      '......x......',
      '.............',
      '.............',
      '...#.....#...',
      '.............',
      '.p.........p.',
      '.............',
    ],
  },
]

// ─── Enemies ──────────────────────────────────────────────────────────────

export type EnemyDef = { name: string; hp: number; speed: number; radius: number; damage: number; cost: number; credits: number }
export const ENEMIES: Record<EnemyType, EnemyDef> = {
  swarm: { name: 'Bài Kiểm Tra Đột Xuất', hp: 16, speed: 6.4, radius: 0.45, damage: 6, cost: 1, credits: 2 },
  shade: { name: 'Bóng Ma Cấm Túc', hp: 44, speed: 4.3, radius: 0.55, damage: 13, cost: 2, credits: 4 },
  monitor: { name: 'Sao Đỏ Tuần Tra', hp: 32, speed: 3.6, radius: 0.6, damage: 10, cost: 2, credits: 4 },
  bruiser: { name: 'Linh Vật Cuồng Nộ', hp: 140, speed: 2.6, radius: 1.0, damage: 22, cost: 4, credits: 9 },
}

export type BossId = 'proctor' | 'librarian'
export type BossDef = {
  id: BossId
  name: string
  title: string
  hp: number
  phases: [string, string, string]
  arena: string
  color: string
  defeat: [string, string]
}
export const BOSSES: Record<BossId, BossDef> = {
  proctor: {
    id: 'proctor', name: 'Giám Thị', title: 'Kẻ Gác Kỳ Thi Cuối', hp: 1100, phases: ['KIỂM TRA MIỆNG', 'THI GIỮA KỲ', 'KỲ THI CUỐI'],
    arena: 'Hội Trường Thi Của Giám Thị', color: '#e8384f', defeat: ['VƯỢT QUA KỲ THI!', 'Giám Thị đã bị phong ấn. Cổng dịch chuyển dẫn xuống sâu hơn...'],
  },
  librarian: {
    id: 'librarian', name: 'Thủ Thư', title: 'Cai Ngục Tầng Thư Khố', hp: 1500, phases: ['QUÁ HẠN', 'GIỮ TRẬT TỰ', 'GIỜ ĐÓNG CỬA'],
    arena: 'Phòng Đọc Sách Đáy Vực', color: '#7effd4', defeat: ['ĐÓNG SÁCH!', 'Hầm Ngục đã yên tĩnh. Hãy tiến tới cổng dịch chuyển để về nhà!'],
  },
}
/** Floor number (1-based) → boss guarding it. */
export const FLOOR_BOSS: BossId[] = ['proctor', 'librarian']
export const BOSS = BOSSES.proctor

// ─── Upgrades (in-run choices) ───────────────────────────────────────────

export type Rarity = 'common' | 'rare' | 'epic'
export type UpgradeId =
  | 'knuckles' | 'splitShot' | 'chain' | 'overcharge' | 'afterimage' | 'vampiric' | 'shield' | 'seismic'
  | 'heart' | 'momentum' | 'surge' | 'glass' | 'nova' | 'critical' | 'bulwark'
export type UpgradeDef = { id: UpgradeId; name: string; desc: string; rarity: Rarity; max: number; icon: string; tag: 'melee' | 'bolt' | 'dash' | 'nova' | 'defense' | 'utility' }

export const UPGRADES: UpgradeDef[] = [
  { id: 'knuckles', name: 'Nắm Đấm Động Năng', desc: 'Sát thương cận chiến +30%.', rarity: 'common', max: 3, icon: 'fist', tag: 'melee' },
  { id: 'seismic', name: 'Đòn Kết Liễu Địa Chấn', desc: 'Đòn cận chiến thứ 3 trong chuỗi phát nổ sóng xung kích quanh mục tiêu.', rarity: 'rare', max: 1, icon: 'quake', tag: 'melee' },
  { id: 'vampiric', name: 'Ý Chí Anh Hùng', desc: 'Đòn đánh cận chiến hồi 1 Máu.', rarity: 'rare', max: 2, icon: 'heart', tag: 'melee' },
  { id: 'splitShot', name: 'Đạn Phân Tách', desc: 'Tia Năng Lượng bắn tỏa ra 3 hướng.', rarity: 'rare', max: 1, icon: 'split', tag: 'bolt' },
  { id: 'chain', name: 'Sét Liên Hoàn', desc: 'Tia đạn giật lan sang 2 kẻ địch khác (60% sát thương).', rarity: 'epic', max: 1, icon: 'bolt', tag: 'bolt' },
  { id: 'overcharge', name: 'Quá Tải Năng Lượng', desc: 'Tia đạn tốn ít hơn 35% Năng Lượng và gây thêm 20% sát thương.', rarity: 'common', max: 2, icon: 'battery', tag: 'bolt' },
  { id: 'afterimage', name: 'Lướt Tàn Ảnh', desc: 'Lướt xuyên qua kẻ địch gây 25 sát thương.', rarity: 'rare', max: 1, icon: 'dash', tag: 'dash' },
  { id: 'momentum', name: 'Quán Tính', desc: 'Tốc độ di chuyển +12% và hồi chiêu lướt -25%.', rarity: 'common', max: 2, icon: 'wing', tag: 'dash' },
  { id: 'nova', name: 'Siêu Tân Tinh', desc: 'Bán kính vụ nổ +40%, sát thương +50% và làm choáng lâu hơn.', rarity: 'rare', max: 2, icon: 'star', tag: 'nova' },
  { id: 'surge', name: 'Trào Dâng Năng Lượng', desc: 'Tích tụ Năng Lượng nhanh hơn 50%.', rarity: 'common', max: 2, icon: 'spark', tag: 'nova' },
  { id: 'shield', name: 'Siêu Khiên Chắn', desc: 'Khiên chắn chặn 1 đòn đánh, tự nạp lại sau mỗi 9 giây.', rarity: 'epic', max: 1, icon: 'shield', tag: 'defense' },
  { id: 'heart', name: 'Trái Tim Anh Hùng', desc: 'Máu tối đa +25 và hồi ngay 25 Máu.', rarity: 'common', max: 3, icon: 'plus', tag: 'defense' },
  { id: 'bulwark', name: 'Ý Chí Sắt Đá', desc: 'Giảm 15% sát thương nhận vào.', rarity: 'rare', max: 2, icon: 'armor', tag: 'defense' },
  { id: 'critical', name: 'Thủ Khoa Học Viện', desc: '+15% tỷ lệ gây sát thương chí mạng gấp đôi.', rarity: 'rare', max: 2, icon: 'crit', tag: 'utility' },
  { id: 'glass', name: 'Pháo Thủy Tinh', desc: 'Mọi sát thương +40%, nhưng Máu tối đa -25.', rarity: 'epic', max: 1, icon: 'skull', tag: 'utility' },
]
export const UPGRADE_BY_ID = Object.fromEntries(UPGRADES.map(u => [u.id, u])) as Record<UpgradeId, UpgradeDef>

// ─── Relics (rare finds, logged in the Codex) ────────────────────────────

export type RelicId = 'cape' | 'crest' | 'compass' | 'key' | 'hourglass' | 'shard'
export type RelicDef = { id: RelicId; name: string; effect: string; lore: string }
export const RELICS: RelicDef[] = [
  { id: 'cape', name: 'Áo Choàng Sáng Lập', effect: 'Mỗi lượt chơi một lần, hồi sinh với 50% Máu.', lore: 'Được Hiệu trưởng Aurelia khoác trên vai vào đêm đầu tiên bà phong ấn Hầm Ngục.' },
  { id: 'crest', name: 'Huy Hiệu Khóa Đầu Tiên', effect: 'Mọi sát thương +20%.', lore: 'Mười hai học viên tốt nghiệp năm 1924. Mười một cái tên được khắc trên đó. Một cái tên đã bị cạo xước.' },
  { id: 'compass', name: 'La Bàn Đội Trưởng Quả Cảm', effect: 'Hé lộ toàn bộ bản đồ tầng. Tỷ lệ chí mạng +10%.', lore: 'Nó chẳng bao giờ chỉ hướng Bắc. Nó luôn chỉ về phía người đang cần được cứu giúp.' },
  { id: 'key', name: 'Chìa Khóa Tủ Đồ May Mắn', effect: 'Tín chỉ +60%. Giá máy bán hàng -25%.', lore: 'Mở được tủ đồ số 713 — chiếc tủ vốn không hề tồn tại trên bất kỳ bản vẽ nào của học viện.' },
  { id: 'hourglass', name: 'Đồng Hồ Cát Cấm Túc', effect: 'Kẻ địch di chuyển chậm đi 15%.', lore: 'Tịch thu từ một học viên du hành thời gian năm 1987. Cát bên trong vẫn chảy ngược lên trên.' },
  { id: 'shard', name: 'Mảnh Vỡ Lõi Siêu Năng', effect: 'Hồi 4 Năng Lượng mỗi giây.', lore: 'Một mảnh vỡ tách ra từ chính phong ấn. Nó ngân nga bài trường ca, nhưng toàn lệch nhịp.' },
]
export const RELIC_BY_ID = Object.fromEntries(RELICS.map(r => [r.id, r])) as Record<RelicId, RelicDef>

// ─── Classmates (rescues grant an assist this run and a permanent bonus) ─

export type ClassmateId = 'pixel' | 'rocky' | 'zephyr' | 'mira' | 'tock' | 'blaze'
export type ClassmateDef = { id: ClassmateId; name: string; power: string; assist: string; line: string; color: string }
export const CLASSMATES: ClassmateDef[] = [
  { id: 'pixel', name: 'Pixel Park', power: 'Thao Túng Công Nghệ', assist: 'Sát thương Tia Năng Lượng +20%', line: 'Tường lửa của hầm ngầm bị phá từ BÊN TRONG. Ai đó đã cố tình mở nó ra.', color: '#7ef9ff' },
  { id: 'rocky', name: 'Rocky Ramos', power: 'Mình Đồng Da Đá', assist: 'Máu tối đa +15', line: 'Mình đang hít đất trong nhà thi đấu thì sàn nhà bỗng dưng... nuốt chửng mình. Bất lịch sự thật.', color: '#c98f3a' },
  { id: 'zephyr', name: 'Zephyr Quinn', power: 'Lướt Gió', assist: 'Tốc độ di chuyển +8%', line: 'Các hành lang đang tự dịch chuyển. Cứ như thể cả ngôi trường đang tự sắp xếp lại quanh CẬU vậy.', color: '#b8f5ff' },
  { id: 'mira', name: 'Mira Solis', power: 'Quang Trị Liệu', assist: 'Hồi 6 Máu sau mỗi phòng dọn sạch', line: 'Bóng tối cứ thì thầm những câu hỏi thi cử. Mình chẳng biết đáp án của câu nào cả.', color: '#ffd35c' },
  { id: 'tock', name: 'Tock', power: 'Trượt Thời Gian', assist: 'Hồi chiêu lướt -20%', line: 'Mình đã chứng kiến đêm nay mười một lần rồi. Trong mọi vòng lặp, cậu luôn là người bước xuống cứu viện.', color: '#c58cff' },
  { id: 'blaze', name: 'Blaze Okafor', power: 'Điều Khiển Hỏa Năng', assist: 'Sát thương cận chiến +15%', line: 'Giám Thị không phải kẻ ác. Nó đang chấm điểm chúng ta. Và chúng ta đang rớt môn.', color: '#ff7a45' },
]
export const CLASSMATE_BY_ID = Object.fromEntries(CLASSMATES.map(c => [c.id, c])) as Record<ClassmateId, ClassmateDef>

// ─── Lore pages (mystery of the Underhall) ───────────────────────────────

export type LorePage = { id: string; title: string; text: string }
export const LORE: LorePage[] = [
  { id: 'l1', title: 'Nhật Ký Sáng Lập, trang 3', text: 'Chúng tôi không ngẫu nhiên xây dựng Học Viện Siêu Anh Hùng ngay phía trên Hầm Ngục. Một ngôi trường là lời hứa rằng thế hệ kế tiếp sẽ sẵn sàng. Hầm ngầm này là nơi lưu giữ thứ mà các em phải sẵn sàng đối mặt.' },
  { id: 'l2', title: 'Nhật Ký Bảo Trì #0413', text: 'Áp suất phong ấn giảm 2% mỗi học kỳ. Hiệu trưởng bảo rằng nó "nuôi dưỡng bằng sự hoài nghi". Đã xin ngân sách mua thêm bê tông chống hoài nghi. Bị từ chối.' },
  { id: 'l3', title: 'Phiếu Cấm Túc (Không Chữ Ký)', text: 'Lý do cấm túc: "Dám hỏi thứ gì nằm sau cánh cửa tầng hầm phụ." Người ký phạt: GIÁM THỊ. Thời hạn: Cho đến khi thi đỗ.' },
  { id: 'l4', title: 'Thực Đơn Căng Tin, Tuần thứ ∞', text: 'Thứ Hai: Thịt bí ẩn. Thứ Ba: Bí ẩn. Thứ Tư: Bí ẩn chính là bạn. Thứ Năm: [trang giấy bị nhai nát].' },
  { id: 'l5', title: 'Thư Gửi Hội Đồng Trường', text: 'Giám Thị chưa bao giờ là một con quái vật. Đó là người thầy đầu tiên của chúng ta — thực thể đã khảo nghiệm mọi nhà sáng lập. Chúng ta phong ấn nó chỉ vì không còn muốn bị thử thách nữa.' },
  { id: 'l6', title: 'Bản Ghi Camera An Ninh', text: '23:58 — Giờ giới nghiêm. 23:59 — Một bóng người mặc đồng phục học viên chạm thẻ từ vào phong ấn. 00:00 — Toàn bộ camera chỉ còn chiếu cảnh một phòng học trống rỗng.' },
  { id: 'l7', title: 'Phiếu Điểm Bị Xé Rách', text: 'Môn học: Anh Hùng Đạo. Xếp loại: CHƯA HOÀN THÀNH. Nhận xét của giáo viên: "Có lòng dũng cảm. Cần quay lại Hầm Ngục để hoàn thành bài thi."' },
  { id: 'l8', title: 'Bản Ghi Nhớ Của Hiệu Trưởng', text: 'Nếu em đang đọc những dòng này, nghĩa là phong ấn đã vỡ và một học viên của chúng ta đã lao xuống cứu các bạn. Tốt lắm. Đó vốn luôn là bài thi cuối cùng.' },
  { id: 'l9', title: 'Thẻ Thư Viện #0001', text: 'Người mượn: Nhóm Sáng Lập. Tài liệu: "Mọi Thứ Chúng Ta Từng Sợ Hãi." Hạn trả: 1952. Trạng thái: CHƯA BAO GIỜ TRẢ. Thủ Thư vẫn luôn chờ đợi.' },
  { id: 'l10', title: 'Thông Báo Quá Hạn (Lần Cuối)', text: 'Tầng Thư Khố Sâu Thẳm lưu giữ mọi nỗi hoài nghi mà ngôi trường này từng cất lên kệ. Giám Thị chỉ khảo nghiệm bạn. Còn Thủ Thư giữ lại những bài học bạn chưa từng thuộc.' },
  { id: 'l11', title: 'Lời Ghi Chú Thì Thầm Bên Lề', text: 'Chiếc thẻ từ nơi phong ấn thuộc về một học viên khao khát biết được sự thật. Hầm ngầm không tự vỡ. Nó đã được mở ra. Phải có ai đó bước xuống và đọc hết sự thật.' },
]

// ─── Meta progression (Hero Development Board in the hub) ────────────────

export type DevId = 'vitality' | 'training' | 'focus' | 'insight'
export type DevDef = { id: DevId; name: string; desc: (level: number) => string; max: number; cost: (level: number) => number }
export const DEV_BOARD: DevDef[] = [
  { id: 'vitality', name: 'Rèn Luyện Thể Lực', desc: l => `Máu tối đa +${l * 10}`, max: 5, cost: l => 12 + l * 10 },
  { id: 'training', name: 'Huấn Luyện Chiến Đấu', desc: l => `Mọi sát thương +${l * 6}%`, max: 5, cost: l => 15 + l * 12 },
  { id: 'focus', name: 'Tập Trung Năng Lượng', desc: l => `Bắt đầu mỗi trận đấu với ít nhất ${20 + l * 15} Năng Lượng`, max: 3, cost: l => 14 + l * 12 },
  { id: 'insight', name: 'Giờ Tự Học', desc: l => `${l} lượt đổi lựa chọn nâng cấp mỗi lượt chơi`, max: 3, cost: l => 20 + l * 15 },
]
