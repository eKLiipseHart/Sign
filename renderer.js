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

    // Works with "#RRGGBB" and "\#RRGGBB"
    // Hides the slash + # + hex, shows only colored content
    html = html.replace(
        /\\?#([0-9A-Fa-f]{6})(.*?)(?=\\?#([0-9A-Fa-f]{6})|$)/gs,
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

// FINAL FIX: gradient outputs \#RRGGBB
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

editor.addEventListener('input', renderPreview);

// COLOR BUTTONS — now escaped
document.querySelectorAll('.colorBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        insertAtCursor(editor, "\\" + btn.dataset.color.toUpperCase());
        renderPreview();
    });
});

// SYMBOL BUTTONS
document.querySelectorAll('.symbolBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        insertAtCursor(editor, btn.innerText);
        renderPreview();
    });
});

// STYLE PACKS — unchanged (your templates already escaped)
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

// CUSTOM COLOR PICKER — escaped
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

// GRADIENT BUTTON
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

// FINAL FIX: DIVIDER — escaped
document.getElementById('dividerBtn')
.addEventListener('click', () => {
    insertAtCursor(editor, '\n\\#FFFF00====================\n');
    renderPreview();
});

// FINAL FIX: BORDER — escaped
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

// COPY BUTTON
document.getElementById('copyBtn')
.addEventListener('click', async () => {
    await navigator.clipboard.writeText(editor.value);
    alert('Copied for SWG!');
});

// RANDOM THEMES — unchanged (your templates already escaped)
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
