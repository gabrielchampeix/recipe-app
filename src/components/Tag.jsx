import { useState } from "react"

export default function Tag({ label = "tag", canBeSelected = false, canBeDeleted = false, tagDeleteHandle, clickHandle }) {
    const [selected, setSelected] = useState(false)
    return (
        <li className={selected ? "tag tag-selected" : "tag"} onClick={() => setSelected(!selected)}
        >
            {label}
            {canBeDeleted ? <button type="button" onClick={() => tagDeleteHandle(label)}>X</button> : ""}
        </li>
    )
}