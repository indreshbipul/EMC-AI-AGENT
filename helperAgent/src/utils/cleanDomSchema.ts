const cleanDomSchema = (nodes : NodeListOf<Element>)=>{
    return Array.from(nodes).map((el) => {
        const element = el as HTMLElement;
        const rect = element.getBoundingClientRect();
        return {
            tag: element.tagName.toLowerCase(),
            text: element.innerText?.trim() || "",
            attributes: {
                id: element.id || null,
                class: element.className || null,
                type: element.getAttribute("type"),
                disabled:
                    (element as HTMLButtonElement).disabled ?? false
            },
            role: element.getAttribute("role"),
            state: {
                visible:
                    rect.width > 0 &&
                    rect.height > 0,

                enabled:
                    !(element as HTMLButtonElement).disabled,

                focused:
                    document.activeElement === element,

                inViewport:
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= window.innerHeight &&
                    rect.right <= window.innerWidth
            },
            box: {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
            }
        };
    })
        
}

export default cleanDomSchema;