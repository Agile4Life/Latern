# Aegis Academy: After Hours — build notes (working file)

Project: /home/ubuntu/aegisrun (Three.js + Vite + TS, managed Game Dev project wdp_9a460e3bb74a9a602cf7a919).
Blueprint approved (rev 2), no online features. Dev server: `PORT=3000 HOST=0.0.0.0 pnpm dev` (resident service).
Before checkpoint read: runtime/skill/references/game-sharing.md (OG cover + favicon required for first complete Three.js game),
git-checkpoints.md, deployment/SKILL.md (under /home/ubuntu/.manus-addons/manus-webdev-sha-3f88fe5e452695c2/runtime/skill/).
Fonts: Bangers (downloaded from Google Fonts gstatic, OFL at public/fonts/Bangers-OFL.txt), Sora, Figtree. Noto SC + i18n removed (English only).
Sora lacks ★♥→←↑↓ glyphs; Figtree lacks ★♥ — avoid in UI or use SVG.

## Done
- src/game/rng.ts (mulberry32, hashSeed, parseSeed, randomSeed)
- src/game/content.ts (wings, TEMPLATES, ENEMIES, BOSS, UPGRADES, RELICS, CLASSMATES, LORE, DEV_BOARD)
- src/game/dungeon.ts (generateDungeon, validateDungeon, T tiles, TILE=2m, CELL=15, GRID=6, MAP=90, roomAt, walkable)
- src/game/rules.ts (deriveStats, rollUpgradeChoices, addUpgrade, rollDamage, takeDamage, computeMerits, heroRank, formatClock)
- src/engine/save.ts v2 (meta progression), input.ts (actions attack/bolt/dash/nova/interact/map/pause/confirm/back; input.gameplay flag), audio.ts (synth SFX + setIntensity combat music)
- src/game/toon.ts (toon(), glow(), outline(), mesh(), canvas textures)
- tests: dungeon/rules/save pass (23 tests)
- Deleted starter: world/collectibles/drones/config/game/player/camera/fx/ui/touch/main/css/i18n/smoke. physics.ts (Rapier) still present -> delete + remove dep.

## Remaining plan
DONE since: models.ts, level.ts (Level, WALL_H, tileCenter, worldToTile), camera.ts (ShoulderCamera), hero.ts (Hero, HERO_RADIUS, NOVA_COST),
fx.ts (Fx, Shot, Telegraph), enemies.ts (Enemy, CombatCtx), boss.ts (Boss, BossCtx), hazards.ts (Hazard), hub.ts (buildHubSource, dressHub, HUB_PALETTE),
pickups.ts, game.ts (Game: start(), play(), pause(), resume(), step(dt), render(alpha, frame); ?debug=1 exposes window.__aegis). physics.ts + rapier removed.

NEXT: src/game/minimap.ts `drawMap(canvas, plan, {discovered, visited, cleared, current, bossDefeated}, heroPos, facing, full)`;
src/ui/ui.ts exporting class UI + types HudData, ShopItem {id,name,desc,price,sold,rarity?}. UI methods used by game.ts:
showTitle(bool), setMode('hub'|'run'|'none'), banner(title, sub, tone gold|purple|red|blue|green), toast(text), bossBar(show, name?, ratio?, phaseLabel?),
openIntro(onDone), modalOpen (getter), closeModal(), openPause(info{inRun,seed,wing,report[],fallback,rooms,build[],relics[]}, {resume,abandon,quit,settings}),
openSettings(saveData, onChange(patch), back), openResults({won,rank,summary,merits,newBest,wing,rescued[],build[]}, {hub,retry,fresh}),
showMap(bool), mapCanvas, minimapCanvas, flashPower(), hurt(intensity), popAt(x,y,text,cls: dmg|crit|ko|hurt|heal|nova|block),
openDialogue(title, subtitle, text, color, onClose), openDescent(lastSeed, onStart(seed), onClose), openCodex(saveData, onClose), openHowTo(onClose, saveData),
openUpgrades([{def, stacks}], rerolls, onPick(i), onReroll()), openShop(items, credits, onBuy(i), onClose), openBoard(dev, merits, onBuy(id), onClose), hud(HudData).
HudData fields: hp,maxHp,power,maxPower,boltCost,novaCost,dash(0..1),shield(-1 none|0..1),credits,merits,prompt,method,inRun,wing,roomLabel,progress{at,total,boss}|null,enemiesLeft,wave,time,build[{icon,name,n,rarity}],relics[],rerolls.
Then: main.ts (boot, Renderer, Input, Audio, SaveStore, UI, Game, GameLoop; touch), styles/main.css, index.html font preload Bangers.

- models.ts: hero (faces -Z), shade, swarm (paper), monitor (drone), bruiser (mascot), Proctor boss, classmate NPC, statue
- level.ts: build instanced floor/walls/wall tops/neon trim/cover props/wall decor/door barriers/lamps; collision (circle vs tiles, doors locked), LOS, camera ray, flow field BFS
- hub.ts: Hall of Origins tile map + interactables (vault portal -> descent modal w/ seed, dev board, codex, rescued NPCs, notice)
- camera.ts OTS (shoulder offset, pitch clamp, pull-in on walls)
- player.ts hero combat: 3-hit melee combo (LMB/J), bolt (RMB/K, power), dash (Space/Shift, iframes), nova (Q, 60 power), interact E, map Tab
- enemies.ts (+projectiles, telegraphs), hazards.ts (pulse chalk/spark/tomes/vent, acid puddle, laser beam), boss.ts (phases 66/33%, volley, pen slam, summons, grading beam)
- game.ts orchestrator: modes title/hub/run/paused/modal/ended; room state machine (lock doors, waves, clear -> reward), rewards, shop, rescue, lore, relic, exit; hitstop; results + merits
- ui.ts + main.css: comic HUD (HP/power bars, credits, minimap canvas, room progress/objective, boss bar, ability cooldowns, prompts, popups POW!), modals (upgrade cards, shop, dev board, codex, lore, descent/seed, intro, how-to), pause (seed + generation report + build), settings, results
- touch controls; smoke test script (playwright) + screenshots; OG cover + favicon; README; checkpoint.

