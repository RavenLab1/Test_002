import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const MODEL_DIR = 'assets/models/';

const CONFIG = {
  brand: {
    name: 'RavenLab',
    accent: '#9cc03d',
  },
  security: {
    // مفتوح للجميع: لا يوجد قفل دومين.
    // أبقينا هذا القسم فقط للعودة إليه مستقبلًا إذا احتجت حماية الدومين.
    enabled: false,
    allowGithubPages: true,
    allowedHostnames: [],
    allowedContains: [],
  },
  basePrice: 5000,
  prices: {
    switchSeat: 2500,
    plainKeycap: 500,
    letterKeycap: 1000,
    special: {
      oreo: 3500,
      strawberry: 3500,
      waffle: 3500,
      chocolate: 3000,
    }
  },
  bases: {
    1: { standard: { label: 'عادي', path: `${MODEL_DIR}base_01.glb` } },
    2: { standard: { label: 'عادي', path: `${MODEL_DIR}base_02.glb` } },
    3: { standard: { label: 'عادي', path: `${MODEL_DIR}base_03.glb` } },
    4: { standard: { label: 'عادي', path: `${MODEL_DIR}base_04.glb` }, square: { label: 'مربع', path: `${MODEL_DIR}base_04_Square.glb` } },
    5: { standard: { label: 'عادي', path: `${MODEL_DIR}base_05.glb` } },
    6: { standard: { label: 'عادي', path: `${MODEL_DIR}base_06.glb` }, square: { label: 'مربع', path: `${MODEL_DIR}base_06_Square.glb` } },
    7: { standard: { label: 'عادي', path: `${MODEL_DIR}base_07.glb` } },
    8: { standard: { label: 'عادي', path: `${MODEL_DIR}base_08.glb` }, square: { label: 'مربع', path: `${MODEL_DIR}base_08_Square.glb` } },
    9: { standard: { label: 'عادي', path: `${MODEL_DIR}base_09.glb` }, square: { label: 'مربع', path: `${MODEL_DIR}base_09_Square.glb` } },
    10: { standard: { label: 'عادي', path: `${MODEL_DIR}base_10.glb`, hidden: true } },
  },
  colors: [
    { id: 'black', name: 'أسود', hex: '#050505' },
    { id: 'white', name: 'أبيض', hex: '#ffffff' },
    { id: 'raven', name: 'Raven Green', hex: '#9cc03d' },
    { id: 'gray', name: 'رمادي', hex: '#8f9488' },
    { id: 'red', name: 'أحمر', hex: '#d83333' },
    { id: 'blue', name: 'أزرق', hex: '#306ee8' },
    { id: 'green', name: 'أخضر', hex: '#37a967' },
    { id: 'yellow', name: 'أصفر', hex: '#f4d13d' },
    { id: 'pink', name: 'وردي', hex: '#ee76b8' },
    { id: 'purple', name: 'بنفسجي', hex: '#8b5cf6' },
    { id: 'orange', name: 'برتقالي', hex: '#f28c28' },
    { id: 'transparent', name: 'شفاف', hex: '#ffffff', transparent: true },
  ],
  keycaps: [
    // يستخدم هذا الملف ككاب سادة / احتياطي.
    { id: 'plain', label: 'سادة', category: 'plain', path: `${MODEL_DIR}keycap_letter.glb`, priceKey: 'plainKeycap', tintable: true },
    // كابات الحروف ليست Sprite أو طباعة برمجية: كل حرف يستخدم ملفه الخاص مثل keycap_a.glb و keycap_g.glb.
    { id: 'letter', label: 'حرف إنجليزي', category: 'letter', pathTemplate: `${MODEL_DIR}keycap_{letter}.glb`, fallbackPath: `${MODEL_DIR}keycap_letter.glb`, priceKey: 'letterKeycap', tintable: true },
    { id: 'oreo', label: 'Oreo', category: 'special', path: `${MODEL_DIR}keycap_oreo.glb`, price: 3500, tintable: false },
    { id: 'strawberry', label: 'Strawberry', category: 'special', path: `${MODEL_DIR}keycap_Strawberry.glb`, price: 3500, tintable: false },
    { id: 'waffle', label: 'Waffle', category: 'special', path: `${MODEL_DIR}keycap_Waffle.glb`, price: 3500, tintable: false },
    { id: 'chocolate', label: 'Chocolate', category: 'special', path: `${MODEL_DIR}keycap_CHOCOLATE.glb`, price: 3000, tintable: false },
  ],
  availableLetterKeycaps: ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'],
};

