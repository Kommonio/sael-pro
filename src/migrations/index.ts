import * as migration_20260821_170237_video_media from './20260821_170237_video_media';
import * as migration_20260821_174112_public_media_contract from './20260821_174112_public_media_contract';

export const migrations = [
  {
    up: migration_20260821_170237_video_media.up,
    down: migration_20260821_170237_video_media.down,
    name: '20260821_170237_video_media',
  },
  {
    up: migration_20260821_174112_public_media_contract.up,
    down: migration_20260821_174112_public_media_contract.down,
    name: '20260821_174112_public_media_contract'
  },
];
