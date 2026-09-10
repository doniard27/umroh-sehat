'use client';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

export interface FacilityItem {
  icon: string;
  title: string;
  desc: string;
}

interface FacilitiesEditorProps {
  value: FacilityItem[];
  onChange: (items: FacilityItem[]) => void;
  onReset?: () => void;
}

const emptyItem = (): FacilityItem => ({
  icon: '✅',
  title: '',
  desc: '',
});

export default function FacilitiesEditor({ value, onChange, onReset }: FacilitiesEditorProps) {
  const update = (index: number, field: keyof FacilityItem, v: string) => {
    const next = [...value];
    next[index] = { ...next[index], [field]: v };
    onChange(next);
  };

  const add = () => onChange([...value, emptyItem()]);
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Daftar fasilitas khusus paket ini ({value.length} item)</span>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Kosongkan
          </button>
        )}
      </div>

      {value.length === 0 && (
        <p className="text-xs text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-center">
          Belum ada fasilitas khusus. Klik &quot;+ Tambah Fasilitas&quot; di bawah — kosongkan jika ingin memakai fasilitas umum website.
        </p>
      )}

      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={index} className="bg-gray-50/90 border border-gray-200 rounded-xl p-3.5 flex flex-col gap-2.5 relative group">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                maxLength={4}
                value={item.icon}
                onChange={(e) => update(index, 'icon', e.target.value)}
                className="w-12 h-10 text-center text-xl bg-white border border-gray-200 rounded-lg shadow-xs focus:ring-2 focus:ring-[#0B6E4F] outline-none"
                title="Emoji ikon"
              />
              <input
                type="text"
                value={item.title}
                onChange={(e) => update(index, 'title', e.target.value)}
                placeholder="Nama fasilitas (contoh: Hotel Bintang 5)"
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-[#0B6E4F] outline-none"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus fasilitas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={item.desc}
              onChange={(e) => update(index, 'desc', e.target.value)}
              placeholder="Penjelasan singkat fasilitas"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-[#0B6E4F] outline-none"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#0B6E4F]/30 text-[#0B6E4F] text-sm font-semibold hover:bg-[#0B6E4F]/5 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Tambah Fasilitas
      </button>
    </div>
  );
}
