import Tag from "./Tag"
import "./RecipeList.css"

export default function Recipe({ title = "title", tags = ["tag"], deleteHandle, editHandle }) {
    return (
        <div className="recipe">
            <h3>{title}</h3>
            <ul>
                {tags.map((tag, index) => (
                    <Tag canBeSelected={false} key={index} label={tag} />
                ))}
            </ul>
            <div className="recipe-buttons-container">
                <button onClick={deleteHandle}>Delete</button>
                <button onClick={editHandle}>Edit</button>
            </div>
        </div>
    )
}