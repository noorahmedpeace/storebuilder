import { Box, Layers3, ShoppingBag, Sparkles } from "lucide-react";

const cards = [
  { title: "Fashion", stat: "Lookbook", tone: "from-[#f4d0d2] to-[#9d5360]" },
  { title: "Electronics", stat: "Catalog", tone: "from-[#a9d6e8] to-[#143c3a]" },
  { title: "Grocery", stat: "Delivery", tone: "from-[#b9ddb7] to-[#4b7f52]" },
];

export function ImmersiveShowcase() {
  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-lg border border-white/10 bg-[#102321] p-5 shadow-2xl [perspective:1200px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(80,183,154,0.35),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(243,183,79,0.22),transparent_24%)]" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9fcfc0]">
            3D Store Builder
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Template scene preview
          </h2>
        </div>
        <span className="grid size-11 place-items-center rounded-lg bg-white/10 text-[#f3b74f]">
          <Box size={21} />
        </span>
      </div>

      <div className="relative z-10 mt-9 h-[290px] [transform-style:preserve-3d]">
        {cards.map((card, index) => (
          <div
            key={card.title}
            className={[
              "absolute top-8 w-48 rounded-lg border border-white/20 bg-white/12 p-4 shadow-2xl backdrop-blur",
              index === 0
                ? "left-0 rotate-[-12deg] [transform:rotateY(22deg)_rotateZ(-10deg)_translateZ(46px)]"
                : index === 1
                  ? "left-1/2 -translate-x-1/2 [transform:rotateX(4deg)_translateZ(92px)]"
                  : "right-0 rotate-[10deg] [transform:rotateY(-22deg)_rotateZ(10deg)_translateZ(34px)]",
            ].join(" ")}
          >
            <div className={`aspect-[4/3] rounded-lg bg-gradient-to-br ${card.tone}`} />
            <p className="mt-4 text-sm font-bold text-white">{card.title}</p>
            <p className="mt-1 font-mono text-xs text-white/62">{card.stat}</p>
          </div>
        ))}

        <div className="absolute bottom-4 left-1/2 grid size-28 -translate-x-1/2 place-items-center rounded-2xl border border-white/20 bg-[#f3b74f] text-[#102321] shadow-2xl [transform:rotateX(58deg)_rotateZ(45deg)]">
          <ShoppingBag className="-rotate-45" size={30} />
        </div>

        <div className="absolute bottom-0 left-6 rounded-lg border border-white/10 bg-black/25 p-4 text-white backdrop-blur">
          <Layers3 className="text-[#9fcfc0]" size={18} />
          <p className="mt-2 text-sm font-bold">Scene JSON</p>
          <p className="mt-1 text-xs text-white/62">objects, blocks, lights, animations</p>
        </div>

        <div className="absolute bottom-0 right-6 rounded-lg border border-white/10 bg-black/25 p-4 text-white backdrop-blur">
          <Sparkles className="text-[#f3b74f]" size={18} />
          <p className="mt-2 text-sm font-bold">AI Layout</p>
          <p className="mt-1 text-xs text-white/62">generate sections from business type</p>
        </div>
      </div>
    </div>
  );
}
