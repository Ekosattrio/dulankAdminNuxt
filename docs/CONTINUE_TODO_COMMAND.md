# Command: Lanjutkan TODO

Dokumen ini adalah kontrak operasional saat pengguna memberi perintah singkat:

```text
lanjutkan todo
```

Perintah tersebut berarti: baca status kanonik, pilih pekerjaan prioritas tertinggi yang benar-benar dapat dikerjakan, selesaikan satu batch dengan batas jelas, verifikasi hasilnya, lalu sinkronkan progres. Perintah ini **bukan** izin untuk melewati dokumen acuan, mengerjakan seluruh backlog sekaligus, menjalankan Git mutating, atau menaikkan status tanpa evidence.

## 1. Perintah yang Didukung

| Perintah pengguna | Perilaku wajib AI |
| --- | --- |
| `lanjutkan todo` | Pilih satu batch actionable dari prioritas tertinggi pada Master TODO kanonik. |
| `lanjutkan todo P1` | Pilih satu batch actionable hanya dari prioritas P1. |
| `lanjutkan todo menu Promo` | Fokus pada TODO dan gap yang berhubungan dengan menu Promo. |
| `lanjutkan todo parity action modal` | Pilih satu menu yang belum memiliki parity evidence lalu audit dan tutup action/modal-nya. |
| `lanjutkan todo satu batch tanpa build/dev` | Kerjakan satu batch, jangan menjalankan build/dev, dan catat keduanya sebagai not run. |
| `cek todo saja` | Audit read-only dan laporkan status; jangan mengubah source atau dokumentasi. |

Nama prioritas/menu dari pengguna selalu mengalahkan pemilihan otomatis. Instruksi terbaru pengguna juga mengalahkan default dokumen ini selama tidak melanggar perlindungan data/repository pada `AGENTS.md`.

## 2. Urutan Baca Wajib

Sebelum memilih atau mengubah TODO:

1. Baca `AGENTS.md`.
2. Baca `docs/CODEBASE_COMPLIANCE_AUDIT_2026-10-09.md`, terutama Status Kanonik, Protokol Wajib, Master TODO, backlog, dan Delivery Record.
3. Baca `docs/AI_WORK_QUALITY_FRAMEWORK.md`.
4. Baca `docs/BACKEND_READY_VERTICAL_SLICE.md` dan `docs/UI_DECOMPOSITION_STANDARD.md`.
5. Baca `docs/PAGE_CLEANLINESS_AND_STATUS_MATRIX.md` sebagai inventory, bukan sumber klaim verified lama.
6. Baca `docs/obsidian-vault/00-HOME.md`, flow, business rules, data/Netlify, client revisions, dan dokumen modul yang sesuai scope.
7. Jika batch menyentuh menu, ikuti `docs/MENU_IMPLEMENTATION_COMMAND.md`, source aktif, legacy HTML/script/partial/aset, dan halaman Netlify terkait.
8. Baca `docs/LEGACY_ACTION_MODAL_PARITY.md`; untuk scope menu, inventarisasi seluruh trigger, modal/submodal, field, dan efek backend.
9. Baca standar khusus yang relevan, termasuk tipografi, ikon, Vue warning, print, reusable component, dan aturan relasional/numeric money.

AI tidak boleh memilih TODO hanya dari satu baris checkbox. Source aktif dan evidence aktual menentukan apakah gap masih ada.

## 3. Algoritma Pemilihan Otomatis

Untuk command `lanjutkan todo` tanpa parameter:

1. Jalankan pemeriksaan Git read-only: branch, working tree, upstream, dan HEAD. Jangan mengubah state Git.
2. Periksa apakah ada perubahan pengguna yang belum dikomit. Pertahankan dan kerjakan bersamanya; jangan reset, restore, clean, atau menimpa.
3. Baca checkbox terbuka berurutan dari P0, P1, P2, lalu P3.
4. Lewati sementara item yang benar-benar membutuhkan keputusan pengguna, provenance aset, kredensial, layanan eksternal, atau runtime yang dilarang. Catat sebagai `blocked`, bukan selesai.
5. Pilih item actionable pertama. Untuk item gabungan, pilih menu/route pertama yang belum selesai berdasarkan urutan pada audit/backlog, kecuali ada batch parsial yang sudah berjalan dan lebih aman diselesaikan lebih dulu.
6. Batasi scope ke satu menu, satu vertical slice, atau satu kelompok file yang saling bergantung. Jangan melakukan refactor seluruh codebase dalam satu batch.
7. Nyatakan scope, evidence awal, risiko, dan kriteria selesai sebelum edit.

