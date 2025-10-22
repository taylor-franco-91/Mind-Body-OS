'use client';
import { useState, useRef } from 'react';

export default function PhotoUploader({
    title,
    onUpload,
}: {
    title: string;
    onUpload: (url: string, file: File) => void;
}) {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
        onUpload(url, file);
    }

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 text-sm text-zinc-400">{title}</div>

            <div
                className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-black/30 ring-1 ring-white/10"
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
            >
                {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt={`${title} preview`} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                        Tap to upload
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="mt-3 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-emerald-400 file:px-3 file:py-1.5 file:text-black hover:file:opacity-90"
            />
        </div>
    );
}
