function translateText() {
    const textToTranslate = document.getElementById('text-to-translate').value;
    const languageSelect = document.getElementById('language-select').value;
    const translatedText = document.getElementById('translated-text');

    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${languageSelect}`)
        .then(response => response.json())
        .then(data => {
            if (data.responseData.translatedText) {
                translatedText.value = data.responseData.translatedText;
            } else {
                translatedText.value = 'خطأ في الترجمة، حاول مرة أخرى.';
            }
        })
        .catch(error => {
            translatedText.value = 'حدث خطأ أثناء الترجمة.';
            console.error('Error:', error);
        });
}
