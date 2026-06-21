# RavenLab GLB Configurator

موقع ثابت جاهز لـ GitHub Pages لتجربة مصمم كليكر السويتشات باستخدام مجسمات GLB.

## الملفات المستخدمة الآن

ضع المجسمات داخل:

```text
assets/models/
```

الملفات الموجودة في هذه النسخة:

```text
base_01.glb
base_02.glb
base_03.glb
keycap_plain.glb
```

لذلك خيارات عدد الأزرار 1 و 2 و 3 مفعلة، أما 4 إلى 9 مقفلة مؤقتًا.

## لتفعيل 4 إلى 9

أضف الملفات التالية داخل `assets/models`:

```text
base_04.glb
base_05.glb
base_06.glb
base_07.glb
base_08.glb
base_09.glb
```

ثم افتح `app.js` وعدّل هذا السطر داخل `baseModels`:

```js
available: count <= 3
```

إلى:

```js
available: count <= 9
```

## ملاحظات مهمة

- لا تفتح `index.html` مباشرة بـ file:// لأن المتصفح قد يمنع تحميل ملفات GLB.
- للتجربة المحلية استخدم سيرفر بسيط:

```bash
python -m http.server 8000
```

ثم افتح:

```text
http://localhost:8000
```

## التخصيص الحالي

- عدد الأزرار: 1–3 مفعلة حاليًا.
- لون القاعدة.
- تحديد كيكاب واحد أو عدة كيكابات.
- كيكاب سادة.
- كيكاب بحرف إنجليزي.
- 3 أشكال مميزة مبدئية: Oreo, Donut, Cake.
- لا يوجد اختيار نوع سويتج.
- لا توجد ميدالية.
