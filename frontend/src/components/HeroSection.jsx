export default function HeroSection(){
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, var(--fc-primary) 0%, var(--fc-primary-600) 45%, var(--fc-accent) 100%)`
        }}
      />
      <div className="container-gz py-12 md:py-16 text-white">
        <h1 className="text-3xl md:text-5xl font-black leading-tight">Carogna League</h1>
        <p className="mt-2 text-white/90 max-w-2xl">
          Notizie, risultati, formazioni e analisi della nostra lega fantacalcio — stile Gazzetta, con velocità e precisione.
        </p>
      </div>
    </section>
  );
}
