import fs from 'fs';
import path from 'path';

const routes = [
	{ component: 'PlatformLandingPage', route: 'src/routes' },
	{ component: 'TaskMarketplace', route: 'src/routes/marketplace' },
	{ component: 'CreateTask', route: 'src/routes/create-task' },
	{ component: 'TaskDetails', route: 'src/routes/task/[id]' },
	{ component: 'UserDashboard', route: 'src/routes/dashboard' },
	{ component: 'Authentication', route: 'src/routes/auth' }
];

routes.forEach(({ component, route }) => {
	const dir = path.join(process.cwd(), route);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	const content = `<script lang="ts">
\timport ${component} from '$lib/components/stitch/${component}.svelte';
</script>

<${component} />
`;

	fs.writeFileSync(path.join(dir, '+page.svelte'), content, 'utf8');
	console.log(`Created route ${route}/+page.svelte mapped to ${component}`);
});
