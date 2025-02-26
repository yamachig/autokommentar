const onLoad = () => {
    const reLawID = /\/law\/(\w+)/;
    const lawID = reLawID.exec(globalThis.location.href)?.[1];
    if (!lawID) return;

    const articleElements = globalThis.document.querySelectorAll(".article");
    console.log(`articleElements.length: ${articleElements.length}`);
    if (articleElements.length === 0) {
        setTimeout(onLoad, 300);
    }

    const styleElement = globalThis.document.createElement("style");
    styleElement.textContent = `
a.invoke-button {
    display: inline-block;
    width: 1.5em;
    min-width: 1.5em;
    margin-left: -1.75em;
    margin-right: 0.25em;
    margin-top: 0.25em;
    height: 1.5em;
    font-size: 0.75em;
    text-align: center;
    vertical-align: middle;
    line-height: 1.5em;
    font-weight: bold;
    background-color: #f0f0f0;
    color: #000000;
    border-radius: 0.25em;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
}
a.invoke-button:hover {
    background-color: #0017c1;
    color: #ffffff;
}
`;
    globalThis.document.body.appendChild(styleElement);
    const baseURL = "https://yamachig.github.io/autokommentar/";
    // const baseURL = "http://localhost:3000/";

    const reArticleNum = /At_(\w+)/;
    articleElements.forEach((articleElement) => {
        const articleNum = reArticleNum.exec(articleElement.id)?.[1];
        if (!articleNum) return;
        const invokeButton = globalThis.document.createElement("a");
        invokeButton.textContent = "A";
        invokeButton.classList.add("invoke-button");
        invokeButton.href = `${baseURL}#/${lawID}/a=${articleNum}`;
        invokeButton.target = "_blank";
        invokeButton.title = "AutoKommentarで開く";
        articleElement.prepend(invokeButton);
    });
};

globalThis.window.addEventListener("load", onLoad);

let prevHref = globalThis.location.href;
setInterval(() => {
    if (prevHref !== globalThis.location.href) {
        prevHref = globalThis.location.href;
        onLoad();
    }
}, 1000);