const $ = (selector) => document.querySelector(selector);
const els = {
  themeToggle: $('#themeToggle'),
  countButtons: $('#countButtons'),
  layoutButtons: $('#layoutButtons'),
  layoutSection: $('#layoutSection'),
  baseColors: $('#baseColors'),
  capColors: $('#capColors'),
  baseColorLabel: $('#baseColorLabel'),
  capColorLabel: $('#capColorLabel'),
  capType: $('#capType'),
  letterBox: $('#letterBox'),
  letterInput: $('#letterInput'),
  letterGrid: $('#letterGrid'),
  countBadge: $('#countBadge'),
  selectedText: $('#selectedText'),
  priceText: $('#priceText'),
  jsonPreview: $('#jsonPreview'),
  completeOrder: $('#completeOrder'),
  completeOrderMobile: $('#completeOrderMobile'),
  mobilePriceText: $('#mobilePriceText'),
  orderModal: $('#orderModal'),
  orderDetails: $('#orderDetails'),
  copyOrder: $('#copyOrder'),
  shareOrder: $('#shareOrder'),
  loader: $('#loader'),
  toast: $('#toast'),
  viewer: $('#viewer'),
  canvasWrap: $('#canvasWrap'),
  resetCamera: $('#resetCamera'),
  clearSelection: $('#clearSelection'),
  selectAllCaps: $('#selectAllCaps'),
  selectNoneCaps: $('#selectNoneCaps'),
  selectAllHero: $('#selectAllHero'),
  securityLock: $('#securityLock'),
};

const state = {
  count: 1,
  layout: 'standard',
  baseColor: CONFIG.colors[0],
  capColor: CONFIG.colors[1],
  selected: new Set([0]),
  caps: [],
  currentToken: 0,
};

let renderer, scene, camera, controls, loader, productGroup, assemblyGroup;
let raycaster, pointer;
let selectableMeshes = [];
let capObjects = [];
let selectionHelpers = [];
let modelCache = new Map();
let lightRig;
let pointerStart = null;

if (initSecurity()) {
  initState();
  initTheme();
  initUI();
  initThree();
  buildProduct();
  updateUI();
}

function initSecurity() {
  const sec = CONFIG.security || {};
  if (!sec.enabled) return true;
  const host = window.location.hostname.toLowerCase();
  const allowedByName = (sec.allowedHostnames || []).map(h => h.toLowerCase()).includes(host);
  const allowedByContains = (sec.allowedContains || []).some(part => part && host.includes(part.toLowerCase()));
  const allowedGithub = !!sec.allowGithubPages && host.endsWith('.github.io');
  const allowedLocal = host === '' || host === 'localhost' || host === '127.0.0.1';
  const allowed = allowedLocal || allowedByName || allowedByContains || allowedGithub;
  if (!allowed) {
    document.body.classList.add('site-blocked');
    els.securityLock?.removeAttribute('hidden');
    return false;
  }
  return true;
}

function initState() {
  state.caps = createDefaultCaps(state.count);
}

function createDefaultCaps(count) {
  return Array.from({ length: count }, () => ({
    type: 'plain',
    color: '#ffffff',
    colorName: 'أبيض',
    letter: 'A',
  }));
}

function initTheme() {
  const saved = localStorage.getItem('ravenlab-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
  updateThemeIcon();
  els.themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('ravenlab-theme', next);
    updateThemeIcon();
  });
}

function updateThemeIcon() {
  els.themeToggle.textContent = document.documentElement.dataset.theme === 'dark' ? '☀' : '☾';
}

