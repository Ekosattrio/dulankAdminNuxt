# Framework Kerja dan Re-check AI

Dokumen ini adalah quality gate kanonik untuk setiap AI yang mengubah Dulank Admin. Tujuannya bukan menambah laporan panjang, tetapi memastikan klaim progres selalu dapat ditelusuri ke kode, flow, data, dan hasil pemeriksaan nyata.

Struktur layer yang diperiksa oleh quality gate ini adalah [Backend-Ready Vertical Slice (BRVS)](BACKEND_READY_VERTICAL_SLICE.md).
Standar decomposition UI yang wajib diperiksa bersama BRVS adalah [BRVS UI Decomposition Standard](UI_DECOMPOSITION_STANDARD.md).

## 1. Status yang Boleh Dipakai

| Status | Arti | Bukti minimum |
| --- | --- | --- |
| `not audited` | Belum dibandingkan dengan acuan. | Tidak boleh diklaim benar. |
| `audited` | Legacy/Netlify dan existing code sudah dipetakan. | Peta kolom, input/output, aksi, modal, data, dan gap. |
| `in progress` | Implementasi sedang berjalan. | File/flow yang sudah dan belum dikerjakan disebutkan. |
| `implemented, verification pending` | Kode utama tersedia, tetapi verifikasi penuh belum selesai. | Bukti layer UI/API/data dan daftar validasi yang belum dijalankan. |
| `verified` | Flow dalam scope sudah diperiksa dengan validasi yang relevan. | Hasil command dan/atau browser flow yang spesifik. |
| `approved baseline` | Pengguna menyetujui hasil sebagai acuan regresi. | Persetujuan pengguna dan dokumentasi batas regresi. |

AI tidak boleh menaikkan status langsung menjadi `approved baseline`. Status itu membutuhkan keputusan pengguna.

## 2. Siklus Wajib: Check, Implement, Re-check

### Gate A - Context Check

Sebelum edit:

1. Baca `AGENTS.md`, dokumen kanonik terkait, dan status modul terbaru.
2. Periksa working tree secara read-only dan jangan membatalkan perubahan yang bukan milik tugas.
3. Tetapkan scope menu/route dan larangan pengguna, termasuk build/dev/Git.
4. Baca legacy HTML, script, partial, dan URL referensi bila tersedia.
5. Cari reusable existing sebelum merancang komponen baru.
6. Buat Architecture Evidence Matrix BRVS; keberadaan file harus dibedakan dari layer yang benar-benar terhubung.
7. Buat UI Responsibility Map; page tipis dan keberadaan Workspace tidak boleh dianggap sebagai bukti decomposition.

Output internal Gate A adalah daftar `expected`: tampilan, input, output, relasi data, aksi, dan validasi yang seharusnya ada.

### Gate B - Implementation Check

Selama implementasi, telusuri satu vertical slice dari ujung ke ujung:

```text
UI -> composable -> API -> server validation/domain helper -> persistence -> response -> UI reload
```

Untuk setiap flow mutasi, pastikan record terpilih, payload, validasi, penyimpanan, feedback, dan reload memakai sumber data yang sama. Setelah mengubah shared component/utility, cari seluruh pemakainya dan nilai blast radius sebelum melanjutkan.

### Gate C - First Re-check

Setelah edit, bandingkan hasil dengan daftar `expected` dari Gate A:

- label dan urutan kolom;
- input Add/Edit versus output turunan;
- modal, submodal, tombol, dan kondisi tampil;
- relasi foreign key dan sumber nilai agregat;
- pemakaian reusable, tipografi, ikon, filter, currency, dan print;
- empty, loading, error, busy, disabled, serta responsive state.

Re-check ini harus membaca ulang file akhir, bukan hanya mengandalkan ingatan saat menulis patch.

### Gate D - Adversarial Re-check

Lakukan pemeriksaan kedua dengan asumsi implementasi masih salah:

1. Cari hardcoded/local dummy yang melewati API.
2. Cari flow sukses palsu, timeout, atau state lokal yang tidak tersimpan.
3. Cari field output yang keliru dijadikan input.
4. Cari ID/foreign key tidak valid, uang string, GET yang menulis data, dan JSON yang belum dibundel.
5. Cari duplikasi komponen/fungsi yang seharusnya reusable.
6. Cari mismatch nama komponen, warning Vue, atribut aksesibilitas, dan ikon/style yang menyimpang.
7. Untuk shared change, periksa sampel pemakai dari lebih dari satu menu.
8. Cari page monolitik, request domain langsung dari page, API route berisi domain logic besar, serta Add/Edit yang menduplikasi form.
9. Buka child component dan cari Workspace/Screen monolitik yang hanya memindahkan masalah dari page.