## v1 shipped (commit 2cec6cb). v2 request: second floor + Librarian boss + Lyria music + ElevenLabs SFX
Tools: manus-tools/generate_music {brief,path(.mp3/.wav),prompt} (Lyria; read skills/music-prompter first; <=184s/call),
manus-tools/generate_sound_effect {brief,path(.mp3),prompt<=1000,duration_seconds 0.5-30,loop,prompt_influence} (ElevenLabs).
Plan:
- Floor 1: wing from 4 (no library) + Proctor. Exit portal -> descend() to Floor 2 "The Stacks Below": wing library, seed hashSeed(seed,202),
  generateDungeon(seed,{wing,floor:2}) with +2 wave budget; boss The Librarian (librarian.ts, makeLibrarian in models.ts). Build/HP/credits carry.
- Librarian attacks: storm (spiral page stream), shelves (parallel line telegraphs + falling shelf slabs), shush (expanding ring, dash through),
  summon, blink (teleport, phase 2+). Phases OVERDUE / SILENCE / CLOSING TIME. HP ~1500.
- BossActor interface in boss.ts; replace `instanceof Boss` with `instanceof Enemy` checks; BOSSES record in content.ts.
- RunSummary + floorsCleared/bosses; rank; results show floor. HUD floor label. Descent modal shows both floors.
- Audio: public/audio/music/{hub,floor1,floor2,boss1,boss2,victory}.mp3 streamed via HTMLAudio+MediaElementSource, crossfade,
  explore=lowpass/quiet, combat=open. public/audio/sfx/*.mp3 decoded buffers, synth fallback. ffmpeg normalize/trim.
- check-size: exclude audio/ + share/ from initial transfer; separate audio budget.
Progress (v2): DONE audio gen (raw /home/ubuntu/audio-src, processed by scripts/process-audio.sh -> public/audio; victory cut to 31s;
floor2/boss2 verified no lyrics), audio.ts rewrite (music(track), preload, setHidden, loadedClips, synth fallback),
content (stacks wing, BOSSES, FLOOR_BOSS, FLOOR_COUNT, FLOOR1_WINGS, lore l9-l11), dungeon floor opt + floorSeed + DEEP_LORE,
models makeLibrarian, librarian.ts, boss.ts BossActor + ctx.say, rules bosses/floor, game.ts startRun/loadFloor/descend partially.
v2 COMPLETE: two floors + Librarian + Lyria/ElevenLabs audio integrated; smoke covers descent, all Librarian attacks, phase 3, win; check-size has a separate audio budget; camera wall-top clearance raised to WALL_H+1.4.

## v3 task (2026-09-28): staged loading
User: initial load very slow. Load only title + first-wave assets, jump to title; stagger loading by
stage/wave/scene; after current+next stage loaded, continue background loading of later assets,
but PAUSE background loading when gameplay heats up (VFX / on-screen counts high).
Plan: measure boot (dev + prod) -> AssetStreamer (priority stages, heat-gated, idle budget) ->
audio per-stage, shader warmup per stage, defer non-title work -> verify with timing script.
Baseline (before, scripts/profile-boot.mjs): DEV 70 req / 7.2 MB before title (three dev prebundle 5.8 MB raw,
no compression on dev server or proxy); PROD 6 req / 0.85 MB. Both: title DOM at ~0.42 s then first-render shader
compile long task ~1.4 s; ~0.5 s long tasks at run start + first combat; all 29 SFX + hub fetched at first click.
Done so far: src/engine/streamer.ts (+tests/streamer.test.ts, 8 pass), audio.loadClips/prefetch (preload none),
Renderer.warm (compileAsync vs composer RT), Librarian.warmSet, Fx.load, UI curtain, Game LOAD_STAGES/registerAssets/
heat/boot/showTitle/transition (startRun->beginRun, descend), boss wake gate, main.ts staged boot, vite dev gzip
(compression) + optimizeDeps minify. NEXT: typecheck, profile again, smoke (update: startRun is async/curtained).
v3 RESULT: streamer + stages wired; smoke 0 errors (stream asserts added); dev wire three 5.97MB->184KB (gzip/br +
minified deps + external dep maps via lightDeps middleware); favicon 241KB->18KB (quantized); curtain resolves on
transitionend. TODO after: commit/push checkpoint.

## v4 task (2026-09-28): realistic visual overhaul (all models, env, VFX)
User: "3D models look ugly; make players, environment, enemies, dust, projectiles, vfx, particles much more
hyper-realistic and nicer". Deliver: detailed concept proposal (md) + concept design image (GPT Image 2) +
implementation plan, then execute fully.

### Sourcing facts (external)
- Catalog snapshot: catalog-20260924-japan-characters-scene-removal-v1 (webdev.search_game_assets / access_game_assets)
- Universal Base Characters (Quaternius, CC0-1.0, no attribution req.) id itch-io:3822259
  archive: 3d-models/cross-category/itch-io-3822259/assets.zip (129 MB, sha fdbf1804c90d...)
  members (prefix "Universal Base Characters[Standard]/"):
    Base Characters/Godot - UE/Superhero_Male_FullBody.gltf/.bin, Superhero_Female_FullBody.gltf/.bin
    Base Characters/Godot - UE/T_Superhero_Male_Dark.png, T_Superhero_Male_Normal.png, T_Superhero_Male_Roughness.png,
      T_Superhero_Female_Dark_BaseColor.png, T_Superhero_Female_Normal.png, T_Superhero_Female_Roughness.png,
      T_Eye_Brown.png, T_Eye_Normal.png, T_Hair_1/2_BaseColor.png, T_Hair_1/2_Normal.png
    Base Characters/Textures/T_Superhero_Male_Ligh.png, T_Superhero_Female_Light_BaseColor.png (light skin variants)
    Hairstyles/Rigged to Head Bone/glTF (Godot -Unreal)/{Hair_SimpleParted,Hair_Buns,Hair_Long,Hair_Buzzed,
      Hair_BuzzedFemale,Hair_Beard,Eyebrows_Regular,Eyebrows_Female}.gltf/.bin (+ T_Hair_* textures same dir)
  Bodies are base (underwear) meshes -> paint suits into baseColor by bone region (offline script).
- Universal Animation Library (Quaternius, CC0-1.0) id itch-io:3408034
  archive: 3d-models/props/itch-io-3408034/assets.zip (15.9 MB)
  member: "Universal Animation Library[Standard]/Unreal-Godot/UAL1_Standard.glb" (7.6 MB; same rig as UBC)
- Other catalog hits: kenney-animated-characters-*, quaternius:ultimatedanimatedcharacter (low poly, not used)
- Tripo3D via data-api (manus-node /home/ubuntu/skills/data-api/scripts/call.mjs): apis Tripo3D/text_to_model
  (body: type=text_to_model, prompt<=1024, negative_prompt<=255, face_limit, texture, pbr, model_version
  default v2.5-20250123), Tripo3D/image_to_model (file.url or file.file_token via Tripo3D/upload_image),
  Tripo3D/get_task (path_params task_id; status queued/running/success/failed; outputs.model.url / result.pbr_model.url).
  Static meshes only (no rig) -> use for props, drones, bosses parts.
- Catalog retrieval: SKILL_DIR=/home/ubuntu/skills/game-asset-catalog; python3 $SKILL_DIR/scripts/retrieve.py
  retrieve --grant-file ACCESS --archive-path P --members-file SEL --cache-dir ~/.cache/game-assets --destination assets/...
### v4 progress
- Proposal: docs/visual-overhaul/PROPOSAL.md; concept images docs/visual-overhaul/concept-keyframe.png, concept-cast-sheet.png (GPT Image 2.5)
- Blender 4.2.3 at /home/ubuntu/tools/blender-4.2.3-linux-x64/blender (headless conversion)
- Retrieved to assets/source/ (gitignore raw): quaternius-ubc (Unity FBX bodies — the glTF bodies reference missing
  T_Eye_Normal_png.png so helper refuses; hair glTF rigged-to-head OK; textures), quaternius-ual (UAL1_Standard.glb),
  polyhaven/<id>/{id}_diff_1k.jpg,_nor_gl_1k.jpg,_arm_1k.jpg for: marble_tiles checkered_pavement_tiles floor_tiles_06
  floor_tiles_02 rectangular_parquet old_wood_floor wood_floor_worn laminate_floor painted_plaster_wall beige_wall_001
  red_plaster_weathered plaster_stone_wall_01 blue_plaster_weathered grey_plaster dark_wooden_planks (brick_wall_001 failed: names differ)
  polyhaven/schooldesk_01 (SchoolDesk_01_1k.blend + maps)
- Kenney particle-pack archive cached sha b631d4b0...; smoke-particles sha 97a1d09c... (CC0) — members to select
- Access grant file (expires): /tmp/manus-game-assets-HfNObL/game-assets-access-b60ce575-c73e-4cd7-8ae2-7b4a21b63971.json
- Wing material plan: hub marble_tiles/painted_plaster_wall/dark_wooden_planks; classrooms checkered_pavement_tiles/beige_wall_001;
  labs floor_tiles_06 / floor_tiles_02 walls; trophy rectangular_parquet/red_plaster_weathered; library old_wood_floor/plaster_stone_wall_01;
  stacks wood_floor_worn/grey_plaster; gym laminate_floor/blue_plaster_weathered
- Tripo3D UNAVAILABLE (provider 403 "not enough credit" on first submit, nothing charged). Fallback: Poly Haven models via
  Blender for props; Blender-scripted procedural hard-surface drone + origami bat; bosses = UBC body scaled with procedural
  gown/mask/mortarboard + giant hands extracted from UBC hand vertex groups; Bruiser = UBC male scaled + painted jersey + procedural mascot helmet.
- UBC FBX: Armature 65 bones (UE mannequin names: root pelvis spine_01..03 neck_01 Head clavicle/upperarm/lowerarm/hand_l/r fingers thigh calf foot ball);
  meshes SuperHero_Male (6287 v, MI_Superhero_Male: T_Superhero_Male_Dark/Normal/Roughness), Eyes, Eyebrows. Dims ~1.82 m tall.
- UAL GLB: same skeleton; 43 actions: Idle_Loop Jog_Fwd_Loop Sprint_Loop Walk_Loop Punch_Jab Punch_Cross Roll Spell_Simple_Shoot
  Spell_Simple_Enter/Idle/Exit Sword_Attack Hit_Chest Hit_Head Death01 Jump_Start/Loop/Land Dance_Loop Crouch_* Interact Idle_Talking_Loop ... (suffix _Armature)
- Poly Haven props retrieved to assets/source/polyhaven/<id>/ (1k .blend + maps): schoolchair_01 chemistry_set book_encyclopedia_set_01
  metal_stool_01 steel_frame_shelves_01 wooden_display_shelves_01 shelf_01 drawer_cabinet painted_wooden_bench metal_trash_can dirty_football
  vintage_cabinet_01 industrial_wall_lamp fancy_picture_frame_01 marble_bust_01 schooldesk_01; fabrics crepe_satin cotton_jersey caban (maps diff/nor_gl/arm/rough/metal)
- Kenney sprites: assets/source/kenney-particles/PNG (Transparent)/*.png (white+alpha 512px), assets/source/kenney-smoke/PNG/White puff|Black smoke
### v4 architecture plan
- Blender scripts in scripts/assets/: build-characters.py (UBC FBX -> skinned GLB, per-texel 3D position rasterized in UV space ->
  procedural suit painter in numpy: hero/classmates/bruiser/proctor/librarian/shade), build-anims.py (UAL armature-only anims.glb, chosen clips),
  build-props.py (.blend -> glb normalized: feet at y0, centered, facing -Z), build-procedural.py (drone, origami bat, mascot head, mortarboard, pen, tome).
- Post: gltf-transform (meshopt + webp resize) -> public/models/*.glb ; textures public/tex/<id>/{albedo,normal,orm}.webp ; particles public/fx/atlas.webp
- Runtime: src/game/assets3d.ts (GLTFLoader+MeshoptDecoder cache, SkeletonUtils.clone), src/game/character.ts (mixer, crossfade clip map, bones),
  src/game/materials.ts (PBR sets); keep old procedural rigs as load-failure fallback; streamer essential tasks load models per stage.
- HeroRig contract used by hero.ts: root, body (rotation.y=facing), head, armL/armR, fistL/fistR (emissive glow), legs, cape, aura, barrier.
- hero.ts render(): procedural anim — replace with Character.play(idle/jog/sprint/punch jab/cross/(combo3 = Sword_Attack or Punch_Cross fast), Roll for dash, Spell_Simple_Shoot bolt, nova = Spell_Simple_Enter?)
### v4 progress (chars)
- DONE scripts/assets/build-characters.py (male/female -> assets/build/chars/<g>-bake.npz + char_<g>.glb; placeholder 4x4 image keeps UVs),
  build-anims.py (25 clips, anims.glb), paint-characters.py (variants: hero pixel rocky zephyr mira tock blaze shade bruiser proctor librarian
  -> public/models/chars/<v>_{albedo,orm,emit}.webp + variants.json; <g>_normal.webp; hair{1,2}_albedo/normal, eye_albedo)
- Compress: gltf-transform prune + meshopt --level medium -> public/models/char_{male,female}.glb (~340KB), anims.glb 1.1MB (resample + meshopt high; 124KB gzipped)
- GLB node names: Body, Eyes, Brows, Hair_<Style>[001]; hair material MI_Hair_1/2; model faces +Z (rotate PI)
- Runtime: src/game/assets3d.ts (loadGLTF/gltf/texture/preloadTexture/loadJSON/json), materials.ts (withFx: flash/rim/dissolve uniforms),
  character.ts (preloadCharacters, createCharacter, Character.play(name,{fade,loop,speed,force,duration}), bone(), flash, dissolve, rim)
- normalScale(1,-1) assumed (UE DX normal) — VERIFY in viewer. Next: viewer.html + src/viewer.ts dev page, render check.
- DONE toe smoothing (boots), all 11 variants painted, viewer.html + src/viewer.ts + scripts/assets/shot.mjs (node shot.mjs out.png "v=hero&cam=front|back|side|close&clip=X&t=0.3")
- DONE props: scripts/assets/build-props.py -> public/models/props/<id>.glb (512 webp, meshopt): schooldesk_01 schoolchair_01 shelf_01
  wooden_display_shelves_01 steel_frame_shelves_01 book_encyclopedia_set_01 marble_bust_01 vintage_cabinet_01 drawer_cabinet
  painted_wooden_bench fancy_picture_frame_01 industrial_wall_lamp (dims printed by script; pivot floor centre, glTF +Z = Blender -Y)
- DONE surfaces public/tex/<id>_{diff,nor,arm}.webp (diff/nor 1024, arm 512): beige_wall_001 blue_plaster_weathered checkered_pavement_tiles
  dark_wooden_planks floor_tiles_02 floor_tiles_06 grey_plaster laminate_floor marble_tiles old_wood_floor painted_plaster_wall
  plaster_stone_wall_01 rectangular_parquet red_plaster_weathered wood_floor_worn crepe_satin(cape) caban
- DONE public/fx/particles.webp 4x4 atlas (256 cells): 0 smoke 1 puff 2 ring-glow 3 flare 4 soft-light 5 lightning 6 star 7 magic-cross
  8 twirl 9 burst 10 dirt 11 slash-arc 12 streak 13 fire-scatter 14 muzzle 15 black-smoke
- NEXT: integrate hero (Character in rig.body, clip state machine, verlet cape, hand glows), enemies (shade/bruiser humanoid; swarm/monitor PBR procedural),
  bosses on bodies, classmates/statues, level PBR materials + props, renderer env/fog/grade, particle system, streaming stages.
### v4 integration (in progress)
- DONE src/game/fx.ts rewritten (soft sprites atlas, 2 pools add/alpha, shader ring/slash/telegraph, shot core+halo+trail+2 pooled PointLights).
  New API: emit(pool,pos,opts) impact(pos,dir,color,str) flash dust(pos,n,size,spread) smoke(pos,color,n,size,life) embers. Shot has .color.
- DONE src/game/actors.ts: makeHeroView (Character 'hero' + verlet Cape on clavicles + hand glow sprites + fresnel barrier + aura + contactShadow, legacy fallback),
  makeClassmate(id,color,'idle'|'trapped'), makeBronzeHero(pose), animateAmbient/updateAmbient(dt) (game.render calls), glowSprite, fresnelMaterial.
- DONE hero.ts: rig is HeroView; render() -> animate() clip state machine (Roll/Jump_Land nova/Punch_Jab/Punch_Cross/Sword_Attack/Spell_Simple_Shoot/Jog/Sprint/Idle/Death01), footstep flag -> dust.
- DONE game.ts: classmates via makeClassmate, rescue plays Dance_Loop (it.obj.userData.char), footstep dust, updateAmbient.
- PLAN loading: add 'core' stage first in LOAD_STAGES (hero+rescued classmates chars, hub props/surfaces, fx atlas, cape tex); boot awaits require('core')
  then hero.rig upgrade (makeHeroView falls back to legacy if not ready -> need upgrade path or construct Hero after core) then enterHub; campus warm awaits core.
  wave1: preloadCharacters(['shade','bruiser']) before warm. floor1/floor2: female body + classmates + wing props/surfaces essential. boss1 proctor, boss2 librarian.
- PLAN level.ts: toon vertex-colour boxes -> PBR surfaces per wing (surfaces.ts WING_SURFACES), GLB props via gltf() with procedural fallback; hub statues makeBronzeHero.
- Tripo3D unavailable -> swarm/monitor procedural PBR; Proctor/Librarian bodies = painted humanoids (variants proctor/librarian) + procedural gown/extras.
- DONE toon() -> MeshStandardMaterial (all procedural parts PBR); outline() no-op except elite gold shell; MeshToonMaterial removed everywhere.
- DONE renderer: PMREM RoomEnvironment (renderer.environment), bloom on medium (half-res) + high, GradeShader pass (split tone, vignette, grain), anisotropy.
- DONE src/game/surfaces.ts: WING_LOOKS (floor/wall surfaces, tint, env, gloss, wallProps, mounted), COVER_PROPS, surface(), propModel/fitScale/instanceProp, wingAssets(wing).
- DONE level.ts: merged world-UV floor (vertex tints), face-only walls (plaster upper + wood wainscot) + AO floor strips + caps + rails + neon baseboard,
  GLB cover props (desk+chair, shelf+books, display shelves+gold trophies, steel shelves+beakers, PBR gym mats), wall props + mounted lamps/frames
  (glow sprite flicker), iron lamp posts, dust motes (Points shader), lights retuned (hemi .7, no ambient, moon 2.1).
- DONE game.ts: loadCore() memo (hero+rescued chars, hub assets, fx atlas, cape tex) awaited in boot before enterHub; hubReady gate for campus warm;
  wave1 preloads shade/bruiser chars; floor1 = classmates + all non-stacks wing assets; floor2 = stacks; boss1/2 preload proctor/librarian chars;
  setLevel sets scene.environment + environmentIntensity = level.look.env; upgradeHeroView(rig) in actors.ts.
- NEXT: screenshot check hub/dungeon; enemies.ts (shade/bruiser on Character; swarm/monitor PBR), bosses on bodies, hub statues bronze, pickups; smoke; build; checkpoint.
- DONE level visuals verified via scripts/look.mjs (/tmp/look: title, hub, <seed>-<wing>-start/combat). Wall UV fixed (along = a.x*|tx|+a.z*|tz|). 404 in look = dev favicon only.
- DONE enemies: makeSwarm (origami exam-sheet bat, PBR paper) + makeMonitor (clearcoat drone, lens, rotors, cap) in models.ts; EnemyRig.char optional;
  actors.makeHumanoidEnemy('shade'|'bruiser') (Character, dissolve, wisp, jersey number, contact shadow, elite halo); enemies.ts renderChar() clip map
  (spawn dissolve-in, chase Jog, windup Spell_Simple_Enter, act Punch_Cross/Jump_Land, stun Hit_Chest, dying Death01 + dissolve, t=1.1), shade smoke wisps.
- DONE models.ts: makeProctorChar (S=2.6, mortarboard+eye followers on Head, pen on hand_r bone, pageRing) / makeLibrarianChar (S=3.0, spectacles follower,
  tome, PBR books); Follower type + updateFollowers(rig); fallbacks keep old procedural rigs. flash: [] -> must drive char.flash.
- NEXT: boss.ts/librarian.ts render: char.update(dt) + clip per state + updateFollowers + char.flash + fade char.materials + dissolve on dying.
- DONE bosses: bossAnim.ts BossAnimator (clip per state, followers, flash, dissolve, fade incl. char materials) wired in boss.ts + librarian.ts.
- DONE anti-glare (user request 19:32, screenshot: huge white floor hotspot in gym): surface() minRough shader clamp (floor .6, wall .75, wain .7),
  floor env .5 / wall .3 / wain .35 / props .45; wing env x0.85; gloss>=0.9; room point lights 40/20 @7.5m (was 55/30 @6m); neon x0.9 (was 1.8);
  glow sprites/halos smaller+dimmer; bloom 0.4/0.4/1.25 (was 0.6/0.45/1.05); Poly Haven lamp emissiveStrength 100 -> clamp 1.2 warm;
  prop transmission disabled (extra render pass!) -> fake glass; cabinet specular 2 -> 1.
- Perf (swiftshader headless): baseline HEAD 5.5 fps / 57k tris per frame; overhaul 2-2.5 fps / ~390k. Body = 12.5k tris (fine; x4 chars).
  Wall lamp simplified 4.4k -> 2k tris; mounted props + hair/brows/eyes no shadow. Smoke: boss kill waits for targetable (slow fps delayed intro).
- Baseline worktree: /tmp/base on :3100 (vite service job_ShZ12FiN) — kill + `git worktree remove --force /tmp/base` when done.
- Smoke 19:47 PASS (0 errors) after anti-glare + boss wait fixes. Labs wing heavy (~690k tris/frame) -> investigate (steel shelves?).
## v4.1 user requests (19:55)
- Cape clips through glutes/back (screenshot: narrow straight strip down spine). Make it wider, drape OVER body; collide verlet vs body capsules (spine/hips/thighs).
- Shift = sprint, Space = jump. Plan: Shift tap(<0.18s)=dash (i-frames kept), Shift hold=sprint; Space=jump (clears ground hazards/slam rings). Update HUD labels, help text, touch.
- DONE cape v2 (actors.ts Cape): 9x10 trapezoid (0.5 top -> 0.74 hem, 1.1 long), bend (skip-one) constraints, skeleton capsules
  (spine/neck, clavicle-upperarm, pelvis-spine01, thighs ra.13, calves) + pelvis spine-plane, collar pinned just outside upper-back capsule,
  cap: no particle above collar line, hitch carry (translate cloth by root delta for unsimulated time). Verified scripts/cape-shots.mjs -> /tmp/cape.
- DECISION controls v4.1: Shift(hold)=sprint, Space=jump (airborne dodges ground attacks), C=dash (instant, i-frames). Pad: A jump, B dash, L3 sprint.
  (Shift-tap dash rejected: release-trigger adds ~0.2s latency to the dodge.)

### v4.1 (2026-09-28 evening): cape, sprint/jump, wall trim
- Cape v2 (actors.ts): skeleton-capsule collision + bend constraints, collar pinned outside the upper-back collider; verified with scripts/cape-shots.mjs.
- Controls: Space = jump (JUMP_V 9.5, apex ~1.4 m, 0.14 s buffer + 0.1 s coyote; Jump_Start/Loop/Land clips; land dust + trauma),
  Shift = sprint (x1.5 speed -> 11.1 m/s, Sprint_Loop, FOV 62 -> 69, off with reduced motion), C = dash. Pad: A jump, B dash, L3 sprint.
  Touch: jump button (.t-jump), stick at rim = sprint. Ground attacks already check hero.y, so jumping over slams/waves/acid is a real dodge.
  Verified with scripts/move-check.mjs (all PASS).
- Wall trim (level.ts buildTrim, runs after buildDecor): rail/crown/neon baseboard are split around trimCuts registered by decal panels,
  standing furniture (offset by the model's real back depth, >= rail) and mounted props. Verified with scripts/wall-shots.mjs.
- Size check: models/ tex/ fx/ are streamed per stage -> own "streamed 3D" budget (10 MB). anims.glb recompressed (resample + meshopt high):
  1.10 MB raw / 124 KB gzipped. Pre-title payload (prod preview, profile-boot): 6.3 MB / 78 requests / ~5.1 s headless -> follow-up.
- There is NO linter in this project (no eslint dep/config; `npx eslint` just prompts to install). Gates: tsc, vitest, build+size, smoke.
- Rescue sequence (actors.ts RescueSequence, game.ts rescueSeqs): root cause of floating classmates = addItem() treats obj.children[0]
  (the classmate body) as the bob part -> held ~1 m up and spinning. On free: gravity drop (Jump_Loop) -> land (dust) -> Death01 tail x1.6
  topple -> 0.45 s down (thud dust + trauma) -> Death01 reversed 1.5 s -> 0.62 s (get up) -> Idle 0.55 s -> Dance_Loop facing the hero
  (burst + ring + reward sfx); dialogue opens 0.7 s into the dance. Verified with scripts/rescue-shots.mjs (clears waves for real first).

## v5 (2026-09-28 21:25): instant title + per-classmate victory dances
- BASELINE prod preview (profile-boot): title 5.06 s, 79 req, 6.15 MB (anims.glb 1.08 MB, char_male, hub props/tex, shade/bruiser tex,
  fx atlas); loadCore ~3 s then hub build+warm long task 1108 ms. Cause: boot awaited title(loadCore+campus shaders)+wave1.
- FIX: LOAD_STAGES title,hub,wave1,... ; BOOT_STAGES=['title'] = only public/title/campus.webp (poster rendered by
  scripts/assets/title-poster.mjs from the title camera, UI hidden, ?noposter=1). #boot + .title-poster paint the poster;
  Game.prepareCampus() (after boot) loads core, builds hub, require('hub') -> campusLive + ui.titleLive() (poster fades 1.4 s)
  -> require('wave1'). play() before campusLive = curtain until ready. startRun transition requires ['wave1','floor1'].
- TODO dances: unique victory dance per classmate (pixel rocky zephyr mira tock blaze) from UAL (check unexported dance clips).
- RESULT: time to title 5.06 s -> ~0.55 s (title-ready 29 ms after game ctor); pre-title = JS+CSS+fonts+97 KB poster (0.43 MB).
- Headless findings (swiftshader, no KHR_parallel_shader_compile): compileAsync resolves early -> first use blocks in
  getShaderInfoLog. Renderer.warm now: parallel ext -> compileAsync + settlePrograms; else warmIncremental (compile per
  unique mesh/material, settle, yield on 12 ms budget). warmProxies adds shadow-depth (mesh/inst/skin, alpha) + post-pass
  materials. Renderer.prime uploads textures on 8 ms budget. Campus not rendered in title until primed. PMREM env
  (renderer.environment) = ~0.9 s sync in headless -> own frame in prepareCampus. Remaining ~2.3 s headless first frame
  = buffer uploads/shadow render on CPU GPU (not shaders: 0 new programs after prime). Probe: scripts/.probe.tmp.mjs.
- Dances: src/game/dances.ts builds 6 procedural clips (Dance_Robot/Flex/Tornado/Cheer/TickTock/Stomp) in
  character.ts clipsFor() against idle t=0; poses = model-space Euler deg offsets (facing +Z, left=+X; arm fwd -X,
  side +Z; knee +X; spine fwd +X), local' = P0^-1 D P0 L0; mirror() for right side; squat() plants feet.
  DANCE_FOR[classmate id] -> RescueSequence(actor, dance). Verify via viewer (v=<id>&clip=Dance_X&t=).
- 22:04 smoke PASS except outdated "boot stages not ready at title" assert (title now shows before stages) -> fix assert.
- Dances verified in viewer (zoom= param added) + in-game rescue (Tock -> Dance_TickTock). README updated (instant title, dances.ts).
- All dev scripts now wait for __aegis.campusLive before clicking Start Patrol.
### v5.1 cape rework (user 22:03: still clips, sits too low, want tight collar at neck not rectangle)
- Plan: pin top row on an arc around neck_01 (tight collar), flare widths toward hem, more particles (11x14),
  capsules fitted from measured body mesh (/tmp/measure.py), shoulder/upper-arm colliders, cap at neck height.
- Cape v3 written (actors.ts): collar U around neck_01 (TOP_W 0.3 -> BOT_W 0.74, 11x14), measured back SHELL table
  (bind depth behind spine curve, rows from 0.87 every 0.05, cols every 0.05; from char_male.glb via /tmp/fit.py),
  limb capsules resolve ONLY along back dir (radial pushes folded the sheet: idle stance has R arm/leg behind torso).
  Idle verified good. Headless run captures fold because low fps => sim carries most motion rigidly; use
  scripts/cape-sim.mjs (freezes rAF, steps game at 1/60) for true-60fps run captures. Backup /tmp/actors.bak.ts (pre-v3).
- TODO: fix smoke assert "boot stages not ready at title"; remove scripts/.capeprobe.tmp.mjs; commit+push.
- 22:50 Cape v3 VERIFIED at true 60 fps via scripts/cape-sim.mjs (rAF frozen; canvas read via toDataURL after
  a.step/a.render; page.screenshot times out while rAF is frozen). Idle drape, run-back billow, run-side trail: no clipping.
- Smoke: replaced outdated "boot stages not ready at title" with a wait for title+wave1 ready after campusLive.
- 22:52 Hero palette changed (user: not Superman colours): navy suit #121a3f/#1d2a63 panels, WHITE piping (piping_metal=0)
  + white collar/cuffs, burnished gold boots/gloves (metal 0.7), gold belt, navy shield w/ gold border + white A, navy mask,
  pale-gold eyes; cape #cfae55 metalness .28 WITHOUT the satin colour map (it's tan: tinted gold -> orange). HERO_LOOK updated.
  paint-characters.py: suit_base(piping_metal), boots/gloves(metal, cuff_metal) params.
- Cape frame now follows clavicle twist (low-pass dt*2.5, clamp 0.7 rad), SKIN 0.03, collar backOff 0.09+0.03c. Fixed notch.

## v5.2 (2026-09-28 23:41) user asks: OG cover+favicon in navy/gold; cape gold hem trim + navy inner lining; NO cape clipping when running
- New probe scripts/cape-clip.mjs: fixed 1/60 steps, renders from directly behind (cape.back frame) cape-only red then cape+body
  green; clip% = body pixels inside cape silhouette. Saves /tmp/capeclip/worst.png (yellow = clip). Phases idle/run/sprint/stop.
- Baseline (commit 98d8f0a): idle 0%, run mean 4.8% max 9.9%, sprint mean 6.9% max 14.5% (upper back band under collar).
- Tried: shell + collar evaluated in live tilted/twisted spine frame (segUp per spine segment, hipAcross thighs, shAcross
  clavicles, collar frame cUp/cBack/cAcross) -> NO improvement (run mean 6.1%). Clip now at hero's LEFT upper back under collar.
  Backup of pre-change actors.ts: /tmp/actors.pre-tilt.ts. Hypotheses next: row spacing too coarse near top (CH=14, 8.3cm rows),
  SKIN too thin, capsule/shoulder. Cape material: MeshPhysical DoubleSide single mesh; plan lining = 2nd mesh BackSide navy +
  canvas texture hem trim (gold band + white pinline) on both.
- Share art: game-sharing.md in /home/ubuntu/.manus-addons/manus-webdev-sha-*/runtime/skill/references/; files assets/share/
  (og-src.png -> og 1200x630, favicon.png palette-quantized); regenerate with GPT Image 2 via manus-tools generate_image.