P0 yang blocked tidak membuat seluruh command berhenti. AI tetap boleh mengerjakan P1/P2 yang actionable, tetapi dilarang menaikkan status akhir menjadi `verified` selama gate yang diwajibkan belum hijau.

## 4. Siklus Eksekusi Wajib

Setiap batch menjalankan urutan berikut:

1. **Context Check:** petakan route aktif, layer BRVS, UI Responsibility Map, Legacy Action and Modal Parity Matrix, legacy/Netlify, kontrak data, relasi, dan reusable yang tersedia.
2. **Implementation:** ubah hanya scope batch. Page tetap composition layer; request melalui composable; API tipis; validasi/persistensi di service/repository server.
3. **First Re-check:** periksa flow normal, type contract, props/emits, endpoint, data, filter, modal, print, dan status UI.
4. **Adversarial Re-check:** cari invalid payload, empty data, missing relation, reload loss, duplicate ID, overflow mobile, stale state, warning console, dan regresi reusable.
5. **Evidence:** jalankan validasi yang diizinkan dan catat command serta hasil aktual. Typecheck tidak menggantikan runtime evidence.
6. **Progress Sync:** perbarui hanya status yang terbukti pada audit, handover, module status, matrix/inventory terkait, dan changelog.

Build/dev tidak dijalankan bila pengguna melarangnya. Larangan tersebut harus ditulis sebagai `not run`, dan status runtime tetap `verification pending`.

## 5. Aturan Status TODO

- Checkbox hanya boleh menjadi `[x]` bila seluruh kalimat item selesai.
- Pekerjaan sebagian dicatat sebagai evidence/progress parsial tanpa mencentang item induk.
- `implemented` berarti kode tersedia dan rantainya terhubung.
- `static verification passed` berarti pemeriksaan statis yang disebutkan benar-benar lulus.
- `runtime verified` membutuhkan browser/runtime/persistence evidence.
- `approved baseline` hanya berasal dari persetujuan pengguna dan bukan sinonim runtime verified.
- Blocker tidak boleh diselesaikan dengan data, aset, relasi, hash, atau hasil pengujian buatan.

## 6. Git dan Delivery Record

- Command `lanjutkan todo` tidak memberi izin `git add`, `commit`, `push`, `pull`, `merge`, `rebase`, `switch`, `checkout`, `reset`, `restore`, atau `clean`.
- Git mutating hanya dijalankan setelah instruksi eksplisit pengguna.
- Setiap batch wajib mencatat branch, baseline HEAD, commit status, push status, validasi yang dijalankan/tidak dijalankan, blocker, dan risiko tersisa.
- Default setelah AI mengedit adalah `NOT COMMITTED / NOT PUSHED`.
- Catatan historis tidak ditimpa. Tambahkan outcome baru ketika commit/push kemudian benar-benar terjadi.

## 7. Format Laporan Akhir

Laporan akhir command `lanjutkan todo` minimal menjawab:

```text
Batch yang dikerjakan:
Selesai diimplementasikan:
Evidence statis:
Evidence runtime:
Belum selesai / blocker:
TODO berikutnya:
Commit status:
Push status:
```

Jangan melaporkan seluruh menu selesai bila yang ditutup hanya satu route, satu modal, satu API, atau satu tahap decomposition.

## 8. Kondisi Kanonik Saat Dokumen Dibuat

Pada 2026-10-09, batch implementasi terakhir berada pada commit `1bf2eac7f22003f0db37da53261db51f10a07dfa` dan sudah `PUSHED` ke `origin/eko`. Perubahan dokumentasi setelah commit tersebut tetap mengikuti status working tree aktual. Daftar TODO hidup tetap berada di `docs/CODEBASE_COMPLIANCE_AUDIT_2026-10-09.md`; bagian ini bukan salinan status dan tidak boleh dipakai untuk menghindari audit terbaru.
