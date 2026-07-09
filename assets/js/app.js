import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const MODEL_DIR = 'assets/models/';

const CONFIG = {
  brand: {
    name: 'RavenLab',
    accent: '#9cc03d',
  },
  contact: {
    // ضع رقم واتساب المتجر بصيغة دولية بدون +، مثال العراق: 9647XXXXXXXXX.
    // إذا تركته فارغًا، زر واتساب يفتح مشاركة عامة للرسالة.
    whatsappNumber: '',
    // عدل هذا الرابط إلى حساب RavenLab الرسمي.
    instagramUrl: 'https://www.instagram.com/ravenlab/',
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
      cheese: 3500,
      noodles: 3500,
      chess: 3500,
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
    { id: 'red', name: 'أحمر', hex: '#d83333' },
    { id: 'yellow', name: 'أصفر', hex: '#f4d13d' },
    { id: 'blue', name: 'أزرق', hex: '#306ee8' },
    { id: 'green', name: 'أخضر', hex: '#37a967' },
    { id: 'sky', name: 'سمائي', hex: '#69cfff' },
    { id: 'pink', name: 'وردي', hex: '#ee76b8' },
    { id: 'wood', name: 'خشبي', hex: '#8b5a2b' },
    { id: 'orange', name: 'برتقالي', hex: '#f28c28' },
    { id: 'white', name: 'أبيض', hex: '#ffffff' },
    { id: 'black', name: 'أسود', hex: '#050505' },
  ],
  keycaps: [
    { id: 'plain', label: 'سادة', category: 'plain', path: `${MODEL_DIR}Keycup_Base.glb`, fallbackPath: `${MODEL_DIR}keycap_plain.glb`, priceKey: 'plainKeycap', tintable: true },
    {
      id: 'letter',
      label: 'حرف إنجليزي',
      category: 'letter',
      pathTemplates: [`${MODEL_DIR}Keycup_{letter}.glb`, `${MODEL_DIR}keycap_{lower}.glb`],
      fallbackPath: `${MODEL_DIR}Keycup_Base.glb`,
      priceKey: 'letterKeycap',
      tintable: true
    },
    { id: 'oreo', label: 'أوريو', category: 'special', path: `${MODEL_DIR}keycap_oreo.glb`, price: 3500, tintable: false },
    { id: 'strawberry', label: 'فراولة', category: 'special', path: `${MODEL_DIR}keycap_Strawberry.glb`, price: 3500, tintable: false },
    { id: 'waffle', label: 'وافل', category: 'special', path: `${MODEL_DIR}keycap_Waffle.glb`, price: 3500, tintable: false },
    { id: 'chocolate', label: 'شوكولاتة', category: 'special', path: `${MODEL_DIR}keycap_Chocolate.glb`, fallbackPath: `${MODEL_DIR}keycap_CHOCOLATE.glb`, price: 3000, tintable: false },
    { id: 'cheese', label: 'جبن', category: 'special', path: `${MODEL_DIR}keycap_Chees.glb`, price: 3500, tintable: false },
    { id: 'noodles', label: 'نودلز', category: 'special', path: `${MODEL_DIR}keycap_Noodles.glb`, price: 3500, tintable: false },
    { id: 'chess', label: 'شطرنج', category: 'special', path: `${MODEL_DIR}keycap_Chess.glb`, price: 3500, tintable: false },
  ],
  presets: [
    {
      id: 'classic3',
      name: 'حروف كلاسيك',
      desc: '3 أزرار بحروف A / B / C',
      count: 3,
      layout: 'standard',
      baseColorId: 'black',
      caps: [
        { type: 'letter', letter: 'A', colorId: 'white' },
        { type: 'letter', letter: 'B', colorId: 'white' },
        { type: 'letter', letter: 'C', colorId: 'white' },
      ]
    },
    {
      id: 'color5',
      name: 'ألوان مرحة',
      desc: '5 أزرار سادة بألوان مختلفة',
      count: 5,
      layout: 'standard',
      baseColorId: 'white',
      caps: [
        { type: 'plain', colorId: 'red' },
        { type: 'plain', colorId: 'yellow' },
        { type: 'plain', colorId: 'blue' },
        { type: 'plain', colorId: 'green' },
        { type: 'plain', colorId: 'pink' },
      ]
    },
    {
      id: 'food6',
      name: 'أشكال مميزة',
      desc: '6 أزرار من أشكال الطعام والتصاميم',
      count: 6,
      layout: 'standard',
      baseColorId: 'wood',
      caps: [
        { type: 'oreo' },
        { type: 'chocolate' },
        { type: 'noodles' },
        { type: 'cheese' },
        { type: 'waffle' },
        { type: 'chess' },
      ]
    },
  ],
  availableKeycupLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
  availableLetterKeycaps: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'],
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
  presetButtons: $('#presetButtons'),
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
  sendWhatsapp: $('#sendWhatsapp'),
  openInstagram: $('#openInstagram'),
  customerName: $('#customerName'),
  customerPhone: $('#customerPhone'),
  customerAddress: $('#customerAddress'),
  customerNotes: $('#customerNotes'),
  testMode: $('#testMode'),
  testModePanel: $('#testModePanel'),
  sceneHint: $('#sceneHint'),
  loader: $('#loader'),
  toast: $('#toast'),
  viewer: $('#viewer'),
  canvasWrap: $('#canvasWrap'),
  resetCamera: $('#resetCamera'),
  clearSelection: $('#clearSelection'),
  selectAllCaps: $('#selectAllCaps'),
  selectNoneCaps: $('#selectNoneCaps'),
  selectAllHero: $('#selectAllHero'),
};