function initUI() {
  Object.keys(CONFIG.bases).forEach((count) => {
    const base = CONFIG.bases[count];
    if (Object.values(base).some(v => v.hidden)) return;
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.type = 'button';
    btn.textContent = count;
    btn.dataset.count = count;
    btn.addEventListener('click', () => setCount(Number(count)));
    els.countButtons.appendChild(btn);
  });

  renderLayoutButtons();
  renderSwatches(els.baseColors, CONFIG.colors, state.baseColor.id, (color) => {
    state.baseColor = color;
    applyBaseColor();
    updateUI();
  });
  renderSwatches(els.capColors, CONFIG.colors, 'white', (color) => {
    state.capColor = color;
    applyToSelectedCaps({ color: color.hex, colorName: color.name, transparent: !!color.transparent });
  });

  CONFIG.keycaps.forEach((cap) => {
    const opt = document.createElement('option');
    opt.value = cap.id;
    opt.textContent = cap.label;
    els.capType.appendChild(opt);
  });
  els.capType.addEventListener('change', () => {
    applyToSelectedCaps({ type: els.capType.value });
  });

  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((letter) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = letter;
    const hasModel = hasLetterModel(letter);
    if (!hasModel) {
      btn.classList.add('soft-disabled');
      btn.title = `لا يوجد ملف keycap_${letter.toLowerCase()}.glb حاليًا، سيتم استخدام الكاب الاحتياطي.`;
    } else {
      btn.title = `يستخدم ملف keycap_${letter.toLowerCase()}.glb`;
    }
    btn.addEventListener('click', () => {
      els.letterInput.value = letter;
      applyToSelectedCaps({ letter, type: 'letter' });
      if (!hasModel) showToast(`لا يوجد keycap_${letter.toLowerCase()}.glb، استخدمنا كاب احتياطي مع الحرف.`);
    });
    els.letterGrid.appendChild(btn);
  });
  els.letterInput.addEventListener('input', () => {
    const letter = sanitizeLetter(els.letterInput.value);
    els.letterInput.value = letter;
    applyToSelectedCaps({ letter, type: 'letter' });
  });

  els.clearSelection.addEventListener('click', () => {
    state.selected.clear();
    refreshSelectionHelpers();
    updateUI();
  });
  els.selectNoneCaps.addEventListener('click', () => {
    state.selected.clear();
    refreshSelectionHelpers();
    updateUI();
  });
  els.selectAllCaps.addEventListener('click', selectAllCaps);
  els.selectAllHero?.addEventListener('click', () => {
    document.querySelector('#configurator')?.scrollIntoView({ behavior: 'smooth' });
    selectAllCaps();
  });
  els.resetCamera.addEventListener('click', fitCameraToObject);
  els.completeOrder?.addEventListener('click', openOrderModal);
  els.completeOrderMobile?.addEventListener('click', openOrderModal);
  els.copyOrder?.addEventListener('click', copyOrderDetails);
  els.shareOrder?.addEventListener('click', shareOrderDetails);
  els.orderModal?.querySelectorAll('[data-close-order]').forEach((el) => el.addEventListener('click', closeOrderModal));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeOrderModal();
  });
}

function renderSwatches(container, colors, activeId, onClick) {
  container.innerHTML = '';
  colors.forEach((color) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `swatch ${color.transparent ? 'transparent' : ''} ${color.id === activeId ? 'active' : ''}`;
    btn.style.setProperty('--swatch', color.hex);
    btn.title = color.name;
    btn.addEventListener('click', () => {
      [...container.children].forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      onClick(color);
    });
    container.appendChild(btn);
  });
}

function renderLayoutButtons() {
  const variants = CONFIG.bases[state.count];
  els.layoutButtons.innerHTML = '';
  const entries = Object.entries(variants).filter(([, v]) => !v.hidden);
  els.layoutSection.style.display = entries.length > 1 ? '' : 'none';
  if (!variants[state.layout] || variants[state.layout].hidden) state.layout = entries[0][0];
  entries.forEach(([id, data]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `option-btn ${id === state.layout ? 'active' : ''}`;
    btn.textContent = data.label;
    btn.addEventListener('click', () => {
      state.layout = id;
      renderLayoutButtons();
      buildProduct();
      updateUI();
    });
    els.layoutButtons.appendChild(btn);
  });
}

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas: els.viewer, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  THREE.ColorManagement.enabled = true;
  // NeutralToneMapping يحافظ على الألوان أقرب للـ hex المختار من ACESFilm.
  renderer.toneMapping = THREE.NeutralToneMapping || THREE.LinearToneMapping;
  renderer.toneMappingExposure = 1.0;

  scene = new THREE.Scene();
  // أزلنا الضباب لأنه كان يغيّر إحساس اللون، خصوصًا الأبيض والأخضر.
  scene.fog = null;
  camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1200);
  // وضع ابتدائي فقط قبل تحميل المنتج. بعد التحميل يتم ضبطها تلقائيًا حسب الحجم الحقيقي.
  camera.position.set(90, 58, 90);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  // منع الزوم من الدخول داخل المجسم. يتم تحديثها أيضًا بعد تحميل كل قاعدة.
  controls.minDistance = 22;
  controls.maxDistance = 700;
  controls.target.set(0, 0, 0);

  loader = new GLTFLoader();
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  productGroup = new THREE.Group();
  scene.add(productGroup);

  lightRig = new THREE.Group();
  scene.add(lightRig);
  // إضاءة محايدة: بدون ضوء أخضر حتى لا تتغير ألوان المنتج.
  const ambient = new THREE.AmbientLight(0xffffff, 1.35);
  lightRig.add(ambient);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.15);
  lightRig.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(4, 7, 6);
  lightRig.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.95);
  fill.position.set(-6, 3, -4);
  lightRig.add(fill);

  const rim = new THREE.DirectionalLight(0xffffff, 0.45);
  rim.position.set(0, 4, -7);
  lightRig.add(rim);

  const grid = new THREE.GridHelper(8, 16, 0x9cc03d, 0x4d4f46);
  grid.position.y = -0.025;
  grid.material.transparent = true;
  grid.material.opacity = 0.16;
  scene.add(grid);

  window.addEventListener('resize', resizeRenderer);
  renderer.domElement.addEventListener('pointerdown', onPointerStart);
  renderer.domElement.addEventListener('pointerup', onPointerEnd);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  resizeRenderer();
  animate();
}

