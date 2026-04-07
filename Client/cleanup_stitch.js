import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src', 'lib', 'components', 'stitch');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svelte'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove doctype, html, head, body tags but keep content inside body
  // We'll look for <body ...> and </body>
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    let bodyContent = bodyMatch[1];
    
    // Also check for <head> content that might be useful (like <title>)
    const headMatch = content.match(/<head[^>]*>([\s\S]*)<\/head>/i);
    let svelteHead = '';
    if (headMatch) {
        const titleMatch = headMatch[1].match(/<title>([\s\S]*)<\/title>/i);
        if (titleMatch) {
            svelteHead = `<svelte:head>\n  <title>${titleMatch[1]}</title>\n</svelte:head>\n\n`;
        }
    }

    content = `<script lang="ts">\n</script>\n\n${svelteHead}${bodyContent.trim()}`;
  }

  // 2. Fix onclick strings to functions
  content = content.replace(/onclick="([^"]+)"/g, (match, p1) => {
    // Basic conversion: onclick="foo()" -> onclick={() => foo()}
    // Be careful with escaped quotes if any
    return `onclick={() => { ${p1.replace(/&quot;/g, '"').replace(/&apos;/g, "'")} }}`;
  });

  // 3. Fix disabled=""
  content = content.replace(/disabled=""/g, 'disabled');

  // 4. Remove redundant scripts/links tags if any survived the body extract
  content = content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, (match) => {
      if (match.includes('cdn.tailwindcss.com') || match.includes('tailwind.config')) return '';
      return match;
  });
  
  // 5. Ensure img and input tags are closed (safety check)
  content = content.replace(/<(img|input|br|hr)([^>]*?)(?<!\/)>/g, '<$1$2 />');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned ${file}`);
});
