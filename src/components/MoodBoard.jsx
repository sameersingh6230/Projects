import { useEffect, useMemo, useState } from 'react';

const defaultCards = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    caption: 'Soft blush palette with greenery',
    mood: 'Romantic'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    caption: 'Modern lounge seating and blue accents',
    mood: 'Contemporary'
  }
];

function MoodBoard() {
  const [cards, setCards] = useState(defaultCards);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [mood, setMood] = useState('Creative');

  useEffect(() => {
    const saved = window.localStorage.getItem('moodBoardCards');
    if (saved) {
      try {
        setCards(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to parse mood board cards from storage', error);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('moodBoardCards', JSON.stringify(cards));
  }, [cards]);

  const moodCount = useMemo(() => {
    return cards.reduce((acc, card) => {
      acc[card.mood] = (acc[card.mood] || 0) + 1;
      return acc;
    }, {});
  }, [cards]);

  const addCard = () => {
    if (!imageUrl.trim() || !caption.trim()) {
      return;
    }

    setCards(prev => [
      {
        id: Date.now(),
        image: imageUrl.trim(),
        caption: caption.trim(),
        mood
      },
      ...prev
    ]);
    setImageUrl('');
    setCaption('');
  };

  const removeCard = id => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  return (
    <section className="page-section moodboard-page">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">Mood board studio</span>
          <h1>Build a visual inspiration board for your event.</h1>
          <p>Gather imagery, color cues, and concept notes in one place so your planner stays aligned with the look and feel you want.</p>
        </div>
        <div className="mood-summary-card">
          <h2>Inspiration snapshot</h2>
          <div className="mood-stats">
            {Object.entries(moodCount).map(([label, value]) => (
              <div key={label} className="mood-pill">
                {label}: {value}
              </div>
            ))}
          </div>
          <p>{cards.length} card{cards.length === 1 ? '' : 's'} saved to your mood board.</p>
        </div>
      </div>

      <div className="moodboard-layout">
        <aside className="moodboard-sidebar interactive-panel">
          <h2>Add a new mood card</h2>
          <label>
            Image URL
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="Paste an inspirational image link"
            />
          </label>
          <label>
            Caption
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Describe the feeling or style"
            />
          </label>
          <label>
            Mood category
            <select value={mood} onChange={e => setMood(e.target.value)}>
              <option>Creative</option>
              <option>Romantic</option>
              <option>Bold</option>
              <option>Minimal</option>
              <option>Contemporary</option>
            </select>
          </label>
          <button type="button" className="button button-primary" onClick={addCard}>
            Save mood card
          </button>
        </aside>

        <div className="moodcard-grid">
          {cards.length === 0 ? (
            <div className="empty-state">
              Start by saving your first mood card. Add an image URL, caption, and mood category.
            </div>
          ) : (
            cards.map(card => (
              <article key={card.id} className="moodcard-card">
                <div className="moodcard-image" style={{ backgroundImage: `url(${card.image})` }} />
                <div className="moodcard-copy">
                  <span className="status-pill available">{card.mood}</span>
                  <p>{card.caption}</p>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => removeCard(card.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default MoodBoard;
