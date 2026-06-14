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
   STYLE PACKS (UPDATED TO ESCAPED COLORS)
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
   SANITIZE + PREVIEW RENDERER (UPDATED REGEX)
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

    // Updated regex to support:
    // #RRGGBB
