'use client';
import { useState } from 'react';
import PhotoUploader from '@/components/PhotoUploader';
import DateBadge from '@/components/DateBadge';
import { useLocalStorage } from '@/lib/useLocalStorage';

type Feeling = 'exhausted' | 'low' | 'average' | 'good' | 'excellent';

export default function CheckInPage() {
    // top-line feeling
    const [feeling, setFeeling] = useState<Feeling>('average');

    // sliders 0–10
    const [sleep, setSleep] = useState(5);
    const [energy, setEnergy] = useState(5);
    const [stress, setStress] = useState(5);
    const [soreness, setSoreness] = useState(5);

    // notes
    const [notes, setNotes] = useState('');

    // progress photos (front/side/back)
    const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
    const [sidePhoto, setSidePhoto] = useState<string | null>(null);
    const [backPhoto, setBackPhoto] = useState<string | null>(null);

    // keep files (for future upload to storage)
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [sideFile, setSideFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);

    // persist last check-in locally
    const [_, setLastCheckIn] = useLocalStorage<any>('lastCheckIn', null);

    function handleSave() {
        const payload = {
            date: new Date().toISOString(),
            feeling,
            metrics: { sleep, energy, stress, soreness },
            notes,
            photos: { front: frontPhoto, side: sidePhoto, back: backPhoto },
            // optional file names for debugging now; real upload later
            _fileDebug: {
                front: frontFile?.name ?? null,
                side: sideFile?.name ?? null,
                back: backFile?.name ?? null,
            },
        };
        setLastCheckIn(payload);
        alert(`Saved check-in:\n${JSON.stringify(payload, null, 2)}`);
    }

    const feelingOptions: { key: Feeling; label: string }[] = [
        { key: 'exhausted', label: 'Exhausted' },
        { key: 'low', label: 'Low' },
        { key: 'average', label: 'Average' },
        { key: 'good', label: 'Good' },
        { key: 'excellent', label: 'Excellent' },
    ];

    return (
        <div className="p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Daily Check-in</h1>
                <DateBadge />
            </div>
            <p className="mt-2 text-zinc-400">Log how you’re feeling today. We’ll adapt your plan.</p>

            {/* Feeling chips */}
            <div className="mt-6 max-w-2xl rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm text-zinc-400">How are you feeling today?</div>
                <div className="mt-3 flex flex-wrap gap-2">
                    {feelingOptions.map((f) => {
                        const active = feeling === f.key;
                        return (
                            <button
                                key={f.key}
                                onClick={() => setFeeling(f.key)}
                                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${active ? 'bg-emerald-400 text-black' : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                                    }`}
                            >
                                {f.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sliders */}
            <div className="mt-6 grid max-w-2xl gap-6">
                <SliderCard
                    title="Sleep Quality"
                    hint="0 = poor · 10 = excellent"
                    value={sleep}
                    setValue={setSleep}
                />
                <SliderCard
                    title="Energy Level"
                    hint="0 = drained · 10 = unstoppable"
                    value={energy}
                    setValue={setEnergy}
                />
                <SliderCard
                    title="Stress Level"
                    hint="0 = none · 10 = maxed"
                    value={stress}
                    setValue={setStress}
                />
                <SliderCard
                    title="Soreness"
                    hint="0 = fresh · 10 = wrecked"
                    value={soreness}
                    setValue={setSoreness}
                />
            </div>

            {/* Notes */}
            <div className="mt-6 grid max-w-2xl gap-6">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm text-zinc-400">Additional notes</div>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        placeholder="Anything else we should know for today?"
                        className="mt-3 w-full rounded-lg bg-black/40 p-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-emerald-400"
                    />
                </div>
            </div>

            {/* Weekly Progress Photos */}
            <div className="mt-6 max-w-5xl rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-baseline justify-between">
                    <div>
                        <div className="text-sm text-zinc-400">Weekly Progress Photos</div>
                        <div className="mt-1 text-xl font-semibold">Front · Side · Back</div>
                    </div>
                    <div className="text-xs text-zinc-500">Private to you and your coach</div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <PhotoUploader
                        title="Front View"
                        onUpload={(url, file) => {
                            setFrontPhoto(url);
                            setFrontFile(file);
                        }}
                    />
                    <PhotoUploader
                        title="Side View"
                        onUpload={(url, file) => {
                            setSidePhoto(url);
                            setSideFile(file);
                        }}
                    />
                    <PhotoUploader
                        title="Back View"
                        onUpload={(url, file) => {
                            setBackPhoto(url);
                            setBackFile(file);
                        }}
                    />
                </div>

                <p className="mt-3 text-xs text-zinc-500">
                    Photos are private and only visible to you and your coach. They will be used to track your progress over time.
                </p>
            </div>

            {/* Save */}
            <div className="mt-8">
                <button
                    onClick={handleSave}
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-lime-400 to-cyan-400 px-6 py-3 text-lg font-semibold text-black transition hover:opacity-90 active:opacity-80"
                >
                    Save Check-in
                </button>
            </div>
        </div>
    );
}

/** Small slider card component for reuse */
function SliderCard({
    title,
    hint,
    value,
    setValue,
}: {
    title: string;
    hint: string;
    value: number;
    setValue: (n: number) => void;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm text-zinc-400">{title}</div>
                    <div className="mt-1 text-xl font-semibold">{value}/10</div>
                </div>
                <div className="text-xs text-zinc-500">{hint}</div>
            </div>

            <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="mt-6 w-full accent-emerald-400"
            />

            <div className="mt-2 flex justify-between text-xs text-zinc-500">
                <span>0</span>
                <span>5</span>
                <span>10</span>
            </div>
        </div>
    );
}
