export default function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Pill.it
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          Sua rotina, com mais clareza.
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          A base da aplicação está pronta. As funcionalidades serão entregues de
          forma incremental, segura e testável.
        </p>
      </section>
    </main>
  );
}
