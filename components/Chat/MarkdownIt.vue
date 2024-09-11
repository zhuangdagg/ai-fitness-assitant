

<script lang="ts">
import MarkdownIt from 'markdown-it'
import MarkdownItAbbr from 'markdown-it-abbr';
// import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItDeflist from 'markdown-it-deflist';
import MarkdownItEmoji from 'markdown-it-emoji';

import MarkdownItFootnote from 'markdown-it-footnote';
// import MarkdownItHighlightjs from 'markdown-it-highlightjs';
import MarkdownItIns from 'markdown-it-ins';
import MarkdownItMark from 'markdown-it-mark';
import MarkdownItSub from 'markdown-it-sub';
import MarkdownItSup from 'markdown-it-sup';
import MarkdownItTasklists from 'markdown-it-task-lists';

export default {
    name: 'markdown-it-content',
    props: {
        anchor: {
            type: Object,
            default: () => ({})
        },
        breaks: {
            type: Boolean,
            default: false
        },
        emoji: {
            type: Object,
            default: () => ({})
        },
        highlight: {
            type: Object,
            default: () => ({})
        },
        html: {
            type: Boolean,
            default: false
        },
        langPrefix: {
            type: String,
            default: 'language-'
        },
        linkify: {
            type: Boolean,
            default: false
        },
        plugins: {
            type: Array,
            default: () => []
        },
        quotes: {
            type: String,
            default: '“”‘’'
        },
        tasklists: {
            type: Object,
            default: () => ({})
        },
        toc: {
            type: Object,
            default: () => ({})
        },
        typographer: {
            type: Boolean,
            default: false
        },
        xhtmlOut: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const md = ref()

        const renderMarkdown = () => {
            let markdown = new MarkdownIt()
                .use(MarkdownItAbbr)
                // .use(MarkdownItAnchor, props.anchor)
                .use(MarkdownItDeflist)
                .use(MarkdownItEmoji, props.emoji)
                .use(MarkdownItIns)
                .use(MarkdownItMark)
                .use(MarkdownItSub)
                .use(MarkdownItSup)
                .use(MarkdownItTasklists, props.tasklists)
            md.value = markdown.render(props.content)
        }

        onMounted(() => renderMarkdown())
        onUpdated(() => renderMarkdown())

        return () => h('div', { innerHTML: md.value })
    }
}
</script>
