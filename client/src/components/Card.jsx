import React from 'react';

const Card = ({ name, description, socialMedia, interests }) => {
    return (
        <div className="card">
            <h2>{name}</h2>
            <p>{description}</p>
            <h3>Interests:</h3>
            <ul>
                {interests.map((interest, index) => (
                    <li key={index}>{interest}</li>
                ))}
            </ul>
            <div>
                {socialMedia.map((platform, index) => (
                    <a href={platform.link} target="_blank" rel="noopener noreferrer" key={index}>
                        <button>{platform.platform}</button>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Card;
