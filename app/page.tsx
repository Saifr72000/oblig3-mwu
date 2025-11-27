import { fetchFilms } from "@/lib/api";
import type { Film } from "@/lib/types";
import FilmCard from "@/components/FilmCard";
import Script from "next/script";

// Enable static generation
export const dynamic = "force-static";

export default async function HomePage() {
  const films = await fetchFilms();
  const sortedFilms = [...films].sort(
    (a, b) => parseInt(a.release_date) - parseInt(b.release_date)
  );

  return (
    <>
      {/* Soot Sprites - server-rendered HTML */}
      <div className="soot-sprites">
        <div
          className="soot-sprite"
          style={{ left: "10%", animationDelay: "0s", width: "28px", height: "28px" }}
        ></div>
        <div
          className="soot-sprite"
          style={{ left: "25%", animationDelay: "2s", width: "32px", height: "32px" }}
        ></div>
        <div
          className="soot-sprite"
          style={{ left: "45%", animationDelay: "4s", width: "26px", height: "26px" }}
        ></div>
        <div
          className="soot-sprite"
          style={{ left: "65%", animationDelay: "1s", width: "30px", height: "30px" }}
        ></div>
        <div
          className="soot-sprite"
          style={{ left: "80%", animationDelay: "3s", width: "34px", height: "34px" }}
        ></div>
        <div
          className="soot-sprite"
          style={{ left: "90%", animationDelay: "5s", width: "27px", height: "27px" }}
        ></div>
      </div>

      {/* Kodama - pure CSS, no JS needed */}
      <div className="kodama-container">
        <div className="kodama" style={{ left: "15%", top: "20%" }}></div>
        <div className="kodama" style={{ left: "75%", top: "35%" }}></div>
        <div className="kodama" style={{ left: "30%", top: "60%" }}></div>
      </div>

      {/* Leaves - pure CSS, no JS needed */}
      <div className="leaves">
        <div className="leaf" style={{ left: "10%", animationDelay: "0s" }}></div>
        <div className="leaf" style={{ left: "20%", animationDelay: "2s" }}></div>
        <div className="leaf" style={{ left: "35%", animationDelay: "4s" }}></div>
        <div className="leaf" style={{ left: "50%", animationDelay: "1s" }}></div>
        <div className="leaf" style={{ left: "65%", animationDelay: "5s" }}></div>
        <div className="leaf" style={{ left: "70%", animationDelay: "3s" }}></div>
        <div className="leaf" style={{ left: "85%", animationDelay: "6s" }}></div>
        <div className="leaf" style={{ left: "95%", animationDelay: "7s" }}></div>
      </div>

      <header>
        <div className="container">
          <h1 className="logo">STUDIO GHIBLI</h1>
          <p className="tagline">Explore the Magical World of Ghibli</p>
        </div>
      </header>

      <main className="container">
        <div className="films-grid">
          {sortedFilms.map((film: Film) => (
            <FilmCard film={film} key={film.id} />
          ))}
        </div>
      </main>

      {/* Vanilla JS for Soot Sprite interactivity - lazy loaded */}
      <Script id="soot-interaction" strategy="lazyOnload">
        {`
          (function() {
            const initSootEasterEgg = () => {
              const sootSprites = document.querySelectorAll('.soot-sprite');
              sootSprites.forEach((sprite) => {
                sprite.addEventListener('click', (e) => {
                  e.stopPropagation();
                  triggerSootExplosion(sprite, e);
                });
              });
            };

            const triggerSootExplosion = (sprite, clickEvent) => {
              if (sprite.classList.contains('soot-exploding')) return;

              const clickX = clickEvent.clientX;
              const clickY = clickEvent.clientY;

              sprite.classList.add('soot-exploding');
              sprite.style.animation = 'sootDisintegrate 1100ms ease-out forwards';

              const particles = 22 + Math.floor(Math.random() * 16);
              for (let i = 0; i < particles; i++) {
                createParticle(clickX, clickY);
              }

              setTimeout(() => {
                sprite.classList.add('soot-hidden');
                sprite.classList.remove('soot-exploding');
                sprite.style.animation = '';

                setTimeout(() => {
                  sprite.classList.remove('soot-hidden');
                  sprite.style.animation = '';
                  sprite.style.top = '100%';
                  void sprite.offsetHeight;
                  sprite.style.animation = 'sootFloat 25s infinite ease-in-out';
                }, 1000);
              }, 1100);
            };

            const createParticle = (x, y) => {
              const p = document.createElement('div');
              p.className = 'soot-particle';
              const size = 4 + Math.random() * 4;
              p.style.width = size + 'px';
              p.style.height = size + 'px';

              const angle = Math.random() * Math.PI * 2;
              const dist = 40 + Math.random() * 120;
              const upwardBias = -20 - Math.random() * 60;
              const tx = Math.round(Math.cos(angle) * dist) + 'px';
              const ty = Math.round(Math.sin(angle) * dist + upwardBias) + 'px';
              const rot = Math.round((Math.random() - 0.5) * 720) + 'deg';

              p.style.left = x - size / 2 + 'px';
              p.style.top = y - size / 2 + 'px';
              p.style.setProperty('--tx', tx);
              p.style.setProperty('--ty', ty);
              p.style.setProperty('--r', rot);
              document.body.appendChild(p);

              setTimeout(() => {
                p.remove();
              }, 1450);
            };

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initSootEasterEgg);
            } else {
              initSootEasterEgg();
            }
          })();
        `}
      </Script>
    </>
  );
}