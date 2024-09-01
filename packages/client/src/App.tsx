import { useState } from 'react'
import { VideoPlayer } from './components/VideoPlayer'

function App() {
    const [selectedVideo, setSelectedVideo] = useState(metaData[0])

    return (
        <Layout>
            <section className="mt-12">
                <VideoPlayer
                    className="mt-4"
                    src={selectedVideo.streamUrl}
                    captionURL={selectedVideo.captionUrl}
                    previewURL={selectedVideo.previewUrl}
                    metaData={selectedVideo}
                />
            </section>

            <section>
                <h2 className="mt-8 text-2xl font-bold">Sample Videos</h2>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    {metaData.map((data) => (
                        <button
                            key={data.uid}
                            className="flex flex-col rounded-md bg-gray-200 p-4 text-left transition-all hover:ring-2 hover:ring-indigo-400"
                            onClick={() => setSelectedVideo(data)}
                        >
                            <h3 className="text-lg font-bold">{data.title}</h3>
                            <p className="text-sm">{data.description}</p>
                        </button>
                    ))}
                </div>
            </section>
            <section className="prose">
                <h2 className="mt-8 text-2xl font-bold">About</h2>
                <p className="mt-4">
                    This is a sample video player. The application demonstrates
                    how to play video streams.
                </p>

                <h3>Features:</h3>
                <ul>
                    <li>Simple Node.js, Express video streaming</li>
                    <li>
                        Supports browser <code>Content-Range</code> header for
                        video streaming
                    </li>
                    <li>
                        Video preview thumbnails on Seek bar (using a single
                        video contact sheet to avoid multiple requests to the
                        server)
                    </li>
                    <li>Video buffering indicator</li>
                    <li>
                        Video player with custom controls
                        <ul>
                            <li>Play/Pause</li>
                            <li>Volume control</li>
                            <li>Fullscreen</li>
                            <li>Seek bar</li>
                            <li>Preview Thumbnails</li>
                            <li>Closed Captions</li>
                            <li>Keyboard shortcuts</li>
                        </ul>
                    </li>
                </ul>
            </section>
        </Layout>
    )
}

export default App

function Layout({ children }: React.ComponentPropsWithoutRef<'div'>) {
    return (
        <>
            <div className="relative flex min-h-screen flex-col justify-between">
                <main className="mx-auto max-w-screen-lg p-4">{children}</main>
                <footer className="mt-auto bg-gray-800 p-4 text-center text-white">
                    <p>
                        <a
                            href="https://github.com/miadv"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Github: @miadv
                        </a>
                    </p>
                </footer>
            </div>
        </>
    )
}

const metaData = [
    {
        uid: 'c56858c0-67df-4c1f-a930-156b47a9b088',
        title: 'Elephants Dream',
        description: 'The first Blender Open Movie from 2006',
        streamUrl:
            'http://localhost:3001/api/stream/video/c56858c0-67df-4c1f-a930-156b47a9b088',
        captionUrl:
            'http://localhost:3001/api/caption/c56858c0-67df-4c1f-a930-156b47a9b088',
        previewUrl:
            'http://localhost:3001/api/preview/c56858c0-67df-4c1f-a930-156b47a9b088',
    },
    {
        uid: 'c56858c0-67df-4c1f-a930-156b47a9b099',
        title: 'For Bigger Joyrides',
        description:
            'Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for the times that call for bigger joyrides.',
        streamUrl:
            'http://localhost:3001/api/stream/video/c56858c0-67df-4c1f-a930-156b47a9b099',
        previewUrl:
            'http://localhost:3001/api/preview/c56858c0-67df-4c1f-a930-156b47a9b099',
    },
]
