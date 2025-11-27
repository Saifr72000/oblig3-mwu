import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  fetchFilms,
  fetchFilm,
  fetchPerson,
  fetchSpeciesByUrl,
  fetchLocation,
  fetchVehicle,
  isValidResourceUrl,
} from "@/lib/api";
import type { Person, Species } from "@/lib/types";

// Generate static params for all films at build time
export async function generateStaticParams() {
  const films = await fetchFilms();

  return films.map((film) => ({
    id: film.id,
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
  const film = await fetchFilm(id);

  if (!film) {
    return {
      title: "Film Not Found",
    };
  }

  return {
    title: `${film.title} - Studio Ghibli`,
    description: film.description,
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

export default async function FilmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const film = await fetchFilm(id);

  if (!film) {
    notFound();
  }

  // Fetch all people (characters)
  const validPeopleUrls = film.people.filter(isValidResourceUrl);
  const peoplePromises = validPeopleUrls.map((url) => fetchPerson(url));
  const people = await Promise.all(peoplePromises);
  const validPeople = people.filter((p): p is Person => p !== null);

  // Fetch species for each person and enrich the data
  const enrichedPeople = await Promise.all(
    validPeople.map(async (person) => {
      let speciesData: Species | null = null;
      if (
        person.species &&
        typeof person.species === "string" &&
        person.species.startsWith("http")
      ) {
        speciesData = await fetchSpeciesByUrl(person.species);
      }
      return { ...person, speciesData };
    })
  );

  // Fetch locations
  const validLocationUrls = film.locations.filter(isValidResourceUrl);
  const locationsPromises = validLocationUrls.map((url) => fetchLocation(url));
  const locations = await Promise.all(locationsPromises);
  const validLocations = locations.filter((l) => l !== null);

  // Fetch species
  const validSpeciesUrls = film.species.filter(isValidResourceUrl);
  const speciesPromises = validSpeciesUrls.map((url) => fetchSpeciesByUrl(url));
  const species = await Promise.all(speciesPromises);
  const validSpecies = species.filter((s) => s !== null);

  // Fetch vehicles
  const validVehicleUrls = film.vehicles.filter(isValidResourceUrl);
  const vehiclesPromises = validVehicleUrls.map((url) => fetchVehicle(url));
  const vehicles = await Promise.all(vehiclesPromises);
  const validVehicles = vehicles.filter((v) => v !== null);

  return (
    <>
      <header>
        <div className="container">
          <h1 className="logo">STUDIO GHIBLI</h1>
          <Link href="/" className="back-btn">
            ← Back to All Films
          </Link>
        </div>
      </header>

      <main className="container">
        <div className="film-detail">
          {/* Hero Banner */}
          <div className="detail-hero">
            <div
              style={{ position: "relative", width: "100%", height: "400px" }}
            >
              <Image
                src={film.movie_banner || film.image}
                alt={film.title}
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
                priority
                quality={90}
              />
            </div>
          </div>

          {/* Film Header */}
          <div className="detail-header">
            <h2>{film.title}</h2>
            <div className="detail-original-title">
              {film.original_title} ({film.original_title_romanised})
            </div>

            <div className="info-grid">
              <div className="info-box">
                <div className="info-box-label">Release Year</div>
                <div className="info-box-value">{film.release_date}</div>
              </div>
              <div className="info-box">
                <div className="info-box-label">Director</div>
                <div className="info-box-value">{film.director}</div>
              </div>
              <div className="info-box">
                <div className="info-box-label">Producer</div>
                <div className="info-box-value">{film.producer}</div>
              </div>
              <div className="info-box">
                <div className="info-box-label">Running Time</div>
                <div className="info-box-value">{film.running_time} mins</div>
              </div>
              <div className="info-box">
                <div className="info-box-label">RT Score</div>
                <div className="info-box-value">⭐ {film.rt_score}%</div>
              </div>
            </div>

            <div className="detail-description">{film.description}</div>
          </div>

          {/* Characters Section */}
          <div className="characters-section">
            <h3 className="section-title">
              Characters ({enrichedPeople.length})
            </h3>
            {enrichedPeople.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-dark)" }}>
                No character information available for this film.
              </p>
            ) : (
              <div className="characters-grid">
                {enrichedPeople.map((person) => (
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
                      {person.speciesData && (
                        <div className="character-detail-item">
                          <span className="detail-label">Species:</span>
                          <span className="detail-value">
                            <Link
                              href={`/species/${person.speciesData.id}`}
                              className="species-link"
                            >
                              {person.speciesData.name}
                            </Link>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="additional-section">
            <h3 className="section-title">Additional Information</h3>

            {/* Locations */}
            <div className="info-section">
              <h4>Locations ({validLocations.length})</h4>
              <div className="info-list">
                {validLocations.length === 0 ? (
                  <div className="info-tag">None</div>
                ) : (
                  validLocations.map((location) => (
                    <div key={location.id} className="info-tag">
                      {location.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Species */}
            <div className="info-section">
              <h4>Species ({validSpecies.length})</h4>
              <div className="info-list">
                {validSpecies.length === 0 ? (
                  <div className="info-tag">None</div>
                ) : (
                  validSpecies.map((spec) => (
                    <div key={spec.id} className="info-tag">
                      {spec.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Vehicles */}
            <div className="info-section">
              <h4>Vehicles ({validVehicles.length})</h4>
              <div className="info-list">
                {validVehicles.length === 0 ? (
                  <div className="info-tag">None</div>
                ) : (
                  validVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="info-tag">
                      {vehicle.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
