const manifestUploadInputEl = document.querySelector('.manifest-upload__input');
const manifestUploadLabelEl = document.querySelector('.manifest-upload__label');
const metaTagOutput = document.querySelector('.meta-tag-output');
const manifestUploadForm = document.querySelector('.manifest-upload__form');
const currentFileBanner = document.querySelector('.current-file-banner');
const copyMetaTagsButtonEl = document.querySelector('.meta-tag-output__copy-button');
let outputHtml = '';

const init = () => {
    bindEvents();
};

const bindEvents = () => {
    manifestUploadForm.addEventListener('change', initManifestUpload);
    manifestUploadLabelEl.addEventListener('click', initChangeEvent);
    copyMetaTagsButtonEl.addEventListener('click', copyMetaTags);
};

const initManifestUpload = e => {
    const fileExtension = e.target.value.split('.')[1];
    if (fileExtension === 'json') {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(e.target.files[0]);
        handleCurrentFileBanner(e);
    } else {
        alert('error please upload supported file');
    }
};
const initChangeEvent = () => {
    manifestUploadInputEl.click();
};

const onReaderLoad = event => {
    var obj = JSON.parse(event.target.result);
    generateMetaTags(obj);
};

const generateMetaTags = obj => {
    const entries = Object.entries(obj);
    renderDefaultTags();
    entries.map(entry => {
        initTagCreation(entry);
    });
    renderTags();
};

const renderDefaultTags = () => {
    outputHtml = `
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">`;
};

const initTagCreation = entry => {
    switch (entry[0]) {
        case 'short_name':
            createShortNameTag(entry);
            break;
        case 'theme_color':
            createThemeColorTag(entry);
            break;
        case 'start_url':
            createStartUrlTag(entry);
            break;
        case 'icons':
            createIconTag(entry);
            break;
        default:
            return;
    }
};

const createShortNameTag = entry => {
    outputHtml += `
    <meta name="application-name" content="${entry[1]}">
    <meta name="apple-mobile-web-app-title" content="${entry[1]}">`;
};

const createStartUrlTag = entry => {
    outputHtml += `
    <meta name="msapplication-starturl" content="${entry[1]}">
    `;
};

const createThemeColorTag = entry => {
    outputHtml += `
    <meta name="msapplication-navbutton-color" content="${entry[1]}">
    <meta name="theme-color" content="#123445">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`;
};

const createIconTag = entry => {
    entry[1].map(imageEntry => {
        outputHtml += `
    <link rel="icon" type="${imageEntry.type}" sizes="${imageEntry.sizes}" href="${imageEntry.src}">
    <link rel="apple-touch-icon" type="${imageEntry.type}" sizes="${imageEntry.sizes}" href="${imageEntry.src}">`;
    });
};

const renderTags = () => {
    metaTagOutput.textContent = outputHtml;
};

const copyMetaTags = e => {
    const range = document.createRange();
    range.selectNode(metaTagOutput);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
};

const handleCurrentFileBanner = e => {
    currentFileBanner.innerHTML = `CurrentFile: ${e.target.value}`;
    currentFileBanner.classList.remove('is-hidden');
};

init();
