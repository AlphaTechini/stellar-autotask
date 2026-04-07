import fs from 'fs';
import path from 'path';

const screens = [
  { name: 'CreateTask', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzhiZjdmNjI0YjFjMTQ0NDFiMGY2YTQyOWFiOWYzZmUzEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxODAxMzc0NTc0MjgwNjE1MzExMQ&filename=&opi=89354086' },
  { name: 'SubmitWork', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzJhODhiZDY3NjMzZDQxODM4NTUwZDFjZTRjMGQ5MTk3EgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxODAxMzc0NTc0MjgwNjE1MzExMQ&filename=&opi=89354086' },
  { name: 'Authentication', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzI4Y2NkZmViMGY2YTQyMjNiNWJjODg5Y2RhNzEzYWQ5EgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxODAxMzc0NTc0MjgwNjE1MzExMQ&filename=&opi=89354086' },
  { name: 'AIVerificationReport', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2YxYzM3ODkwZWUwODQwMDI4ODc5YTg5MTUwNTE2NTg2EgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxODAxMzc0NTc0MjgwNjE1MzExMQ&filename=&opi=89354086' },
  { name: 'ReviewApproval', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2U1M2MyOTNiNzYxNTRlNWZhZmIxMmYwYmNlNDIyODJkEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxODAxMzc0NTc0MjgwNjE1MzExMQ&filename=&opi=89354086' },
  { name: 'TaskMarketplace', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzZmZjcxNWY3MjE0OTQ0MjY4Y2I2NmI0MzYxYmNlODJhEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxODAxMzc0NTc0MjgwNjE1MzExMQ&filename=&opi=89354086' },
  { name: 'TaskDetails', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzk1MmQ0NDRiNTNmNzQzYTc4NDcwYzVjNjJkZTYxZTk0EgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxODAxMzc0NTc0MjgwNjE1MzExMQ&filename=&opi=89354086' },
  { name: 'UserDashboard', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2JjYzA0NTJhYzc4NjQ5ZmNiNTU3YWUzOWE3NDBhY2ZjEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxODAxMzc0NTc0MjgwNjE1MzExMQ&filename=&opi=89354086' },
  { name: 'PaymentReceipt', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzA4ZmRlYWNjMGFiZDRjODc5MWMzODBlZWZkZTJiOWNkEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxODAxMzc0NTc0MjgwNjE1MzExMQ&filename=&opi=89354086' },
  { name: 'PlatformLandingPage', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzhjOGFlOTUxMjUxMTRlZmJiOWY1ODNmZGU5YjYwZjRjEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxODAxMzc0NTc0MjgwNjE1MzExMQ&filename=&opi=89354086' }
];

const outDir = path.join(process.cwd(), 'src', 'lib', 'components', 'stitch');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  for (const screen of screens) {
    console.log(`Downloading ${screen.name}...`);
    const res = await fetch(screen.url);
    if (!res.ok) {
      console.error(`Failed to download ${screen.name}: ${res.statusText}`);
      continue;
    }
    let html = await res.text();
    
    // Auto-close tags for Svelte
    html = html.replace(/<(img|input|br|hr)([^>]*?)(?<!\/)>/g, '<$1$2 />');

    // Make it a Svelte component
    const svelteCode = `<script lang="ts">\n</script>\n\n${html}`;
    
    const outFile = path.join(outDir, `${screen.name}.svelte`);
    fs.writeFileSync(outFile, svelteCode, 'utf8');
    console.log(`Saved ${outFile}`);
  }
}

run().catch(console.error);
