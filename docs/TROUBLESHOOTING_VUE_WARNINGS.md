# Troubleshooting Vue Component Warnings

Dokumen ini mencatat warning Vue yang pernah muncul di Dulank Admin serta pola perbaikannya. Jangan menutupi warning dengan `compilerOptions.isCustomElement` jika tag tersebut sebenarnya komponen Vue lokal.

## Failed to resolve component: `Pages...`

Contoh warning:

```text
Failed to resolve component: PagesVariantTable
Failed to resolve component: PagesVariantModal
```

### Penyebab

`nuxt.config.ts` memakai:

```ts
components: [{ path: '~/components', pathPrefix: false }]
```

Dengan `pathPrefix: false`, nama auto-import mengikuti **basename file**, bukan struktur folder. Maka:

- `app/components/Variant/VariantTable.vue` menjadi `VariantTable`.
- `app/components/Variant/VariantModal.vue` menjadi `VariantModal`.
- Nuxt tidak otomatis membuat nama `PagesVariantTable` atau `PagesVariantModal`.

### Perbaikan yang benar

Gunakan nama basename atau import eksplisit:

```vue
<script setup lang="ts">
import VariantTable from '~/components/Variant/VariantTable.vue'
import VariantModal from '~/components/Variant/VariantModal.vue'
</script>
```

Jika nama `Pages...` diperlukan untuk kompatibilitas atau menghindari benturan, gunakan alias eksplisit:

```ts
import PagesVariantTable from '~/components/Variant/VariantTable.vue'
```

Jangan mengubah komponen lokal menjadi custom element. `isCustomElement` hanya untuk web component/native element yang memang bukan komponen Vue.

### Audit

Setiap tag `Pages...` harus memiliki import eksplisit dengan nama yang sama. Audit 2026-10-08 memperbaiki Variant serta potensi warning pada Category, Sub Category, Unit, Designation, Expense, Expense Category, Income, Incentive, Paper Size, dan Paper Price.

## Extraneous non-props attributes pada Fragment

Contoh warning:

```text
Extraneous non-props attributes (class) were passed to component but could not be automatically inherited because component renders fragment...
```

### Penyebab

`AppSidebar.vue` memiliki dua root node: elemen `<aside>` dan backdrop mobile. Layout mengirim `class="print:hidden"`. Karena root-nya fragment, Vue tidak tahu atribut tersebut harus diterapkan ke root yang mana.

### Perbaikan yang benar

Matikan pewarisan otomatis dan teruskan `$attrs` ke elemen yang memang menjadi target:

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <aside v-bind="$attrs">...</aside>
  <div v-if="open">...</div>
</template>
```

Jangan menambahkan wrapper hanya untuk menghilangkan warning jika wrapper dapat merusak `fixed`, flex layout, teleport, stacking context, atau perilaku overlay.

## Checklist AI

1. Pastikan file komponen benar-benar ada.
2. Periksa `components.pathPrefix` di `nuxt.config.ts`.
3. Cocokkan nama tag dengan basename atau import alias eksplisit.
4. Untuk komponen multi-root, tentukan root yang harus menerima `$attrs`.
5. Jangan memakai `isCustomElement` untuk menyembunyikan komponen Vue yang gagal ditemukan.
6. Parse/compile SFC yang diubah dan audit ulang tag `Pages...` tanpa import.
