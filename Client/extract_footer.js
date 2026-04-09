import fs from 'fs';
import path from 'path';

const componentsDir = path.join(process.cwd(), 'src', 'lib', 'components', 'stitch');
const commonDir = path.join(process.cwd(), 'src', 'lib', 'components', 'common');

if (!fs.existsSync(commonDir)) {
	fs.mkdirSync(commonDir, { recursive: true });
}

// Fixed Footer content from PlatformLandingPage.svelte
const footerContent = `<script lang="ts">
</script>

<footer class="w-full py-8 mt-auto bg-slate-950 border-t border-slate-800/30 flex flex-col md:flex-row justify-between items-center px-8 gap-4 z-50">
<div class="flex flex-col items-center md:items-start gap-2">
<span class="text-cyan-400 font-bold font-['Manrope'] text-xs tracking-wide">Luminal Freelance</span>
<span class="text-slate-500 font-['Manrope'] text-xs tracking-wide">© 2024 Kinetic Luminescence. Powered by AI Verification.</span>
</div>
<div class="flex gap-8">
<a class="text-slate-500 hover:text-cyan-400 transition-colors font-['Manrope'] text-xs tracking-wide" href="#">Privacy Policy</a>
<a class="text-slate-500 hover:text-cyan-400 transition-colors font-['Manrope'] text-xs tracking-wide" href="#">Terms of Service</a>
<a class="text-slate-500 hover:text-cyan-400 transition-colors font-['Manrope'] text-xs tracking-wide" href="#">Agent API Access</a>
</div>
</footer>
`;

fs.writeFileSync(path.join(commonDir, 'Footer.svelte'), footerContent, 'utf8');

const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.svelte'));

files.forEach((file) => {
	const filePath = path.join(componentsDir, file);
	let content = fs.readFileSync(filePath, 'utf8');

	// Regex to remove the footer block
	// <footer ...>...</footer>
	content = content.replace(/<footer[\s\S]*?<\/footer>/i, '<Footer />');

	// Add the import to <script lang="ts"> block
	const importStatement = `import Footer from '../common/Footer.svelte';\n`;
	if (content.includes('<script lang="ts">')) {
		content = content.replace('<script lang="ts">', `<script lang="ts">\n${importStatement}`);
	} else {
		content = `<script lang="ts">\n${importStatement}</script>\n\n` + content;
	}

	fs.writeFileSync(filePath, content, 'utf8');
	console.log(`Replaced footer in ${file}`);
});
