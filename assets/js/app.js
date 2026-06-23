import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const MODEL_DIR = 'assets/models/';

const CONFIG = {
  brand: {
    name: 'RavenLab',
    accent: '#9cc03d',
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
    { id: 'plain', label: 'سادة', category: 'plain', path: `${MODEL_DIR}keycap_letter.glb`, priceKey: 'plainKeycap', tintable: true },
    { id: 'letter', label: 'حرف إنجليزي', category: 'letter', path: `${MODEL_DIR}keycap_letter.glb`, priceKey: 'letterKeycap', tintable: true },
    { id: 'oreo', label: 'Oreo', category: 'special', path: `${MODEL_DIR}keycap_oreo.glb`, price: 3500, tintable: false },
    { id: 'strawberry', label: 'Strawberry', category: 'special', path: `${MODEL_DIR}keycap_Strawberry.glb`, price: 3500, tintable: false },
    { id: 'waffle', label: 'Waffle', category: 'special', path: `${MODEL_DIR}keycap_Waffle.glb`, price: 3500, tintable: false },
    { id: 'chocolate', label: 'Chocolate', category: 'special', path: `${MODEL_DIR}keycap_CHOCOLATE.glb`, price: 3000, tintable: false },
  ],
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
  addToCart: $('#addToCart'),
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
    btn.addEventListener('click', () => {
      els.letterInput.value = letter;
      applyToSelectedCaps({ letter, type: 'letter' });
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
  els.selectAllHero.addEventListener('click', () => {
    document.querySelector('#configurator')?.scrollIntoView({ behavior: 'smooth' });
    selectAllCaps();
  });
  els.resetCamera.addEventListener('click', fitCameraToObject);
  els.addToCart.addEventListener('click', addToCart);
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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0d08, 0.026);
  camera = new THREE.PerspectiveCamera(35, 1, 0.01, 220);
  // أبعدنا الكاميرا الافتراضية حتى لا تبدأ داخل مجسم الكليكر.
  camera.position.set(100, 75, 100);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  // منع الزوم من الدخول داخل المجسم. يتم تحديثها أيضًا بعد تحميل كل قاعدة.
  controls.minDistance = 3.5;
  controls.maxDistance = 60;
  controls.target.set(0, 0, 0);

  loader = new GLTFLoader();
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  productGroup = new THREE.Group();
  scene.add(productGroup);

  lightRig = new THREE.Group();
  scene.add(lightRig);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x1d220d, 1.25);
  lightRig.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(3, 5, 5);
  lightRig.add(key);
  const fill = new THREE.DirectionalLight(0x9cc03d, 1.2);
  fill.position.set(-5, 2, -3);
  lightRig.add(fill);

  const grid = new THREE.GridHelper(8, 16, 0x9cc03d, 0x4d4f46);
  grid.position.y = -0.025;
  grid.material.transparent = true;
  grid.material.opacity = 0.16;
  scene.add(grid);

  window.addEventListener('resize', resizeRenderer);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
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
  const source = await loadScene(def.path);
  const model = cloneScene(source);
  model.name = `cap_model_${index + 1}`;

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

  if (def.category === 'letter') {
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
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  if (!isFinite(maxDim) || maxDim <= 0) return;

  // The food models are larger/heavier than the simple caps, so this keeps them near the same slot footprint.
  const target = def.category === 'special' ? 0.62 : 0.52;
  const factor = target / maxDim;
  if (factor > 0 && isFinite(factor)) model.scale.multiplyScalar(factor);

  const newBox = new THREE.Box3().setFromObject(model);
  const center = newBox.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= newBox.min.y;
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
  model.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color === 'transparent' ? '#ffffff' : color),
      roughness: 0.52,
      metalness: 0.02,
      transparent,
      opacity: transparent ? 0.48 : 1,
      envMapIntensity: 0.8,
    });
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
  sprite.position.set(0, 0.18, 0);
  sprite.scale.set(0.36, 0.36, 1);
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
  const maxDim = Math.max(size.x, size.y, size.z, 1);

  // حساب مسافة آمنة بناءً على حجم المجسم وزاوية الكاميرا، مع مساحة تنفس كبيرة حوله.
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const fitDistance = (maxDim / 2) / Math.tan(verticalFov / 2);
  const distance = fitDistance * 300.0;
  const direction = new THREE.Vector3(1, 0.55, 1).normalize();

  camera.position.copy(center).add(direction.multiplyScalar(distance));
  camera.near = Math.max(distance / 250, 0.01);
  camera.far = Math.max(distance * 80, 220);
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.minDistance = Math.max(fitDistance * 1.45, maxDim * 2.0, 2.8);
  controls.maxDistance = Math.max(distance * 4.5, 60);
  controls.update();
}

function onPointerMove(event) {
  const hit = raycastCap(event);
  renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
}

function onPointerDown(event) {
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
    showToast('حدد كاب واحد على الأقل من المشهد أولًا.');
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
    switches: state.count,
    layout: state.layout,
    baseColor: state.baseColor.name,
    keycaps: state.caps.map((cap, index) => {
      const def = getCapDef(cap.type);
      return {
        slot: index + 1,
        type: def.category,
        design: def.label,
        color: def.tintable ? (cap.colorName || cap.color || 'أبيض') : 'original',
        letter: def.category === 'letter' ? (cap.letter || 'A') : null,
        price: def.price !== undefined ? def.price : (CONFIG.prices[def.priceKey] || 0),
      };
    }),
    price: calculatePrice(),
    currency: 'IQD',
  };
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
  els.priceText.textContent = `${price.toLocaleString('en-US')} IQD`;
  els.jsonPreview.textContent = JSON.stringify(buildOrderJson(), null, 2);
}

function addToCart() {
  const order = buildOrderJson();
  const cart = JSON.parse(localStorage.getItem('ravenlab-cart') || '[]');
  cart.push(order);
  localStorage.setItem('ravenlab-cart', JSON.stringify(cart));
  navigator.clipboard?.writeText(JSON.stringify(order, null, 2)).catch(() => {});
  showToast('تمت إضافة التصميم إلى السلة ونسخ JSON للطلب.');
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
