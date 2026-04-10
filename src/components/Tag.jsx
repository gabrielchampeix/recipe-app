import { useState } from "react"

export default function Tag({ label = "tag", canBeSelected = false, canBeDeleted = false, tagDeleteHandle, clickHandle }) {
    const [selected, setSelected] = useState(canBeSelected ? true : false)
    return (
        <li className={selected ? "tag tag-selected" : "tag"} onClick={() => {
            if (canBeSelected) {
                if (clickHandle) clickHandle(label);
                setSelected(!selected);
            }
        }}
        >
            {label}
            {canBeDeleted ? <button className="close-button" type="button" onClick={() => tagDeleteHandle(label)}>X</button> : ""}
        </li>
    )
}