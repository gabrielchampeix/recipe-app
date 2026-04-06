import { useState } from "react";
import Tag from "./Tag";


export default function SearchBarTags({ tags, tagClickHandle }) {
    return (
        <div className="tag-container">{tags.map((tag, index) => (
            <Tag canBeSelected={true} clickHandle={tagClickHandle} key={index} label={tag.label} />
        ))
        }</div>)
}


