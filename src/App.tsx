import { useState, useRef } from 'react'
import { toPng } from 'html-to-image'
import { Layout } from './components/Layout'
import { Hero } from './components/Hero'
import { UploadForm } from './components/UploadForm'
import { IntensitySelector } from './components/IntensitySelector'
import { LoadingScreen } from './components/LoadingScreen'
import { RoastCard } from './components/RoastCard'
import { generateRoast } from './services/ai'
import { Button } from './components/ui/Button'
import { Download, Share2, RefreshCw } from 'lucide-react'

type AppStep = 'landing' | 'upload' | 'intensity' | 'analyzing' | 'result'

function App() {
  const [step, setStep] = useState<AppStep>('landing')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [intensity, setIntensity] = useState<string>('no-mercy')
  const [roast, setRoast] = useState<string>('')
  const [signals, setSignals] = useState<any>(null)

  const cardRef = useRef<HTMLDivElement>(null)

  const handleStart = () => {
    setStep('upload')
  }

  const handleImageSelect = (file: File) => {
    setImage(file)
    // Convert to Base64 immediately to avoid CORS/BLOB issues during export
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      setStep('intensity')
    }
    reader.readAsDataURL(file)
  }

  const handleIntensitySelect = async (selectedIntensity: string) => {
    setIntensity(selectedIntensity)
    setStep('analyzing')

    if (image) {
      try {
        const { roast, signals } = await generateRoast(image, selectedIntensity)
        setRoast(roast)
        setSignals(signals)
        setStep('result')
      } catch (error) {
        console.error("Roast failed", error)
        alert("AI refused to roast you. You broke it.")
        setStep('landing')
      }
    } else {
      // Fallback if image missing (dev only issue potentially)
      setStep('upload')
    }
  }

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          // Force font embedding workarounds
          fontEmbedCSS: '',
          // Force standard dimensions (approx mobile width but full 9:16 ratio)
          width: 400,
          height: 712,
          style: {
            margin: '0',
            transform: 'none',
            maxWidth: 'none',
            maxHeight: 'none',
            width: '400px',
            height: '712px'
          }
        })
        const link = document.createElement('a')
        link.download = 'you-asked-for-this.png'
        link.href = dataUrl
        link.click()
      } catch (err) {
        console.error('Download failed', err)
      }
    }
  }

  const handleShare = async () => {
    if (cardRef.current && navigator.share) {
      try {
        const dataUrl = await toPng(cardRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          fontEmbedCSS: '',
          width: 400,
          height: 712,
          style: {
            margin: '0',
            transform: 'none',
            maxWidth: 'none',
            maxHeight: 'none',
            width: '400px',
            height: '712px'
          }
        })
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], 'roast.png', { type: 'image/png' })
        await navigator.share({
          title: 'You Asked For This',
          text: 'Proof that free will was a mistake.',
          files: [file]
        })
      } catch (err) {
        console.error('Share failed', err)
      }
    } else {
      handleDownload()
    }
  }

  return (
    <Layout>
      {step === 'landing' && <Hero onStart={handleStart} />}

      {step === 'upload' && (
        <UploadForm onImageSelect={handleImageSelect} />
      )}

      {step === 'intensity' && (
        <IntensitySelector onSelect={handleIntensitySelect} />
      )}

      {step === 'analyzing' && (
        <LoadingScreen />
      )}

      {step === 'result' && (
        <div className="flex flex-col items-center space-y-8 w-full max-w-4xl animate-in fade-in zoom-in duration-500">
          <RoastCard
            ref={cardRef}
            image={imagePreview}
            roast={roast}
            intensity={intensity}
            signals={signals}
          />

          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={handleDownload} variant="primary">
              <Download className="mr-2 w-4 h-4" /> SAVE PROOF
            </Button>
            <Button onClick={handleShare} variant="secondary">
              <Share2 className="mr-2 w-4 h-4" /> SHARE PAIN
            </Button>
            <Button onClick={() => setStep('landing')} variant="ghost">
              <RefreshCw className="mr-2 w-4 h-4" /> REGRET AGAIN
            </Button>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default App
