<template>
  <article
    ref="articleRef"
    class="content-renderer text-foreground [&>a]:text-primary [&>a]:hover:text-primary/80 [&_a]:text-primary [&_a]:hover:text-primary/80 [&>code]:bg-muted [&_code]:bg-muted [&>pre]:bg-muted [&_pre]:bg-muted [&>blockquote]:border-primary [&_blockquote]:border-primary [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:px-2 [&_code]:py-1 [&_code]:font-mono [&_code]:text-sm [&_li]:mb-2 [&_ol]:mb-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4 [&_strong]:font-semibold [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:pl-6 [&>a]:underline [&>blockquote]:my-4 [&>blockquote]:border-l-4 [&>blockquote]:pl-4 [&>blockquote]:italic [&>code]:rounded [&>code]:px-2 [&>code]:py-1 [&>code]:font-mono [&>code]:text-sm [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:text-2xl [&>h2]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-xl [&>h3]:font-semibold [&>p]:mb-4 [&>p]:leading-relaxed [&>pre]:mb-4 [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:p-4 [&>strong]:font-semibold"
    v-html="html"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  html: string
}

defineProps<Props>()

const articleRef = ref<HTMLElement | null>(null)

defineExpose({
  articleRef,
})
</script>
