/**
 * CodeVigil — Code Editor Component
 * Styled textarea with line numbers and macOS-style title bar
 */

/**
 * Render a code editor textarea
 * @param {object} opts
 * @param {string} opts.id - Unique element ID
 * @param {string} [opts.value] - Initial code content
 * @param {string} [opts.placeholder] - Placeholder text
 * @param {string} [opts.language] - Language label
 * @param {number} [opts.minHeight] - Minimum height in px
 * @returns {string} HTML string
 */
export function renderCodeEditor({ id, value = '', placeholder = '', language = 'javascript', minHeight = 300 }) {
  const lineCount = Math.max((value || '').split('\n').length, 15);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => `<span>${i + 1}</span>`).join('');

  return `
    <div class="code-editor" id="${id}-editor">
      <div class="code-editor__header">
        <div class="code-editor__dots">
          <div class="code-editor__dot code-editor__dot--red"></div>
          <div class="code-editor__dot code-editor__dot--yellow"></div>
          <div class="code-editor__dot code-editor__dot--green"></div>
        </div>
        <span class="code-editor__lang" id="${id}-lang">${language}</span>
      </div>
      <div class="code-editor__body">
        <div class="code-editor__lines" id="${id}-lines">${lineNumbers}</div>
        <textarea
          class="code-editor__textarea"
          id="${id}"
          placeholder="${placeholder}"
          spellcheck="false"
          style="min-height: ${minHeight}px"
        >${escapeHtml(value)}</textarea>
      </div>
    </div>
  `;
}

/**
 * Attach line number updater to a code editor
 */
export function attachLineUpdater(textareaId) {
  const textarea = document.getElementById(textareaId);
  const linesEl = document.getElementById(`${textareaId}-lines`);
  if (!textarea || !linesEl) return;

  const update = () => {
    const count = Math.max(textarea.value.split('\n').length, 15);
    linesEl.innerHTML = Array.from({ length: count }, (_, i) => `<span>${i + 1}</span>`).join('');
  };

  textarea.addEventListener('input', update);
  textarea.addEventListener('keydown', (e) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      update();
    }
  });

  update();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
