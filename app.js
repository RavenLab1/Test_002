import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const MODEL_PATH = 'assets/models/';

const DATA = {
  prices: {
    base: 5000,
    perSwitch: 2500,
    letterPrint: 750
  },
  baseModels: Array.from({ length: 9 }, (_, index) => {
    const count = index + 1;
    return {
      count,
      name: `${count} زر`,
      file: `${MODEL_PATH}base_${String(count).padStart(2, '0')}.glb`,
      // المتوفر حاليًا من الملفات المرفوعة هو 1 إلى 3 فقط.
      available: count <= 3
    };
  }),
  baseColors: [
    { id: 'black', name: 'أسود', hex: '#050505' },
    { id: 'white', name: 'أبيض', hex: '#f4f4ef' },
    { id: 'raven', name: 'Raven Green', hex: '#9cc03d' },
    { id: 'gray', name: 'رمادي', hex: '#8b9184' },
    { id: 'red', name: 'أحمر', hex: '#c24132' },
    { id: 'blue', name: 'أزرق', hex: '#315eaa' },
    { id: 'transparent', name: 'شفاف', hex: '#dfe8d8', transparent: true }
  ],
  keycapColors: [
    { id: 'white', name: 'أبيض', hex: '#f7f8f3' },
    { id: 'black', name: 'أسود', hex: '#050505' },
    { id: 'raven', name: 'Raven Green', hex: '#9cc03d' },
    { id: 'red', name: 'أحمر', hex: '#d94336' },
    { id: 'blue', name: 'أزرق', hex: '#2f68d8' },
    { id: 'yellow', name: 'أصفر', hex: '#f0d84a' },
    { id: 'pink', name: 'وردي', hex: '#f48abc' },
    { id: 'purple', name: 'بنفسجي', hex: '#8257d5' },
    { id: 'orange', name: 'برتقالي', hex: '#f28d31' },
    { id: 'gray', name: 'رمادي', hex: '#8d928b' },
    { id: 'transparent', name: 'شفاف', hex: '#e8efe3', transparent: true }
  ],
  textColors: [
    { id: 'black', name: 'أسود', hex: '#050505' },
    { id: 'white', name: 'أبيض', hex: '#ffffff' },
    { id: 'raven', name: 'Raven Green', hex: '#9cc03d' },
    { id: 'red', name: 'أحمر', hex: '#d94336' },
    { id: 'blue', name: 'أزرق', hex: '#2f68d8' }
  ],
  keycapTypes: [
    { id: 'plain', name: 'سادة', description: 'كيكاب بدون طباعة' },
    { id: 'letter', name: 'حرف إنجليزي', description: 'حرف مطبوع فوق الكيكاب' },
    { id: 'special', name: 'شكل مميز', description: 'تصاميم طعام مبدئية' }
  ],
  specials: [
    { id: 'oreo', name: 'Oreo', icon: 'OREO', price: 1500, color: '#111111', textColor: '#ffffff' },
    { id: 'donut', name: 'Donut', icon: 'DONUT', price: 2000, color: '#d99a67', textColor: '#7b321f' },
    { id: 'cake', name: 'Cake', icon: 'CAKE', price: 1750, color: '#f0d4c2', textColor: '#a13d72' }
  ],
  models: {
    plainKeycap: `${MODEL_PATH}keycap_plain.glb`
  }
};

const state = {
  switches: 1,
  baseColor: 'black',
  selectedSlots: [1],
  keycaps: Array.from({ length: 9 }, () => ({
    type: 'plain',
    color: 'white',
    letter: 'A',
    textColor: 'black',
    special: 'oreo'
  }))
};

