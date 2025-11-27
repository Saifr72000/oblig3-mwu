import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchFilms,
  fetchSpecies,
  fetchPerson,
  fetchFilmByUrl,
  isValidResourceUrl,
  extractIdFromUrl,
} from "@/lib/api";
import type { Person, Film } from "@/lib/types";

// Generate static params for all species at build time
export async function generateStaticParams() {
  const films = await fetchFilms();
  const speciesIds = new Set<string>();

  // Collect all unique species IDs from all films
  for (const film of films) {
    for (const speciesUrl of film.species) {
      if (isValidResourceUrl(speciesUrl)) {
        const id = extractIdFromUrl(speciesUrl);
        speciesIds.add(id);
      }
    }
  }

  return Array.from(speciesIds).map((id) => ({
    id,
  }));
}

// Enable static generation
export const dynamic = "force-static";

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const species = await fetchSpecies(id);

  if (!species) {
    return {
      title: "Species Not Found",
    };
  }

  return {
    title: `${species.name} - Studio Ghibli Species`,
    description: `Learn about ${species.name}, a ${species.classification} from Studio Ghibli films.`,
  };
}

// Helper functions
function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getAvatarColor(gender: string): string {
  if (!gender) return "avatar-neutral";
  const genderLower = gender.toLowerCase();
  if (genderLower === "female") return "avatar-female";
  if (genderLower === "male") return "avatar-male";
  return "avatar-neutral";
}

function capitalize(str: string): string {
  if (!str || str === "n/a" || str === "NA") return str;
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getSpeciesHeroClass(classification: string): string {
  const lowerClass = classification.toLowerCase();
  if (lowerClass.includes("mammal")) return "species-hero-mammal";
  if (lowerClass.includes("spirit")) return "species-hero-spirit";
  if (lowerClass.includes("bird")) return "species-hero-bird";
  return "species-hero-default";
}

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const species = await fetchSpecies(id);

  if (!species) {
    notFound();
  }

  // Fetch all people (characters) of this species
  const validPeopleUrls = species.people.filter(isValidResourceUrl);
  const peoplePromises = validPeopleUrls.map((url) => fetchPerson(url));
  const people = await Promise.all(peoplePromises);
  const validPeople = people.filter((p): p is Person => p !== null);

  // Fetch all films featuring this species
  const validFilmUrls = species.films.filter(isValidResourceUrl);
  const filmsPromises = validFilmUrls.map((url) => fetchFilmByUrl(url));
  const films = await Promise.all(filmsPromises);
  const validFilms = films.filter((f): f is Film => f !== null);

  return (
    <>
      <header>
        <div className="container">
          <h1 className="logo">STUDIO GHIBLI</h1>
          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/" className="back-btn">
              ← All Films
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="species-detail">
          {/* Species Hero */}
          <div
            className={`species-hero ${getSpeciesHeroClass(
              species.classification
            )}`}
          >
            <div className="species-hero-content">
              <h2 className="species-hero-title">{species.name}</h2>
              <div className="species-hero-subtitle">
                {species.classification}
              </div>
            </div>
          </div>

          {/* Species Details */}
          <div className="detail-header">
            <h3 className="section-title">Species Information</h3>

            <div className="info-grid">
              <div className="info-box">
                <div className="info-box-label">Classification</div>
                <div className="info-box-value">{species.classification}</div>
              </div>
              {species.eye_colors && species.eye_colors !== "n/a" && (
                <div className="info-box">
                  <div className="info-box-label">Eye Colors</div>
                  <div className="info-box-value">
                    {capitalize(species.eye_colors)}
                  </div>
                </div>
              )}
              {species.hair_colors && species.hair_colors !== "n/a" && (
                <div className="info-box">
                  <div className="info-box-label">Hair Colors</div>
                  <div className="info-box-value">
                    {capitalize(species.hair_colors)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Characters of this species */}
          <div className="characters-section">
            <h3 className="section-title">Characters ({validPeople.length})</h3>
            {validPeople.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-dark)" }}>
                No character information available for this species.
              </p>
            ) : (
              <div className="characters-grid">
                {validPeople.map((person) => (
                  <div key={person.id} className="character-card">
                    <div
                      className={`character-avatar ${getAvatarColor(
                        person.gender
                      )}`}
                    >
                      {getInitials(person.name)}
                    </div>
                    <h4>{person.name}</h4>
                    <div className="character-details">
                      {person.gender && (
                        <div className="character-detail-item">
                          <span className="detail-label">Gender:</span>
                          <span className="detail-value">
                            {capitalize(person.gender)}
                          </span>
                        </div>
                      )}
                      {person.age && (
                        <div className="character-detail-item">
                          <span className="detail-label">Age:</span>
                          <span className="detail-value">{person.age}</span>
                        </div>
                      )}
                      {person.eye_color && (
                        <div className="character-detail-item">
                          <span className="detail-label">Eye Color:</span>
                          <span className="detail-value">
                            {capitalize(person.eye_color)}
                          </span>
                        </div>
                      )}
                      {person.hair_color && (
                        <div className="character-detail-item">
                          <span className="detail-label">Hair Color:</span>
                          <span className="detail-value">
                            {capitalize(person.hair_color)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Films featuring this species */}
          <div className="additional-section">
            <h3 className="section-title">Films Featuring this Species</h3>
            {validFilms.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-dark)" }}>
                No film information available.
              </p>
            ) : (
              <div className="info-list">
                {validFilms.map((film) => (
                  <Link
                    key={film.id}
                    href={`/film/${film.id}`}
                    className="info-tag"
                    style={{ cursor: "pointer", textDecoration: "none" }}
                  >
                    {film.title} {/* ({film.release_date}) */}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
