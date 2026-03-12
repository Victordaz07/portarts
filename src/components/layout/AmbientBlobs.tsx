export function AmbientBlobs() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-30 -top-[12%] -left-[8%] animate-[blobFloat_24s_ease-in-out_infinite_alternate]"
        style={{
          background:
            "radial-gradient(circle, rgba(232,197,71,.09), transparent 70%)",
        }}
      />
      <div
        className="absolute w-[450px] h-[450px] rounded-full blur-[140px] opacity-30 bottom-[5%] -right-[4%] animate-[blobFloat_24s_ease-in-out_infinite_alternate]"
        style={{
          background:
            "radial-gradient(circle, rgba(71,197,232,.06), transparent 70%)",
          animationDelay: "-9s",
        }}
      />
    </div>
  );
}
