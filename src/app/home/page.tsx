"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; 
import styles from "./home.module.css";

type Song = {
  id: string;
  name: string;
  file: File;
  liked: boolean;
  audioURL: string;
};

const HomePage = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    const savedSongs = localStorage.getItem("uploadedSongs");
    if (savedSongs) {
      setSongs(JSON.parse(savedSongs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("uploadedSongs", JSON.stringify(songs));
  }, [songs]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newSongs = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        file: file,
        liked: false,
        audioURL: URL.createObjectURL(file),
      }));
      setSongs((prevSongs) => [...prevSongs, ...newSongs]);
    }
  };

  const toggleLike = (id: string) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === id ? { ...song, liked: !song.liked } : song
      )
    );
  };

  const playSong = (song: Song) => {
    setCurrentSong(song);
  };

  return (
    <div className={styles.home}>
      <Navbar /> 

      <header className={styles.header}>
        <h1>🎵 Bienvenido a Kodigo Music 🎵</h1>
        <p>Organiza y disfruta de tus canciones favoritas.</p>
      </header>

      <div className={styles.container}>
        {/* Subir Canciones */}
        <section className={styles.section}>
          <h2>📤 Subir Canciones</h2>
          <input
            type="file"
            multiple
            accept="audio/*"
            onChange={handleFileUpload}
            className={styles.uploadInput}
          />
        </section>

        <section className={styles.section}>
          <h2>📂 Playlist</h2>
          <div className={styles.songGrid}>
            {songs.map((song) => (
              <div key={song.id} className={styles.songCard}>
                <div className={styles.songInfo}>
                  <p className={styles.songTitle}>{song.name}</p>
                </div>
                <div className={styles.songActions}>
                  <button
                    className={`${styles.likeButton} ${
                      song.liked ? styles.liked : ""
                    }`}
                    onClick={() => toggleLike(song.id)}
                  >
                    {song.liked ? "❤️ Me gusta" : "🤍 Me gusta"}
                  </button>
                  <button
                    className={styles.playButton}
                    onClick={() => playSong(song)}
                  >
                    ▶️ Reproducir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>❤️ Me gusta</h2>
          <div className={styles.songGrid}>
            {songs.filter((song) => song.liked).map((song) => (
              <div key={song.id} className={styles.songCard}>
                <div className={styles.songInfo}>
                  <p className={styles.songTitle}>{song.name}</p>
                </div>
                <div className={styles.songActions}>
                  <button
                    className={styles.playButton}
                    onClick={() => playSong(song)}
                  >
                    ▶️ Reproducir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {currentSong && (
        <footer className={styles.audioPlayer}>
          <h3>Reproduciendo: {currentSong.name}</h3>
          <audio controls autoPlay src={currentSong.audioURL}>
            Tu navegador no soporta el reproductor de audio.
          </audio>
        </footer>
      )}
    </div>
  );
};

export default HomePage;
