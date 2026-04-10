import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { subscribeToRecipes, deleteRecipe, editRecipe } from "../services/recipes";
import AddRecipeBox from "./AddRecipeBox";
import Recipe from "./Recipe";
import EditModal from "./EditModal";
import SearchBarTitle from "./SearchBarTitle";
import SearchBarTags from "./SearchBarTags";

async function fetchRecipes() {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    const recipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return recipes;
}

async function fetchTags() {
    const querySnapshot = await getDocs(collection(db, "tags"));
    const tags = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return tags;
}


export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [tags, setTags] = useState([]);
    const [editing, setEditing] = useState(false)
    const [searchTitle, setSearchTitle] = useState("");
    const [searchTags, setSearchTags] = useState([])
    const [editedId, setEditedId] = useState([])
    const [editedTitle, setEditedTitle] = useState("")
    const [editedTags, setEditedTags] = useState([])

    console.log(recipes)


    // Handle tag selection/deselection
    const handleTagClick = (tagLabel) => {
        setSearchTags(prev =>
            prev.includes(tagLabel)
                ? prev.filter(tag => tag !== tagLabel)
                : [...prev, tagLabel]
        );
    };

    const filteredRecipes = recipes.filter((recipe) => {
        const titleMatch = recipe.title.toLowerCase().includes(searchTitle.toLowerCase());
        const tagsMatch = searchTags.length === 0 ||
            (recipe.tags && recipe.tags.length > 0 && recipe.tags.some(recipeTag =>
                searchTags.includes(recipeTag)
            ));

        return titleMatch && tagsMatch;
    });

    useEffect(() => {
        fetchRecipes().then(setRecipes);
    }, []);

    useEffect(() => {
        fetchTags().then((fetchedTags) => {
            // Trim tag labels to avoid whitespace issues
            const trimmedTags = fetchedTags.map(tag => ({
                ...tag,
                label: tag.label.trim()
            }));
            setTags(trimmedTags);
            setSearchTags(trimmedTags.map(tag => tag.label));
        });
    }, []);
    // console.log(tags)

    useEffect(() => {
        const unsubscribe = subscribeToRecipes((recipesData) => {
            // Trim tags in recipes to avoid whitespace issues
            const trimmedRecipes = recipesData.map(recipe => ({
                ...recipe,
                tags: recipe.tags?.map(tag => tag.trim()) || []
            }));
            setRecipes(trimmedRecipes);
        });
        return () => unsubscribe(); // cleanup
    }, []);

    async function handleDelete(id) {
        const confirmed = window.confirm("Delete this recipe?");
        if (!confirmed) return;
        await deleteRecipe(id);
    }

    return (
        <div className="recipe-list-view">
            {editing ? <EditModal
                title={editedTitle}
                tags={editedTags}
                id={editedId}
                closeHandle={() => setEditing(false)} /> : ""
            }

            <div className="search-bar">
                <SearchBarTitle titleValue={searchTitle} titleChangeHandle={(e) => setSearchTitle(e.target.value)} />
                <SearchBarTags tags={tags} tagClickHandle={handleTagClick} />
            </div>


            <div className="recipesList">
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
            <AddRecipeBox tagsToSelect={tags} />
        </div>
    );
}