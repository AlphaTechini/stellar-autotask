import fs from 'fs';
import path from 'path';

const componentsDir = path.join(process.cwd(), 'src', 'lib', 'components', 'stitch');
const commonDir = path.join(process.cwd(), 'src', 'lib', 'components', 'common');

if (!fs.existsSync(commonDir)) {
  fs.mkdirSync(commonDir, { recursive: true });
}

// Master NavBar content with SvelteKit links
const navBarContent = `<script lang="ts">
  import { page } from '$app/state';
</script>

<nav class="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl flex justify-between items-center px-8 h-20 w-full shadow-2xl shadow-cyan-900/10">
<div class="flex items-center gap-12">
<a href="/" class="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">
    Luminal Freelance
</a>
<div class="hidden md:flex gap-8 items-center">
<a 
    class="font-['Space_Grotesk'] tracking-tight transition-colors {page.url.pathname === '/dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}" 
    href="/dashboard">Dashboard</a>
<a 
    class="font-['Space_Grotesk'] tracking-tight transition-colors {page.url.pathname === '/marketplace' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}" 
    href="/marketplace">Marketplace</a>
<a 
    class="font-['Space_Grotesk'] tracking-tight transition-colors {page.url.pathname === '/create-task' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}" 
    href="/create-task">Create Task</a>
</div>
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-cyan-400 hover:bg-slate-800/50 transition-all rounded-lg active:scale-95 duration-200">
<span class="material-symbols-outlined">notifications</span>
</button>
<a href="/dashboard" class="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 overflow-hidden">
<img alt="User profile avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnxQ1abFZjJB2GMptkYGltB3pAVDITV2yFhqECXQOuWhvMBGD6keR6IgxCJcdxXa20iRLfoEgneT-xRRGIdwHxAIX74t6mcZl_4Z4c8RmwAsn76HYyeEL6o8nxP6UdBwu2aPwWlxd97oBHPRarHaC_-I9UMGiMbeNwUAh-Men3WnVr1y4WzvIaGGMvfBzIUxxk9xa2ijNDGbPu0LAFB0_1EVGDuCCMIryk6GiCZffjDrPXCfQ7ujT0Ty-Vvoy8JGI4welnGvzkhPRC"/>
</a>
</div>
</nav>
`;

fs.writeFileSync(path.join(commonDir, 'NavBar.svelte'), navBarContent, 'utf8');

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.svelte'));

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Detect and remove navbar block
  // We'll look for <!-- TopNavBar --> if it exists, or just the first <nav> tag if it's the header.
  // Many of these screens have <nav ...> as the first major tag after </script>.
  
  // First, find the first nav tag
  const navRegex = /<nav[\s\S]*?<\/nav>/i;
  if (navRegex.test(content)) {
    content = content.replace(navRegex, '<NavBar />');
    
    // Add import
    const importStatement = `import NavBar from '../common/NavBar.svelte';\n`;
    if (content.includes('<script lang="ts">')) {
       // Check if there's already an import footer line to place it nicely
       if (!content.includes('import NavBar')) {
          content = content.replace('<script lang="ts">', `<script lang="ts">\n${importStatement}`);
       }
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Replaced NavBar in ${file}`);
});
