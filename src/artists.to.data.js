export function artistsToDatasets(artists) {
    return artists.map((a) => {
        return {
            label: a.name,
            data: a.allTracks().map((t) => {
                return {
                    location: a.departementNo,
                    date: t.releaseYear,
                    value: 1,
                };
            }),
        };
    });
}