function resizeRenderer() {
  const rect = els.canvasWrap.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / Math.max(rect.height, 1);
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  selectionHelpers.forEach((helper) => helper.update());
  renderer.render(scene, camera);
}

async function buildProduct() {
  const token = ++state.currentToken;
  setLoading(true);
  selectableMeshes = [];
  capObjects = [];
  selectionHelpers.forEach((helper) => productGroup.remove(helper));
  selectionHelpers = [];
  productGroup.clear();

  try {
    assemblyGroup = new THREE.Group();
    productGroup.add(assemblyGroup);

    const baseData = CONFIG.bases[state.count][state.layout];
    const baseScene = await loadScene(baseData.path);
    if (token !== state.currentToken) return;

    const base = cloneScene(baseScene);
    base.name = 'clicker_base';
    base.userData.kind = 'base';
    assemblyGroup.add(base);
    applyBaseColor(base);

    await waitOneFrame();
    const slots = findSlots(base).slice(0, state.count);
    if (!slots.length) {
      makeFallbackSlots(state.count, base).forEach(slot => slots.push(slot));
    }

    for (let i = 0; i < state.count; i++) {
      const capConfig = state.caps[i] || makeDefaultCap();
      const slot = slots[i] || slots[slots.length - 1] || makeFallbackSlot(i, state.count);
      const cap = await createCapObject(capConfig, i, slot);
      if (token !== state.currentToken) return;
      assemblyGroup.add(cap);
      capObjects[i] = cap;
    }

    centerAssembly();
    refreshSelectionHelpers();
    fitCameraToObject(false);
  } catch (error) {
    console.error(error);
    showToast('تعذر تحميل أحد مجسمات GLB. تأكد من أسماء الملفات داخل assets/models.');
  } finally {
    if (token === state.currentToken) {
      setLoading(false);
      updateUI();
    }
  }
}

function waitOneFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

function loadScene(path) {
  if (modelCache.has(path)) return Promise.resolve(modelCache.get(path));
  return new Promise((resolve, reject) => {
    loader.load(path, (gltf) => {
      modelCache.set(path, gltf.scene);
      resolve(gltf.scene);
    }, undefined, reject);
  });
}

async function loadCapScene(def, capConfig) {
  const primaryPath = resolveCapPath(def, capConfig);
  try {
    return { scene: await loadScene(primaryPath), path: primaryPath, usedFallback: false };
  } catch (primaryError) {
    if (!def.fallbackPath || def.fallbackPath === primaryPath) throw primaryError;
    return { scene: await loadScene(def.fallbackPath), path: def.fallbackPath, usedFallback: true };
  }
}

function resolveCapPath(def, capConfig) {
  if (def.category === 'letter' && def.pathTemplate) {
    const letter = sanitizeLetter(capConfig.letter || 'A').toLowerCase();
    return def.pathTemplate.replace('{letter}', letter);
  }
  return def.path;
}

function hasLetterModel(letter) {
  return CONFIG.availableLetterKeycaps.includes(sanitizeLetter(letter));
}

