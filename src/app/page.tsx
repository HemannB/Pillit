import Image from "next/image";

const highlights = [
  {
    title: "Clareza diária",
    description:
      "Veja a tomada do dia, a posição na cartela e a próxima transição do ciclo.",
  },
  {
    title: "Acompanhamento seguro",
    description:
      "Compartilhe a rotina com alguém de confiança usando permissões controladas.",
  },
  {
    title: "Histórico confiável",
    description:
      "Consulte registros e correções sem perder o contexto de cada alteração.",
  },
] as const;

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-0 h-[38rem] bg-[radial-gradient(circle_at_top_left,_#dbe9ff_0,_transparent_45%),radial-gradient(circle_at_top_right,_#e5efff_0,_transparent_38%)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <a
            className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
            href="#inicio"
            aria-label="Pill.it — início"
          >
            <Image
              alt=""
              className="size-11 rounded-xl shadow-sm"
              height={44}
              priority
              src="/pillit-icon.svg"
              width={44}
            />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Pill.it
            </span>
          </a>

          <span className="rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 backdrop-blur">
            Em desenvolvimento
          </span>
        </header>

        <section
          className="grid items-center gap-14 pb-24 pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:pt-28"
          id="inicio"
        >
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Sua rotina em um só lugar
            </p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-6xl">
              Uma rotina que você não precisa guardar só na memória.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              O Pill.it ajuda a visualizar ciclos, registrar tomadas e reduzir
              dúvidas no acompanhamento diário de pílulas.
            </p>
            <a
              className="mt-9 inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
              href="#proposta"
            >
              Conheça a proposta
            </a>
          </div>

          <aside
            aria-label="Prévia da experiência diária"
            className="relative mx-auto w-full max-w-md"
          >
            <div
              aria-hidden="true"
              className="absolute -inset-5 -z-10 rotate-3 rounded-[2.5rem] bg-blue-200/50"
            />
            <div className="rounded-[2rem] border border-white bg-white p-6 shadow-2xl shadow-blue-950/10 sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Hoje</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    Próxima tomada
                  </p>
                </div>
                <span className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
                  21:00
                </span>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">Cartela 4</span>
                  <span className="text-slate-500">1 de 30</span>
                </div>
                <div
                  aria-hidden="true"
                  className="mt-5 grid grid-cols-5 gap-3"
                >
                  {Array.from({ length: 10 }, (_, index) => (
                    <span
                      className={
                        index === 0
                          ? "grid aspect-square place-items-center rounded-full bg-blue-600 text-sm font-bold text-white"
                          : "aspect-square rounded-full border-2 border-slate-300 bg-white"
                      }
                      key={index}
                    >
                      {index === 0 ? "✓" : null}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  Visualização ilustrativa da cartela
                </p>
              </div>

              <div className="mt-6 flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 font-semibold text-white">
                Confirmar tomada
              </div>
            </div>
          </aside>
        </section>

        <section
          className="scroll-mt-8 rounded-[2rem] bg-slate-950 px-6 py-12 text-white sm:px-10"
          id="proposta"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              Feito para aprender e ajudar
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Um produto simples por fora e responsável por dentro.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              O projeto combina uma experiência acessível com regras de negócio
              testáveis, privacidade e segurança desde a fundação.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {highlights.map((highlight) => (
              <article
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                key={highlight.title}
              >
                <h3 className="text-lg font-bold">{highlight.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">
                  {highlight.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer className="mx-auto max-w-3xl px-4 pb-4 pt-10 text-center text-sm leading-6 text-slate-500">
          O Pill.it apoia a organização da rotina. Não oferece diagnóstico,
          prescrição ou orientação clínica.
        </footer>
      </div>
    </main>
  );
}