const state = {
  count: 1,
  layout: 'standard',
  baseColor: CONFIG.colors.find(c => c.id === 'black') || CONFIG.colors[0],
  capColor: CONFIG.colors.find(c => c.id === 'white') || CONFIG.colors[0],
  selected: new Set([0]),
  caps: [],
  currentToken: 0,
  testMode: false,
};

let renderer, scene, camera, controls, loader, productGroup, assemblyGroup;
let raycaster, pointer;
let selectableMeshes = [];
let capObjects = [];
let selectionHelpers = [];
let modelCache = new Map();
let lightRig;
let pointerStart = null;

initState();
initTheme();
initUI();
initThree();
buildProduct();
updateUI();

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
  renderPresetButtons();
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
      btn.title = `لا يوجد ملف حرف ${letter} حاليًا، سيتم استخدام كاب احتياطي.`;
    } else {
      btn.title = `يستخدم ملف الحرف ${getLetterModelFileName(letter)}`;
    }
    btn.addEventListener('click', () => {
      els.letterInput.value = letter;
      applyToSelectedCaps({ letter, type: 'letter' });
      if (!hasModel) showToast(`لا يوجد ملف حرف ${letter}، استخدمنا كاب احتياطي.`);
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
  els.testMode?.addEventListener('click', toggleTestMode);
  els.testModePanel?.addEventListener('click', toggleTestMode);
  els.completeOrder?.addEventListener('click', openOrderModal);
  els.completeOrderMobile?.addEventListener('click', openOrderModal);
  els.copyOrder?.addEventListener('click', copyOrderDetails);
  els.shareOrder?.addEventListener('click', shareOrderDetails);
  els.sendWhatsapp?.addEventListener('click', sendWhatsappOrder);
  els.openInstagram?.addEventListener('click', openInstagramOrder);
  [els.customerName, els.customerPhone, els.customerAddress, els.customerNotes].forEach((input) => {
    input?.addEventListener('input', () => {
      saveCustomerInfo();
      updateOrderDetails();
    });
  });
  restoreCustomerInfo();
  els.orderModal?.querySelectorAll('[data-close-order]').forEach((el) => el.addEventListener('click', closeOrderModal));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeOrderModal();
  });
}


