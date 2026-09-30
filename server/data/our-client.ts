// Mock data untuk halaman /our-client (dipindah dari app/pages/our-client.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const clients = [
  { id: 1, name: "Google Partner", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { id: 2, name: "YouTube Print", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" },
  { id: 3, name: "Microsoft 365", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { id: 4, name: "Amazon Media", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { id: 5, name: "Netflix Studio", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { id: 6, name: "Spotify Music", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
  {
    id: 7,
    name: "Adobe Creative",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg",
  },
  { id: 8, name: "Intel Tech", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%29.svg" },
  { id: 9, name: "Cisco Networks", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" },
  { id: 10, name: "Oracle Cloud", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
  {
    id: 11,
    name: "Heidelberg Press",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/Heidelberger_Druckmaschinen_logo.svg",
  },
  { id: 12, name: "Canon Solutions", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Canon_wordmark.svg" },
]
