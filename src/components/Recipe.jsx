import Tag from "./Tag"

export default function Recipe({ title = "title", tags = ["tag"], deleteHandle, editHandle }) {
    return (
        <div style={{ border: "1px solid black" }}>
            <h3>{title}</h3>
            <ul>
                {tags.map((tag, index) => (
                    <Tag key={index} label={tag} />
                ))}
            </ul>
            <button onClick={deleteHandle}>Delete</button>
            <button onClick={editHandle}>Edit</button>
        </div>
    )
}