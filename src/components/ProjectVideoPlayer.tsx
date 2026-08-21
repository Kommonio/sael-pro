import type { CSSProperties } from 'react'

import { mediaUrl } from '@/lib/media'
import { externalVideoEmbedUrl, type ProjectVideo } from '@/lib/videoMedia'

const RATIO: Record<ProjectVideo['aspectRatio'], string> = {
  '16:9': '16 / 9',
  '4:3': '4 / 3',
  '1:1': '1 / 1',
  '9:16': '9 / 16',
}

export function ProjectVideoPlayer({ video }: { video: ProjectVideo }) {
  const isUpload = video.source === 'upload'
  const uploadedSource = isUpload ? mediaUrl(video.asset) : null
  const uploadedPoster = isUpload
    ? mediaUrl(video.poster, 'xlarge') ||
      mediaUrl(video.poster) ||
      (video.asset && typeof video.asset === 'object'
        ? mediaUrl(video.asset.poster, 'xlarge') || mediaUrl(video.asset.poster)
        : null)
    : null
  const embedSource =
    video.source === 'vimeo' || video.source === 'youtube'
      ? externalVideoEmbedUrl(video.source, video.url, video.startAt)
      : null
  const source = uploadedSource || embedSource
  if (!source) return null

  const providerLabel =
    video.source === 'upload' ? 'Video' : video.source === 'youtube' ? 'YouTube' : 'Vimeo'
  const credit =
    isUpload && video.asset && typeof video.asset === 'object'
      ? video.asset.credit?.trim() || null
      : null

  return (
    <figure
      className={`project-video project-video--${video.aspectRatio.replace(':', '-')}`}
      style={{ '--video-aspect': RATIO[video.aspectRatio] } as CSSProperties}
    >
      <div className="project-video-frame">
        {isUpload ? (
          <video
            controls
            playsInline
            preload="metadata"
            poster={uploadedPoster || undefined}
            aria-label={video.title}
          >
            <source
              src={source}
              type={
                video.asset && typeof video.asset === 'object'
                  ? video.asset.mimeType || undefined
                  : undefined
              }
            />
            {video.tracks.map((track) => {
              const trackSource = mediaUrl(track.file)
              return trackSource ? (
                <track
                  key={`${track.id || trackSource}-${track.language}`}
                  kind={track.kind}
                  src={trackSource}
                  srcLang={track.language}
                  label={track.label}
                  default={track.default}
                />
              ) : null
            })}
          </video>
        ) : (
          <iframe
            src={source}
            title={video.title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
      <figcaption className="project-video-caption">
        <span className="type-meta">{providerLabel}</span>
        <span>{video.title}</span>
        {video.caption ? <p>{video.caption}</p> : null}
        {credit ? <small className="type-meta">{credit}</small> : null}
      </figcaption>
    </figure>
  )
}