const el = {
  themeToggle: document.getElementById('themeToggle'),
  switchCountGrid: document.getElementById('switchCountGrid'),
  baseColorGrid: document.getElementById('baseColorGrid'),
  slotPicker: document.getElementById('slotPicker'),
  selectAllSlots: document.getElementById('selectAllSlots'),
  clearSlots: document.getElementById('clearSlots'),
  keycapTypeGrid: document.getElementById('keycapTypeGrid'),
  keycapColorGrid: document.getElementById('keycapColorGrid'),
  letterColorGrid: document.getElementById('letterColorGrid'),
  letterInput: document.getElementById('letterInput'),
  textColorInput: document.getElementById('textColorInput'),
  specialGrid: document.getElementById('specialGrid'),
  plainOptions: document.getElementById('plainOptions'),
  letterOptions: document.getElementById('letterOptions'),
  specialOptions: document.getElementById('specialOptions'),
  totalPrice: document.getElementById('totalPrice'),
  mobileTotalPrice: document.getElementById('mobileTotalPrice'),
  summaryList: document.getElementById('summaryList'),
  addToCart: document.getElementById('addToCart'),
  mobileAddToCart: document.getElementById('mobileAddToCart'),
  copyJson: document.getElementById('copyJson'),
  toast: document.getElementById('toast'),
  year: document.getElementById('year'),
  resetCamera: document.getElementById('resetCamera'),
  viewerLoading: document.getElementById('viewerLoading'),
  canvas: document.getElementById('productCanvas'),
  viewerShell: document.getElementById('viewerShell')
};

let renderer;
let scene;
let camera;
let controls;
let productGroup;
let loader;
let currentBaseRoot = null;
let keycapTemplate = null;
let selectionObjects = [];
let labelObjects = [];
let loadToken = 0;
let cameraWasFit = false;

init();

function init() {
  el.year.textContent = new Date().getFullYear();
  initTheme();
  initThree();
  buildStaticControls();
  bindEvents();
  renderAll();
  loadProduct();
}

function initTheme() {
  const saved = localStorage.getItem('ravenlab-theme');
  const theme = saved || 'dark';
  document.documentElement.dataset.theme = theme;
  el.themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
}

function initThree() {
  scene = new THREE.Scene();
  scene.background = null;

  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 2000);
  camera.position.set(65, 55, 85);

  renderer = new THREE.WebGLRenderer({ canvas: el.canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 20;
  controls.maxDistance = 260;
  controls.enablePan = false;

  productGroup = new THREE.Group();
  scene.add(productGroup);

  const ambient = new THREE.HemisphereLight(0xffffff, 0x16190f, 2.25);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 2.8);
  key.position.set(40, 70, 55);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x9cc03d, 1.7);
  rim.position.set(-60, 45, -40);
  scene.add(rim);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(120, 80),
    new THREE.MeshStandardMaterial({ color: 0x9cc03d, transparent: true, opacity: 0.055, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.2;
  scene.add(floor);

  loader = new GLTFLoader();
  resizeRenderer();
  window.addEventListener('resize', resizeRenderer);
  renderer.setAnimationLoop(renderScene);
}

function buildStaticControls() {
  renderSwitchCounts();
  renderSwatches(el.baseColorGrid, DATA.baseColors, state.baseColor, (id) => {
    state.baseColor = id;
    updateBaseMaterial();
    renderAll(false);
  });
  renderSwatches(el.keycapColorGrid, DATA.keycapColors, getPrimarySelectedKeycap().color, (id) => {
    applyToSelected({ color: id, type: 'plain' });
  });
  renderSwatches(el.letterColorGrid, DATA.keycapColors, getPrimarySelectedKeycap().color, (id) => {
    applyToSelected({ color: id, type: 'letter' });
  });
  renderKeycapTypes();
  renderLetters();
  renderTextColors();
  renderSpecials();
}

function bindEvents() {
  el.themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('ravenlab-theme', next);
    el.themeToggle.textContent = next === 'dark' ? '☀' : '☾';
  });

  el.selectAllSlots.addEventListener('click', () => {
    state.selectedSlots = Array.from({ length: state.switches }, (_, i) => i + 1);
    renderAll();
    rebuildKeycapsOnly();
  });

  el.clearSlots.addEventListener('click', () => {
    state.selectedSlots = [];
    renderAll();
    rebuildKeycapsOnly();
  });

  el.letterInput.addEventListener('change', () => applyToSelected({ type: 'letter', letter: el.letterInput.value }));
  el.textColorInput.addEventListener('change', () => applyToSelected({ type: 'letter', textColor: el.textColorInput.value }));

  el.addToCart.addEventListener('click', addToCart);
  el.mobileAddToCart.addEventListener('click', addToCart);
  el.copyJson.addEventListener('click', async () => {
    const payload = JSON.stringify(getConfiguration(), null, 2);
    await navigator.clipboard.writeText(payload);
    showToast('تم نسخ JSON للتكوين الحالي.');
  });

  el.resetCamera.addEventListener('click', () => fitCameraToProduct(true));
}

