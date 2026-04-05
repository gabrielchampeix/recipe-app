import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Fragment } from "react";
import Tag from "./Tag";

async function fetchTags() {
    const querySnapshot = await getDocs(collection(db, "tags"));
    const tags = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return tags;
}

export default function SearchBar({ titleValue, titleChangeHandle }) {
    const [tags, setTags] = useState([])
    useEffect(() => {
        fetchTags().then(setTags);
    }, []);
    console.log(tags)

    return (
        <Fragment>
            <input
                type="text"
                placeholder="Search…"
                value={titleValue}
                onChange={titleChangeHandle}
            ></input>
            <div style={{ display: "flex", flexWrap: "wrap" }}>{tags.map(tag => (
                <Tag label={tag.label} />
            ))
            }</div>
        </Fragment>
    )
}