- 00:12 CLIPPING FIXED (cape-clip.mjs 0.00% all phases; .capediag.tmp.mjs ray-cast from skinned verts = 0 hits). Root causes found
  via per-bone ray diagnostic: (1) collar row never collided -> twisting shoulder blade/deltoid cut the collar strip; (2) static
  bind-pose (T-pose) shell underestimates arms-down trapezius/scapula; (3) world-Y "no billow" cap ran AFTER collision and clamped
  cloth down into the leaning (sprint) upper back. Fixes in actors.ts Cape: CH 16 rows, ROW_S=(y/15)^1.35 (3cm top -> 10cm hem),
  restH[] per gap, UV v=1-ROW_S; row 0 collides; live shell grid (LG_* consts) rebuilt per frame from ~1k CPU-skinned torso verts
  (TORSO_BONES dominant weight, back-half pruned on first frame) binned by (hb along spine, signed side), dilated 1 cell; locate()
  gives live frame (segUp lean, hip->shoulder across twist); cap along cUp, applied before collision.
  Backups: /tmp/actors.pre-tilt.ts, /tmp/actors.rows.ts, /tmp/actors.live.ts, /tmp/actors.noclip.ts (clip fixed, before lining).
- Lining/trim: outer MeshPhysical FrontSide gold (map capeFace canvas: body + polished gold trim TRIM_V 0.055 w/ diamonds + white
  pinline PIN_V0..V1; metalnessMap capeMetal B chan 0.28/0.8/0) ; lining child mesh BackSide navy CAPE_LINING #1c2b5c same trim.