function cloneScene(source) {
  const clone = source.clone(true);
  clone.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
      if (Array.isArray(obj.material)) obj.material = obj.material.map(m => m ? m.clone() : m);
      else if (obj.material) obj.material = obj.material.clone();
      else obj.material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .55 });
    }
  });
  return clone;
}

function findSlots(root) {
  const slots = [];
  root.updateWorldMatrix(true, true);
  root.traverse((obj) => {
    if (/slot/i.test(obj.name)) slots.push(obj);
  });
  slots.sort((a, b) => {
    const aw = new THREE.Vector3();
    const bw = new THREE.Vector3();
    a.getWorldPosition(aw);
    b.getWorldPosition(bw);
    if (Math.abs(aw.z - bw.z) > 0.03) return aw.z - bw.z;
    return aw.x - bw.x;
  });
  return slots;
}

function makeFallbackSlots(count, base) {
  const box = new THREE.Box3().setFromObject(base);
  const size = box.getSize(new THREE.Vector3());
  const spacing = Math.max(size.x / Math.max(count, 1), 0.8);
  const y = box.max.y + 0.05;
  return Array.from({ length: count }, (_, i) => makeFallbackSlot(i, count, spacing, y));
}

function makeFallbackSlot(i, count, spacing = 0.85, y = 0.1) {
  const obj = new THREE.Object3D();
  const start = -((count - 1) * spacing) / 2;
  obj.position.set(start + i * spacing, y, 0);
  obj.updateWorldMatrix(true, true);
  return obj;
}

async function createCapObject(capConfig, index, slot) {
  const def = getCapDef(capConfig.type);
  const loaded = await loadCapScene(def, capConfig);
  const model = cloneScene(loaded.scene);
  model.name = `cap_model_${index + 1}`;
  model.userData.sourcePath = loaded.path;

  const group = new THREE.Group();
  group.name = `cap_${index + 1}`;
  group.userData.capIndex = index;
  group.userData.kind = 'cap';

  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  slot.updateWorldMatrix(true, false);
  slot.getWorldPosition(pos);
  slot.getWorldQuaternion(quat);
  slot.getWorldScale(scale);
  group.position.copy(pos);
  group.quaternion.copy(quat);
  group.scale.copy(scale);

  group.add(model);
  normalizeCap(model, def);
  applyCapMaterial(model, capConfig, def);

  // في الحالة الطبيعية لا نضيف حرفًا برمجيًا، لأن ملف keycap_a/keycap_g يحتوي الحرف فعليًا.
  // نستخدم Sprite فقط عند عدم وجود ملف الحرف المطلوب، حتى لا يظهر الكاب فارغًا.
  if (def.category === 'letter' && loaded.usedFallback) {
    group.add(createLetterSprite(capConfig.letter || 'A', capConfig.textColor || '#111111'));
  }

  group.traverse((obj) => {
    if (obj.isMesh) {
      obj.userData.capIndex = index;
      obj.userData.kind = 'cap';
      selectableMeshes.push(obj);
    }
  });

  return group;
}

function normalizeCap(model, def) {
  const box = new THREE.Box3().setFromObject(model);
  if (box.isEmpty()) return;

  // المجسمات الجديدة معمولة بنفس مقياس القاعدة تقريبًا، لذلك لا نصغرها.
  // التصغير القديم كان يجعل الكابات غير مرئية تقريبًا.
  const center = box.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= box.min.y;

  // رفع بسيط للأشكال الخاصة حتى لا تدخل داخل قاعدة الزر.
  if (def.category === 'special') model.position.y += 0.25;
}

function applyBaseColor(target = null) {
  const root = target || productGroup.getObjectByName('clicker_base');
  if (!root) return;
  const color = state.baseColor;
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color.hex),
      roughness: 0.58,
      metalness: 0.04,
      transparent: !!color.transparent,
      opacity: color.transparent ? 0.42 : 1,
      envMapIntensity: 0.75,
    });
  });
}

