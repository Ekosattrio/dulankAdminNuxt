// Mock data untuk halaman /cetak-full-color (dipindah dari app/pages/cetak-full-color.vue)
// Dikonsumsi oleh server/api/cetak-full-color.ts

export const products = [
  {
    id: '1',
    name: 'Brosur',
    defaultSize: 'A4 (297x210mm) (Default), A5 (210x149mm)',
    paperTypes: 'Art Paper 150gr, Art Paper 120gr',
    machine: 'SM 52 4 Warna',
    active: true,
    image: '/assets/img/products/brosur.png'
  },
  {
    id: '2',
    name: 'Kartu Nama',
    defaultSize: '90x54mm (Default)',
    paperTypes: 'Art Carton 260gr',
    machine: 'Digital Press Fuji Xerox',
    active: true,
    image: '/assets/img/products/pos-product-01.png'
  },
  {
    id: '3',
    name: 'Flyer',
    defaultSize: 'A5 (210x148mm) (Default), DL (210x99mm)',
    paperTypes: 'Art Paper 120gr, HVS 80gr',
    machine: 'SM 52 4 Warna',
    active: true,
    image: '/assets/img/products/pos-product-04.png'
  },
  {
    id: '4',
    name: 'Kalender Meja',
    defaultSize: '210x150mm Horizontal',
    paperTypes: 'Art Carton 230gr, Board No. 30',
    machine: 'Komori Lithrone 4 Warna',
    active: false,
    image: '/assets/img/products/pos-product-10.png'
  }
]