function renderPresetButtons() {
  if (!els.presetButtons) return;
  els.presetButtons.innerHTML = '';
  CONFIG.presets.forEach((preset) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-card';
    btn.innerHTML = `<strong>${preset.name}</strong><span>${preset.desc}</span><small>تطبيق النموذج</small>`;
    btn.addEventListener('click', () => applyPreset(preset));
    els.presetButtons.appendChild(btn);
  });
}

function applyPreset(preset) {
  const baseColor = CONFIG.colors.find(c => c.id === preset.baseColorId) || state.baseColor;
  state.count = preset.count;
  state.layout = CONFIG.bases[state.count]?.[preset.layout] ? preset.layout : 'standard';
  state.baseColor = baseColor;
  state.caps = Array.from({ length: state.count }, (_, index) => {
    const presetCap = preset.caps[index] || { type: 'plain', colorId: 'white' };
    const color = CONFIG.colors.find(c => c.id === presetCap.colorId) || CONFIG.colors.find(c => c.id === 'white') || CONFIG.colors[0];
    const cap = {
      type: presetCap.type || 'plain',
      color: color.hex,
      colorName: color.name,
      letter: presetCap.letter || 'A',
    };
    return cap;
  });
  state.selected = new Set([0]);
  state.capColor = CONFIG.colors.find(c => c.id === 'white') || CONFIG.colors[0];
  renderLayoutButtons();
  renderSwatches(els.baseColors, CONFIG.colors, state.baseColor.id, (color) => {
    state.baseColor = color;
    applyBaseColor();
    updateUI();
  });
  renderSwatches(els.capColors, CONFIG.colors, state.capColor.id, (color) => {
    state.capColor = color;
    applyToSelectedCaps({ color: color.hex, colorName: color.name, transparent: !!color.transparent });
  });
  buildProduct();
  updateUI();
  showToast(`تم تطبيق نموذج ${preset.name}. يمكنك تعديله الآن.`);
}

