import { useEffect, useState } from "react";
import Card from "./components/Card";
import axios from "axios";

function BusinessCard() {
  const [cards, setCards] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    interests: '',
    socialMedia: '',
  });


  const fetchCards = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cards");
      setCards(response.data); 
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const interests = formData.interests.split(',').map(item => item.trim());
    const socialMedia = formData.socialMedia.split(',').map(item => {
      const [platform, link] = item.split(':');
      return { platform: platform.trim(), link: link.trim() };
    });

    try {
      await axios.post("http://localhost:3000/cards", {
        ...formData,
        interests,
        socialMedia,
      });

      setFormData({ name: '', description: '', interests: '', socialMedia: '' });
      fetchCards();
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="interests"
          placeholder="Interests (comma separated)"
          value={formData.interests}
          onChange={handleChange}
          required
        />
        <input
          name="socialMedia"
          placeholder="Social Handles (platform: link, comma separated)"
          value={formData.socialMedia}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Card</button>
      </form>

      <div>
        {cards.map((card) => (
          <Card
            key={card._id}
            name={card.name}
            description={card.description}
            interests={card.interests}
            socialMedia={card.socialMedia}
          />
        ))}
      </div>
    </div>
  );
}

export default BusinessCard;