export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center rounded-lg p-8 text-center">
      <h1 className="font-display text-lion mb-4 block text-5xl leading-none md:text-[13rem]">
        404
      </h1>
      <h2 className="mb-4 text-2xl font-bold">Not found :(</h2>

      <p className="mb-6 max-w-md">
        Hmm, we can&apos;t seem to find the page you&apos;re looking for. The
        link might be broken, or the page may have been moved. Please check the
        URL and try again.
      </p>
    </div>
  );
}
