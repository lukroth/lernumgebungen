async function initExercises() {
    const exercises = document.querySelectorAll('.exercise');

    exercises.forEach((ex, index) => {
        const title = `Übung ${index + 1}: ${ex.dataset.title}`;
        const src = ex.dataset.src;
        const solutionSrc = src.replace('.svg', '_solution.svg');
        const description = ex.dataset.description || '';
        const hasSolution = ex.dataset.solution !== "false";

        const heading = document.createElement('h3');
        heading.textContent = title;

        const desc = document.createElement('p');
        desc.className = 'description';
        desc.innerHTML = description;

        const editorDiv = document.createElement('div');
        editorDiv.className = 'editor';

        const preview = document.createElement('div');
        preview.className = 'preview';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const downloadButton = document.createElement("button");
        downloadButton.textContent = "SVG Code herunterladen";
        downloadButton.className = "download-btn";

        const solutionButton = document.createElement("button");
        solutionButton.textContent = "Lösung anzeigen";
        solutionButton.className = "solution-btn";

        const solutionContainer = document.createElement('div');
        solutionContainer.className = 'solution-container';
        solutionContainer.style.display = 'none';

        const solutionHeading = document.createElement('h4');
        solutionHeading.textContent = 'Lösung';

        const solutionEditorDiv = document.createElement('div');
        solutionEditorDiv.className = 'editor';

        const solutionPreview = document.createElement('div');
        solutionPreview.className = 'preview';

        fetch(src)
            .then(res => res.text())
            .then(svgCode => {
                const editor = ace.edit(editorDiv);
                editor.setTheme("ace/theme/github");
                editor.getSession().setMode("ace/mode/xml");
                editor.setValue(svgCode, -1);
                editor.setOption("showPrintMargin", false);

                editor.getSession().on('change', () => {
                    preview.innerHTML = editor.getValue();
                });

                downloadButton.addEventListener("click", () => {
                    const svgContent = editor.getValue();
                    const blob = new Blob([svgContent], {type: "image/svg+xml"});

                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `${title.replace(/\s+/g, '_')}.svg`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });

                preview.innerHTML = svgCode;
            })
            .catch(err => {
                editorDiv.textContent = `Fehler beim Laden von ${src}`;
                preview.textContent = 'Fehler beim Laden der SVG-Datei.';
                console.error(`Fehler beim Laden von ${src}:`, err);
            });

        solutionButton.addEventListener("click", () => {
            if (solutionContainer.style.display === 'none') {
                fetch(solutionSrc)
                    .then(res => res.text())
                    .then(solutionCode => {
                        const solutionEditor = ace.edit(solutionEditorDiv);
                        solutionEditor.setTheme("ace/theme/github");
                        solutionEditor.getSession().setMode("ace/mode/xml");
                        solutionEditor.setValue(solutionCode, -1);
                        solutionEditor.setOption("showPrintMargin", false);

                        solutionEditor.getSession().on('change', () => {
                            solutionPreview.innerHTML = solutionEditor.getValue();
                        });

                        solutionPreview.innerHTML = solutionCode;
                        solutionContainer.style.display = 'block';
                        solutionButton.textContent = "Lösung verbergen";
                    })
                    .catch(err => {
                        solutionEditorDiv.textContent = `Fehler beim Laden von ${solutionSrc}`;
                        console.error(`Fehler beim Laden von ${solutionSrc}:`, err);
                    });
            } else {
                solutionContainer.style.display = 'none';
                solutionButton.textContent = "Lösung anzeigen";
            }
        });

        ex.appendChild(heading);
        if (description) ex.appendChild(desc);
        ex.appendChild(editorDiv);
        ex.appendChild(preview);
        ex.appendChild(buttonContainer);
        buttonContainer.appendChild(downloadButton);
        if (hasSolution) {
            buttonContainer.appendChild(solutionButton);
            ex.appendChild(solutionContainer);
            solutionContainer.appendChild(solutionHeading);
            solutionContainer.appendChild(solutionEditorDiv);
            solutionContainer.appendChild(solutionPreview);
        }
    });
}

window.addEventListener('DOMContentLoaded', initExercises);