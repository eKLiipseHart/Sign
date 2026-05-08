const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const charCount = document.getElementById('charCount');
const stylePackSelect = document.getElementById('stylePackSelect');
const colorWheel = document.getElementById('colorWheel');
const hexInput = document.getElementById('hexInput');
const insertCustomColor = document.getElementById('insertCustomColor');
const gradientText = document.getElementById('gradientText');
const gradientStart = document.getElementById('gradientStart');
const gradientEnd = document.getElementById('gradientEnd');

const stylePacks = {
    imperial: {
        templates: [
`#ff0000====================
#cc0000Imperial Checkpoint
#880000Authorized Personnel
#550000====================`,
`#ff0000+++ EMPIRE NETWORK +++
#ffffffSecurity Level Alpha
#aa0000Unauthorized Access Forbidden`
        ]
    },

    cyberpunk: {
        templates: [
`#00ffff/// Neon District ///
#ff00ff+++ Open All Night +++
#ffff00=== Vendors Active ===`,
`#00ffff>>> CYBERNET LIVE <<<
#ff00ffDigital Bazaar
#ffffffSlicers Welcome`
        ]
    },

    hutt: {
        templates: [
`#66ff00Jabba Exchange
#ffff00Rare Goods & Spice
#00ff00No Questions Asked`
        ]
    },

    rebel: {
        templates: [
`#00ccff=== Alliance Network ===
#ffffffEncrypted Communications
#00ffffFor Freedom`
        ]
    },

    corporate: {
        templates: [
`#00ccff>>>> GALACTIC FINANCE <<<<
#ffffffUpper Coruscant Division
#00ffffInvestment & Trade`
        ]
    },

    nightclub: {
        templates: [
`#ff00ff+++ Galaxy Pulse +++
#00ffffLive DJ Tonight
#ffffffVIP Lounge Upstairs`
        ]
    }
};

function sanitizeText(text) {
    text = text.replace(/[^\x20-\x7E\n]/g, '');
    if (text.length > 256)
        text = text.substring(0, 256);
    return text;
}

function renderPreview() {
    let text = sanitizeText(editor.value);
    editor.value = text;
    charCount.innerText = text.length;

    let html = text;

    html = html.replace(
        /#([0-9A-Fa-f]{6})(.*?)(?=#([0-9A-Fa-f]{6})|$)/gs,
        (match, color, content) => {
            return `<span style="color:#${color}">${content}</span>`;
        }
    );

    preview.innerHTML = html.replace(/\n/g, '<br>');
}

function insertAtCursor(field, text) {
    const start = field.selectionStart;
    const end = field.selectionEnd;

    field.value =
        field.value.substring(0, start) +
        text +
        field.value.substring(end);

    field.selectionStart =
        field.selectionEnd =
        start + text.length;

    field.focus();
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function rgbToHex(r, g, b) {
    return "#" +
        [r, g, b]
        .map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');
}

function generateLetterGradient(text, startHex, endHex) {
    const start = hexToRgb(startHex);
    const end = hexToRgb(endHex);
    let result = '';

    for (let i = 0; i < text.length; i++) {
        const ratio = i / Math.max(text.length - 1, 1);

        const r = Math.round(start.r + (end.r - start.r) * ratio);
        const g = Math.round(start.g + (end.g - start.g) * ratio);
        const b = Math.round(start.b + (end.b - start.b) * ratio);

        const hex = rgbToHex(r, g, b);
        result += `${hex}${text[i]}`;
    }

    return result;
}

editor.addEventListener('input', renderPreview);

document.querySelectorAll('.colorBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        insertAtCursor(editor, btn.dataset.color);
        renderPreview();
    });
});

document.querySelectorAll('.symbolBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        insertAtCursor(editor, btn.innerText);
        renderPreview();
    });
});

stylePackSelect.addEventListener('change', () => {
    const selected = stylePacks[stylePackSelect.value];
    if (!selected) return;

    const randomTemplate =
        selected.templates[
            Math.floor(Math.random() * selected.templates.length)
        ];

    editor.value = randomTemplate;
    renderPreview();
});

colorWheel.addEventListener('input', () => {
    hexInput.value = colorWheel.value;
});

hexInput.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hexInput.value)) {
        colorWheel.value = hexInput.value;
    }
});

