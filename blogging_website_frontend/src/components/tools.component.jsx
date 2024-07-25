//importing tools packages

import Embed from "@editorjs/embed";  // This Embed basically allow you to add a youtube video or any other social media video by just providing the link
import List from "@editorjs/list";  // This List basically allow you to create a unordered list or ordered list 
import Image from "@editorjs/image";  // This Image basically allow you to add an image to your content or give an access to image like you can upload an image or you can just paste link of the image or you can drag and drop the image
import Header from "@editorjs/header"; // This Header basically allow you to add a header to your content or this will you the create h1 and h2 header
import Quote from "@editorjs/quote"; // This Quote basically allow you to add a quote to your content or this will you the create a tag or this will allow you the add Quotes in the editor
import Marker from "@editorjs/marker"; // This Marker basically allow you to add a marker to your content or this will you the create a tag or this will allow you the add Markers in the editor or this will allow you to Highlight any text inside this editor
import InlineCode from "@editorjs/inline-code";  // This InlineCode basically allow you to add a inline code to your content or this will you or give you the access to change the properties of link or text by just selecting them & it will just give a popup box over their
import { uploadImage } from "../common/aws";


const uploadImageByFile = (e) => {
    return uploadImage(e).then(url => {
        if ( url ) {
            return {
                success: 1,
                file: { url } 
            }
        }
    })
}

const uploadImageByURL = (e) => {
    let link = new Promise(( resolve, reject ) => {
        try {
            resolve(e)
        }
        catch(err) {
            reject(err)
        }
    })

    return link.then(url => {
        return {
            success: 1,
            file: { url }
        }
    })
} 

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true,
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByURL,
                uploadByFile: uploadImageByFile,
            }
        }
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type Heading...",
            levels: [2, 3],
            defaultLevel: 2
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
    },
    marker: Marker,
    inlineCode: InlineCode

}