function renderSwitchCounts() {
  el.switchCountGrid.innerHTML = DATA.baseModels.map((item) => `
    <button type="button"
      class="choice-btn ${state.switches === item.count ? 'active' : ''} ${!item.available ? 'disabled' : ''}"
      data-count="${item.count}"
      ${!item.available ? 'disabled' : ''}
      title="${item.available ? item.file : `ارفع ملف base_${String(item.count).padStart(2, '0')}.glb لتفعيل الخيار`}">
      ${item.count}
    </button>
  `).join('');

  el.switchCountGrid.querySelectorAll('button:not(:disabled)').forEach((button) => {
    button.addEventListener('click', () => {
      state.switches = Number(button.dataset.count);
      state.selectedSlots = [1];
      renderAll();
      loadProduct();
    });
  });
}

function renderSwatches(container, colors, activeId, onClick) {
  container.innerHTML = colors.map((color) => `
    <button type="button" class="swatch ${color.id === activeId ? 'active' : ''}"
      style="--swatch:${color.hex}"
      data-color="${color.id}"
      aria-label="${color.name}"
      title="${color.name}"></button>
  `).join('');

  container.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => onClick(button.dataset.color));
  });
}

function renderKeycapTypes() {
  const selected = getPrimarySelectedKeycap();
  el.keycapTypeGrid.innerHTML = DATA.keycapTypes.map((type) => `
    <button type="button" class="seg-btn ${selected.type === type.id ? 'active' : ''}" data-type="${type.id}">
      <strong>${type.name}</strong><br><small>${type.description}</small>
    </button>
  `).join('');

  el.keycapTypeGrid.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => applyToSelected({ type: button.dataset.type }));
  });
}

function renderLetters() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  el.letterInput.innerHTML = letters.map((letter) => `<option value="${letter}">${letter}</option>`).join('');
}

function renderTextColors() {
  el.textColorInput.innerHTML = DATA.textColors.map((color) => `<option value="${color.id}">${color.name}</option>`).join('');
}

function renderSpecials() {
  const selected = getPrimarySelectedKeycap();
  el.specialGrid.innerHTML = DATA.specials.map((item) => `
    <button type="button" class="special-btn ${selected.special === item.id ? 'active' : ''}" data-special="${item.id}">
      <strong>${item.name}</strong>
      <small>+${formatPrice(item.price)}</small>
    </button>
  `).join('');

  el.specialGrid.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => applyToSelected({ type: 'special', special: button.dataset.special }));
  });
}

function renderSlotPicker() {
  const slots = Array.from({ length: state.switches }, (_, i) => i + 1);
  el.slotPicker.innerHTML = slots.map((slot) => {
    const keycap = state.keycaps[slot - 1];
    const label = keycap.type === 'letter' ? keycap.letter : keycap.type === 'special' ? specialById(keycap.special).name : 'سادة';
    return `
      <button type="button" class="slot-btn ${state.selectedSlots.includes(slot) ? 'active' : ''}" data-slot="${slot}">
        ${slot}<small>${label}</small>
      </button>
    `;
  }).join('');

  el.slotPicker.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      const slot = Number(button.dataset.slot);
      if (state.selectedSlots.includes(slot)) {
        state.selectedSlots = state.selectedSlots.filter((item) => item !== slot);
      } else {
        state.selectedSlots.push(slot);
        state.selectedSlots.sort((a, b) => a - b);
      }
      renderAll();
      rebuildKeycapsOnly();
    });
  });
}

