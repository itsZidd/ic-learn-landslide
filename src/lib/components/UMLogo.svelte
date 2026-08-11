<script lang="ts">
	import logoImg from '$lib/assets/UMLogo.webp';

	interface Props {
		className?: string;
	}
	let { className = "w-16 h-16" }: Props = $props();
</script>

<img src={logoImg} alt="Universitas Negeri Malang Logo" class={`${className} object-contain`} />
