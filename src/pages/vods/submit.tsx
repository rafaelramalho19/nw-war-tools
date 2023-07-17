
import type { GetServerSideProps, Metadata } from 'next'
import { FormEvent, useRef, useState } from 'react'
import Button from '@/components/button';
import axios from 'axios';
import Alert from '@/components/alert';
import { TwitchPlayer, TwitchPlayerInstance } from 'react-twitch-embed';
import { extractVideoId } from '@/utils/twitch';
import { convertSecondsToHMS } from '@/utils/time';
import styles from '@/styles/vods/submit.module.css'

export const metadata: Metadata = {
  title: 'New World VOD Analysis',
  description: 'A tool generated by Rafael Ramalho - Raisingz',
}

export default function SubmitVodPage({ accessToken }: { accessToken: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inputURL, setInputURL] = useState('');
  const [vodID, setVodID] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [successStatus, setSuccessStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const embedTwitchPlayer = useRef<TwitchPlayerInstance>();

  const onInputChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setInputURL(e.currentTarget.value)
  }

  const setVideo = () => {
    const videoID = extractVideoId(inputURL);
    if (videoID) setVodID(videoID);
    else setErrorMessage("Invalid video ID")
  }

  const onSubmit = async () => {
    try {
      const { data } = await axios.post('/api/fetchVideoData', { url: inputURL, startTime, endTime })
      if (data.status === 'SUCCESS') {
        setSuccessStatus(true);
      }
      setTimeout(() => setVodID(''), 300);
    } catch (error: any) {
      console.error('Error in the fetchVideoData', error)
      if (error.response.data.error) setErrorMessage(error.response.data.error)
    }

    return false;
  }

  const handleTwitchReady = (instance: TwitchPlayerInstance) => embedTwitchPlayer.current = instance;
  const handleSetStart = () => {
    const { hours, minutes, seconds } = convertSecondsToHMS(embedTwitchPlayer.current?.getCurrentTime() as number);
    setStartTime(`${hours}:${minutes}:${seconds}`)
  }
  const handleSetEnd = () => {
    const { hours, minutes, seconds } = convertSecondsToHMS(embedTwitchPlayer.current?.getCurrentTime() as number);
    setEndTime(`${hours}:${minutes}:${seconds}`)
  }

  return (
    <div className="flex flex-col items-center justify-between p-24">
      <h2 className="text-2xl">Submit vods</h2>
      <div className="flex gap-8 py-8 w-full justify-center">
        <input className="p-2 text-black w-80" onChange={onInputChanged} placeholder="twitch or youtube URL" />
        <Button onClick={setVideo}>Submit</Button>
      </div>
      {vodID !== '' && (<div className={successStatus ? styles.afterSuccess : ''}>
        <TwitchPlayer autoplay muted video={vodID} onReady={handleTwitchReady} />
        <div className="flex w-full justify-between py-2">
          <div className="flex gap-8">
            <Button onClick={handleSetStart}>Set Start ({startTime})</Button>
            <Button onClick={handleSetEnd}>Set End ({endTime})</Button>
          </div>
          <Button onClick={onSubmit}>Submit</Button>
        </div>
      </div>
      )}
      {successStatus && (
        <div className={styles.successText}>
          Your vod is being reviewed. Wait for updates.
        </div>
      )}

      {errorMessage ? (
        <Alert message={errorMessage} onEnd={() => setErrorMessage(null)} />
      ) : null}
    </div>
  )
}

/* export default {
  methods: {
    
    },
    preprocessImage (canvas, img) {
    // Convert the image to grayscale
      img.filters.push(new fabric.Image.filters.Grayscale())
      img.applyFilters()

      // Apply Gaussian blur for noise reduction
      img.filters.push(new fabric.Image.filters.Convolute({
        matrix: [1 / 16, 1 / 8, 1 / 16, 1 / 8, 1 / 4, 1 / 8, 1 / 16, 1 / 8, 1 / 16],
        opaque: true
      }))
      img.applyFilters()

      // Apply adaptive thresholding to enhance contrast
      img.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.5 }))
      img.applyFilters()

      canvas.renderAll()
    },
    detectBar (img) {
    // Apply edge detection using Canny algorithm
      img.filters.push(new fabric.Image.filters.Convolute({
        matrix: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
        opaque: true
      }))
      img.applyFilters()

      return img
    },
    segmentBar (barRegion) {
    // Segment the bar into individual regions based on the contour information
    // You can use techniques like connected component labeling or contour splitting
    // based on specific requirements and properties of the bar

      // Return an array of segmented regions
      return this.segmentedRegions
    },
    extractNumbers (segmentedRegions) {
    // Apply OCR or text detection algorithms on each segmented region
    // You can use libraries like Tesseract.js or OpenCV's text recognition module

      // Return the extracted numbers
      return this.numbers
    }
  }

} */