function renderAll(rebuild = true) {
  renderSwitchCounts();
  renderSlotPicker();
  syncSelectedControls();
  updateSummary();
  if (rebuild && currentBaseRoot) rebuildKeycapsOnly();
}

function syncSelectedControls() {
  const selected = getPrimarySelectedKeycap();
  renderKeycapTypes();
  renderSwatches(el.keycapColorGrid, DATA.keycapColors, selected.color, (id) => applyToSelected({ color: id, type: 'plain' }));
  renderSwatches(el.letterColorGrid, DATA.keycapColors, selected.color, (id) => applyToSelected({ color: id, type: 'letter' }));
  renderSpecials();

  el.letterInput.value = selected.letter;
  el.textColorInput.value = selected.textColor;

  el.plainOptions.classList.toggle('hidden', selected.type !== 'plain');
  el.letterOptions.classList.toggle('hidden', selected.type !== 'letter');
  el.specialOptions.classList.toggle('hidden', selected.type !== 'special');
}

function applyToSelected(patch) {
  if (!state.selectedSlots.length) {
    showToast('حدد كيكاب واحد على الأقل أولًا.');
    return;
  }
  state.selectedSlots.forEach((slot) => {
    state.keycaps[slot - 1] = { ...state.keycaps[slot - 1], ...patch };
  });
  renderAll(false);
  rebuildKeycapsOnly();
}

async function loadProduct() {
  const token = ++loadToken;
  showLoading(true);
  productGroup.clear();
  currentBaseRoot = null;
  selectionObjects = [];
  labelObjects = [];
  cameraWasFit = false;

  try {
    const [baseGltf, keycapGltf] = await Promise.all([
      loadGLB(baseModelForCount(state.switches).file),
      keycapTemplate ? Promise.resolve({ scene: keycapTemplate }) : loadGLB(DATA.models.plainKeycap)
    ]);

    if (token !== loadToken) return;

    currentBaseRoot = baseGltf.scene;
    currentBaseRoot.name = `ravenlab_base_${state.switches}`;
    productGroup.add(currentBaseRoot);

    if (!keycapTemplate) keycapTemplate = keycapGltf.scene;

    updateBaseMaterial();
    rebuildKeycapsOnly();
    fitCameraToProduct(!cameraWasFit);
    showLoading(false);
  } catch (error) {
    console.error(error);
    showLoading(false);
    showToast('تعذر تحميل أحد ملفات GLB. تأكد من وجوده داخل assets/models.');
  }
}

function rebuildKeycapsOnly() {
  if (!currentBaseRoot || !keycapTemplate) return;
  const removable = productGroup.children.filter((child) => child.userData.dynamicKeycap);
  removable.forEach((child) => productGroup.remove(child));
  selectionObjects = [];
  labelObjects = [];

  for (let slot = 1; slot <= state.switches; slot += 1) {
    const keycap = state.keycaps[slot - 1];
    const slotObject = findSlotObject(slot);
    const slotPosition = slotObject ? getLocalSlotPosition(slotObject) : getFallbackSlotPosition(slot);
    const keycapObject = keycapTemplate.clone(true);
    keycapObject.userData.dynamicKeycap = true;
    keycapObject.userData.slot = slot;
    keycapObject.position.copy(slotPosition);

    applyKeycapMaterial(keycapObject, keycap);
    productGroup.add(keycapObject);

    if (keycap.type === 'letter') {
      const color = textColorById(keycap.textColor).hex;
      addLabel(slotPosition, keycap.letter, color, slot);
    }

    if (keycap.type === 'special') {
      const special = specialById(keycap.special);
      addLabel(slotPosition, special.icon, special.textColor, slot, true);
    }

    if (state.selectedSlots.includes(slot)) {
      addSelectionRing(slotPosition, slot);
    }
  }

  updateSummary();
}

