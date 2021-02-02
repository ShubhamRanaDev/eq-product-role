import React, { useState } from 'react';
import Fuse from 'fuse.js';


function FuzzySearch(props) {


    const [query, updateQuery] = useState('');

    const fuse = new Fuse(props.poi, {
        keys: [
            'name'
        ],
        includeScore: true
    });

    const results = fuse.search(query);
    const characterResults = query ? results.map(character => character.item) : props.poi;

    function onSearch({ currentTarget }) {
        updateQuery(currentTarget.value);
    }

    return (
        <>

            <header className="App-header">
                <div className="container">
                    <h1>Point of Interests</h1>
                </div>
            </header>

            <main className="container">
                <ul className="characters">
                    {characterResults.map(character => {
                        const { name, lat, lon} = character;
                        return (
                            <li key={name} className="character">
                <span className="character-thumb" />
                                <ul className="character-meta">
                                    <li>
                                        <strong>Name:</strong> { name }
                                    </li>
                                    <li>
                                        <strong>Latitude:</strong> { lat }
                                    </li>
                                    <li>
                                        <strong>Longitude:</strong> { lon }
                                    </li>
                                </ul>
                            </li>
                        )
                    })}
                </ul>
                <aside>
                    <form className="search">
                        <label>Search</label>
                        <input type="text" value={query} onChange={onSearch} />
                    </form>
                </aside>
            </main>

        </>
    );
}

export default FuzzySearch;
