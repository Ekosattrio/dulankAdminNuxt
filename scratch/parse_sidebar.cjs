const fs = require("fs");

const lines = fs.readFileSync("components/sidebar.html", "utf8").split("\n");

const groups = [];
let currentGroup = null;
let currentSubmenu = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Group header: <h6 class="submenu-hdr">DASHBOARD</h6>
  const hdrMatch = line.match(/<h6 class="submenu-hdr">([^<]+)<\/h6>/);
  if (hdrMatch) {
    currentGroup = { header: hdrMatch[1].trim(), items: [] };
    groups.push(currentGroup);
    currentSubmenu = null;
    continue;
  }

  if (!currentGroup) continue;

  // Single item start: <li class="menu-tunggal">
  if (line.includes('class="menu-tunggal"')) {
    // Look ahead for href and title and icon
    let chunk = line;
    let j = i;
    while (!chunk.includes("</li>") && j < lines.length - 1) {
      j++;
      chunk += " " + lines[j].trim();
    }
    const linkMatch = chunk.match(/href="([^"]+)"/);
    const iconMatch = chunk.match(/data-feather="([^"]+)"/);
    const spanMatch = chunk.match(/<span>([^<]+)<\/span>/);
    let title = spanMatch ? spanMatch[1].trim() : "";
    if (!title) {
      // maybe without span or weird closing
      const textMatch = chunk.match(/<a[^>]*>(?:<i[^>]*><\/i>)?\s*<span>\s*([^<]+)/);
      if (textMatch) title = textMatch[1].trim();
    }
    let url = linkMatch ? linkMatch[1] : "";
    let to = url.replace(".html", "");
    if (to === "") to = "/";
    else if (!to.startsWith("/")) to = "/" + to;

    currentGroup.items.push({
      title: title.replace(/\s+/g, " "),
      icon: iconMatch ? iconMatch[1] : "",
      to: to,
    });
    i = j;
    continue;
  }

  // Submenu start: <li class="submenu
  if (line.includes('<li class="submenu') && !line.includes("submenu-open")) {
    // Look ahead until <ul> that contains child items
    let chunk = line;
    let j = i;
    while (!chunk.includes("<ul>") && j < lines.length - 1) {
      j++;
      chunk += " " + lines[j].trim();
    }
    const iconMatch = chunk.match(/data-feather="([^"]+)"/);
    const spanMatch = chunk.match(/<span>([^<]+)<\/span>/);
    let title = spanMatch ? spanMatch[1].trim() : "";

    currentSubmenu = {
      title: title,
      icon: iconMatch ? iconMatch[1] : "",
      submenus: [],
    };
    currentGroup.items.push(currentSubmenu);
    i = j;
    continue;
  }

  // Submenu child item: <li><a href="...">...</a></li>
  if (
    (currentSubmenu && line.includes("<li><a")) ||
    (currentSubmenu && line.includes("<li>") && lines[i + 1] && lines[i + 1].includes("<a"))
  ) {
    let chunk = line;
    let j = i;
    while (!chunk.includes("</li>") && j < lines.length - 1) {
      j++;
      chunk += " " + lines[j].trim();
    }
    const linkMatch = chunk.match(/href="([^"]+)"/);
    let title = "";
    const spanMatch = chunk.match(/<span>([^<]+)<\/span>/);
    if (spanMatch) {
      title = spanMatch[1].trim();
    } else {
      const aMatch = chunk.match(/<a[^>]*>([^<]+)<\/a>/);
      if (aMatch) title = aMatch[1].trim();
    }
    let url = linkMatch ? linkMatch[1] : "";
    let to = url.replace(".html", "");
    if (to === "") to = "/";
    else if (!to.startsWith("/")) to = "/" + to;

    if (title && url) {
      currentSubmenu.submenus.push({
        title: title.replace(/\s+/g, " "),
        to: to,
      });
    }
    i = j;
    continue;
  }

  // Submenu end: </ul></li>
  if (currentSubmenu && (line.includes("</ul>") || line.includes("</li>"))) {
    // If we hit closing ul, currentSubmenu might end
    if (line.includes("</ul>")) {
      currentSubmenu = null;
    }
  }
}

fs.writeFileSync("scratch/parsed_groups.json", JSON.stringify(groups, null, 2));
console.log("Parsed", groups.length, "groups successfully.");