function renderSwatches(container, colors, activeId, onClick) {
  container.innerHTML = '';
  colors.forEach((color) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `swatch ${color.transparent ? 'transparent' : ''} ${color.id === activeId ? 'active' : ''}`;
    btn.style.setProperty('--swatch', color.hex);
    btn.title = color.name;
    btn.setAttribute('aria-label', color.name);
    const label = document.createElement('span');
    label.textContent = color.name;
    btn.appendChild(label);
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
  const paths = resolveCapPaths(def, capConfig);
  let lastError = null;
  for (let i = 0; i < paths.length; i++) {
    try {
      return { scene: await loadScene(paths[i]), path: paths[i], usedFallback: isCapFallbackPath(def, paths[i]) };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('No cap model path found');
}


function isCapFallbackPath(def, path) {
  if (def.category !== 'letter') return false;
  return /Keycup_Base\.glb|keycap_plain\.glb/i.test(path || '');
}

function resolveCapPaths(def, capConfig) {
  const paths = [];
  const add = (path) => {
    if (path && !paths.includes(path)) paths.push(path);
  };
  if (def.category === 'letter') {
    const letter = sanitizeLetter(capConfig.letter || 'A');
    const lower = letter.toLowerCase();
    if (Array.isArray(def.pathTemplates)) {
      def.pathTemplates.forEach((template) => add(template.replace('{letter}', letter).replace('{lower}', lower)));
    } else if (def.pathTemplate) {
      add(def.pathTemplate.replace('{letter}', lower).replace('{lower}', lower));
    }
    add(def.fallbackPath);
    add(`${MODEL_DIR}keycap_plain.glb`);
    return paths;
  }
  add(def.path);
  add(def.fallbackPath);
  return paths;
}

function resolveCapPath(def, capConfig) {
  return resolveCapPaths(def, capConfig)[0];
}

function hasLetterModel(letter) {
  const safe = sanitizeLetter(letter);
  return CONFIG.availableLetterKeycaps.includes(safe) || CONFIG.availableKeycupLetters.includes(safe);
}

function getLetterModelFileName(letter) {
  const safe = sanitizeLetter(letter);
  if (CONFIG.availableKeycupLetters.includes(safe)) return `Keycup_${safe}.glb`;
  if (CONFIG.availableLetterKeycaps.includes(safe)) return `keycap_${safe.toLowerCase()}.glb`;
  return 'Keycup_Base.glb (احتياطي)';
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
  if (state.testMode) {
    pressCap(index);
    return;
  }
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


function toggleTestMode() {
  state.testMode = !state.testMode;
  if (state.testMode) {
    state.selected.clear();
    refreshSelectionHelpers();
    showToast('وضع التجربة مفعل. اضغط على أي زر في الكليكر.');
  } else {
    state.selected = new Set([0]);
    refreshSelectionHelpers();
    syncControlsFromSelection();
    showToast('رجعنا لوضع التصميم. اضغط على كاب لتغييره.');
  }
  updateUI();
}

function pressCap(index) {
  const cap = capObjects[index];
  if (!cap || cap.userData.pressLock) return;

  const rest = cap.userData.restPosition ? cap.userData.restPosition.clone() : cap.position.clone();
  cap.userData.restPosition = rest.clone();
  const box = new THREE.Box3().setFromObject(cap);
  const size = box.getSize(new THREE.Vector3());
  const down = THREE.MathUtils.clamp(Math.max(size.y, 1) * 0.11, 0.12, 0.75);
  const duration = 170;
  const start = performance.now();
  cap.userData.pressLock = true;
  playClickSound(index);

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const offset = Math.sin(Math.PI * t) * down;
    cap.position.copy(rest);
    cap.position.y -= offset;
    if (t < 1) requestAnimationFrame(step);
    else {
      cap.position.copy(rest);
      cap.userData.pressLock = false;
    }
  }
  requestAnimationFrame(step);
}

let clickAudioContext = null;
function playClickSound(index = 0) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    clickAudioContext = clickAudioContext || new AudioContextClass();
    const ctx = clickAudioContext;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(760 + (index % 5) * 35, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.052);
  } catch (error) {
    // الصوت اختياري. إذا رفض المتصفح تشغيله لا نوقف التجربة.
  }
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
  const color = CONFIG.colors.find(c => c.hex.toLowerCase() === (cap.color || '').toLowerCase()) || CONFIG.colors.find(c => c.id === 'white') || CONFIG.colors[0];
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
        modelFile: def.category === 'letter' ? getLetterModelFileName(cap.letter || 'A') : resolveCapPath(def, cap).split('/').pop(),
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

function getCustomerInfo() {
  return {
    name: (els.customerName?.value || '').trim(),
    phone: (els.customerPhone?.value || '').trim(),
    address: (els.customerAddress?.value || '').trim(),
    notes: (els.customerNotes?.value || '').trim(),
  };
}

function saveCustomerInfo() {
  localStorage.setItem('ravenlab-customer-info', JSON.stringify(getCustomerInfo()));
}

function restoreCustomerInfo() {
  try {
    const saved = JSON.parse(localStorage.getItem('ravenlab-customer-info') || '{}');
    if (els.customerName && saved.name) els.customerName.value = saved.name;
    if (els.customerPhone && saved.phone) els.customerPhone.value = saved.phone;
    if (els.customerAddress && saved.address) els.customerAddress.value = saved.address;
    if (els.customerNotes && saved.notes) els.customerNotes.value = saved.notes;
  } catch (error) {}
}

function updateOrderDetails() {
  if (els.orderDetails) els.orderDetails.value = createOrderMessage(buildOrderJson());
}

function createOrderMessage(order = buildOrderJson()) {
  const customer = getCustomerInfo();
  const keycapLines = order.keycaps.map((cap) => {
    let details = '';
    if (cap.type === 'letter') details = `حرف ${cap.letter} — لون الكاب: ${cap.color}`;
    else if (cap.type === 'plain') details = `سادة — لون الكاب: ${cap.color}`;
    else details = `${cap.design} — لون التصميم الأصلي`;
    return `كاب ${cap.slot}: ${details}`;
  }).join('\n');

  return `طلب كليكر مخصص من RavenLab\n` +
    `------------------------------\n` +
    `عدد الأزرار: ${order.switches}\n` +
    `شكل القاعدة: ${order.layout}\n` +
    `لون الأساس: ${order.baseColor}\n\n` +
    `تفاصيل الكابات:\n${keycapLines}\n\n` +
    `السعر الظاهر في الموقع: ${order.price.toLocaleString('en-US')} IQD تقريبًا\n` +
    `ملاحظة: السعر النهائي يتم تأكيده من RavenLab بعد مراجعة الطلب.\n` +
    `------------------------------\n` +
    `اسم العميل: ${customer.name || 'غير مكتوب'}\n` +
    `رقم الجوال: ${customer.phone || 'غير مكتوب'}\n` +
    `العنوان: ${customer.address || 'غير مكتوب'}\n` +
    `ملاحظات: ${customer.notes || 'لا توجد'}`;
}

function openOrderModal() {
  const order = buildOrderJson();
  localStorage.setItem('ravenlab-last-order', JSON.stringify(order));
  updateOrderDetails();
  els.orderModal?.classList.add('show');
  els.orderModal?.setAttribute('aria-hidden', 'false');
  setTimeout(() => els.customerPhone?.focus(), 50);
}

function closeOrderModal() {
  els.orderModal?.classList.remove('show');
  els.orderModal?.setAttribute('aria-hidden', 'true');
}

async function copyOrderDetails() {
  updateOrderDetails();
  const text = els.orderDetails?.value || createOrderMessage();
  try {
    await navigator.clipboard.writeText(text);
    showToast('تم نسخ الفاتورة. أرسلها لنا لإكمال الطلب.');
  } catch (error) {
    els.orderDetails?.select();
    document.execCommand?.('copy');
    showToast('تم تحديد تفاصيل الطلب. انسخها يدويًا إن لم تُنسخ تلقائيًا.');
  }
}

async function shareOrderDetails() {
  updateOrderDetails();
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

function makeWhatsappUrl(text) {
  const phone = String(CONFIG.contact.whatsappNumber || '').replace(/\D/g, '');
  const encoded = encodeURIComponent(text);
  return phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

function sendWhatsappOrder() {
  updateOrderDetails();
  const text = els.orderDetails?.value || createOrderMessage();
  window.open(makeWhatsappUrl(text), '_blank', 'noopener');
}

async function openInstagramOrder() {
  await copyOrderDetails();
  const url = CONFIG.contact.instagramUrl || 'https://www.instagram.com/';
  window.open(url, '_blank', 'noopener');
  showToast('تم نسخ الفاتورة. الصقها في رسالة إنستغرام إلى RavenLab.');
}

function updateUI() {
  [...els.countButtons.children].forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.count) === state.count);
  });
  els.countBadge.textContent = `${state.count} ${state.count === 1 ? 'زر' : 'أزرار'}`;
  els.baseColorLabel.textContent = state.baseColor.name;
  els.capColorLabel.textContent = state.capColor.name;

  els.testMode?.classList.toggle('active', state.testMode);
  if (els.testMode) els.testMode.textContent = state.testMode ? 'إنهاء التجربة' : 'تجربة الضغط';
  if (els.testModePanel) els.testModePanel.textContent = state.testMode ? 'إنهاء التجربة' : 'تجربة الكليكر';
  if (els.sceneHint) els.sceneHint.textContent = state.testMode ? 'وضع التجربة مفعل: اضغط على أي زر لسماع وتجربة الضغط' : 'اسحب للدوران · اضغط على كاب لتغييره';

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

console.info('RavenLab configurator invoice examples build');
