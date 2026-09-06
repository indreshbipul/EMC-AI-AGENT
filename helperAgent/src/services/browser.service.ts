import { agent } from "../agents/vesionAgent.js";
import { getPage } from "../config/playwright.config.js";
import cleanDomSchema from "../utils/cleanDomSchema.js";
import uuidGen from "../utils/uuidGen.js";
import path from "node:path";
import fs from 'fs'

const current_path = process.cwd();
const screenshortPath = path.join(current_path, "screenshorts");

let consoleErrors : string[] = [];
let pageErrors : string[] = [];

export const errorCaptureService = async()=>{
    try{
        const page = await getPage()
        page.on("console", (msg) => {
            if (msg.type() === "error") {
                consoleErrors.push(msg.text());
            }
        });
        page.on("pageerror", (error) => {
            pageErrors.push(error.message);
        });
    }
    catch(err){
        console.log(err)
    }
}

export const gotoService = async(uri : string)=>{
    try{
        const page = await getPage();
        // Resetting the errors or console logs
        consoleErrors = [];
        pageErrors = [];
        await page.goto(uri);
        return {url: page.url(), title: await page.title()};
    }
    catch(err){
        return {status : "failed", url : uri, error : String(err)}
    }
}

export const screenshortService = async()=>{
    try{
        const page = await getPage();
        const imageId = `ss-${uuidGen().replaceAll("-","").slice(1,15)}`;
        const imagePath = path.join(screenshortPath, imageId);
        await page.screenshot({path : `${imagePath}.png`});
        const imageBuffer = fs.readFileSync(`${imagePath}.png`);
        const base64Image = imageBuffer.toString("base64");
        const context = await agent(base64Image);
        return {status : "success", image : context};
    }
    catch(err){
        return {status : "failed", error : String(err)};
    }
}
export const getDOMService = async () => {
    try {
        const page = await getPage();
        const elements = await page.evaluate(() => {
            const nodes = document.querySelectorAll(
                "button, a, input, textarea, select, [role]"
            );

            return Array.from(nodes)
                .map((element) => {
                    const el = element as HTMLElement;
                    const rect = el.getBoundingClientRect();
                    const visible = rect.width > 0 && rect.height > 0;
                    const inViewport =
                        rect.top >= 0 && rect.left >= 0 &&
                        rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;

                    return {
                        tag: el.tagName.toLowerCase(),
                        text: el.innerText?.trim().slice(0, 100) || "", // cap long text
                        id: el.getAttribute("id") || undefined,
                        type: el.getAttribute("type") || undefined,
                        href: el.getAttribute("href") || undefined,
                        placeholder: el.getAttribute("placeholder") || undefined,
                        name: el.getAttribute("name") || undefined,
                        role: el.getAttribute("role") || undefined,
                        enabled: !(el as HTMLButtonElement).disabled,
                        visible,
                        inViewport,
                    };
                })
                .filter(e => e.visible && (e.text || e.href || e.placeholder || e.name))
                .slice(0, 80); 
        });

        return { status: "success", data: elements, count: elements.length };
    } catch (err) {
        return { status: "failed", error: String(err) };
    }
};
export const clickService = async(selector : string)=>{
    try{
        const page = await getPage();
        await page.locator(selector).click();
        return {status : "success", uri : page.url()};
    }
    catch(err){
        return {status : "failed", error : String(err)};
    }
}

export const fillService = async(selector : string, inputText : string )=>{
    try{
        const page = await getPage();
        const input = page.locator(selector)
        await input.fill(inputText)
        return {status : "success", uri : page.url()};
    }
    catch(err){
        return {status : "failed", error : String(err)};
    }
}

export const scrollService = async (x: number, y: number) => {
    try {
        const page = await getPage();
        await page.mouse.wheel(x, y);
        return {status: "success", uri: page.url()};
    } 
    catch (err) {
        return {status: "failed", error: String(err)};
    }
};

export const getErrorsService = () => {
    const errors = {consoleErrors,pageErrors};
    consoleErrors = [];
    pageErrors = [];
    return errors;
};

