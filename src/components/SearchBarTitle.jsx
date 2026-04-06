export default function SearchBarTitle({ titleValue, titleChangeHandle }) {
    return (
        <div>
            <h4>Search</h4>
            <input
                type="text"
                placeholder="Search…"
                value={titleValue}
                onChange={titleChangeHandle}
            ></input>
        </div>
    )
}