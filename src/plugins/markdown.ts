import MarkdownIt from "markdown-it";
import hljs from "highlight.js"; // Pour la coloration syntaxique
import "highlight.js/styles/github-dark-dimmed.css"; // Style pour le code

// Plugins Markdown
import taskLists from "markdown-it-task-lists";
import footnote from "markdown-it-footnote";
import container from "markdown-it-container";

// Initialisation de MarkdownIt
const markdown = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
    highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
});

// Ajout des plugins
markdown.use(taskLists);
markdown.use(footnote);

// Blocs personnalisés
markdown.use(container, "note", {
    render: (tokens, idx) => {
        const content = tokens[idx].info.trim();
        if (tokens[idx].nesting === 1) {
            return `<div class="callout note"><strong>💡 ${content}</strong><div>`;
        } else {
            return `</div></div>`;
        }
    },
});

markdown.use(container, "warning", {
    render: (tokens, idx) => {
        if (tokens[idx].nesting === 1) {
            return `<div class="callout warning"><strong>⚠️ Attention :</strong><div>`;
        } else {
            return `</div></div>`;
        }
    },
});

export default markdown;