Temuan Gate D harus diperbaiki atau dicatat sebagai risiko terbuka. Jangan disembunyikan dengan klaim umum.

### Gate E - Validation and Evidence

Jalankan validasi yang diizinkan dan relevan. Catat perintah, hasil, dan cakupannya. Bedakan:

- `passed`: benar-benar dijalankan dan lulus;
- `failed - in scope`: wajib diperbaiki sebelum klaim verified;
- `failed - pre-existing/out of scope`: sertakan bukti file/error;
- `not run`: sebutkan alasan, misalnya larangan pengguna.

Build tidak membuktikan flow browser. Parse SFC tidak membuktikan persistensi. Screenshot tidak membuktikan validasi server. Klaim harus seukuran bukti.

### Gate F - Progress Sync

Sebelum laporan akhir:

1. Cocokkan status dokumentasi dengan implementasi aktual.
2. Perbarui changelog dan dokumen status hanya bila scope/status memang berubah.
3. Catat reusable baru, flow selesai, validasi, batas verifikasi, dan next check.
4. Pastikan tidak ada dua dokumen yang memberi status berbeda; `AI_HANDOVER_GUIDE.md` tetap kanonik untuk status modul.
5. Catat branch, commit status, push status, dan remote verification di changelog. Default setiap perubahan yang belum dikomit adalah `NOT COMMITTED` / `NOT PUSHED`.

## 3. Evidence Matrix

Gunakan format ini pada pekerjaan menu yang substansial:

| Area | Expected | Evidence | Result | Remaining check |
| --- | --- | --- | --- | --- |
| Legacy/UI | Kolom, form, modal, aksi | File legacy + komponen final | pass/gap | Browser desktop/mobile |
| Data | Type, PK/FK, numeric money | Types + JSON + domain helper | pass/gap | Integrity audit |
| API | Read/mutation/validation | Endpoint + utility | pass/gap | Request tests |
| Flow | Add/Edit/View/Delete/reload | Composable + handler | pass/gap | Browser persistence |
| Shared UI | Existing reusable used | Import/usage search | pass/gap | Cross-menu regression |
| Architecture | Seluruh layer BRVS terhubung | Path page/component/composable/API/service/data | pass/gap | Structural review |
| UI decomposition | Page, orchestrator, dan child components punya satu tanggung jawab | Responsibility map + line/logic audit | pass/gap | Split oversized component |
| Validation | Commands/browser checks | Output aktual | pass/fail/not run | Follow-up |

Matrix boleh disimpan di catatan modul atau diringkas di handover. Jangan mengisi `pass` tanpa evidence yang dapat ditunjuk.

## 4. Definition of Done

Pekerjaan baru boleh disebut `verified` bila:

- scope dan expected behavior jelas;
- implementasi akhir sudah melalui dua kali re-check;
- flow utama dalam scope ditelusuri end-to-end;
- shared impact diperiksa;
- validasi relevan lulus atau keterbatasannya dinyatakan;
- dokumentasi progres cocok dengan kode;
- tidak ada klaim yang lebih luas daripada bukti.
- Architecture Evidence Matrix BRVS tidak memiliki gap pada layer wajib.
- UI Responsibility Evidence tidak memiliki monolithic Workspace atau component yang belum dijustifikasi.
- changelog dan handover mencatat delivery state Git secara jujur.

Jika build/dev/browser dilarang, hasil maksimal umumnya `implemented, verification pending`, kecuali tugasnya murni dokumentasi atau pemeriksaan statis yang memang lengkap tanpa runtime.

## 5. Format Laporan AI

```text
Scope:
Changed:
Reusable used/created:
Check 1 (expected vs implementation):
Check 2 (failure/regression search):
Validation passed:
Validation not run/failed:
Status after work:
Git branch / commit status:
Push status / remote verification:
Remaining risks / next check:
```

Jawaban akhir boleh ringkas, tetapi isi tersebut tidak boleh hilang untuk perubahan substansial.

## 6. Delivery Record Git

- `NOT COMMITTED`: perubahan masih berada di working tree.
- `COMMITTED <hash>`: commit lokal benar-benar tersedia.
- `NOT PUSHED`: perubahan belum terbukti berada di remote.
- `PUSHED`: hanya setelah `git push` berhasil dan remote branch menunjuk commit yang dimaksud.
- `UNKNOWN`: remote tidak dapat diperiksa; jangan menebak.

AI tetap dilarang menjalankan `git add`, commit, push, pull, merge, rebase, checkout, atau operasi Git mutating tanpa instruksi eksplisit pengguna. Delivery record adalah kewajiban dokumentasi, bukan izin Git.

