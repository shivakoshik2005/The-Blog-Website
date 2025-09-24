document.addEventListener('DOMContentLoaded', function() {
    const tools = document.querySelectorAll('.tool');
    const canvas = document.getElementById('contentCanvas');
    let draggedTool = null;

    // Make tools draggable
    tools.forEach(tool => {
        tool.addEventListener('dragstart', (e) => {
            draggedTool = tool;
            e.dataTransfer.setData('text/plain', tool.dataset.type);
        });
    });

    // Canvas drop zone
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        canvas.style.borderColor = '#007bff';
    });

    canvas.addEventListener('dragleave', (e) => {
        canvas.style.borderColor = '#dee2e6';
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        canvas.style.borderColor = '#dee2e6';
        
        const type = e.dataTransfer.getData('text/plain');
        const placeholder = canvas.querySelector('.canvas-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const element = createContentElement(type);
        canvas.appendChild(element);
    });
});

function createContentElement(type) {
    const div = document.createElement('div');
    div.className = `content-element ${type}`;
    
    if (type === 'subheading') {
        div.innerHTML = `
            <input type="text" placeholder="Enter subheading" class="subheading-input">
            <button onclick="this.parentElement.remove()" class="delete-btn">×</button>
        `;
    } else if (type === 'paragraph') {
        div.innerHTML = `
            <textarea placeholder="Enter paragraph text" rows="4" class="paragraph-input"></textarea>
            <button onclick="this.parentElement.remove()" class="delete-btn">×</button>
        `;
    }

    return div;
}