function applyCapMaterial(model, capConfig, def) {
  if (!def.tintable) return;
  const color = capConfig.color || '#ffffff';
  const transparent = capConfig.transparent || color === 'transparent';
  const tintMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color === 'transparent' ? '#ffffff' : color),
    roughness: 0.52,
    metalness: 0.02,
    transparent,
    opacity: transparent ? 0.48 : 1,
    envMapIntensity: 0.8,
  });

  const meshes = [];
  model.traverse((obj) => {
    if (obj.isMesh) meshes.push(obj);
  });

  // كابات الحروف تحتوي حرفًا داخل ملف GLB. لذلك نحاول تلوين جسم الكاب فقط
  // ونترك تفاصيل الحرف/الطباعة الصغيرة كما هي إن كانت Mesh منفصلة.
  if (def.category === 'letter' && meshes.length > 1) {
    const scored = meshes.map((mesh) => {
      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      return { mesh, score: Math.max(size.x * size.y * size.z, 0) };
    });
    const maxScore = Math.max(...scored.map(item => item.score), 0);
    scored.forEach(({ mesh, score }) => {
      if (score >= maxScore * 0.35) mesh.material = tintMaterial.clone();
    });
    return;
  }

  meshes.forEach((mesh) => {
    mesh.material = tintMaterial.clone();
  });
}

function createLetterSprite(letter, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.font = '900 300px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((letter || 'A').toUpperCase(), 256, 270);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.name = 'letter_sprite';
  // بعد اعتماد مقياس GLB الحقيقي، الحرف يحتاج حجم وارتفاع أكبر حتى يظهر فوق الكاب.
  sprite.position.set(0, 8.45, 0);
  sprite.scale.set(7.2, 7.2, 1);
  return sprite;
}

function centerAssembly() {
  if (!assemblyGroup) return;
  assemblyGroup.position.set(0, 0, 0);
  assemblyGroup.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(assemblyGroup);
  if (box.isEmpty()) return;
  const center = box.getCenter(new THREE.Vector3());
  assemblyGroup.position.sub(center);
  assemblyGroup.updateWorldMatrix(true, true);
}

function fitCameraToObject(animateTarget = true) {
  if (!assemblyGroup) return;
  const box = new THREE.Box3().setFromObject(assemblyGroup);
  if (box.isEmpty()) return;

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const radius = Math.max(sphere.radius, 1);

  // ضبط ذكي حسب حجم المجسم الحقيقي، وليس مضاعفة عمياء حسب عدد الأزرار.
  // القواعد الصغيرة تحصل على padding أعلى قليلًا، والقواعد الكبيرة padding أقل حتى لا تبتعد كثيرًا.
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * Math.max(camera.aspect || 1, 0.1));
  const limitingFov = Math.min(verticalFov, horizontalFov);
  const padding = state.count <= 3 ? 1.34 : state.count <= 6 ? 1.24 : 1.14;
  let distance = (radius / Math.sin(limitingFov / 2)) * padding;

  // حدود حماية: تمنع دخول الكاميرا داخل المجسم، وتمنع المسافة الضخمة مع كليكرات 8 و9.
  const compactMax = radius * 4.9 + 28;
  const compactMin = radius * 2.4 + 18;
  distance = THREE.MathUtils.clamp(distance, compactMin, compactMax);

  const direction = new THREE.Vector3(1, 0.62, 1).normalize();
  camera.position.copy(center).add(direction.multiplyScalar(distance));
  camera.near = Math.max(distance / 500, 0.01);
  camera.far = Math.max(distance * 7, 1200);
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.minDistance = Math.max(radius * 1.35, 18);
  controls.maxDistance = Math.max(distance * 2.15, radius * 5.5, 220);
  controls.update();
}

function onPointerMove(event) {
  const hit = raycastCap(event);
  renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
}

function onPointerStart(event) {
  pointerStart = {
    x: event.clientX,
    y: event.clientY,
    time: performance.now(),
  };
}

function onPointerEnd(event) {
  if (!pointerStart) return;
  const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
  const elapsed = performance.now() - pointerStart.time;
  pointerStart = null;
  // اختيار الكاب يتم بالنقرة فقط. السحب لتدوير المجسم لا يغير التحديد، وهذا مهم للجوال.
  if (distance > 10 || elapsed > 650) return;
  selectCapFromEvent(event);
}

function selectCapFromEvent(event) {
  const hit = raycastCap(event);
  if (!hit) return;
  const index = hit.object.userData.capIndex;
  if (index === undefined) return;
  if (event.shiftKey || event.ctrlKey || event.metaKey) {
    if (state.selected.has(index)) state.selected.delete(index);
    else state.selected.add(index);
  } else {
    state.selected.clear();
    state.selected.add(index);
  }
  refreshSelectionHelpers();
  syncControlsFromSelection();
  updateUI();
}