function applyBaseMaterial(object) {
  const color = baseColorById(state.baseColor);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color.hex),
    roughness: 0.58,
    metalness: 0.02,
    clearcoat: 0.18,
    clearcoatRoughness: 0.38,
    transparent: Boolean(color.transparent),
    opacity: color.transparent ? 0.48 : 1
  });

  object.traverse((child) => {
    if (child.isMesh) {
      child.material = material.clone();
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

function updateBaseMaterial() {
  if (!currentBaseRoot) return;
  applyBaseMaterial(currentBaseRoot);
}

function applyKeycapMaterial(object, keycap) {
  let colorData = keycapColorById(keycap.color);
  let roughness = 0.45;
  let clearcoat = 0.22;

  if (keycap.type === 'special') {
    const special = specialById(keycap.special);
    colorData = { hex: special.color, transparent: false };
    roughness = keycap.special === 'oreo' ? 0.32 : 0.62;
    clearcoat = keycap.special === 'donut' ? 0.48 : 0.2;
  }

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colorData.hex),
    roughness,
    metalness: 0.01,
    clearcoat,
    clearcoatRoughness: 0.2,
    transparent: Boolean(colorData.transparent),
    opacity: colorData.transparent ? 0.52 : 1
  });

  object.traverse((child) => {
    if (child.isMesh) {
      child.material = material.clone();
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

function addLabel(position, text, color, slot, isSpecial = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.font = isSpecial ? '900 92px Arial' : '900 260px Arial';
  ctx.lineWidth = isSpecial ? 10 : 18;
  ctx.strokeStyle = color.toLowerCase() === '#ffffff' ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.22)';
  ctx.strokeText(text, 256, 260);
  ctx.fillText(text, 256, 260);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: true }));
  sprite.userData.dynamicKeycap = true;
  sprite.userData.label = true;
  sprite.userData.slot = slot;
  sprite.position.copy(position).add(new THREE.Vector3(0, 7.2, 0));
  sprite.scale.set(isSpecial ? 12 : 8.5, isSpecial ? 12 : 8.5, 1);
  productGroup.add(sprite);
  labelObjects.push(sprite);
}

function addSelectionRing(position, slot) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(6.8, 0.22, 16, 80),
    new THREE.MeshBasicMaterial({ color: 0x9cc03d, transparent: true, opacity: 0.95 })
  );
  ring.userData.dynamicKeycap = true;
  ring.userData.selection = true;
  ring.userData.slot = slot;
  ring.rotation.x = Math.PI / 2;
  ring.position.copy(position).add(new THREE.Vector3(0, 1.15, 0));
  productGroup.add(ring);
  selectionObjects.push(ring);
}

function findSlotObject(slot) {
  const padded = String(slot).padStart(2, '0');
  return currentBaseRoot.getObjectByName(`slot_${padded}`) || currentBaseRoot.getObjectByName(`slot_${slot}`);
}

function getLocalSlotPosition(slotObject) {
  const worldPosition = new THREE.Vector3();
  slotObject.getWorldPosition(worldPosition);
  return productGroup.worldToLocal(worldPosition.clone());
}

function getFallbackSlotPosition(slot) {
  const spacing = 20;
  const offset = ((state.switches - 1) * spacing) / 2;
  return new THREE.Vector3(0, 19, (slot - 1) * spacing - offset);
}

function fitCameraToProduct(force = false) {
  if (!force && cameraWasFit) return;
  cameraWasFit = true;

  const box = new THREE.Box3().setFromObject(productGroup);
  if (box.isEmpty()) return;
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const maxSize = Math.max(size.x, size.y, size.z, 28);
  const distance = maxSize * 2.25;

  camera.position.set(center.x + distance * 0.72, center.y + distance * 0.58, center.z + distance * 0.95);
  camera.near = Math.max(0.1, distance / 120);
  camera.far = distance * 8;
  camera.updateProjectionMatrix();
  controls.target.copy(center);
  controls.update();
}

