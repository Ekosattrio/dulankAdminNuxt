---
title: Content Module
tags: [module, content]
status: verification-pending
updated: 2026-10-08
---

# Content

## Routes

`/all-blog`, `/blog-category`, `/blog-tag`, `/blog-comment`, `/faq`, `/faq-category`, `/our-client`, `/download-files`, `/footer`, `/banner`.

## Flow dan Logic

- Blog memakai category/tag relation, status publishing, author, image, dan content.
- Comment mengelola moderasi status.
- FAQ Question menyimpan pertanyaan, jawaban, kategori, urutan, dan status.
- FAQ Category route saat ini explicit empty state karena tidak ada legacy page; backend category sudah tersedia untuk kebutuhan FAQ.
- Our Client mendukung CRUD dan reorder; urutan harus persisten setelah reload.
- Download Files memisahkan folder/file metadata; binary upload nyata perlu storage object.
- Footer memisahkan configuration dan link records.
- Banner memisahkan main/product banner, status, jadwal, link, dan preview image.

## Verification Gate

Uji sanitasi content, image/file persistence, reorder, schedule banner, relationship category, empty-state decision, dan fidelity terhadap legacy/Netlify.
