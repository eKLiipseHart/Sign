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

/* ============================================================
   STYLE PACKS — NOW ESCAPED
   ============================================================ */

const stylePacks = {
    imperial: {
        templates: [
`\\#FF0000====================
\\#CC0000Imperial Checkpoint
\\#880000Authorized Personnel
\\#550000====================`,
`\\#FF0000+++ EMPIRE NETWORK +++
\\#FFFFFFSecurity Level Alpha
\\#AA0000Unauthorized Access Forbidden`
        ]
    },

    cyberpunk: {
        templates: [
`\\#00FFFF/// Neon District ///
\\#FF00FF+++ Open All Night +++
\\#FFFF00=== Vendors Active ===`,
`\\#00FFFF>>> CYBERNET LIVE <<<
\\#FF00FFDigital Bazaar
\\#FFFFFFSlicers Welcome`
        ]
    },

    hutt: {
        templates: [
`\\#66FF00Jabba Exchange
\\#FFFF00Rare Goods & Spice
\\#00FF00No Questions Asked`
        ]
    },

    rebel: {
        templates: [
`\\#00CCFF=== Alliance Network ===
\\#FFFFFFEncrypted Communications
\\#00FFFFFor Freedom`
        ]
    },

    corporate: {
        templates: [
`\\#00CCFF>>>> GALACTIC FINANCE <<<<
\\#FFFFFFUpper Coruscant Division
\\#00FFFFInvestment & Trade`
        ]
    },

    nightclub: {
        templates: [
`\\#FF00FF+++ Galaxy Pulse +++
\\#00FFFFLive DJ Tonight
\\#FFFFFFVIP Lounge Upstairs`
        ]
    }
};

/* ============================================================
   SANITIZE + PREVIEW RENDERER
   ============================================================ */

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

    // Supports both "#RRGGBB" and "\#RRGGBB"
    html = html.replace(
    /(\\)?#([0-9A-Fa-f]{6})(.*?)(?=(\\)?#[0-9A-Fa-f]{6}|$)/gs,
    (match, slash, color, content) => {
        return `<span style="color:#${color}">${content}</span>`;
    }
);

    preview.innerHTML = html.replace(/\n/g, '<br>');
}

/* ============================================================
   INSERT HELPERS
   ============================================================ */

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

/* ============================================================
   COLOR UTILITIES
   ============================================================ */

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

/* ============================================================
   GRADIENT GENERATOR — ESCAPED FORMAT
   ============================================================ */

function generateLetterGradient(text, startHex, endHex) {
    const start = hexToRgb(startHex);
    const end = hexToRgb(endHex);
    let result = '';

    for (let i = 0; i < text.length; i++) {
        const ratio = i / Math.max(text.length - 1, 1);

        const r = Math.round(start.r + (end.r - start.r) * ratio);
        const g = Math.round(start.g + (end.g - start.g) * ratio);
        const b = Math.round(start.b + (end.b - start.b) * ratio);

        const hex = rgbToHex(r, g, b).toUpperCase();

        result += `\\${hex}${text[i]}`;
    }

    return result;
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */

editor.addEventListener('input', renderPreview);

/* COLOR BUTTONS — ESCAPED */
document.querySelectorAll('.colorBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        insertAtCursor(editor, "\\" + btn.dataset.color.toUpperCase());
        renderPreview();
    });
});

/* SYMBOL BUTTONS */
document.querySelectorAll('.symbolBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        insertAtCursor(editor, btn.innerText);
        renderPreview();
    });
});

/* STYLE PACK SELECT */
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

/* CUSTOM COLOR PICKER — ESCAPED */
colorWheel.addEventListener('input', () => {
    hexInput.value = colorWheel.value;
});

hexInput.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hexInput.value)) {
        colorWheel.value = hexInput.value;
    }
});

insertCustomColor.addEventListener('click', () => {
    let value = hexInput.value.toUpperCase();

    if (!value.startsWith('#'))
        value = '#' + value;

    if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
        alert('Invalid hex color');
        return;
    }

    insertAtCursor(editor, "\\" + value);
    renderPreview();
});

/* GRADIENT BUTTON */
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

/* DIVIDER — ESCAPED */
document.getElementById('dividerBtn')
.addEventListener('click', () => {
    insertAtCursor(editor, '\n\\#FFFF00====================\n');
    renderPreview();
});

/* BORDER — ESCAPED */
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

    insertAtCursor(editor, `\n\\#FFFF00${border}\n`);
    renderPreview();
});

/* COPY BUTTON */
document.getElementById('copyBtn')
.addEventListener('click', async () => {
    await navigator.clipboard.writeText(editor.value);
    alert('Copied for SWG!');
});

/* ============================================================
   RANDOM STAR WARS THEMES — ESCAPED
   ============================================================ */

const randomThemes = [
    {
        name: "Imperial",
        templates: [
`\\#FF0000=== Imperial Notice ===
\\#CC0000Authorized Personnel Only
\\#880000Report Suspicious Activity`,

`\\#FF0000+++ EMPIRE NETWORK +++
\\#FFFFFFSector Patrol Active
\\#AA0000Glory to the Empire`
        ]
    },

    {
        name: "Rebel Alliance",
        templates: [
`\\#00CCFF=== Alliance Outpost ===
\\#FFFFFFEncrypted Channel Active
\\#00FFFFHope Lives`,

`\\#00CCFF>>> REBEL NETWORK <<<
\\#FFFFFFSupply Drop Incoming
\\#00FFFFStand Together`
        ]
    },

    {
        name: "Hutt Cartel",
        templates: [
`\\#66FF00Jabba's Exchange
\\#FFFF00Spice & Rare Goods
\\#00FF00No Questions Asked`,

`\\#99FF00Hutt Territory
\\#FFFF00Pay Your Tribute
\\#55AA00Trespassers Vanish`
        ]
    },

    {
        name: "Mandalorian",
        templates: [
`\\#FFAA00>>> Mandalorian Forge <<<
\\#FFFFFFThis Is The Way
\\#FFAA00Clan Honor Above All`,

`\\#FFAA00=== Mandalorian Outpost ===
\\#FFFFFFBeskar Trade Authorized
\\#FFAA00No Droids Allowed`
        ]
    },

    {
        name: "Sith",
        templates: [
`\\#FF0000+++ SITH SANCTUM +++
\\#AA0000Power Through Passion
\\#550000Fear Is Freedom`,

`\\#FF0000=== DARK SIDE ARCHIVE ===
\\#AA0000Knowledge Is Power
\\#550000Obey the Sith`
        ]
    },

    {
        name: "Jedi",
        templates: [
`\\#00FFFF=== JEDI ENCLAVE ===
\\#FFFFFFPeace Through Knowledge
\\#00CCFFThe Force Guides Us`,

`\\#00FFFF>>> JEDI ARCHIVE <<<
\\#FFFFFFMeditation Chamber Active
\\#00CCFFBalance Above All`
        ]
    },

    {
        name: "Cantina",
        templates: [
`\\#FF00FF+++ Mos Eisley Cantina +++
\\#00FFFFLive Music Tonight
\\#FFFFFFNo Blasters`,

`\\#FF00FF=== OUTER RIM CANTINA ===
\\#00FFFFDrinks & Sabacc
\\#FFFFFFSmugglers Welcome`
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