function raycastCap(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(selectableMeshes, true);
  return hits[0] || null;
}

function refreshSelectionHelpers() {
  selectionHelpers.forEach((helper) => productGroup.remove(helper));
  selectionHelpers = [];
  state.selected.forEach((index) => {
    const cap = capObjects[index];
    if (!cap) return;
    const helper = new THREE.BoxHelper(cap, new THREE.Color(CONFIG.brand.accent));
    helper.name = `selection_${index + 1}`;
    productGroup.add(helper);
    selectionHelpers.push(helper);
  });
}

function setCount(count) {
  if (state.count === count) return;
  state.count = count;
  const variants = CONFIG.bases[count];
  if (!variants[state.layout] || variants[state.layout].hidden) {
    state.layout = Object.keys(variants).find(key => !variants[key].hidden) || 'standard';
  }
  state.caps = createDefaultCaps(count);
  state.selected = new Set([0]);
  renderLayoutButtons();
  buildProduct();
  updateUI();
}

function selectAllCaps() {
  state.selected = new Set(state.caps.map((_, i) => i));
  refreshSelectionHelpers();
  syncControlsFromSelection();
  updateUI();
}

function applyToSelectedCaps(patch) {
  if (state.selected.size === 0) {
    showToast('اضغط على الكاب من الصورة بالأعلى أولًا.');
    return;
  }
  const safePatch = { ...patch };
  if (safePatch.letter) safePatch.letter = sanitizeLetter(safePatch.letter);
  if (safePatch.type) {
    const def = getCapDef(safePatch.type);
    if (def.category === 'special') {
      delete safePatch.color;
      delete safePatch.transparent;
    }
  }
  state.selected.forEach((index) => {
    state.caps[index] = { ...state.caps[index], ...safePatch };
    if (safePatch.type === 'letter' && !safePatch.letter) state.caps[index].letter = state.caps[index].letter || 'A';
  });
  buildProduct();
  updateUI();
}

function syncControlsFromSelection() {
  const first = [...state.selected][0];
  if (first === undefined || !state.caps[first]) return;
  const cap = state.caps[first];
  els.capType.value = cap.type;
  els.letterInput.value = cap.letter || 'A';
  const color = CONFIG.colors.find(c => c.hex.toLowerCase() === (cap.color || '').toLowerCase()) || CONFIG.colors[1];
  state.capColor = color;
  renderSwatches(els.capColors, CONFIG.colors, color.id, (selectedColor) => {
    state.capColor = selectedColor;
    applyToSelectedCaps({ color: selectedColor.hex, colorName: selectedColor.name, transparent: !!selectedColor.transparent });
  });
}

function sanitizeLetter(value) {
  const match = String(value || 'A').toUpperCase().match(/[A-Z]/);
  return match ? match[0] : 'A';
}

function getCapDef(id) {
  return CONFIG.keycaps.find(k => k.id === id) || CONFIG.keycaps[0];
}

function makeDefaultCap() {
  return { type: 'plain', color: '#ffffff', colorName: 'أبيض', letter: 'A' };
}

function calculatePrice() {
  let total = CONFIG.basePrice + (state.count * CONFIG.prices.switchSeat);
  state.caps.forEach((cap) => {
    const def = getCapDef(cap.type);
    if (def.price !== undefined) total += def.price;
    else total += CONFIG.prices[def.priceKey] || 0;
  });
  return total;
}

function buildOrderJson() {
  return {
    brand: CONFIG.brand.name,
    product: 'Custom Switch Clicker',
    switches: state.count,
    layout: getLayoutLabel(),
    baseColor: state.baseColor.name,
    keycaps: state.caps.map((cap, index) => {
      const def = getCapDef(cap.type);
      return {
        slot: index + 1,
        type: def.category,
        design: def.label,
        color: def.tintable ? (cap.colorName || cap.color || 'أبيض') : 'original',
        letter: def.category === 'letter' ? (cap.letter || 'A') : null,
        modelFile: def.category === 'letter' ? `keycap_${String(cap.letter || 'A').toLowerCase()}.glb` : resolveCapPath(def, cap).split('/').pop(),
        price: def.price !== undefined ? def.price : (CONFIG.prices[def.priceKey] || 0),
      };
    }),
    price: calculatePrice(),
    currency: 'IQD',
  };
}

function getLayoutLabel() {
  return CONFIG.bases[state.count]?.[state.layout]?.label || state.layout;
}

