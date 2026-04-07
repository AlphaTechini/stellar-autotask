import fs from 'fs';
import path from 'path';

// Note: Replace this with the actual file path of the list of screens
const jsonFile = 'C:/Users/rehob/.gemini/antigravity/brain/4a6647d4-baf1-454b-b375-2d03fec30b76/.system_generated/steps/12/output.txt';

if (!fs.existsSync(jsonFile)) {
    console.error('File not found:', jsonFile);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
const screens = data.screens;

const outputDir = path.join(process.cwd(), 'src/lib/components/stitch');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function toPascalCase(str) {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
        .replace(/^([a-z])/, (m, chr) => chr.toUpperCase())
        .replace(/[^a-zA-Z0-9]/g, '');
}

function formatHTMLForSvelte(html) {
    // Extract everything between <body> and </body>
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let svelteContent = bodyMatch ? bodyMatch[1] : html;

    // Remove the TopNavBar and SideNavBar? No, the user wants the screens. 
    // They are standalone screens but let's keep everything for now.

    // Svelte replacements
    // Close void tags
    const voidTags = ['img', 'input', 'hr', 'br', 'source', 'meta', 'link'];
    voidTags.forEach(tag => {
        const regex = new RegExp(`(<${tag}\\b[^>]*)(?<!/)>`, 'gi');
        svelteContent = svelteContent.replace(regex, '$1 />');
    });

    // Replace class= with class= (it's identical but some templates might have class="..." already)
    // Svelte has {}) which shouldn't be parsed if it's text.
    // Replace inline styles if they have curly braces? No, {} means Svelte.
    // Replace { with {'{'} and } with {'}'} if they are part of text? Usually HTML doesn't have {} unless in JS.
    // But we removed JS scripts.
    svelteContent = svelteContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Sometimes CSS inside svelte shouldn't have raw { if it's not a block, but we stripped <style> that matched body.
    
    // Convert inline SVG elements (they often have missing closing tags for paths but it's fine).

    return `<script lang="ts">\n\t// Generated from Stitch\n</script>\n\n<div class="stitch-container min-h-screen flex flex-col">\n${svelteContent}\n</div>\n`;
}

async function run() {
    for (const screen of screens) {
        if (!screen.htmlCode || !screen.htmlCode.downloadUrl) {
            console.log(`Skipping ${screen.title}: No download URL.`);
            continue;
        }
        
        const componentName = toPascalCase(screen.title) + '.svelte';
        const url = screen.htmlCode.downloadUrl;
        
        console.log(`Downloading ${screen.title} from ${url}`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Status ${response.status}`);
            }
            const html = await response.text();
            const svelteCode = formatHTMLForSvelte(html);
            
            const filePath = path.join(outputDir, componentName);
            fs.writeFileSync(filePath, svelteCode);
            console.log(`Saved ${componentName}`);
        } catch (err) {
            console.error(`Error processing ${screen.title}:`, err);
        }
    }
}

run().catch(console.error);