## v5.3 (2026-09-29 13:53) user: same cape collision fixes + red & gold trim on Librarian and Proctor; share description adds floor 2 + Librarian
- Checkpoint before: 716df85 (cape zero-clip, gold hem + navy lining, navy/gold OG+favicon). Art sources in /home/ubuntu/share-src/.
- Bosses: makeProctorChar (variant 'proctor', char.root scale 2.6) / makeLibrarianChar ('librarian', scale 3.0) in models.ts; gowns
  are only PAINTED on body texture + glowing torus hem. Plan: generalise Cape (options: scale, len/width, colours, trim colours) and
  attach a simulated gown-cape to each boss (Proctor: black academic gown cape, red lining, red+gold hem; Librarian: plum mantle,
  red+gold hem). Boss render code in boss.ts / librarian.ts + bossAnim.ts; must call cape.update each render.
- webdev.config schema: {method, path, body?, query?} (don't put action in arguments).

## v5.3 progress (14:47)
- Boss garments: BossAnimator lazily creates a Cape (scaled, redgold trim) for Proctor (#241b4d/#7a1426 lining) and Librarian (#34223f/#1f5c5a). Painter adds crimson+gold sleeve bars / stole stripe (Proctor) and crimson placket/cuffs w/ gold edges (Librarian); repainted.
- scripts/boss-cape.mjs [out] [seed] [floors] (FORCE=slam env): fresh page per floor (freezing rAF kills loop), ray-cast diag + orbit-camera stills (a.renderer.render(a.scene, cam)). DON'T edit index.html/src while it runs (Vite reload).
- Results: natural fight Proctor 2-66/123k verts, Librarian 1/125k. Forced slam: 145 verts, left FINGERS (0.45). Fix: CAPSULES hand_l->middle_03_l / hand_r (r .06/.05); missing bones now park capsule instead of disabling all. Re-check running (/tmp/bslam2.log).
- Share description updated (175 chars) + captions + index.html meta mention floor 2 / Librarian.
## RENAME -> "Super Dungeon" (user 14:43): everywhere + regen OG, favicon, landing/boot, title bg
- Done: game-sharing.json title+captions, README h1, PROPOSAL h1. auto_publish = true (config GET) -> pushing checkpoint publishes.
- Media jobs: OG lettering edit -> /home/ubuntu/share-src/og-src-v3.png (from og-src-v2b.png); favicon "SD in gold arch" -> share-src/favicon-src-v3.png (transparent).
- TODO after bslam2 finishes: index.html <title>, meta, boot card (kicker/title), ui.ts logo (kicker 'AEGIS ACADEMY'/main 'AFTER HOURS' at ~l.160), main.ts WebGL msg, viewer.html title; keep SAVE_KEY + in-world school name "Aegis Academy" (lore). Then POST game/sharing/prepare {} (updates scripts/manus-game-sharing/build.mjs projectTitle), regenerate title poster (scripts/assets/title-poster.mjs), build, verify dist tags, smoke, checkpoint.
- 14:52 RENAME applied: index.html title/meta/boot (SUPER / DUNGEON), ui.ts logo (kicker SUPER, main DUNGEON, sub "After curfew at Aegis Academy, the superhero high school"), main.ts WebGL msg, viewer title. Kept: SAVE_KEY 'aegis-after-hours.save' (progress), in-world school "Aegis Academy", "Aegis Nova/Barrier" ability names.
- OG: og-src-v3 (lettering edit, 1 pass, spelled right) -> 1200x630 crop from top. Favicon: SD in gold archway, 128-colour palette 27 KB. Title poster regenerated (no lettering in it).
- prepare -> origin https://superdungeon.manustest.game; build.mjs projectTitle still old (host display name; fallback only; game-sharing.json title wins). dist verified.
- Slam: finger capsules only 145->136 verts; visual check = arm swept back OVER the gown (diag false-positive for drape-under-arm). Accept.

## v5.4 (2026-09-29 15:48) in-world rename Aegis -> Super
- Case-sensitive sed Aegis->Super, AEGIS->SUPER in src, README, PROPOSAL: Super Academy, Super Nova (Q), Super Barrier,
  Super Core Shard relic, hub banner SUPER, trophy banner GO SUPER, hub tagline "Where every Super hero begins.", lore l1, intro.
- Kept lowercase internals: window.__aegis, 'aegis:' perf marks, save key 'aegis-after-hours.save', vite plugin names, repo dir.
- Title poster regenerated (hub banners visible). dist has 0 "Aegis".

## v5.5 (2026-09-29 16:19) movement tutorial (sprint/jump/dash)
- src/game/tutorial.ts pure state machine (steps sprint 1.2s, jump x2, dash x2; STEP_CELEBRATE 0.9s); tests/tutorial.test.ts (6 pass).
- Plan: save.tutorialDone; auto-start 1.8s after entering hub if not done (restart if player leaves hub mid-way);
  coach card left side (top ~150px); highlight dash slot / touch buttons; pause menu in hub: SKIP TRAINING (active) or
  MOVEMENT TRAINING (replay, manual=true; on finish stay in hub, never auto-start a run). Done -> banner + save.
- DONE: save.tutorialDone (optional v2 field, old saves keep progress); Game.stepTutorial (auto after 1.8s in hub, reset on
  enterHub / leaving hub), startTraining (manual, hub only, resumes in place), skipTraining; UI.coach card + dash/touch pulse;
  pause menu MOVEMENT TRAINING / SKIP TRAINING. Validation: tsc clean, vitest 50/50, tutorial-check 15/15 PASS 0 errors,
  smoke18 EXIT 0 (both bosses, victory audio), build ok (initial transfer unchanged 0.44 MB).