function createOrderMessage(order = buildOrderJson()) {
  const keycapLines = order.keycaps.map((cap) => {
    let details = '';
    if (cap.type === 'letter') details = `حرف ${cap.letter} — لون الكاب: ${cap.color} — ملف المجسم: keycap_${String(cap.letter || 'A').toLowerCase()}.glb`;
    else if (cap.type === 'plain') details = `سادة — لون الكاب: ${cap.color}`;
    else details = `${cap.design} — لون التصميم الأصلي`;
    return `كاب ${cap.slot}: ${details}`;
  }).join('\n');

  return `طلب كليكر مخصص من RavenLab\n` +
    `------------------------------\n` +
    `عدد الأزرار: ${order.switches}\n` +
    `شكل القاعدة: ${order.layout}\n` +
    `لون الكليكر: ${order.baseColor}\n\n` +
    `تفاصيل الكابات:\n${keycapLines}\n\n` +
    `السعر الظاهر في الموقع: ${order.price.toLocaleString('en-US')} IQD تقريبًا\n` +
    `ملاحظة: السعر النهائي يتم تأكيده من RavenLab بعد مراجعة الطلب.\n` +
    `أي تعديل يدوي على تفاصيل الطلب لا يُعتمد إلا بعد مراجعة RavenLab.\n` +
    `------------------------------\n` +
    `اسم العميل:\n` +
    `رقم الهاتف:\n` +
    `العنوان / طريقة الاستلام:\n` +
    `ملاحظات إضافية:`;
}


function openOrderModal() {
  const order = buildOrderJson();
  localStorage.setItem('ravenlab-last-order', JSON.stringify(order));
  if (els.orderDetails) els.orderDetails.value = createOrderMessage(order);
  els.orderModal?.classList.add('show');
  els.orderModal?.setAttribute('aria-hidden', 'false');
  setTimeout(() => els.orderDetails?.focus(), 50);
}

function closeOrderModal() {
  els.orderModal?.classList.remove('show');
  els.orderModal?.setAttribute('aria-hidden', 'true');
}

async function copyOrderDetails() {
  const text = els.orderDetails?.value || createOrderMessage();
  try {
    await navigator.clipboard.writeText(text);
    showToast('تم نسخ تفاصيل الطلب. أرسلها لنا لإكمال الطلب.');
  } catch (error) {
    els.orderDetails?.select();
    document.execCommand?.('copy');
    showToast('تم تحديد تفاصيل الطلب. انسخها يدويًا إن لم تُنسخ تلقائيًا.');
  }
}

async function shareOrderDetails() {
  const text = els.orderDetails?.value || createOrderMessage();
  if (navigator.share) {
    try {
      await navigator.share({ title: 'طلب RavenLab', text });
      return;
    } catch (error) {
      // المستخدم قد يلغي المشاركة، لذلك لا نعرض خطأ.
      return;
    }
  }
  await copyOrderDetails();
}

function updateUI() {
  [...els.countButtons.children].forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.count) === state.count);
  });
  els.countBadge.textContent = `${state.count} ${state.count === 1 ? 'زر' : 'أزرار'}`;
  els.baseColorLabel.textContent = state.baseColor.name;
  els.capColorLabel.textContent = state.capColor.name;

  const selected = [...state.selected].sort((a, b) => a - b);
  els.selectedText.textContent = selected.length ? selected.map(i => `#${i + 1}`).join('، ') : 'لا يوجد تحديد';

  const firstSelected = selected[0];
  const firstCap = state.caps[firstSelected] || state.caps[0] || makeDefaultCap();
  els.capType.value = firstCap.type;
  const def = getCapDef(firstCap.type);
  els.letterBox.classList.toggle('show', def.category === 'letter');
  els.capColors.closest('#capColorBox').style.display = def.tintable ? '' : 'none';

  [...els.letterGrid.children].forEach(btn => {
    btn.classList.toggle('active', btn.textContent === (firstCap.letter || 'A'));
  });

  const price = calculatePrice();
  els.priceText.textContent = `${price.toLocaleString('en-US')} IQD تقريبًا`;
  if (els.mobilePriceText) els.mobilePriceText.textContent = `${price.toLocaleString('en-US')} IQD`;
  els.jsonPreview.textContent = createOrderMessage(buildOrderJson());
}


function setLoading(isLoading) {
  els.loader.classList.toggle('show', isLoading);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove('show'), 2600);
}
