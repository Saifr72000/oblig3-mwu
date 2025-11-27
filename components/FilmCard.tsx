import Link from "next/link";
import type { Film } from "@/lib/types";
import { getFilmPoster } from "@/lib/images";

export default function FilmCard({ film }: { film: Film }) {
  const posterSrc = getFilmPoster(film.id, film.image);

  return (
    <Link href={`/film/${film.id}`} className="film-card">
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "450px",
          overflow: "hidden",
        }}
      >
        <img
          src={posterSrc}
          alt={film.title}
          width="400"
          height="450"
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
      <div className="film-content">
        <div className="release-year">{film.release_date}</div>
        <h2>{film.title}</h2>
        <div className="original-title">{film.original_title}</div>
        <div className="film-info">
          <div className="info-item">
            <span className="info-label">Director:</span>
            <span>{film.director}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Producer:</span>
            <span>{film.producer}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Runtime:</span>
            <span>{film.running_time} mins</span>
          </div>
          <div className="info-item">
            <span className="rt-score">⭐ {film.rt_score}%</span>
          </div>
        </div>
        <div className="description">{film.description}</div>
      </div>
    </Link>
  );
}
