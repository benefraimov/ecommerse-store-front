import { useEffect } from 'react';

const useDocumentHead = (options = {}) => {
    const {
        title = 'E-Shop - קנייה מהנה ובטוחה',
        description = 'מבחר מוצרים איכותיים במחירים מעולים.',
        ogTitle = title,
        ogDescription = description,
        ogImage = '/og-image.png', // תמונת ברירת מחדל לשיתוף
        ogUrl = window.location.href
    } = options;

    useEffect(() => {
        document.title = title;
        // ... קוד עדכון ה-meta description נשאר זהה ...

        // עדכון תגיות Open Graph
        setMetaTag('property', 'og:title', ogTitle);
        setMetaTag('property', 'og:description', ogDescription);
        setMetaTag('property', 'og:image', ogImage);
        setMetaTag('property', 'og:url', ogUrl);
        setMetaTag('property', 'og:type', 'website');

    }, [title, description, ogTitle, ogDescription, ogImage, ogUrl]);
};

// פונקציית עזר פנימית ליצירה/עדכון של תגיות מטא
const setMetaTag = (attr, key, value) => {
    let element = document.querySelector(`meta[${attr}="${key}"]`);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
    }
    element.setAttribute('content', value);
};

export default useDocumentHead;