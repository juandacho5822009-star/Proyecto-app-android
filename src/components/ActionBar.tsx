type Modal = 'upgrade' | 'shop' | 'map' | null;

export function ActionBar({ onOpen }: { onOpen: (modal: Modal) => void }) {
  return (
    <div className="bg-gray-950/95 border-t-2 border-gray-700 flex items-center justify-around px-2 py-2 gap-2">
      <ActionBtn
        icon="🔧"
        label="UPGRADE"
        color="from-gray-700 to-gray-800 border-gray-600"
        onClick={() => onOpen('upgrade')}
      />
      <ActionBtn
        icon="📺"
        label="×92 AD"
        color="from-yellow-700 to-yellow-800 border-yellow-600"
        onClick={() => onOpen('shop')}
        badge="×92"
      />
      <ActionBtn
        icon="🏪"
        label="SHOP"
        color="from-purple-800 to-purple-900 border-purple-600"
        onClick={() => onOpen('shop')}
      />
      <ActionBtn
        icon="🗺️"
        label="MAPA"
        color="from-green-800 to-green-900 border-green-600"
        onClick={() => onOpen('map')}
      />
    </div>
  );
}

function ActionBtn({
  icon, label, color, onClick, badge,
}: {
  icon: string; label: string; color: string; onClick: () => void; badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl
        bg-gradient-to-b ${color} border active:scale-95 transition-transform shadow-lg`}
    >
      {badge && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold
          rounded-full px-1 py-0.5 border border-white">
          {badge}
        </span>
      )}
      <span className="text-2xl leading-none">{icon}</span>
      <span className="text-white text-[10px] font-bold mt-0.5 tracking-wider">{label}</span>
    </button>
  );
}

export type { Modal };
