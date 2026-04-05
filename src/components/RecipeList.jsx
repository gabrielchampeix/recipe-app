import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import { subscribeToRecipes, deleteRecipe, editRecipe } from "../services/recipes";
import Tag from "./Tag";
import AddRecipeBox from "./AddRecipeBox";
import Recipe from "./Recipe";
import EditModal from "./EditModal";
import SearchBar from "./SearchBar";

async function fetchRecipes() {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    const recipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return recipes;
}


export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [editing, setEditing] = useState(false)
    const [searchTitle, setSearchTitle] = useState("");
    const [editedId, setEditedId] = useState([])
    const [editedTitle, setEditedTitle] = useState("")
    const [editedTags, setEditedTags] = useState([])

    const filteredRecipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTitle.toLowerCase())
        // ||
        // recipe.tags.some((tag) =>
        //     tag.toLowerCase().includes(searchTitle.toLowerCase())
        // )
    );

    useEffect(() => {
        fetchRecipes().then(setRecipes);
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToRecipes(setRecipes);
        return () => unsubscribe(); // cleanup
    }, []);

    async function handleDelete(id) {
        const confirmed = window.confirm("Delete this recipe?");
        if (!confirmed) return;
        await deleteRecipe(id);
    }

    return (
        <Fragment>
            {editing ? <EditModal
                title={editedTitle}
                tags={editedTags}
                id={editedId}
                closeHandle={() => setEditing(false)} /> : ""
            }

            <SearchBar titleValue={searchTitle} titleChangeHandle={(e) => setSearchTitle(e.target.value)} />

            <div>
                <h2>Recipes</h2>
                {filteredRecipes.map((recipe, index) => (
                    <Recipe
                        deleteHandle={() => handleDelete(recipe.id)}
                        editHandle={() => {
                            setEditing(true)
                            setEditedId(recipe.id)
                            setEditedTitle(recipe.title)
                            setEditedTags(recipe.tags)
                        }}
                        closeHandle={() => setEditing(false)}
                        key={index} title={recipe.title}
                        tags={recipe.tags}
                    />
                ))}
            </div>
            <div>
                <AddRecipeBox />
            </div>
        </Fragment>
    );
}