insertCustomColor.addEventListener('click', () => {
    let value = hexInput.value;

    if (!value.startsWith('#'))
        value = '#' + value;

    if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
        alert('Invalid hex color');
        return;
    }

    insertAtCursor(editor, value);
    renderPreview();
});

document.getElementById('generateLetterGradient')
.addEventListener('click', () => {
    const text = gradientText.value.trim();
    if (!text) return;

    const output = generateLetterGradient(
        text,
        gradientStart.value,
        gradientEnd.value
    );

    editor.value = output;
    renderPreview();
});

document.getElementById('dividerBtn')
.addEventListener('click', () => {
    insertAtCursor(editor, '\n#ffff00====================\n');
    renderPreview();
});

document.getElementById('borderBtn')
.addEventListener('click', () => {
    const borders = [
        "====================",
        "++++++++++++++++++++",
        "////////////////////",
        "********************",
        "~~~~~~~~~~~~~~~~~~~~",
        ">>>>>>>>>>>>>>>>>>>>",
        "<<<<<<<<<<<<<<<<<<<<",
        "||||||||||||||||||||",
        "####################",
        "--------------------"
    ];

    const border =
        borders[Math.floor(Math.random() * borders.length)];

    insertAtCursor(editor, `\n#ffff00${border}\n`);
    renderPreview();
});

document.getElementById('copyBtn')
.addEventListener('click', async () => {
    await navigator.clipboard.writeText(editor.value);
    alert('Copied for SWG!');
});

/* ============================================================
   NEW STAR WARS RANDOM GENERATOR
   ============================================================ */

const randomThemes = [
    {
        name: "Imperial",
        templates: [
`#ff0000=== Imperial Notice ===
#cc0000Authorized Personnel Only
#880000Report Suspicious Activity`,

`#ff0000+++ EMPIRE NETWORK +++
#ffffffSector Patrol Active
#aa0000Glory to the Empire`
        ]
    },

    {
        name: "Rebel Alliance",
        templates: [
`#00ccff=== Alliance Outpost ===
#ffffffEncrypted Channel Active
#00ffffHope Lives`,

`#00ccff>>> REBEL NETWORK <<<
#ffffffSupply Drop Incoming
#00ffffStand Together`
        ]
    },

    {
        name: "Hutt Cartel",
        templates: [
`#66ff00Jabba's Exchange
#ffff00Spice & Rare Goods
#00ff00No Questions Asked`,

`#99ff00Hutt Territory
#ffff00Pay Your Tribute
#55aa00Trespassers Vanish`
        ]
    },

    {
        name: "Mandalorian",
        templates: [
`#ffaa00>>> Mandalorian Forge <<<
#ffffffThis Is The Way
#ffaa00Clan Honor Above All`,

`#ffaa00=== Mandalorian Outpost ===
#ffffffBeskar Trade Authorized
#ffaa00No Droids Allowed`
        ]
    },

    {
        name: "Sith",
        templates: [
`#ff0000+++ SITH SANCTUM +++
#aa0000Power Through Passion
#550000Fear Is Freedom`,

`#ff0000=== DARK SIDE ARCHIVE ===
#aa0000Knowledge Is Power
#550000Obey the Sith`
        ]
    },

    {
        name: "Jedi",
        templates: [
`#00ffff=== JEDI ENCLAVE ===
#ffffffPeace Through Knowledge
#00ccffThe Force Guides Us`,

`#00ffff>>> JEDI ARCHIVE <<<
#ffffffMeditation Chamber Active
#00ccffBalance Above All`
        ]
    },

    {
        name: "Cantina",
        templates: [
`#ff00ff+++ Mos Eisley Cantina +++
#00ffffLive Music Tonight
#ffffffNo Blasters`,

`#ff00ff=== OUTER RIM CANTINA ===
#00ffffDrinks & Sabacc
#ffffffSmugglers Welcome`
        ]
    }
];

document.getElementById('randomBtn')
.addEventListener('click', () => {
    const theme =
        randomThemes[Math.floor(Math.random() * randomThemes.length)];

    const template =
        theme.templates[Math.floor(Math.random() * theme.templates.length)];

    editor.value = template;
    renderPreview();
});

renderPreview();
