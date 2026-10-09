---
title: Setting Module
tags: [module, setting]
status: verification-pending
updated: 2026-10-08
---

# Setting

## Routes

`/profile`, `/company-setting`, `/province`, `/regency`, `/district`, `/invoice-setting`, `/invoice-template`, `/pos-settings`, `/email-setting`, `/language`, `/otp`, `/prefixes`.

## Flow dan Logic

- Profile dan Company Setting membaca konfigurasi, menampilkan preview aset, lalu menyimpan perubahan melalui API.
- Province -> Regency -> District adalah relasi bertingkat; pilihan parent membatasi child.
- Invoice/POS settings menyimpan konfigurasi dan menampilkan live preview, bukan transaksi nyata.
- Email Setting menyimpan konfigurasi. Send Test Email saat ini simulasi API, bukan pengiriman SMTP nyata.
- OTP menyimpan konfigurasi gateway dan preview pesan.
- Prefixes mengatur nomor dokumen; perubahan prefix tidak boleh mengubah nomor historis.
- Language memakai API dan data server, tabel kolom legacy, Add/Settings, toggle RTL/status, import/export object translation JSON, progress server-side, serta shared Print/PDF. Statusnya tetap verification pending sampai flow browser dan reload persistence diuji.
- Invoice Template tetap explicit empty state dan tidak boleh disebut fitur lengkap.

## Data

Source berada di `server/data/*settings.json`, location JSON, profile, language, `language-translations.json`, dan prefixes. Mutasi deploy memerlukan durable storage.

## Verification Gate

Cascading location, upload preview, reload persistence, prefix behavior, responsive modal, dan perbedaan antara simulasi dengan integrasi nyata harus diperiksa.
