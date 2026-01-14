import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X } from 'lucide-react'
import { Button } from './ui/Button'
import { cn } from '../lib/utils'

interface UploadFormProps {
    onImageSelect: (file: File) => void
}

export function UploadForm({ onImageSelect }: UploadFormProps) {
    const [dragActive, setDragActive] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [consented, setConsented] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = (file: File) => {
        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file.")
            return
        }
        setFile(file)
        const url = URL.createObjectURL(file)
        setPreview(url)
    }

    const handleRemove = () => {
        setFile(null)
        setPreview(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    const handleSubmit = () => {
        if (file && consented) {
            onImageSelect(file)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto space-y-6"
        >
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-brand font-bold text-white">SUBMIT YOURSELF</h2>
                <p className="text-white/60 text-sm">Upload a clear photo. Don't hide.</p>
            </div>

            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                            "relative h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer glass-panel group",
                            dragActive ? "border-neon-green bg-neon-green/5" : "border-white/20 hover:border-white/40"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:bg-white/10 transition-colors">
                            <Upload className="w-8 h-8 text-white/70" />
                        </div>
                        <p className="text-white/80 font-medium">Click or drag photo here</p>
                        <p className="text-white/40 text-xs mt-2">JPG, PNG, WEBP</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative h-64 rounded-xl overflow-hidden border border-white/20 group"
                    >
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-neon-red/80 backdrop-blur-md rounded-full text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {/* Consent Checkbox */}
                <label className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <div className="relative flex items-center mt-0.5">
                        <input
                            type="checkbox"
                            checked={consented}
                            onChange={(e) => setConsented(e.target.checked)}
                            className="peer w-5 h-5 appearance-none border border-white/40 rounded bg-transparent checked:bg-neon-green checked:border-neon-green cursor-pointer transition-colors"
                        />
                        <svg
                            className="absolute left-0 w-5 h-5 text-black pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-white text-sm">I ASKED FOR THIS.</p>
                        <p className="text-white/50 text-xs mt-1">
                            I consent to being roasted by a mean AI. I understand my feelings might get hurt.
                        </p>
                    </div>
                </label>

                <Button
                    onClick={handleSubmit}
                    disabled={!file || !consented}
                    className="w-full"
                    size="lg"
                >
                    PROCEED TO REGRET
                </Button>
            </div>
        </motion.div>
    )
}
