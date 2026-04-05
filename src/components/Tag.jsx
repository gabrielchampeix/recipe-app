import { useState } from "react"

export default function Tag({ label = "tag", canBeSelected = false, canBeDeleted = false, tagDeleteHandle, clickHandle }) {
    const [selected, setSelected] = useState(false)
    return (
        <li onClick={() => setSelected(!selected)} style={{ padding: "4px", border: selected ? "1px solid black" : "1px solid lightgray", listStyle: "none", display: "inline" }}>
            {label}
            {canBeDeleted ? <button type="button" onClick={() => tagDeleteHandle(label)}>X</button> : ""}
        </li>
    )
}