import Link from "next/link";
import Image from "next/image";
import type { Film } from "@/lib/types";

export default function FilmCard({ film }: { film: Film }) {
  return (
    <Link href={`/film/${film.id}`} className="film-card">
      <div style={{ position: "relative", width: "100%", height: "450px" }}>
        <Image
          src={film.image}
          alt={film.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          loading="lazy"
          quality={60}
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
