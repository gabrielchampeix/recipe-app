export default function Tag({ label = "tag", canBeDeleted = false, tagDeleteHandle }) {
    return (
        <li style={{ padding: "4px", border: "1px solid grey", listStyle: "none", display: "inline" }}>
            {label}
            {canBeDeleted ? <button type="button" onClick={() => tagDeleteHandle(label)}>X</button> : ""}
        </li>
    )
}