// blog/static/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const tools = document.querySelectorAll('.tool');
    const canvas = document.getElementById('canvas');
    const form = document.getElementById('blog-form');
    const contentInput = document.getElementById('content-input');

    tools.forEach(tool => {
        tool.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.type);
        });
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');
        const placeholderText = canvas.querySelector('.placeholder-text');
        if (placeholderText) {
            placeholderText.remove();
        }
        createCanvasItem(type);
    });

    function createCanvasItem(type) {
        const item = document.createElement('div');
        item.className = 'canvas-item';
        let element;

        if (type === 'subheading') {
            element = document.createElement('textarea');
            element.placeholder = 'Enter your subheading...';
            element.style.fontWeight = 'bold';
            element.style.fontSize = '1.5em';
        } else { // paragraph
            element = document.createElement('textarea');
            element.placeholder = 'Enter your paragraph...';
            element.rows = 4;
        }
        element.dataset.type = type;
        item.appendChild(element);
        canvas.appendChild(item);
    }

    form.addEventListener('submit', (e) => {
        const content = [];
        canvas.querySelectorAll('textarea').forEach(el => {
            content.push({
                type: el.dataset.type,
                value: el.value
            });
        });
        contentInput.value = JSON.stringify(content);
    });
});