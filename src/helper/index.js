import PizZip from "pizzip";

export const getParagraphs = (content) => {
    const zip = new PizZip(content);
    const str = zip.files["word/document.xml"].asText();

    if (str.charCodeAt(0) === 65279) {
        str = str.substr(1);
    }

    const xml = new DOMParser().parseFromString(str, "text/xml");
    const paragraphsXml = xml.getElementsByTagName("w:p");
    const paragraphs = [];

    for (let i = 0, len = paragraphsXml.length; i < len; i++) {
        let fullText = "";
        const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
        for (let j = 0, len2 = textsXml.length; j < len2; j++) {
            const textXml = textsXml[j];
            if (textXml.childNodes) {
                fullText += textXml.childNodes[0].nodeValue;
            }
        }
        if (fullText) {
            paragraphs.push(fullText);
        }
    }

    return paragraphs;
}