function resizeRenderer() {
  const rect = el.viewerShell.getBoundingClientRect();
  const width = Math.max(320, rect.width);
  const height = Math.max(320, rect.height);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function renderScene() {
  selectionObjects.forEach((item) => {
    item.rotation.z += 0.01;
  });
  productGroup.rotation.y = THREE.MathUtils.lerp(productGroup.rotation.y, 0, 0.015);
  controls.update();
  renderer.render(scene, camera);
}

function loadGLB(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

function updateSummary() {
  const total = calculateTotal();
  el.totalPrice.textContent = `${formatPrice(total)} IQD`;
  el.mobileTotalPrice.textContent = `${formatPrice(total)} IQD`;

  const activeKeycaps = state.keycaps.slice(0, state.switches);
  const plainCount = activeKeycaps.filter((item) => item.type === 'plain').length;
  const letterCount = activeKeycaps.filter((item) => item.type === 'letter').length;
  const specialCount = activeKeycaps.filter((item) => item.type === 'special').length;
  const selectedText = state.selectedSlots.length ? state.selectedSlots.join('، ') : 'لا يوجد';

  el.summaryList.innerHTML = [
    ['عدد الأزرار', state.switches],
    ['لون القاعدة', baseColorById(state.baseColor).name],
    ['الأزرار المحددة', selectedText],
    ['كيكابات سادة', plainCount],
    ['كيكابات حروف', letterCount],
    ['كيكابات مميزة', specialCount],
    ['ملفات GLB المستخدمة', `base_${String(state.switches).padStart(2, '0')}.glb + keycap_plain.glb`]
  ].map(([label, value]) => `<div class="summary-item"><span>${label}</span><strong>${value}</strong></div>`).join('');
}

function calculateTotal() {
  const activeKeycaps = state.keycaps.slice(0, state.switches);
  const keycapExtras = activeKeycaps.reduce((sum, item) => {
    if (item.type === 'letter') return sum + DATA.prices.letterPrint;
    if (item.type === 'special') return sum + specialById(item.special).price;
    return sum;
  }, 0);
  return DATA.prices.base + state.switches * DATA.prices.perSwitch + keycapExtras;
}

function getConfiguration() {
  return {
    brand: 'RavenLab',
    product: 'Custom Switch Clicker',
    switches: state.switches,
    baseColor: baseColorById(state.baseColor).name,
    baseModel: `base_${String(state.switches).padStart(2, '0')}.glb`,
    keycaps: state.keycaps.slice(0, state.switches).map((item, index) => ({
      slot: index + 1,
      type: item.type,
      color: keycapColorById(item.color).name,
      letter: item.type === 'letter' ? item.letter : null,
      textColor: item.type === 'letter' ? textColorById(item.textColor).name : null,
      special: item.type === 'special' ? specialById(item.special).name : null,
      model: item.type === 'plain' || item.type === 'letter' ? 'keycap_plain.glb' : 'keycap_plain.glb placeholder'
    })),
    keychain: false,
    switchType: 'Default fixed switch',
    price: calculateTotal(),
    currency: 'IQD'
  };
}

function addToCart() {
  const payload = getConfiguration();
  const cart = JSON.parse(localStorage.getItem('ravenlab-cart') || '[]');
  cart.push(payload);
  localStorage.setItem('ravenlab-cart', JSON.stringify(cart));
  console.log('RavenLab cart item:', payload);
  showToast('تمت إضافة التصميم إلى السلة وحفظه كـ JSON.');
}

function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => el.toast.classList.remove('show'), 2600);
}

function showLoading(show) {
  el.viewerLoading.classList.toggle('done', !show);
}

function getPrimarySelectedKeycap() {
  const slot = state.selectedSlots[0] || 1;
  return state.keycaps[slot - 1];
}

function baseModelForCount(count) {
  return DATA.baseModels.find((item) => item.count === count) || DATA.baseModels[0];
}
function baseColorById(id) { return DATA.baseColors.find((item) => item.id === id) || DATA.baseColors[0]; }
function keycapColorById(id) { return DATA.keycapColors.find((item) => item.id === id) || DATA.keycapColors[0]; }
function textColorById(id) { return DATA.textColors.find((item) => item.id === id) || DATA.textColors[0]; }
function specialById(id) { return DATA.specials.find((item) => item.id === id) || DATA.specials[0]; }
function formatPrice(value) { return new Intl.NumberFormat('en-US').format(value); }
