export const sortData = (items, sort = "asc") => {

    if (sort === "desc") {
        return items.toSorted((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    } else if (sort === "asc") {
        return items.toSorted((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
    }

    return items;
};